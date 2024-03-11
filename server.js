const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Require json file
const dbPath = path.join(__dirname, "./db/db.json");
let notes = require(dbPath);

// Get all notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.send([
    {
      title: "Test Title",
      text: "Test text",
    },
    {
      title: "Test",
      text: "Test",
    },
    {
      title: "New Note",
      text: "New Note",
    },
  ]);
});

// Write updated notes back to json file
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      console.error(error);
      return res.status(500).send("error saving the note");
    }

    console.log(
      `note with title ${newNote.title} has been written to JSON file`
    );
    res.status(201).send("note created");
  });
});

// Serve index.html file
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
// Listen on port 3001
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
