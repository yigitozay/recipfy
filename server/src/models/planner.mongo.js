const mongoose = require('mongoose')

const plannerSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    days: [{
        date: {
            type: Date,
            required: true
        },
        meals: [{
            recipe: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe',
                required: true
            }
        }]
    }],
    shoppingList: [{
        ingredient: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        }     
    }]

})

module.exports = mongoose.model('Plan', plannerSchema)