const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const publicRecipesSchema = new Schema({
    username: {
        type: String,
        required: true,
        uniquie: true,
        trim: true,
        minlength: 3
    },
    publicRecipesTitle: {
        type: String,
        required: true,
        unique: false,
        trim: false
    },
    publicRecipesIngredients:{
        type: String,
        required: true,
        unique: false,
        trim: false
    },
    publicRecipesPreparation:{
            type: String,
            required: true,
            unique: false,
            trim: false
    }
    // userID: {
    //     type: Number,
    //     required: true
    // }
},{
    timestamps: true,
}
);

const PublicRecipes = mongoose.model('PublicRecipes', publicRecipesSchema);

module.exports = PublicRecipes;