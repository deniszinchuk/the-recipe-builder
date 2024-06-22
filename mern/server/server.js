import express from "express";
import cors from "cors";
import path from "path";
import ingredients from "./routes/ingredient.js";
import recipes from "./routes/recipe.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/ingredient", ingredients);
app.use("/recipe", recipes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
