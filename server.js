import express from "express";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { getCompositions } from "remotion";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 10000;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "";

let bundleLocationPromise;

async function getBundle() {
  if (!bundleLocationPromise) {
    bundleLocationPromise = bundle({
      entryPoint: path.join(__dirname, "src", "index.jsx"),
      webpackOverride: (config) => config,
    });
  }
  return bundleLocationPromise;
}

app.get("/", (_, res) => {
  res.json({ ok: true, service: "youtube-render-server" });
});

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.post("/render", async (req, res) => {
  const body = req.body || {};
  const inputProps = body.inputProps || body.props || {};
  const compositionId = body.compositionId || "Main";
  const outputName = body.outputName || `video-${Date.now()}.mp4`;

  try {
    const bundleLocation = await getBundle();
    const comps = await getCompositions(bundleLocation);
    const comp = comps.find(c => c.id === compositionId);

    if (!comp) {
      return res.status(400).json({
        ok: false,
        error: `Composition '${compositionId}' not found`,
        availableCompositions: comps.map(c => c.id)
      });
    }

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps
    });

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "remotion-"));
    const outputPath = path.join(tmpDir, outputName);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps
    });

    if (PUBLIC_BASE_URL) {
      return res.json({
        ok: true,
        url: `${PUBLIC_BASE_URL.replace(/\/$/, "")}/files/${encodeURIComponent(path.basename(outputPath))}`,
        filename: path.basename(outputPath)
      });
    }

    res.download(outputPath, outputName);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error?.message || String(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Render server listening on ${PORT}`);
});
