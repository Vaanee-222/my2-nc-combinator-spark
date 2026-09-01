import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stillFrames = process.argv.slice(2).filter((a) => a.startsWith("--still=")).map((a) => Number(a.split("=")[1]));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id: "main", puppeteerInstance: browser });

if (stillFrames.length) {
  for (const f of stillFrames) {
    await renderStill({
      composition,
      serveUrl: bundled,
      frame: f,
      output: `/tmp/dv/frame-${f}.png`,
      puppeteerInstance: browser,
    });
    console.log("still", f);
  }
} else {
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    crf: 18,
    outputLocation: "/mnt/documents/Xi-Combinator-Platform-Demo.mp4",
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 10 === 0) console.log("progress", Math.round(progress * 100));
    },
  });
}

await browser.close({ silent: false });
console.log("done");
