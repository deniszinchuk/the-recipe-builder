import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import { getHealthinessEvaluation } from "../ChatGPTService.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/", upload.single("picture"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const ingredients = JSON.parse(req.body.ingredients);
    
    // Fetch detailed ingredient data
    const ingredientsCollection = await db.collection("ingredients");
    const detailedIngredients = await Promise.all(ingredients.map(async ingredient => {
      const ingredientDetails = await ingredientsCollection.findOne({ _id: new ObjectId(ingredient.ingredientId) });
      if (!ingredientDetails) {
        throw new Error(`Ingredient with ID ${ingredient.ingredientId} not found`);
      }
      return {
        ...ingredient,
        name: ingredientDetails.name,
        calories: ingredientDetails.calories,
        fat: ingredientDetails.fat,
        protein: ingredientDetails.protein,
        carbs: ingredientDetails.carbs
      };
    }));

    console.log('Parsed ingredients:', detailedIngredients);

    const newRecipe = {
      name: req.body.name,
      picture: req.file ? `/uploads/${req.file.filename}` : null,
      description: req.body.description,
      ingredients: detailedIngredients,
    };

    const evaluation = await getHealthinessEvaluation(newRecipe.name, detailedIngredients);
    newRecipe.healthinessScore = evaluation.healthinessScore;
    newRecipe.healthinessEvaluation = evaluation.evaluation;
    newRecipe.healthierRecipe = evaluation.healthierRecipe;

    const collection = db.collection("recipes");
    const result = await collection.insertOne(newRecipe);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding recipe:", err);
    res.status(500).send("Error adding recipe");
  }
});

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

router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("recipes");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving recipe");
  }
});

export default router;



/*

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
*/