import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import ingredients from './routes/ingredient.js';
import recipes from './routes/recipe.js';

dotenv.config();



const PORT = process.env.PORT || 5050;
const app = express();

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/ingredient", ingredients);
app.use("/recipe", recipes);

app.get("/", (req, res) => {
  res.send("Hello, the server is running!");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
