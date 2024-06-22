import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

import multer from "multer";

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

/*
Ingredient structure:
name:
picture:
calories:
protein:
carbs:
fat:
*/



router.post("/", upload.single("picture"), async (req, res) => {
    try {
      // Create a new document with the provided details
      let newDocument = {
        name: req.body.name,
        picture: req.file ? `/uploads/${req.file.filename}` : null, // Handle optional picture upload
        calories: req.body.calories,
        protein: req.body.protein,
        carbs: req.body.carbs,
        fat: req.body.fat,
      };
  
      // Insert the new document into the ingredients collection
      let collection = await db.collection("ingredients");
      let result = await collection.insertOne(newDocument);
  
      // Respond with the result of the insertion
      res.status(201).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding ingredient");
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
  });

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
  });
  

  export default router;
