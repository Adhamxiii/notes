import dotenv from "dotenv";
import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://adham:test1234@notesapp.tmczb0c.mongodb.net/?retryWrites=true&w=majority&appName=notesapp";
mongoose.connect(MONGO_URI);

import Note from "./models/note.model.js";
import User from "./models/user.model.js";

import cors from "cors";
import express, { json } from "express";
const app = express();
const port = 8000;
dotenv.config();

import pkg from "jsonwebtoken";
const { sign } = pkg;
import authenticateToken from "./utilities.js";

app.use(json());
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.get("/", (req, res) => res.json({ data: "hello" }));

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await findOne({ email: email });

  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    message: "Registration Successful",
    accessToken,
    user,
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await findOne({ email: email });

  if (!userInfo) {
    return res.json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const accessToken = sign(
      { user: userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "36000m",
      }
    );
    return res.json({
      error: false,
      message: "Login Successful",
      accessToken,
      email,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await findOne({
    _id: user._id,
  });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    message: "",
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
  });
});

// Add Notes
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({ error: false, message: "Note added successfully", note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "An error occurred while adding the note",
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!noteId) {
    return res
      .status(400)
      .json({ error: true, message: "Note ID is required" });
  }

  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: "Please enter at least one field to edit",
    });
  }

  try {
    const note = await _findOne({
      _id: noteId,
      userId: user._id,
    });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "An error occurred while updating the note",
    });
  }
});

// Get Notes
app.get("/get-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching notes",
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { user } = req.user;

  try {
    const note = await _findOne({
      _id: noteId,
      userId: user._id,
    });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await note.deleteOne({
      _id: noteId,
      userId: user._id,
    });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while deleting the note",
    });
  }
});

// Update isPinned Value
app.put("/update-isPinned/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await _findOne({
      _id: noteId,
      userId: user._id,
    });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while updating the note",
    });
  }
});

// Search
app.get("/search", authenticateToken, async (req, res) => {
  const { searchTerm } = req.query;
  const { user } = req.user;

  if (!searchTerm) {
    return res
      .status(400)
      .json({ error: true, message: "Search term is required" });
  }

  try {
    const notes = await find({
      userId: user._id,
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ],
    });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching notes",
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
