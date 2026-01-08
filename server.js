import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://t2i.mcpcore.xyz/api/free/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: "turbo" })
      }
    );

    const rawText = await response.text();
    const lines = rawText.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const payload = line.replace("data:", "").trim();
      if (!payload || payload === "[DONE]") continue;

      try {
        const parsed = JSON.parse(payload);

        if (parsed.imageUrl) {
          return res.json({ imageUrl: parsed.imageUrl });
        }
      } catch {
        // Ignore partial JSON chunks
      }
    }

    res.status(500).json({
      error: "No image URL found in response"
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      error: "Image generation failed",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
