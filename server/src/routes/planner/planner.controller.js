const express = require('express');
const Planner = require('../../models/planner.mongo')



async function httpAddRecipeToDay(req, res) {
    const { plannerId, date, recipeId } = req.body;

    try {
        const planner = await Planner.findById(plannerId);
        if (!planner) {
            return res.status(404).json({
                success: false,
                message: 'Planner not found'
            });
        }

        let day = planner.days.find(d => d.date.toISOString().split('T')[0] === date);
        if (!day) {
            day = { date, meals: [] };
            planner.days.push(day);
        }

        day.meals.push({ recipe: recipeId });
        await planner.save();

        res.status(201).json({
            success: true,
            message: 'Recipe added to day',
            planner
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to add recipe to day',
            error: err.message
        });
    }
}

async function futurePlanners(userId) {
    const WEEKS_AHEAD = 8;
    const today = new Date();
    const fourWeeksFromNow = new Date();
    fourWeeksFromNow.setDate(today.getDate() + 28);

    const lastPlanner = await Planner.findOne({ user: userId }).sort({ weekStartDate: -1 });
    let lastDate = lastPlanner ? new Date(lastPlanner.weekStartDate) : new Date();

    if (new Date(lastDate) <= fourWeeksFromNow) {
        lastDate.setDate(lastDate.getDate() + (lastPlanner ? 7 : 0)); // Start from next week if planner exists
        for (let week = 1; week <= WEEKS_AHEAD; week++) {
            await createWeeklyPlanner(userId, new Date(lastDate));
            lastDate.setDate(lastDate.getDate() + 7);
        }
    }
}



async function createWeeklyPlanner(userId, startDate) {
    const newPlanner = new Planner({
        user: userId,
        weekStartDate: startDate,
        days: [],  
        shoppingList: []  
    });
    await newPlanner.save();
}

async function httpGetShoppingList(req, res) {
    const { plannerId } = req.body;
    try {
        const planner = await Planner.findById(plannerId);  
        if (!planner) {
            return res.status(404).json({ message: "Planner not found." });
        }

        const { shoppingList } = planner;
        if (!shoppingList || shoppingList.length === 0) {
            return res.status(404).json({ message: "No shopping list found for this week." });
        }

        const aggregatedList = aggregateShoppingList(shoppingList);

        res.status(200).json({ success: true, shoppingList: aggregatedList });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error retrieving shopping list.", error: error.message });
    }
}

function aggregateShoppingList(shoppingList) {
    const aggregatedIngredients = {};

    shoppingList.forEach(item => {
        const { ingredient, quantity } = item;

        if (aggregatedIngredients[ingredient]) {
            aggregatedIngredients[ingredient] += parseFloat(quantity); 
        } else {
            aggregatedIngredients[ingredient] = parseFloat(quantity);
        }
    });

    const aggregatedList = Object.keys(aggregatedIngredients).map(ingredient => {
        return { ingredient, quantity: aggregatedIngredients[ingredient].toString() + " units" };  
    });

    return aggregatedList;
}