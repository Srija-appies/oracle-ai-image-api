import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://t2i.mcpcore.xyz/api/free/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: "turbo" })
      }
    );

    const rawText = await response.text();

    // Find last JSON block in stream
    const lines = rawText.split("\n").filter(l => l.includes("{"));
    const lastLine = lines[lines.length - 1];

    const jsonString = lastLine.replace(/^data:\s*/, "");
    const data = JSON.parse(jsonString);

    res.json({
      imageUrl: data.imageUrl
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
