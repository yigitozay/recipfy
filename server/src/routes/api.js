const express = require('express')
const recipeRouter = require('./recipes/recipes.router')


const api = express.Router()

api.use('/recipes',recipeRouter)


module.exports=api