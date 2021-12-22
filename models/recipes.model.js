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
    recipes: {
        type: String,
        required: false,
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

const Recipes = mongoose.model('Recipes', recipesSchema);

module.exports = Recipes;