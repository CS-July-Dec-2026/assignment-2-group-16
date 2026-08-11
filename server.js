const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API: List available files
app.get("/api/files", (req, res) => {
  const filesDir = path.join(__dirname, "files");
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Could not list files" });
    }
    res.json({ files });
  });
});

// API: View a file (VULNERABLE - no sanitization of filename)
app.get("/api/view", (req, res) => {
  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  const filesDir = path.join(__dirname, "files");
  const filePath = path.join(filesDir, filename);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    res.json({ filename: filename, content: data });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
