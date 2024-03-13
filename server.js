const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const dbPath = path.join(__dirname, "./db/db.json");

// Get all notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Read and send notes
app.get("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading notes data.");
    }
    res.send(JSON.parse(data));
  });
});

// Write updated notes back to json file
app.post("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading notes data.");
    }
    const notes = JSON.parse(data);
    const newNote = { ...req.body, id: Date.now().toString() };
    notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving the note.");
      }
      console.log(`Note with title "${newNote.title}" has been written to JSON file.`);
      res.status(201).send("Note created");
    });
  });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

// Listen on port 3001
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));