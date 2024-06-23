import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import Home from "./components/Home";
import "./index.css";
import Inventory from "./components/Inventory";
import Recipe from "./components/Recipe";
import Ingredient from "./components/Ingredient";
import RecipeList from "./components/RecipeList";
import Mongo from "./components/Mongo";
import RecipeDetail from "./components/RecipeDetail";
const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/create-ingredient",
    element: <Ingredient />,
  },
  {
    path: "/create-recipe",
    element: <Recipe />,
  },

  {
    path: "/",
    element: <App />,
  },
  {
    path: "/recipe-list", // Add route for RecipeList
    element: <RecipeList />,
  },
  {
    path: "/mongo",
    element: <Mongo/>,
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/recipe/:id",
    element: <RecipeDetail />,
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);