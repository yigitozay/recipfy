const mongoose = require('mongoose');

const recipesSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    ingredients:[{
        name: {
            type: String,
            required: true 
        },
        quantity: {
            type: String,
            required: true 
        }

    }],
    steps:[{
        stepNumber: {
            type: Number,
            required: true 
        },
        instruction: {
            type: String,
            required: true 
        }
    }],
    likes:{
        type:Number,
        default:0,

    },
    saved:{
        type:Number,
        default:0,  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('Recipe', recipesSchema)