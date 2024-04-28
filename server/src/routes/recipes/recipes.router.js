const express = require('express');
const {httpCreateRecipe,httpDeleteRecipe,httpUpdateRecipe,httpGetAllRecipes}= require('./recipes.controller');
const recipeRouter = express.Router();


recipeRouter.get('/recipes', httpGetAllRecipes)
recipeRouter.post('/recipes', httpCreateRecipe);
recipeRouter.delete('/recipes/:id', httpDeleteRecipe);
recipeRouter.put('/recipes/:id', httpUpdateRecipe);

module.exports = recipeRouter;