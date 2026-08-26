import { describe, it, expect } from "vitest";
import { sanitizeHeadScripts } from "@/lib/sanitizeHeadScripts";

describe("sanitizeHeadScripts", () => {
  it("TC-HS-01 returns empty output for empty input", () => {
    expect(sanitizeHeadScripts("").sanitizedHtml).toBe("");
    expect(sanitizeHeadScripts("   ").warnings).toEqual([]);
  });

  it("TC-HS-02 keeps a legitimate GA4 script tag", () => {
    const { sanitizedHtml } = sanitizeHeadScripts(
      '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XYZ"></script>',
    );
    expect(sanitizedHtml).toContain("googletagmanager.com/gtag/js");
    expect(sanitizedHtml).toContain("async");
  });

  it("TC-HS-03 removes disallowed tags such as iframe and object", () => {
    const res = sanitizeHeadScripts('<iframe src="https://evil.test"></iframe><object></object>');
    expect(res.sanitizedHtml).toBe("");
    expect(res.warnings.length).toBe(2);
  });

  it("TC-HS-04 strips inline event handlers", () => {
    const res = sanitizeHeadScripts('<script onload="alert(1)" src="https://a.test/x.js"></script>');
    expect(res.sanitizedHtml).not.toContain("onload");
    expect(res.warnings.join(" ")).toContain("onload");
  });

  it("TC-HS-05 blocks javascript: and data: URLs", () => {
    const js = sanitizeHeadScripts('<script src="javascript:alert(1)"></script>');
    expect(js.sanitizedHtml).not.toContain("javascript:");
    const data = sanitizeHeadScripts('<link rel="stylesheet" href="data:text/css,body{}">');
    expect(data.sanitizedHtml).not.toContain("data:");
  });

  it("TC-HS-06 drops scripts with a disallowed type", () => {
    const res = sanitizeHeadScripts('<script type="module">import("https://evil.test")</script>');
    expect(res.sanitizedHtml).toBe("");
    expect(res.warnings.join(" ")).toContain("disallowed type");
  });

  it("TC-HS-07 allows JSON-LD structured data", () => {
    const res = sanitizeHeadScripts(
      '<script type="application/ld+json">{"@context":"https://schema.org"}</script>',
    );
    expect(res.sanitizedHtml).toContain("schema.org");
  });

  it("TC-HS-08 removes CSS expressions from style blocks", () => {
    const res = sanitizeHeadScripts("<style>a{width:expression(alert(1))}</style>");
    expect(res.sanitizedHtml).toBe("");
  });

  it("TC-HS-09 keeps only img/link/meta inside noscript (GTM pixel)", () => {
    const res = sanitizeHeadScripts(
      '<noscript><img src="https://www.googletagmanager.com/ns.html?id=GTM-X"><script src="https://a.test/x.js"></script></noscript>',
    );
    expect(res.sanitizedHtml).toContain("<img");
    expect(res.sanitizedHtml).not.toContain("<script");
  });

  it("TC-HS-10 strips attributes not on the allow-list", () => {
    const res = sanitizeHeadScripts('<meta name="x" content="y" style="display:none">');
    expect(res.sanitizedHtml).not.toContain("style=");
    expect(res.sanitizedHtml).toContain('name="x"');
  });
});
