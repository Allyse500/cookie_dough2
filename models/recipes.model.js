const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipesSchema = new Schema({
    username: {
        type: String,
        required: true,
        uniquie: true,
        trim: true,
        minlength: 3
    },
    recipesTitle: {
        type: String,
        required: true,
        unique: false,
        trim: false
    },
    recipesIngredients:{
        type: String,
        required: true,
        unique: false,
        trim: false
    },
    recipesPreparation:{
            type: String,
            required: true,
            unique: false,
            trim: false
    }
},{
    timestamps: true,
}
);

const Recipes = mongoose.model('Recipes', recipesSchema);

module.exports = Recipes;