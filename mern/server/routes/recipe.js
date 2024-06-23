import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db/connection.js';
import { getHealthinessEvaluation } from '../ChatGPTService.js';

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

// Create a new recipe
router.post("/", upload.single("picture"), async (req, res) => {
  try {
    const { name, description, ingredients } = req.body;
    
    // Add logging to inspect the ingredients
    console.log('Request body:', req.body);
    
    const parsedIngredients = JSON.parse(ingredients);
    
    // Verify parsed ingredients
    console.log('Parsed ingredients:', parsedIngredients);

    if (!Array.isArray(parsedIngredients)) {
      throw new Error('Ingredients must be an array');
    }

    const newRecipe = {
      name,
      picture: req.file ? `/uploads/${req.file.filename}` : null,
      description,
      ingredients: parsedIngredients,
    };

    // Get healthiness evaluation from ChatGPT
    const { evaluation, healthinessScore } = await getHealthinessEvaluation(name, parsedIngredients);
    newRecipe.evaluation = evaluation;
    newRecipe.healthinessScore = healthinessScore;

    const collection = db.collection("recipes");
    const result = await collection.insertOne(newRecipe);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding recipe:", err);
    res.status(500).send("Error adding recipe");
  }
});

// Get a list of all recipes
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("recipes");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving recipes");
  }
});

// Get a single recipe by id
router.get("/:id", async (req, res) => {
    try {
        let collection = await db.collection("recipes");
        let query = { _id: new ObjectId(req.params.id) };
        let result = await collection.findOne(query);
        if (!result) {
            res.status(404).send("Recipe not found");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving recipe");
    }
});

// Update a recipe by id
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                name: req.body.name,
                picture: req.body.picture,
                description: req.body.description,
                ingredients: req.body.ingredients, // Ensure this is an array of objects { ingredientId, amount }
            },
        };
        let collection = await db.collection("recipes");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating recipe");
    }
});

// Delete a recipe by id
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const collection = db.collection("recipes");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting recipe");
    }
});

export default router;