import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ObjectId } from "mongodb"; // Correct import statement
import db from "../db/connection.js";

const router = express.Router();

// Determine __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Middleware to parse form-data
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Create a new ingredient
router.post("/", upload.single("picture"), async (req, res) => {
  console.log(req.body); // Debug: Check the parsed body
  console.log(req.file); // Debug: Check the uploaded file
  try {
    const newIngredient = {
      name: req.body.name,
      picture: req.file ? `/uploads/${req.file.filename}` : null,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
    };
    const collection = db.collection("ingredients");
    const result = await collection.insertOne(newIngredient);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding ingredient:", err);
    res.status(500).send("Error adding ingredient");
  }
});

// Middleware to parse form-data
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Get a list of all ingredients
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("ingredients");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving ingredients");
  }
});

// Get a single ingredient by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("ingredients");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving ingredient");
  }
});


// Update an ingredient by id with optional picture upload
router.patch("/:id", upload.single("picture"), async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const updates = {
        $set: {
          name: req.body.name,
          picture: req.file ? `/uploads/${req.file.filename}` : req.body.picture, // Handle optional picture upload
          calories: req.body.calories,
          protein: req.body.protein,
          carbs: req.body.carbs,
          fat: req.body.fat,
        },
      };
  
      let collection = await db.collection("ingredients");
      let result = await collection.updateOne(query, updates);
  
      if (result.matchedCount === 0) {
        res.status(404).send("Ingredient not found");
      } else {
        res.status(200).send(result);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating ingredient");
    }
  }
);

// Delete an ingredient by id
router.delete("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection("ingredients");
      let result = await collection.deleteOne(query);
  
      if (result.deletedCount === 0) {
        res.status(404).send("Ingredient not found");
      } else {
        res.status(200).send({ message: "Ingredient deleted successfully" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting ingredient");
    }
  }
);
  


export default router;
