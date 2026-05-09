// Sanitizer for CUSTOM_HEAD_SCRIPTS — only allow a strict whitelist of
// tags and attributes safe to inject into <head>.

const ALLOWED_TAGS = new Set(["SCRIPT", "NOSCRIPT", "META", "LINK", "STYLE"]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  SCRIPT: new Set(["src", "async", "defer", "type", "crossorigin", "integrity", "nonce", "id"]),
  NOSCRIPT: new Set([]),
  META: new Set(["name", "content", "property", "http-equiv", "charset"]),
  LINK: new Set(["rel", "href", "as", "type", "crossorigin", "integrity", "media", "sizes"]),
  STYLE: new Set(["type", "media"]),
};

// Allowed script types (block module-from-data, importmap not allowed by default)
const ALLOWED_SCRIPT_TYPES = new Set(["", "text/javascript", "application/javascript", "application/ld+json"]);

const URL_ATTRS = new Set(["src", "href"]);

const isSafeUrl = (url: string): boolean => {
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Block javascript:, data:, vbscript: etc. Allow http(s), protocol-relative, relative.
  if (/^(javascript|vbscript|data|file):/i.test(trimmed)) return false;
  return true;
};

export interface SanitizeResult {
  sanitizedHtml: string;
  warnings: string[];
}

export const sanitizeHeadScripts = (rawHtml: string): SanitizeResult => {
  const warnings: string[] = [];
  if (!rawHtml || !rawHtml.trim()) return { sanitizedHtml: "", warnings };

  // Parse in a detached document so nothing executes.
  const doc = new DOMParser().parseFromString(`<!doctype html><html><head>${rawHtml}</head><body></body></html>`, "text/html");
  const head = doc.head;
  const out: string[] = [];

  const walk = (node: Element) => {
    const tag = node.tagName.toUpperCase();

    if (!ALLOWED_TAGS.has(tag)) {
      warnings.push(`Removed disallowed <${tag.toLowerCase()}> tag`);
      return;
    }

    const allowed = ALLOWED_ATTRS[tag] ?? new Set<string>();
    // Strip disallowed attrs and any "on*" event handlers
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on")) {
        warnings.push(`Removed inline handler "${name}" on <${tag.toLowerCase()}>`);
        node.removeAttribute(attr.name);
        continue;
      }
      if (!allowed.has(name)) {
        warnings.push(`Removed attribute "${name}" on <${tag.toLowerCase()}>`);
        node.removeAttribute(attr.name);
        continue;
      }
      if (URL_ATTRS.has(name) && !isSafeUrl(attr.value)) {
        warnings.push(`Removed unsafe URL in "${name}" on <${tag.toLowerCase()}>`);
        node.removeAttribute(attr.name);
      }
    }

    if (tag === "SCRIPT") {
      const type = (node.getAttribute("type") || "").toLowerCase();
      if (!ALLOWED_SCRIPT_TYPES.has(type)) {
        warnings.push(`Removed <script> with disallowed type="${type}"`);
        return;
      }
      // Inline script body is allowed only if not JSON-LD that requires it; we keep textContent as-is.
      // No further sanitization of JS body — admins must trust pasted snippets.
    }

    if (tag === "STYLE") {
      const css = node.textContent || "";
      if (/expression\s*\(|javascript:/i.test(css)) {
        warnings.push("Removed <style> containing unsafe expressions");
        return;
      }
    }

    // For NOSCRIPT, only allow img/link/meta children
    if (tag === "NOSCRIPT") {
      for (const child of Array.from(node.children)) {
        const childTag = child.tagName.toUpperCase();
        if (!["IMG", "LINK", "META"].includes(childTag)) {
          warnings.push(`Removed <${childTag.toLowerCase()}> inside <noscript>`);
          child.remove();
          continue;
        }
        for (const attr of Array.from(child.attributes)) {
          if (attr.name.toLowerCase().startsWith("on")) child.removeAttribute(attr.name);
          if (URL_ATTRS.has(attr.name.toLowerCase()) && !isSafeUrl(attr.value)) child.removeAttribute(attr.name);
        }
      }
    }

    out.push(node.outerHTML);
  };

  for (const child of Array.from(head.children)) walk(child);

  return { sanitizedHtml: out.join("\n"), warnings };
};

const MARKER_ATTR = "data-custom-head";

export const applyCustomHeadScripts = (rawHtml: string) => {
  if (typeof document === "undefined") return;
  // Remove previously injected nodes
  document.querySelectorAll(`[${MARKER_ATTR}="1"]`).forEach((n) => n.remove());

  const { sanitizedHtml } = sanitizeHeadScripts(rawHtml);
  if (!sanitizedHtml) return;

  const tpl = document.createElement("template");
  tpl.innerHTML = sanitizedHtml;

  // Re-create script nodes so the browser actually executes them
  tpl.content.childNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    const el = node as Element;
    let toInsert: Element;
    if (el.tagName === "SCRIPT") {
      const s = document.createElement("script");
      for (const a of Array.from(el.attributes)) s.setAttribute(a.name, a.value);
      s.text = el.textContent || "";
      toInsert = s;
    } else {
      toInsert = el.cloneNode(true) as Element;
    }
    toInsert.setAttribute(MARKER_ATTR, "1");
    document.head.appendChild(toInsert);
  });
};

export const STORAGE_KEY = "CUSTOM_HEAD_SCRIPTS";
