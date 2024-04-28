const express = require('express')
const Recipe = require('../../models/recipes.mongo');



async function httpGetAllRecipes(req,res){
    const recipes = await getAllRecipes()
    return res.status(200).json(recipes)
}

async function getAllRecipes(){
    return await Recipe.find({},'-__v')
    .sort({likes:-1})

}

async function httpCreateRecipe(req,res) {
    const {name, ingredients, steps,createdBy} = req.body;
    if (!name || !ingredients || !steps || !createdBy) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }

    try {
        const newRecipe = new Recipe({
            name,
            ingredients,
            steps,
            createdBy,
        });

        await newRecipe.save();

        res.status(201).json({
            success:true,
            message:'Recipe created successfully!',
            recipe:newRecipe
        });
    }catch (err){
        res.status(500).json({
            success:false,
            message:'Failed to create recipe',
            error: err.message
        })
    }

}

async function httpDeleteRecipe(res,req){
    const { id } = req.params; 
    try {
        const result = await Recipe.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting recipe',
            error: error.message
        });
    }
}

async function httpUpdateRecipe(req,res){
    const {_id,name, ingredients, steps } =req.body
    if (!name || !ingredients || !steps ) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    try{
        const updatedRecipe = await Recipe.findOneAndUpdate(
            {_id:_id},
            {name,ingredients,steps},
            {new:true,runValidators:true}
        )
        if (!updatedRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.json({
            success:true,
            message:'Recipe updated',
            data: updatedRecipe
        })


    }catch(err){
        res.status(500).json({
            success:false,
            message:'Error updatind recipe',
            error:err.message
        })
    }

}

module.exports={
    httpCreateRecipe,httpDeleteRecipe,httpUpdateRecipe,httpGetAllRecipes
}