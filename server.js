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
        body: JSON.stringify({
          prompt,
          model: "turbo"
        })
      }
    );

    const data = await response.json();

    res.json({
      imageUrl: data.imageUrl || data.output || data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
