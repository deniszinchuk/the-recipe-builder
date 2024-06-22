import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

import multer from "multer";  // Add this line to import multer
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();



// Configure storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage: storage });

// Create a new recipe
router.post("/", async (req, res) => {
    try {
        const newRecipe = {
            name: req.body.name,
            picture: req.body.pciture,
            description: req.body.description,
            ingredients: req.body.ingredients, // This should be an array of objects { ingredientId, amount }
        };
        const collection = db.collection("recipes");
        const result = await collection.insertOne(newRecipe);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding recipe");
    }
});


// Get recipes that can be made with selected ingredients
router.post("/find", async (req, res) => {
    try {
        const ingredientIds = req.body.ingredientIds.map(id => new ObjectId(id));
        let collection = await db.collection("recipes");

        // Match recipes where all selected ingredients are included
        let results = await collection.aggregate([
            { $match: { "ingredients.ingredientId": { $all: ingredientIds } } },
            {
                $lookup: {
                    from: "ingredients",
                    localField: "ingredients.ingredientId",
                    foreignField: "_id",
                    as: "ingredientDetails"
                }
            }
        ]).toArray();

        res.status(200).send(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving recipes");
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