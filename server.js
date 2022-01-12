const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt');
// const passport = require('passport');
// const LocalStrategy = require("passport-local");
// const passportLocalMongoose =
//         require("passport-local-mongoose");



require('dotenv').config();//configures .env file

//setup express server
const app = express();
const port = process.env.PORT || 5000;//define server port

//middleware
app.use(cors());
app.use(express.json());//enables parsing of json
app.use(morgan('short'));
app.use(express.static('./public'));//displays static pages
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

//code to connect to mongoDB--------------
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//login/signup session connection code----------
var store = new MongoDBStore({
    uri: process.env.ATLAS_URI,
    collection: 'mySessions'
  });

  const secret = process.env.MONGO_SESSION_SECRET;

  app.use(session({
    secret:secret,
    resave: false,
    saveUninitialized: false,
    store: store
}))

//authentication function variable=========================================
const isAuth = (req, res, next) => {
    if(req.session.isAuth){//if session authentication is true, go to next function 
        next()
    }
    else{//direct to root route
        res.rendirect("/");
        console.log("logged in: " + req.session.isAuth);
    }
}

//require the user model needed-----------
let User = require('./models/user.model');//require the user model needed
let Recipes = require('./models/recipes.model');//require the recipes model needed
let PublicRecipes = require("./models/publicRecipes.model");//require the publicrecipes model needed
const { Store } = require('express-session');

//=========================PUBLIC RECIPE SEARCH=================================
//-------------------------HOME PAGE-----------------------------------
app.post("/publicSearch", async (req,res) =>{
    const searchInput = req.body.searchInput;

    let chef = await PublicRecipes.find({username: searchInput});//check public recipe collection for chef name
    let recipe = await PublicRecipes.find({publicRecipesTitle: searchInput});//check public recipe collection for recipe name

    if (recipe.length > 0){//if recipe already exists
        console.log("recipe already exists: '" + searchInput + "', " + "'" + recipe + "'");
        return res.render("home.ejs", //redirect to home page
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"", 
                display2:"none", 
                messageContents: "", 
                homeMsgFunc: "",
                loginAlt:"none",
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"block",
                homePubNum:recipe.length,
                publicRecipes: recipe,
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            });
    }//end of if (recipe.length > 0)
    else if(chef.length > 0){
        console.log("chef exists: '" + chef + "'");
        return res.render("home.ejs", //redirect to home page
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"", 
                display2:"none", 
                messageContents: "",
                homeMsgFunc: "",
                loginAlt:"none",
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"block",
                homePubNum:chef.length,
                publicRecipes: chef,
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
   
            });
    }//end of else if(chef.length > 0)
    else{//if chef name/recipe title does not yet exist in public recipe db note this

        console.log("this chef/recipe not in public recipe DB. Search item submitted: '" + searchInput + "'");        
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"", 
                display2:"none", 
                messageContents: "", 
                homeMsgFunc: "",
                loginAlt:"none",
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"block",
                homePubNum:0,
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            });
    }

})
//---------------------------USER PAGE-------------------------------------//
app.post("/publicSearch2", async (req,res) =>{
    const searchInput = req.body.searchInput;

    let chef = await PublicRecipes.find({username: searchInput});//check public recipe collection for chef name
    let recipe = await PublicRecipes.find({publicRecipesTitle: searchInput});//check public recipe collection for recipe name

    if (recipe.length > 0){//if recipe already exists
        console.log("recipe already exists: '" + searchInput + "', " + "'" + recipe + "'");
        //render message noting recipes located
        return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "block",
                pubNum: recipe.length,
                publicRecipes2: recipe, 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "none",      
                messageTitle:"", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:""
                });

    }//end of if (recipe.length > 0)
    else if(chef.length > 0){
        console.log("chef exists: '" + chef + "'");
        console.log("chef.length: " + chef.length);
        //render message noting recipes located
        return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "block",
                pubNum: chef.length,
                publicRecipes2: chef, 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "none",      
                messageTitle:"", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:""
                });

    }//end of else if(chef.length > 0)
    else{//if chef name/recipe title does not yet exist in public recipe db note this

        console.log("this chef/recipe not in public recipe DB. Search item submitted: '" + searchInput + "'");        
        //declare session variables
        var sessionuser = req.session.username;//session user's name
        var userEmail = req.session.userEmail;//session user's email
        var userID = req.session.userID;//session user's ID
        return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "block",
                pubNum: 0,
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "none",      
                messageTitle:"", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:""
                });

    }//end of else statement

})//end of app.post("/publicSearch2",...);

//==========================LOAD PUBLIC RECIPE=====================================
app.post("/loadPublicRecipe2", async (req,res)=>{
    //declare variables needed
    let sessionuser = req.body.newUsername;//username inserted to form
    let userEmail = req.body.newUserEmail;//email inserted to form
    let publicRecipeId = req.body.publicRecipeId;//recipe selected
    console.log("public recipe ID: " + publicRecipeId);

    let recipeToLoad = await PublicRecipes.findById(publicRecipeId);
    console.log("recipe to load: " + recipeToLoad);

    return res.render("user.ejs", 
    {
    //-----------------USER INFO-----------------------
    name: sessionuser,
    email: userEmail,
    //----------PUBLIC RECIPES PROMPT BOX---------------
    publicRecipesModalDisplay: "none",
    pubNum: "",
    publicRecipes2: [], 
    //-----------------RECIPE DOC 2--------------------
    chef: recipeToLoad.username, 
    documentModalDisplay: "block",
    publicRecipesTitle: recipeToLoad.publicRecipesTitle,
    publicRecipesIngredients: recipeToLoad.publicRecipesIngredients,
    publicRecipesPreparation: recipeToLoad.publicRecipesPreparation,
    //-------------MY RECIPES PROMPT BOX---------------
    myRecipesModalDisplay: "none",
    num:"",
    recipes: [],
    recipesTitle: "",
    //-------------NEW RECIPE PROMPT BOX---------------
    tempTitle: "", 
    tempIng: "", 
    tempPrep: "", 
    //--------------RECIPE PROMPT BOX------------------
    recipeModalDisplay: "none",
    recipesTitle: "", 
    recipesIngredients: "", 
    recipesPreparation:"",  
    checked:"",
    //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
    recipesTitle0:"",
    //---------------MESSAGE PROMPT BOX-----------------
    messageModalDisplay: "none",      
    messageTitle:"", 
    messageContents: "", 
    userMsgContVarialbeDisplay:"none",
    nameMsgDisplay:"none",
    emailMsgDisplay:"none",
    msgbtn:""
    });

})//end of app.post("/loadPublicRecipe2",...);

//===================SIGN UP FUNCTION===============================================
app.post("/sign_up", async (req,res) => {
    const username = req.body.newUsername;//username inserted to form
    const email = req.body.newUserEmail;//email inserted to form
    const password = req.body.newPassword;//password inserted to form
    const pwdConfirm =req.body.confirmNewPassword;//password confirm field

    let user = await User.findOne({username: username});//check user collection for username
    let userEmail = await User.findOne({email: email});

    if (user || userEmail){//if username or email already exist
        console.log("user already exists.");
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Sign Up Error...", 
                display2:"grid", 
                messageContents: "Username already taken. Please try again to sign up or ", 
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"inline-block", 
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"none",
                homePubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            });
    }

    if(username == "" || email == "" || password == "" || pwdConfirm == ""){
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "Please fill in all fields.", 
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none", 
                //--------PUBLIC RECIPE PROMPT BOX--------// 
                display:"none",
                homePubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""  
            });  
    }
    //if username invalid
    var simplifiedUsername = username.replace(/[a-z\d]/ig, "");
    if (/[a-z\d]/i.test(username) == false || /[\s]/.test(username) == true || simplifiedUsername !== ""){
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "Username invalid. Please submit username without spaces using only characters a-z, A-Z and/or 0-9.", 
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none",    
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"none",
                PubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            });  
    }
    var simplifiedEmail = email.replace(/[a-z\d@.]/ig, "");
    if (/[a-z\d]/i.test(email) == false || simplifiedEmail !== "" || /com/.test(email) == false|| /[\s]/.test(email) == true){
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "Email invalid. Please try again.", 
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none",
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display: "none",
                homePubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            });      
    }
    //if passwords don't match
    if (password !== pwdConfirm){
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "'Password' and 'Confirm Password' fields did not match. Please try again.", 
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none",   
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"none",
                homePubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            });
    }
        
    const hashedPW = await bcrypt.hash(password, 10);//hash password with salt of 10 times encryption
    user = new User({
        username,
        email,
        password: hashedPW
    })

    await user.save();//save new user to DB
    //redirect to home page and display welcome message
    return res.render("home.ejs", 
        {
        //------------MESSAGE PROMPT BOX----------//
        messageTitle:"Welcome!", 
        display2:"block", 
        messageContents: "Please log in to access your account.", 
        homeMsgFunc: "closeMsgPrompt()",
        loginAlt:"none",  
        //--------PUBLIC RECIPE PROMPT BOX--------//
        display:"none",
        homePubNum:"",
        publicRecipes: [],
        //-------------RECIPE DOC------------------//
        documentModalDisplay:"none",
        chef: "",
        publicRecipesTitle: "",
        publicRecipesIngredients: "",
        publicRecipesPreparation: ""
    });

})
//======================LOGIN FUNCTION========================================
app.post("/login", async (req,res)=>{
    const username = req.body.username;//username inserted to form
    const password = req.body.password;//password inserted to form

    let user = await User.findOne({username: username});//check user collection for username
    let email = await User.findOne({email: username});//check user collection for email

    //if any fields are empty
    if(username == "" || password == ""){
        //redirect to home page and display error message  
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Login Error...", 
                display2:"block", 
                messageContents: "Please fill in all fields.", 
                homeMsgFunc: "backToLoginPrompt()",
                loginAlt:"none", 
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"none",
                homePubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            }); 
    }

    if (!user && !email){//if the user does not exsist, return to the home page
        console.log("not a user");
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {
                //------------MESSAGE PROMPT BOX----------//
                messageTitle:"Login Error...", 
                display2:"block", 
                messageContents: "Wrong username or password. Please try again.", 
                homeMsgFunc: "backToLoginPrompt()",
                loginAlt:"none", 
                //--------PUBLIC RECIPE PROMPT BOX--------//
                display:"none",
                homePubNum:"",
                publicRecipes: [],
                //-------------RECIPE DOC------------------//
                documentModalDisplay:"none",
                chef: "",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: ""
            }); 
    }
    if(user){
        const isMatch = await bcrypt.compare(password, user.password);//compares input password with hashed password

        if(!isMatch){//if the password doesn't match, return user to home page
            console.log("not matched");
            //redirect to home page and display error message
            return res.render("home.ejs", 
                    {
                    //------------MESSAGE PROMPT BOX----------//
                    messageTitle:"Login Error...", 
                    display2:"block", 
                    messageContents: "Wrong username or password. Please try again.", 
                    homeMsgFunc: "backToLoginPrompt()",
                    loginAlt:"none",  
                    //--------PUBLIC RECIPE PROMPT BOX--------//
                    display:"none",
                    homePubNum:"",
                    publicRecipes: [],
                    //-------------RECIPE DOC------------------//
                    documentModalDisplay:"none",
                    chef: "",
                    publicRecipesTitle: "",
                    publicRecipesIngredients: "",
                    publicRecipesPreparation: ""
                });        
        }
        req.session.isAuth = true;
        req.session.username = user.username;
        req.session.userID = user._id;
        req.session.userEmail = user.email;
        req.session.userPassword = user.password;

        console.log("userID from username: " + user._id);
        res.redirect("/user");
    }
    if(email){
        const isMatch = await bcrypt.compare(password, email.password);//compares input password with hashed password

        if(!isMatch){//if the password doesn't match, return user to home page
            console.log("not matched");
            //redirect to home page and display error message
            return res.render("home.ejs", 
                    {
                    //------------MESSAGE PROMPT BOX----------//
                    messageTitle:"Login Error...", 
                    display2:"block", 
                    messageContents: "Wrong username or password. Please try again.", 
                    homeMsgFunc: "backToLoginPrompt()",
                    loginAlt:"none", 
                    //--------PUBLIC RECIPE PROMPT BOX--------//
                    display:"none",
                    homePubNum:"",
                    publicRecipes: [],
                    //-------------RECIPE DOC------------------//
                    documentModalDisplay:"none",
                    chef: "",
                    publicRecipesTitle: "",
                    publicRecipesIngredients: "",
                    publicRecipesPreparation: ""
                });
        }
        req.session.isAuth = true;
        req.session.username = email.username;
        req.session.userEmail = email.email;
        req.session.userPassword = email.password;
        req.session.userID = email._id;
        
        console.log("userID from user email: " + email._id);
        res.redirect("/user");
    }
})

//==============================CLOSE MESSAGE PROMPTS========================================
app.post("/closeMsg", (req,res)=>{
    return res.render("home.ejs", 
            {
            //------------MESSAGE PROMPT BOX----------//
            messageTitle:"", 
            display2:"none", 
            messageContents: "",
            homeMsgFunc: "",
            loginAlt:"none",
            //--------PUBLIC RECIPE PROMPT BOX--------//
            display:"none",
            homePubNum:"",
            publicRecipes: [],
            //-------------RECIPE DOC------------------//
            documentModalDisplay:"none",
            chef: "",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: ""
        });
})

app.post("/closeMsg2", (req,res)=>{
    //clear saved original recipe title name from loaded recipe if it was loaded
    req.session.recipeTitle= "";
    req.session.personalRecipeID = "";
    req.session.publicRecipeID = "";
    return res.redirect("/user");
    
});

//==============================USER PAGE====================================================
//================MY RECIPES PROMPT BOX: GET USER RECIPES===============================
app.post("/getRecipeList", async (req,res)=>{

var sessionuser = req.session.username;//session user's name
var userEmail = req.session.userEmail;//session user's email
var userID = req.session.userID;//session user's ID

let userRecipes = await Recipes.find({username: sessionuser});
console.log("userRecipes variable: " + userRecipes);
console.log("userRecipes variable type: " + typeof userRecipes);
console.log("userRecipes variable length: " + userRecipes.length);
if(userRecipes ==""){
    return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "block",
                num: "0",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "none",      
                messageTitle:"", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:""
                });

}
else{
    return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "block",
                num:userRecipes.length,
                recipes: userRecipes,
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "none",      
                messageTitle:"", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:""
                });
}//end of else to if(userRecipes =="")

})//end of app.post("/getRecipeList",...);

//=====================RECIPE PROMPT BOX:LOAD RECIPE=======================
app.post("/loadRecipe", async (req,res) =>{
    //declare variables
    var sessionuser = req.session.username;//session user's name
    var userEmail = req.session.userEmail;//session user's email
    var recipeSelection = req.body.recipeInputName;//selected recipe name

    let recipesToLoad = await Recipes.find({username: sessionuser});
    let inPublicList = await PublicRecipes.find({username: sessionuser});
    console.log("recipe to load: " + recipesToLoad);

    //make empty arrays to catch matches of title searches
    let recipeMatch = [];
    let publicRecipeMatch = [];

    //search for title with username in public listing
    inPublicList.forEach(publicTitleSearch);
    function publicTitleSearch(index){
        console.log("public index title: " + index.publicRecipesTitle);

        if(index.publicRecipesTitle !== recipeSelection){//recipe title does not exist
            console.log("index title not the same as selection. Public Selection: " + recipeSelection + " Index title: " + index.publicRecipesTitle);
        }
        else{//recipe title does exist
            publicRecipeMatch.push(index);
            console.log("index title is the same as the submitted selection. Public Selection: " + recipeSelection + " Index title: " + index.publicRecipesTitle);
            console.log("recipeMatch length: " + publicRecipeMatch.length);
            req.session.publicRecipeID = index._id;
        }
    }  
    //make conditional definition for 'checked' EJS variable
    var checkValue =  (publicRecipeMatch.length > 0)? "checked='checked'":"";
    console.log("check value " + checkValue);
    //search for username with recipe title in personal listing
    recipesToLoad.forEach(titleSearch);
    function titleSearch(index){
        console.log("index title: " + index.recipesTitle);

        if(index.recipesTitle !== recipeSelection){//recipe title does not exist
            console.log("index title not the same as selection. Selection: " + recipeSelection + " Index title: " + index.recipesTitle);
        }
        else{//recipe title does exist
            recipeMatch.push(index);
            console.log("index title is the same as the submitted selection. Selection: " + recipeSelection + " Index title: " + index.recipesTitle);
            console.log("recipeMatch length: " + recipeMatch.length);
            //make variables of original recipe title and id if any editions made
            req.session.recipeTitle = index.recipesTitle;
            req.session.personalRecipeID = index._id;
            //load user page with recipe info----------------------------
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
            name: sessionuser,
            email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
            publicRecipesModalDisplay: "none",
            pubNum: "",
            publicRecipes2: [], 
            //-----------------RECIPE DOC 2--------------------
            chef: "", 
            documentModalDisplay: "none",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: "",
            //-------------MY RECIPES PROMPT BOX---------------
            myRecipesModalDisplay: "none",
            num:"",
            recipes: [],
            recipesTitle: "",
            //-------------NEW RECIPE PROMPT BOX---------------
            tempTitle: "", 
            tempIng: "", 
            tempPrep: "", 
            //--------------RECIPE PROMPT BOX------------------
            recipeModalDisplay: "block",
            recipesTitle: index.recipesTitle, 
            recipesIngredients: index.recipesIngredients, 
            recipesPreparation: index.recipesPreparation,  
            checked:checkValue,
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:index.recipesTitle,
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "none",      
            messageTitle:"", 
            messageContents: "", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:""
            });
        }//end of else to if(index.recipesTitle !== recipeSelection)
    }//end of function titleSearch(index)
    //this section should never occur per user only selecting options visible, note error message if selection of non-option
    return res.render("user.ejs", 
    {
    //-----------------USER INFO-----------------------
    name: sessionuser,
    email: userEmail,
    //----------PUBLIC RECIPES PROMPT BOX---------------
    publicRecipesModalDisplay: "none",
    pubNum: "",
    publicRecipes2: [], 
    //-----------------RECIPE DOC 2--------------------
    chef: "", 
    documentModalDisplay: "none",
    publicRecipesTitle: "",
    publicRecipesIngredients: "",
    publicRecipesPreparation: "",
    //-------------MY RECIPES PROMPT BOX---------------
    myRecipesModalDisplay: "none",
    num:"",
    recipes: [],
    recipesTitle: "",
    //-------------NEW RECIPE PROMPT BOX---------------
    tempTitle: "", 
    tempIng: "", 
    tempPrep: "", 
    //--------------RECIPE PROMPT BOX------------------
    recipeModalDisplay: "none",
    recipesTitle: "", 
    recipesIngredients: "", 
    recipesPreparation: "",  
    checked:"",
    //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
    recipesTitle0:"",
    //---------------MESSAGE PROMPT BOX-----------------
    messageModalDisplay: "block",      
    messageTitle:"Error...", 
    messageContents: "Something went wrong. Please try again", 
    userMsgContVarialbeDisplay:"none",
    nameMsgDisplay:"none",
    emailMsgDisplay:"none",
    msgbtn:"closeMessage()"
    });
})//end of app.post("/loadRecipe",...);

//======================UPDATE RECIPE============================================
app.post("/editRecipe", async (req,res)=>{
//declare variables to be used
var sessionuser = req.session.username;
var userEmail = req.session.userEmail;
var makePublic = req.body.makePublic;
var recipeName = req.body.recipeName;
var trimmedRecipeName = recipeName.trim();
var originalRecipeName = req.session.recipeTitle;
var recipeIngredients = req.body.recipeIngredients;
var recipePreparation = req.body.recipePreparation;

//search for report in public recipe listing (if exits and makepublic chekcbox is checked, update public recipe; if it doesn't yet exist add it to public recipe; if it does exist and makepublic checkbox is off, remove from public recipe collection)
    //define variable for public recipe if it exsists
    let publicRecipe = await PublicRecipes.find({username: sessionuser});
    
    let publicRecipeMatch = [];

    publicRecipe.forEach(originalTitleSearch);
    console.log("publicRecipeMatch from above originalTitleSearch: " + publicRecipeMatch.length);
    function originalTitleSearch(index){
        if(index.publicRecipesTitle !== originalRecipeName){//recipe title does not exist
            console.log("index title not the same as selection. Public Selection: " + originalRecipeName + " Index title: " + index.publicRecipesTitle);
            // publicRecipeNonMatch.push(index);
        }
        else{//recipe title does exist
            publicRecipeMatch.push(index);
            console.log("index title is the same as the submitted selection. Public Selection: " + originalRecipeName + " Index title: " + index.publicRecipesTitle);
            console.log("publicRecipeMatch length: " + publicRecipeMatch.length);
        }
    }//end of originalTitleSearch(index)
    //define variable for located recipe from recipe collection
    let personalRecipe = await Recipes.find({username: sessionuser});
    let recipeMatch = [];
    let editedTitleMatch = [];
    personalRecipe.forEach(originalTitleSearch2);

    function originalTitleSearch2(index){
        if(index.recipesTitle !== originalRecipeName){//recipe title does not exist
            console.log("index title not the same as selection. Personal recipe title: " + originalRecipeName + " Index title: " + index.recipesTitle);
        }
        else if(index.recipesTitle == trimmedRecipeName){
            editedTitleMatch.push(index);
            console.log("pursued recipe title already taken: "+ index.recipesTitle);
        }
        else if(index.recipesTitle == originalRecipeName){//recipe title does exist
            recipeMatch.push(index);
            console.log("index title is the same as the submitted selection. Personal recipe title: " + originalRecipeName + " Index title: " + index.recipesTitle);
            console.log("recipeMatch length: " + recipeMatch.length);
        }
    }//end of originalTitleSearch2(index)
    
    //make conditional definition for 'checked' EJS variable
    var checkValue =  (publicRecipeMatch.length > 0)? "checked='checked'":"";
    console.log("Edit recipe: load check value " + checkValue);

    //if makePublic checkbox is on
    if(makePublic == "on"){
        console.log("make public note detected 'on'");

        //--------PERSONAL RECIPE COLLECTION: UPDATE RECIPE--------------//
        //1. Error handlers: 
        //1.1: Are any fields empty?
        if(trimmedRecipeName=="" ||recipeIngredients =="" || recipePreparation==""){
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
            name: sessionuser,
            email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
            publicRecipesModalDisplay: "none",
            pubNum: "",
            publicRecipes2: [], 
            //-----------------RECIPE DOC 2--------------------
            chef: "", 
            documentModalDisplay: "none",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: "",
            //-------------MY RECIPES PROMPT BOX---------------
            myRecipesModalDisplay: "none",
            num:"",
            recipes: [],
            recipesTitle: "",
            //-------------NEW RECIPE PROMPT BOX---------------
            tempTitle: "", 
            tempIng: "", 
            tempPrep: "", 
            //--------------RECIPE PROMPT BOX------------------
            recipeModalDisplay: "none",
            recipesTitle: trimmedRecipeName, 
            recipesIngredients: recipeIngredients, 
            recipesPreparation:recipePreparation,  
            checked:checkValue,
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:originalRecipeName,
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "Please fill in all fields", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(trimmedRecipeName=="" ||recipeIngredients =="" || recipePreparation=="")

        //1.2: Is the pursued recipe name/ingredients list/preparation notes invalid?
        //if recipe title contains too much white space
        let pattern = new RegExp("  ","g");
        let excessWhiteSpace = pattern.test(recipeName);

        if(excessWhiteSpace == true){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please remove excess spaces: ' '", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(excessWhiteSpace == true)

        //if recipe title is invalid
        if(/[a-z]/i.test(trimmedRecipeName) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(/[a-z]/i.test(trimmedRecipeName) == false)

        //if recipe ingredients field is invalid
        if(/[a-z]/i.test(recipeIngredients) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe ingredients input invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(/[a-z]/i.test(recipeIngredients) == false)

        //if recipe preparation field is invalid
        if(/[a-z]/i.test(recipePreparation) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe preparation input invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(/[a-z]/i.test(recipePreparation) == false)

        //1.3: Is the pursued recipe name already taken in personal recipe collection and the pursued title is not the same as the original?
        if(editedTitleMatch.length > 0){//if recipe name submitted is the same as the current recipe name
            if(trimmedRecipeName !== originalRecipeName){//if the pursued name is not the same as the origial name and a recipe was found with that title, give error message noting recipe name taken
                return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe name taken. Please resubmit recipe with differnt title", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
                });
            }//end of if(trimmedRecipeName !== originalRecipeName)
        }//end of if(editedTitleMatch.length > 0)
        //2. Update recipe in personal recipe collection

        personalRecipe.forEach(updateOriginalTitle);

        async function updateOriginalTitle(index){
            if(index.recipesTitle !== originalRecipeName){//recipe title does not exist
                console.log("index title not the same as selection. Personal recipe title: " + originalRecipeName + " Index title: " + index.recipesTitle);
            }
            else{//recipe title does exist
                console.log("index title is the same as the submitted selection. Personal recipe title: " + originalRecipeName + " Index title: " + index.recipesTitle);
                console.log("recipeMatch length: " + recipeMatch.length);
                console.log("id of located recipe: " + index._id);

                let updatedTitle = await Recipes.findOneAndUpdate({_id: index._id}, {recipesTitle: trimmedRecipeName});
                let updatedIngredients = await Recipes.findOneAndUpdate({_id: index._id}, {recipesIngredients: recipeIngredients});
                let updatedPreparation = await Recipes.findOneAndUpdate({_id: index._id}, {recipesPreparation: recipePreparation});
                
            }
        }//end of updateOriginalTitle(index)
    
        //-------------------PUBLIC RECIPE COLLECTION--------------------// 
        //2.1A PUBLIC RECIPE COLLECTION: RECIPE DOES NOT EXIST: Insert recipe to public recipe collection
        if(publicRecipeMatch.length == 0){
            
            publicRecipeLog = new PublicRecipes({
                username: sessionuser,
                publicRecipesTitle: trimmedRecipeName,
                publicRecipesIngredients: recipeIngredients,
                publicRecipesPreparation: recipePreparation
            })

            await publicRecipeLog.save();//save new recipe to public recipe collection

        }//end of if(publicRecipeMatch.length == 0)
        //2.1B PUBLIC RECIPE COLLECTION: RECIPE ALREADY EXISTS: Update recipe in public recipe collection
        publicRecipe.forEach(updateOriginalTitle2);
        async function updateOriginalTitle2(index){
            //recipe title does not match recipe to be updated
            if(index.publicRecipesTitle !== originalRecipeName){
                console.log("index title not the same as original title. Public Selection: " + originalRecipeName + " Index title: " + index.publicRecipesTitle);
            }
            //recipe title matches recipe to be updated
            else {
                console.log("index title is the same as the submitted selection. Public Selection: " + originalRecipeName + " Index title: " + index.publicRecipesTitle);
                console.log("publicRecipeMatch length: " + publicRecipeMatch.length);
                console.log("index.publicRecipesTitle from else" + index.publicRecipesTitle);

                let updatedPublicRecipeName = await PublicRecipes.findOneAndUpdate({_id: index._id}, {publicRecipesTitle: trimmedRecipeName});
                let updatedPublicRecipeIngredients = await PublicRecipes.findOneAndUpdate({_id: index._id}, {publicRecipesIngredients: recipeIngredients});
                let updatedPublicRecipePreparation = await PublicRecipes.findOneAndUpdate({_id: index._id}, {publicRecipesPreparation: recipePreparation});
                
                console.log("index.publicRecipesTitle from else2" + index.publicRecipesTitle);
            }
        }//end of updateOriginalTitle2(index)

        return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Success!", 
                messageContents: "Recipe updated", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"closeMessage()"
                });

    }//end of if(makePublic == "on")

    //if makePublic checkbox is off
    else{
        console.log("make public note detected 'off'");

        //--------PERSONAL RECIPE COLLECTION: UPDATE RECIPE--------------//
        //1. Error handlers: 
        //1.1: Is the title field empty?
        if(trimmedRecipeName==""){
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
            name: sessionuser,
            email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
            publicRecipesModalDisplay: "none",
            pubNum: "",
            publicRecipes2: [], 
            //-----------------RECIPE DOC 2--------------------
            chef: "", 
            documentModalDisplay: "none",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: "",
            //-------------MY RECIPES PROMPT BOX---------------
            myRecipesModalDisplay: "none",
            num:"",
            recipes: [],
            recipesTitle: "",
            //-------------NEW RECIPE PROMPT BOX---------------
            tempTitle: "", 
            tempIng: "", 
            tempPrep: "", 
            //--------------RECIPE PROMPT BOX------------------
            recipeModalDisplay: "none",
            recipesTitle: trimmedRecipeName, 
            recipesIngredients: recipeIngredients, 
            recipesPreparation:recipePreparation,  
            checked:checkValue,
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:originalRecipeName,
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "Must submit title before submission", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(trimmedRecipeName=="")

        //1.2: Is the pursued recipe name invalid?
        //if recipe title is invalid
        if(/[a-z]/i.test(recipeName) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(/[a-z]/i.test(recipeName) == false)

        //if recipe title contains too much white space
        let pattern = new RegExp("  ","g");
        let excessWhiteSpace = pattern.test(recipeName);

        if(excessWhiteSpace == true){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please remove excess spaces: ' '", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
            });
        }//end of if(excessWhiteSpace == true)

        //1.3: Is the pursued recipe name already taken in personal recipe collection and the pursued title is not the same as the original?
        if(editedTitleMatch.length > 0){//if recipe name submitted is the same as the current recipe name
            if(trimmedRecipeName !== originalRecipeName){//if the pursued name is not the same as the origial name and a recipe was found with that title, give error message noting recipe name taken
                return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: trimmedRecipeName, 
                recipesIngredients: recipeIngredients, 
                recipesPreparation:recipePreparation,  
                checked:checkValue,
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:originalRecipeName,
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe name taken. Please resubmit recipe with differnt title", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToRecipePromptBox()"
                });
            }//end of if(trimmedRecipeName !== originalRecipeName)
        }//end of if(editedTitleMatch.length > 0)
        
        //2. Update recipe in personal recipe collection
        personalRecipe.forEach(updateOriginalTitle);

        async function updateOriginalTitle(index){
            if(index.recipesTitle !== originalRecipeName){//recipe title does not exist
                console.log("index title not the same as selection. Personal recipe title: " + originalRecipeName + " Index title: " + index.recipesTitle);
            }
            else{//recipe title does exist
                console.log("index title is the same as the submitted selection. Personal recipe title: " + originalRecipeName + " Index title: " + index.recipesTitle);
                console.log("recipeMatch length: " + recipeMatch.length);
                console.log("id of located recipe: " + index._id);

                let updatedTitle = await Recipes.findOneAndUpdate({_id: index._id}, {recipesTitle: trimmedRecipeName});
                let updatedIngredients = await Recipes.findOneAndUpdate({_id: index._id}, {recipesIngredients: recipeIngredients});
                let updatedPreparation = await Recipes.findOneAndUpdate({_id: index._id}, {recipesPreparation: recipePreparation});
                
            }
        }//end of updateOriginalTitle(index)

        //-------------------PUBLIC RECIPE COLLECTION--------------------// 
        //--------PUBLIC RECIPE COLLECTION: RECIPE ALREADY EXISTS--------//
        //2.1A Remove recipe from public recipe collection
        publicRecipe.forEach(updateOriginalTitle2);
        async function updateOriginalTitle2(index){
            //recipe title does not match recipe to be updated
            if(index.publicRecipesTitle !== originalRecipeName){
                console.log("index title not the same as original title. Public Selection: " + originalRecipeName + " Index title: " + index.publicRecipesTitle);
            }
            //recipe title matches recipe to be updated
            else {
                console.log("index title is the same as the submitted selection. Public Selection: " + originalRecipeName + " Index title: " + index.publicRecipesTitle);
                console.log("publicRecipeMatch length: " + publicRecipeMatch.length);

                let deletedPublicRecipe = await PublicRecipes.findOneAndDelete({_id: index._id});
                
                console.log("deletedPublicRecipe from else2" + deletedPublicRecipe);
            }
        }//end of updateOriginalTitle2(index)

        //--------PUBLIC RECIPE COLLECTION: RECIPE DOES NOT EXIST--------//
        //2.1B No action needed

        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
        name: sessionuser,
        email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
        publicRecipesModalDisplay: "none",
        pubNum: "",
        publicRecipes2: [], 

        //-----------------RECIPE DOC 2--------------------
        chef: "", 
        documentModalDisplay: "none",
        publicRecipesTitle: "",
        publicRecipesIngredients: "",
        publicRecipesPreparation: "",
        //-------------MY RECIPES PROMPT BOX---------------
        myRecipesModalDisplay: "none",
        num:"",
        recipes: [],
        recipesTitle: "",
        //-------------NEW RECIPE PROMPT BOX---------------
        tempTitle: "", 
        tempIng: "", 
        tempPrep: "", 
        //--------------RECIPE PROMPT BOX------------------
        recipeModalDisplay: "none",
        recipesTitle: "", 
        recipesIngredients: "", 
        recipesPreparation:"",  
        checked:"",
        //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
        recipesTitle0:"",
        //---------------MESSAGE PROMPT BOX-----------------
        messageModalDisplay: "block",      
        messageTitle:"Success!", 
        messageContents: "Recipe updated", 
        userMsgContVarialbeDisplay:"none",
        nameMsgDisplay:"none",
        emailMsgDisplay:"none",
        msgbtn:"closeMessage()"
        });

    }//end of else statement: if makePublic checkbox is off
});//end of app.post("/editRecipe",...);

//================================DELETE RECIPE===================================
app.post("/delRecipe", async (req,res)=>{
    var sessionuser = req.session.username;//session user's name
    var userEmail = req.session.userEmail;//session user's email
    let personalRecipe = req.session.personalRecipeID;//personal recipe id
    let publicRecipe = req.session.publicRecipeID;//public recipe id

    let deletedPublicRecipe = await Recipes.findOneAndDelete({_id: personalRecipe});
    let deletedPersonalRecipe = await PublicRecipes.findOneAndDelete({_id: publicRecipe});

    return res.render("user.ejs", 
    {
    //-----------------USER INFO-----------------------
    name: sessionuser,
    email: userEmail,
    //----------PUBLIC RECIPES PROMPT BOX---------------
    publicRecipesModalDisplay: "none",
    pubNum: "",
    publicRecipes2: [], 
    //-----------------RECIPE DOC 2--------------------
    chef: "", 
    documentModalDisplay: "none",
    publicRecipesTitle: "",
    publicRecipesIngredients: "",
    publicRecipesPreparation: "",
    //-------------MY RECIPES PROMPT BOX---------------
    myRecipesModalDisplay: "none",
    num:"",
    recipes: [],
    recipesTitle: "",
    //-------------NEW RECIPE PROMPT BOX---------------
    tempTitle: "", 
    tempIng: "", 
    tempPrep: "", 
    //--------------RECIPE PROMPT BOX------------------
    recipeModalDisplay: "none",
    recipesTitle: "", 
    recipesIngredients: "", 
    recipesPreparation:"",  
    checked:"",
    //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
    recipesTitle0:"",
    //---------------MESSAGE PROMPT BOX-----------------
    messageModalDisplay: "block",      
    messageTitle:"Success!", 
    messageContents: "Recipe deleted", 
    userMsgContVarialbeDisplay:"none",
    nameMsgDisplay:"none",
    emailMsgDisplay:"none",
    msgbtn:"closeMessage()"
    });

});//end of app.post("/delRecipe",...);


//======================UPDATE ACCT INFORMATION===================================
//======================UPDATE USERNAME===========================================
app.post("/editUsername", async (req,res)=>{

    var sessionuser = req.session.username;
    var editedUserName = req.body.editedusername;
    var currentPW = req.body.currentPWEditUN;
    var userEmail = req.session.userEmail;

    console.log(sessionuser);//current username
    //if any fields are empty, note this
    if(editedUserName =="" || currentPW ==""){
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: sessionuser,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Please fill in all fields", 
         userMsgContVarialbeDisplay:"none",
         nameMsgDisplay:"none",
         emailMsgDisplay:"none",
         msgbtn:"returnAccountPromptBox()"});
    }

    //if username invalid
    var simplifiedUsername = editedUserName.replace(/[a-z\d]/ig, "");
    if (/[a-z\d]/i.test(editedUserName) == false || /[\s]/.test(editedUserName) == true || simplifiedUsername !== ""){
        //redirect to user page and display error message
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: sessionuser,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Username invalid. Please submit username without spaces using only characters a-z, A-Z and/or 0-9.", 
         userMsgContVarialbeDisplay:"none",
         nameMsgDisplay:"none",
         emailMsgDisplay:"none",
         msgbtn:"returnAccountPromptBox()"});
    }
    //search for current and pursued username
    let specificUser = await User.find({username: sessionuser});//find current user in database
    let newUsername = await User.find({username: editedUserName});//find, if available, proposed new username in database
    const isMatch = await bcrypt.compare(currentPW, specificUser[0].password);//compares input password with hashed password
    console.log("specific user: " + specificUser);//check which user was located
    console.log("isMatch variable: " + isMatch);//check for password match
    //if user already exists and pursued username not the same as current username
    if (newUsername[0] !== undefined){
        let pattern = new RegExp(specificUser.username, "i");
        //let sameName = pattern.test(editedUserName);
        let sameName = newUsername.username.replace(pattern,"");
        if (sameName == ""){
            console.log("Submitting same/similar username: " + newUsername);//log attempted username if it was already taken in the users collection
            
            //if the password doesn't match, return user to user page
            if(!isMatch){
                console.log("Password does not match for user update");
                return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Password incorrect. Please try again", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnAccountPromptBox()"
                });
            }//end of if (newUsername[0] !== undefined):if (sameName == ""):if(!isMatch)
            //if it is the same name and the password of the user is correct...
            //take the current username from users and recipes collections and update it to the new entered username-------------        
            let specificUserPublicRecipesUN = await PublicRecipes.updateMany({username: sessionuser}, { username: editedUserName });//update username in public recipes collection
            let specificUserRecipeUN = await Recipes.findOneAndUpdate({username: sessionuser}, { username: editedUserName });//update username in recipes collection
            let specificUserUpdate = await User.findOneAndUpdate({username: sessionuser}, { username: editedUserName });//update username in users collection
    
            req.session.username = editedUserName;
            //reload session to contain new username
            req.session.reload(function(err) {
                console.log(err);
                })
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
             name: editedUserName,
             email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
             publicRecipesModalDisplay: "none",
             pubNum: "",
             publicRecipes2: [], 
             //-----------------RECIPE DOC 2--------------------
             chef: "", 
             documentModalDisplay: "none",
             publicRecipesTitle: "",
             publicRecipesIngredients: "",
             publicRecipesPreparation: "",
             //-------------MY RECIPES PROMPT BOX---------------
             myRecipesModalDisplay: "none",
             num:"",
             recipes: [],
             recipesTitle: "",
             //-------------NEW RECIPE PROMPT BOX---------------
             tempTitle: "", 
             tempIng: "", 
             tempPrep: "", 
             //--------------RECIPE PROMPT BOX------------------
             recipeModalDisplay: "none",
             recipesTitle: "", 
             recipesIngredients: "", 
             recipesPreparation:"",  
             checked:"",
             //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
             recipesTitle0:"",
             //---------------MESSAGE PROMPT BOX-----------------
             messageModalDisplay: "block",      
             messageTitle:"Success!", 
             messageContents: "Updated username to ", 
             userMsgContVarialbeDisplay:"inline-block",
             nameMsgDisplay:"inline-block",
             emailMsgDisplay:"none",
             msgbtn:"closeMessage()"
            });  
        }//end of if (newUsername[0] !== undefined):if (sameName == "")
        //if username already exits and it is not the same as the current username
        else{
            console.log("This username already taken in database: " + newUsername);//log attempted username if it was already taken in the users collection
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
            name: sessionuser,
            email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
            publicRecipesModalDisplay: "none",
            pubNum: "",
            publicRecipes2: [], 
            //-----------------RECIPE DOC 2--------------------
            chef: "", 
            documentModalDisplay: "none",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: "",
            //-------------MY RECIPES PROMPT BOX---------------
            myRecipesModalDisplay: "none",
            num:"",
            recipes: [],
            recipesTitle: "",
            //-------------NEW RECIPE PROMPT BOX---------------
            tempTitle: "", 
            tempIng: "", 
            tempPrep: "", 
            //--------------RECIPE PROMPT BOX------------------
            recipeModalDisplay: "none",
            recipesTitle: "", 
            recipesIngredients: "", 
            recipesPreparation:"",  
            checked:"",
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:"",
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "Username already taken. Please try again", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:"returnAccountPromptBox()"});
        }//end of else statement
    }//end of if (newUsername[0] !== undefined)

    //if the pursued username does not yet exsist...
    //if the password doesn't match, return user to user page with error note
    if(!isMatch){
        console.log("Password does not match for user update");
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: sessionuser,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Password incorrect. Please try again", 
         userMsgContVarialbeDisplay:"none",
         nameMsgDisplay:"none",
         emailMsgDisplay:"none",
         msgbtn:"returnAccountPromptBox()"
        });
    }//end of if(!isMatch)
   
    //if the password does match, return user to user page with success note
    console.log("new username not yet used in user database");
    //take the current username from users and recipes collections and update it to the new entered username-------------
    let specificUserPublicRecipesUN = await PublicRecipes.updateMany({username: sessionuser}, { username: editedUserName });//update username in public recipes collection       
    let specificUserRecipeUN = await Recipes.findOneAndUpdate({username: sessionuser}, { username: editedUserName });//update username in recipes collection
    let specificUserUpdate = await User.findOneAndUpdate({username: sessionuser}, { username: editedUserName });//update username in users collection

    req.session.username = editedUserName;
    //reload session to contain new username
    req.session.reload(function(err) {
        console.log(err);
        })
    return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: editedUserName,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Success!", 
         messageContents: "Updated username to ", 
         userMsgContVarialbeDisplay:"inline-block",
         nameMsgDisplay:"inline-block",
         emailMsgDisplay:"none",
         msgbtn:"closeMessage()"
        });

});//end of app.post("/editUsername",...)
    
//======================UPDATE EMAIL===========================================
app.post("/editEmail", async (req,res)=>{
    var sessionuser = req.session.username;
    var userEmail = req.session.userEmail;
    var editedEmail = req.body.editedEmail;
    var currentPW = req.body.currentPWEditEM;

    console.log(userEmail);//current user email

    if(editedEmail == "" || currentPW==''){
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: sessionuser,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Please fill in all fields", 
         userMsgContVarialbeDisplay:"none",
         nameMsgDisplay:"none",
         emailMsgDisplay:"none",
         msgbtn:"returnAccountPromptBox()"}); 
    }

    //if email invalid
    var simplifiedEmail = editedEmail.replace(/[a-z\d@.]/ig, "");
    if (/[a-z\d]/i.test(editedEmail) == false || simplifiedEmail !== "" || /com/.test(editedEmail) == false|| /[\s]/.test(editedEmail) == true){
        //redirect to user page and display error message
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: sessionuser,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Email invalid. Please try again", 
         userMsgContVarialbeDisplay:"none",
         nameMsgDisplay:"none",
         emailMsgDisplay:"none",
         msgbtn:"returnAccountPromptBox()"});
    }



    let specificUser = await User.find({email: userEmail});//find current user in database
    let newEmail = await User.find({email: editedEmail});//find, if available, proposed new username in database
    const isMatch = await bcrypt.compare(currentPW, specificUser[0].password);//compares input password with hashed password

    console.log("specific user: " + specificUser[0]);//check which user was located
    console.log("user of pursued email: " + newEmail[0]);//check which user was located
    //if user email already exists...
    if (newEmail[0] !== undefined){
        
        let pattern = new RegExp(specificUser.email, "i");
        let sameEmail = newEmail.email.replace(pattern,"");
        if (sameEmail == ""){
            console.log("Submitting same/similar email: " + editedEmail);//log attempted email if it was already taken in the users collection
            
            //if the password doesn't match, return user to user page
            if(!isMatch){
                console.log("Password does not match for user update");
                return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: "", 
                tempIng: "", 
                tempPrep: "", 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Password incorrect. Please try again", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnAccountPromptBox()"
                });
            }//end of if (sameEmail == ""), if(!isMatch)
            
            // if password does match and submitting same/similar email, take the current email from users collection and update it to the new entered email-------------        
            let specificUserUpdate = await User.findOneAndUpdate({username: sessionuser}, { email: editedEmail });//update email in users collection
    
            req.session.email = editedEmail;
            //reload session to contain new username
            req.session.reload(function(err) {
                console.log(err);
                })
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
             name: sessionuser,
             email: editedEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
             publicRecipesModalDisplay: "none",
             pubNum: "",
             publicRecipes2: [], 
             //-----------------RECIPE DOC 2--------------------
             chef: "", 
             documentModalDisplay: "none",
             publicRecipesTitle: "",
             publicRecipesIngredients: "",
             publicRecipesPreparation: "",
             //-------------MY RECIPES PROMPT BOX---------------
             myRecipesModalDisplay: "none",
             num:"",
             recipes: [],
             recipesTitle: "",
             //-------------NEW RECIPE PROMPT BOX---------------
             tempTitle: "", 
             tempIng: "", 
             tempPrep: "", 
             //--------------RECIPE PROMPT BOX------------------
             recipeModalDisplay: "none",
             recipesTitle: "", 
             recipesIngredients: "", 
             recipesPreparation:"",  
             checked:"",
             //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
             recipesTitle0:"",
             //---------------MESSAGE PROMPT BOX-----------------
             messageModalDisplay: "block",      
             messageTitle:"Success!", 
             messageContents: "Updated email to ", 
             userMsgContVarialbeDisplay:"inline-block",
             nameMsgDisplay:"none",
             emailMsgDisplay:"inline-block",
             msgbtn:"closeMessage()"
            });  
        }//end of if (sameEmail == "")
        else{
            console.log("This email already taken in database: " + newEmail);//log attempted username if it was already taken in the users collection
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
            name: sessionuser,
            email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
            publicRecipesModalDisplay: "none",
            pubNum: "",
            publicRecipes2: [], 
            //-----------------RECIPE DOC 2--------------------
            chef: "", 
            documentModalDisplay: "none",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: "",
            //-------------MY RECIPES PROMPT BOX---------------
            myRecipesModalDisplay: "none",
            num:"",
            recipes: [],
            recipesTitle: "",
            //-------------NEW RECIPE PROMPT BOX---------------
            tempTitle: "", 
            tempIng: "", 
            tempPrep: "", 
            //--------------RECIPE PROMPT BOX------------------
            recipeModalDisplay: "none",
            recipesTitle: "", 
            recipesIngredients: "", 
            recipesPreparation:"",  
            checked:"",
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:"",
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "Email already taken. Please try again", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:"returnAccountPromptBox()"});
        }//end of else statement
    }//end of if (newEmail[0] !== undefined")
    //if new email does not exist...
    if(!isMatch){//if the password doesn't match, return user to user page
        console.log("Password does not match for user update");
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
        name: sessionuser,
        email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
        publicRecipesModalDisplay: "none",
        pubNum: "",
        publicRecipes2: [], 
        //-----------------RECIPE DOC 2--------------------
        chef: "", 
        documentModalDisplay: "none",
        publicRecipesTitle: "",
        publicRecipesIngredients: "",
        publicRecipesPreparation: "",
        //-------------MY RECIPES PROMPT BOX---------------
        myRecipesModalDisplay: "none",
        num:"",
        recipes: [],
        recipesTitle: "",
        //-------------NEW RECIPE PROMPT BOX---------------
        tempTitle: "", 
        tempIng: "", 
        tempPrep: "", 
        //--------------RECIPE PROMPT BOX------------------
        recipeModalDisplay: "none",
        recipesTitle: "", 
        recipesIngredients: "", 
        recipesPreparation:"",  
        checked:"",
        //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
        recipesTitle0:"",
        //---------------MESSAGE PROMPT BOX-----------------
        messageModalDisplay: "block",      
        messageTitle:"Error...", 
        messageContents: "Password incorrect. Please try again", 
        userMsgContVarialbeDisplay:"none",
        nameMsgDisplay:"none",
        emailMsgDisplay:"none",
        msgbtn:"returnAccountPromptBox()"
        });
    }

    console.log("new username not yet used in user database");
    //take the current user email from users collections and update it to the new entered email-------------
    let specificUserUpdate = await User.findOneAndUpdate({email: userEmail}, { email: editedEmail });//update user email in users collection
    //redefine email in session variable
    req.session.userEmail = editedEmail;
    //reload session to contain new username
    req.session.reload(function(err) {
        console.log(err);
        })
    console.log("updated email: " + req.session.userEmail);
    return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
             name: sessionuser,
             email: editedEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
             publicRecipesModalDisplay: "none",
             pubNum: "",
             publicRecipes2: [], 
             //-----------------RECIPE DOC 2--------------------
             chef: "", 
             documentModalDisplay: "none",
             publicRecipesTitle: "",
             publicRecipesIngredients: "",
             publicRecipesPreparation: "",
             //-------------MY RECIPES PROMPT BOX---------------
             myRecipesModalDisplay: "none",
             num:"",
             recipes: [],
             recipesTitle: "",
             //-------------NEW RECIPE PROMPT BOX---------------
             tempTitle: "", 
             tempIng: "", 
             tempPrep: "", 
             //--------------RECIPE PROMPT BOX------------------
             recipeModalDisplay: "none",
             recipesTitle: "", 
             recipesIngredients: "", 
             recipesPreparation:"",  
             checked:"",
             //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
             recipesTitle0:"",
             //---------------MESSAGE PROMPT BOX-----------------
             messageModalDisplay: "block",      
             messageTitle:"Success!", 
             messageContents: "Updated email to ", 
             userMsgContVarialbeDisplay:"inline-block",
             nameMsgDisplay:"none",
             emailMsgDisplay:"inline-block",
             msgbtn:"closeMessage()"
            }); 
});//end of app.post("/editEmail",...)


//================UPDATE PASSWORD======================================
app.post("/editPassword", async (req,res)=>{
    const sessionuser = req.session.username;//name of user for current session
    const userEmail = req.session.userEmail;//email of current user for current session
    const oldPW = req.body.oldPassword;//what the user entered to be the current DB passowrd for their acct
    const newPW = req.body.newPassword;//what the user entered for new passoword
    const confirmNewPW = req.body.reEnteredNewPWD;//what the user re-entered for new passoword

    let user = await User.findOne({username: sessionuser});//check user collection for username
    if(oldPW =="" || newPW =="" || confirmNewPW ==""){
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
         name: sessionuser,
         email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
         publicRecipesModalDisplay: "none",
         pubNum: "",
         publicRecipes2: [], 
         //-----------------RECIPE DOC 2--------------------
         chef: "", 
         documentModalDisplay: "none",
         publicRecipesTitle: "",
         publicRecipesIngredients: "",
         publicRecipesPreparation: "",
         //-------------MY RECIPES PROMPT BOX---------------
         myRecipesModalDisplay: "none",
         num:"",
         recipes: [],
         recipesTitle: "",
         //-------------NEW RECIPE PROMPT BOX---------------
         tempTitle: "", 
         tempIng: "", 
         tempPrep: "", 
         //--------------RECIPE PROMPT BOX------------------
         recipeModalDisplay: "none",
         recipesTitle: "", 
         recipesIngredients: "", 
         recipesPreparation:"",  
         checked:"",
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Please fill in all fields", 
         userMsgContVarialbeDisplay:"none",
         nameMsgDisplay:"none",
         emailMsgDisplay:"none",
         msgbtn:"returnAccountPromptBox()"
        }); 
    }//end of if(oldPW =="" || newPW =="" || confirmNewPW =="")
    const isMatch = await bcrypt.compare(oldPW, user.password);//compares input password with hashed password

    if(!isMatch){//if the password doesn't match, do not submit, stay on user page
        console.log("not matched");
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
        name: sessionuser,
        email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
        publicRecipesModalDisplay: "none",
        pubNum: "",
        publicRecipes2: [], 
        //-----------------RECIPE DOC 2--------------------
        chef: "", 
        documentModalDisplay: "none",
        publicRecipesTitle: "",
        publicRecipesIngredients: "",
        publicRecipesPreparation: "",
        //-------------MY RECIPES PROMPT BOX---------------
        myRecipesModalDisplay: "none",
        num:"",
        recipes: [],
        recipesTitle: "",
        //-------------NEW RECIPE PROMPT BOX---------------
        tempTitle: "", 
        tempIng: "", 
        tempPrep: "", 
        //--------------RECIPE PROMPT BOX------------------
        recipeModalDisplay: "none",
        recipesTitle: "", 
        recipesIngredients: "", 
        recipesPreparation:"",  
        checked:"",
        //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
        recipesTitle0:"",
        //---------------MESSAGE PROMPT BOX-----------------
        messageModalDisplay: "block",      
        messageTitle:"Error...", 
        messageContents: "Password incorrect. Please try again", 
        userMsgContVarialbeDisplay:"none",
        nameMsgDisplay:"none",
        emailMsgDisplay:"none",
        msgbtn:"returnAccountPromptBox()"
        });
    }
    else if (isMatch){//if the password does match, check for matching re-entered passwords
        if(newPW === confirmNewPW){//if re-entered passwords do match, submit new password to DB
            const hashedPW = await bcrypt.hash(confirmNewPW, 10);//hash password with salt of 10 times encryption
            user.password = hashedPW;
            await user.save();//save updated password to DB 
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
             name: sessionuser,
             email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
             publicRecipesModalDisplay: "none",
             pubNum: "",
             publicRecipes2: [], 
             //-----------------RECIPE DOC 2--------------------
             chef: "", 
             documentModalDisplay: "none",
             publicRecipesTitle: "",
             publicRecipesIngredients: "",
             publicRecipesPreparation: "",
             //-------------MY RECIPES PROMPT BOX---------------
             myRecipesModalDisplay: "none",
             num:"",
             recipes: [],
             recipesTitle: "",
             //-------------NEW RECIPE PROMPT BOX---------------
             tempTitle: "", 
             tempIng: "", 
             tempPrep: "", 
             //--------------RECIPE PROMPT BOX------------------
             recipeModalDisplay: "none",
             recipesTitle: "", 
             recipesIngredients: "", 
             recipesPreparation:"",  
             checked:"",
             //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
             recipesTitle0:"",
             //---------------MESSAGE PROMPT BOX-----------------
             messageModalDisplay: "block",      
             messageTitle:"Success!", 
             messageContents: "Password updated", 
             userMsgContVarialbeDisplay:"none",
             nameMsgDisplay:"none",
             emailMsgDisplay:"none",
             msgbtn:"closeMessage()"
            });
        }
        else{
            console.log("not matched");
            return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
            name: sessionuser,
            email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
            publicRecipesModalDisplay: "none",
            pubNum: "",
            publicRecipes2: [], 
            //-----------------RECIPE DOC 2--------------------
            chef: "", 
            documentModalDisplay: "none",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: "",
            //-------------MY RECIPES PROMPT BOX---------------
            myRecipesModalDisplay: "none",
            num:"",
            recipes: [],
            recipesTitle: "",
            //-------------NEW RECIPE PROMPT BOX---------------
            tempTitle: "", 
            tempIng: "", 
            tempPrep: "", 
            //--------------RECIPE PROMPT BOX------------------
            recipeModalDisplay: "none",
            recipesTitle: "", 
            recipesIngredients: "", 
            recipesPreparation:"",  
            checked:"",
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:"",
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "'Password' and 'Confirm Password' fields did not match. Please try again", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:"returnAccountPromptBox()"
            });
        }//end of else statement
    }//end of else if (isMatch) 
})//app.post("/editPassword",...)

//==================NEW RECIPE=========================================
app.post("/newRecipe", async (req,res) =>{
    //declare variables for submission
    let sessionuser = req.session.username;//name of user for current session
    let userEmail = req.session.userEmail;//email of current user for current session
    let newRecipeTitle = req.body.newRecipeTitle;
    let newRecipeTitleTrimmed = newRecipeTitle.trim();
    let newIngredients = req.body.newIngredients;
    let newPreparation = req.body.newPreparation;
    let makePublic = req.body.makePublic;

    console.log("makePublic: " + makePublic);

    // //----------------------------PUBLIC ENTRY SECTION--------------------------
    if (makePublic == "on"){
        console.log("makePublic detected 'on'");
        //error handlers for public posting with new recipe

        //if any fields are empty...
        if(newRecipeTitleTrimmed == "" || newIngredients =="" || newPreparation ==""){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Please fill in all fields", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(newRecipeTitleTrimmed == "" || newIngredients =="" || newPreparation =="")

        //if recipe title contains too much white space
        let pattern = new RegExp("  ","g");
        let excessWhiteSpace = pattern.test(newRecipeTitle);

        if(excessWhiteSpace == true){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please remove excess spaces: ' '", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(excessWhiteSpace == true)
        
        //if recipe title is invalid
        if(/[a-z]/i.test(newRecipeTitle) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(/[a-z]/i.test(newRecipeTitle) == false)

        //if recipe ingredients field is invalid
        if(/[a-z]/i.test(newIngredients) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe ingredients input invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(/[a-z]/i.test(newIngredients) == false)

        //if recipe preparation field is invalid
        if(/[a-z]/i.test(newPreparation) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe preparation input invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(/[a-z]/i.test(newPreparation) == false)

        //check for if recipe title already exists for user in recipe collection
        let recipe = await Recipes.find({username: sessionuser});
        console.log("recipe(s) located: " + recipe);

        let recipeMatch = [];
        recipe.forEach(titleSearch);

        function titleSearch(index){
            console.log("index title: " + index.recipesTitle);

            if(index.recipesTitle !== newRecipeTitleTrimmed){//recipe title does not exist
                console.log("index title not the same as entry. Entry: " + newRecipeTitleTrimmed + " Index title: " + index.recipesTitle);
            }
            else{//recipe title does exist
                recipeMatch.push(index);
                console.log("index title is the same as the submitted entry. Entry: " + newRecipeTitleTrimmed + " Index title: " + index.recipesTitle);
                console.log("recipeMatch length: " + recipeMatch.length);
            }
        }
                                

        console.log("recipe located: " + recipe);
        //console.log("recipe username located: " + recipe.username);

        //if a recipe was located with the session user's name
        if(recipeMatch.length !== 0){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe name taken. Please resubmit recipe with differnt title", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(recipeMatch.length !== 0)

    //if that recipe does not already exist for the user, add to public and private recipe list
    personalRecipeLog = new Recipes({
        username: sessionuser,
        recipesTitle: newRecipeTitleTrimmed,
        recipesIngredients: newIngredients,
        recipesPreparation: newPreparation
    })

    publicRecipeLog = new PublicRecipes({
        username: sessionuser,
        publicRecipesTitle: newRecipeTitleTrimmed,
        publicRecipesIngredients: newIngredients,
        publicRecipesPreparation: newPreparation
    })

    await personalRecipeLog.save();//save new recipe to personal recipe collection
    await publicRecipeLog.save();//save new recipe to public recipe collection

    //redirect to user page and display success message
    return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
             name: sessionuser,
             email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
             publicRecipesModalDisplay: "none",
             pubNum: "",
             publicRecipes2: [], 
             //-----------------RECIPE DOC 2--------------------
             chef: "", 
             documentModalDisplay: "none",
             publicRecipesTitle: "",
             publicRecipesIngredients: "",
             publicRecipesPreparation: "",
             //-------------MY RECIPES PROMPT BOX---------------
             myRecipesModalDisplay: "none",
             num:"",
             recipes: [],
             recipesTitle: "",
             //-------------NEW RECIPE PROMPT BOX---------------
             tempTitle: "", 
             tempIng: "", 
             tempPrep: "", 
             //--------------RECIPE PROMPT BOX------------------
             recipeModalDisplay: "none",
             recipesTitle: "", 
             recipesIngredients: "", 
             recipesPreparation:"",  
             checked:"",
             //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
             recipesTitle0:"",
             //---------------MESSAGE PROMPT BOX-----------------
             messageModalDisplay: "block",      
             messageTitle:"Success!", 
             messageContents: "Recipe submitted", 
             userMsgContVarialbeDisplay:"none",
             nameMsgDisplay:"none",
             emailMsgDisplay:"none",
             msgbtn:"closeMessage()"
        });

    }//end of if(makePublic == "on")
    //--------------------------PRIVATE ENTRY SECTION------------------------------
    else{
        console.log("makePublic detected undefined('off'): " + makePublic);
        //if any fields are empty...
        if(newRecipeTitle == ""){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Must submit title before submission", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(newRecipeTitle == "")  
        
        //if recipe title is invalid
        if(/[a-z]/i.test(newRecipeTitle) == false){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please resubmit using at least characters A-Z, a-z", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(/[a-z]/i.test(newRecipeTitle) == false)

        //if recipe title contains too much white space
        let pattern = new RegExp("  ","g");
        let excessWhiteSpace = pattern.test(newRecipeTitle);

        if(excessWhiteSpace == true){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe title invalid. Please remove excess spaces: ' '", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(excessWhiteSpace == true)

        //check for if recipe title already exists for user in recipe collection
        let recipe = await Recipes.find({username: sessionuser});

        let recipeMatch = [];
        recipe.forEach(titleSearch);

        function titleSearch(index){
            console.log("index title: " + index.recipesTitle);

            if(index.recipesTitle !== newRecipeTitleTrimmed){//recipe title does not exist
                console.log("index title not the same as entry. Entry: " + newRecipeTitleTrimmed + " Index title: " + index.recipesTitle);
                console.log("recipeMatch length2: " + recipeMatch.length);
            }
            else{//recipe title does exist
                recipeMatch.push(index);
                console.log("index title is the same as the submitted entry. Entry: " + newRecipeTitleTrimmed + " Index title: " + index.recipesTitle);
            }
        }

        console.log("recipe located2: " + recipe);
        //if a recipe was located with the session user's name
        if(recipeMatch.length !== 0){
            return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                pubNum: "",
                publicRecipes2: [], 
                //-----------------RECIPE DOC 2--------------------
                chef: "", 
                documentModalDisplay: "none",
                publicRecipesTitle: "",
                publicRecipesIngredients: "",
                publicRecipesPreparation: "",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "none",
                num:"",
                recipes: [],
                recipesTitle: "",
                //-------------NEW RECIPE PROMPT BOX---------------
                tempTitle: newRecipeTitleTrimmed, 
                tempIng: newIngredients, 
                tempPrep: newPreparation, 
                //--------------RECIPE PROMPT BOX------------------
                recipeModalDisplay: "none",
                recipesTitle: "", 
                recipesIngredients: "", 
                recipesPreparation:"",  
                checked:"",
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Recipe name taken. Please resubmit recipe with differnt title", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                msgbtn:"returnToNewRecipePrompt()"
            });
        }//end of if(recipeMatch.length !== 0)

    //if that recipe does not already exist for the user, add to private recipe list
    personalRecipeLog = new Recipes({
        username: sessionuser,
        recipesTitle: newRecipeTitleTrimmed,
        recipesIngredients: newIngredients,
        recipesPreparation: newPreparation
    })
    await personalRecipeLog.save();//save new recipe to personal recipe collection
    //redirect to user page and display success message
    return res.render("user.ejs", 
            {
            //-----------------USER INFO-----------------------
             name: sessionuser,
             email: userEmail,
            //----------PUBLIC RECIPES PROMPT BOX---------------
             publicRecipesModalDisplay: "none",
             pubNum: "",
             publicRecipes2: [], 
             //-----------------RECIPE DOC 2--------------------
             chef: "", 
             documentModalDisplay: "none",
             publicRecipesTitle: "",
             publicRecipesIngredients: "",
             publicRecipesPreparation: "",
             //-------------MY RECIPES PROMPT BOX---------------
             myRecipesModalDisplay: "none",
             num:"",
             recipes: [],
             recipesTitle: "",
             //-------------NEW RECIPE PROMPT BOX---------------
             tempTitle: "", 
             tempIng: "", 
             tempPrep: "", 
             //--------------RECIPE PROMPT BOX------------------
             recipeModalDisplay: "none",
             recipesTitle: "", 
             recipesIngredients: "", 
             recipesPreparation:"",  
             checked:"",
             //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
             recipesTitle0:"",
             //---------------MESSAGE PROMPT BOX-----------------
             messageModalDisplay: "block",      
             messageTitle:"Success!", 
             messageContents: "Recipe submitted", 
             userMsgContVarialbeDisplay:"none",
             nameMsgDisplay:"none",
             emailMsgDisplay:"none",
             msgbtn:"closeMessage()"
        });

    }//end of else to if (makePublic == "on")

})//end of app.post("/newRecipe",...)

//===============LOGOUT FUNCTION========================================
app.post("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log("Error: " + err);
            res.redirect("/");
        }
    })
    console.log("Logging out");
    return res.render("home.ejs", 
            {
            //------------MESSAGE PROMPT BOX----------//
            messageTitle:"Logged Out", 
            display2:"block", 
            messageContents: "See ya later", 
            homeMsgFunc: "closeMsgPrompt()",
            loginAlt:"none", 
            //--------PUBLIC RECIPE PROMPT BOX--------//
            display:"none",
            homePubNum:"",
            publicRecipes: [],
            //-------------RECIPE DOC------------------//
            documentModalDisplay:"none",
            chef: "",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: ""
            });
})

//==========================LANDING PAGE ROUTE ("/")================================
app.get("/", (req,res) =>{
    //display home page with all modals hidden and message fields cleared
    res.render("home.ejs", 
    {
    //------------MESSAGE PROMPT BOX----------//
    messageTitle:"", 
    display2:"none", 
    messageContents: "", 
    homeMsgFunc: "",
    loginAlt:"none", 
    //--------PUBLIC RECIPE PROMPT BOX--------//
    display:"none",
    homePubNum:"",
    publicRecipes: [],
    //-------------RECIPE DOC------------------//
    documentModalDisplay:"none",
    chef: "",
    publicRecipesTitle: "",
    publicRecipesIngredients: "",
    publicRecipesPreparation: ""

});
})

//=====================WHAT TO DO WHEN '/USER' ROUTE IDENTIFIED====================
app.get("/user", isAuth,  async (req,res)=>{

var sessionuser = req.session.username;//session user's name
var userEmail = req.session.userEmail;//session user's email
var userID = req.session.userID;//session user's ID

    console.log(sessionuser);

    res.render("user.ejs", 
    {
    //-----------------USER INFO-----------------------
     name: sessionuser,
     email: userEmail,
    //----------PUBLIC RECIPES PROMPT BOX---------------
     publicRecipesModalDisplay: "none",
     pubNum: "",
     publicRecipes2: [], 
     //-----------------RECIPE DOC 2--------------------
     chef: "", 
     documentModalDisplay: "none",
     publicRecipesTitle: "",
     publicRecipesIngredients: "",
     publicRecipesPreparation: "",
     //-------------MY RECIPES PROMPT BOX---------------
     myRecipesModalDisplay: "none",
     num:"",
     recipes: [],
     recipesTitle: "",
     //-------------NEW RECIPE PROMPT BOX---------------
     tempTitle: "", 
     tempIng: "", 
     tempPrep: "", 
     //--------------RECIPE PROMPT BOX------------------
     recipeModalDisplay: "none",
     recipesTitle: "", 
     recipesIngredients: "", 
     recipesPreparation:"",  
     checked:"",
     //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
     recipesTitle0:"",
     //---------------MESSAGE PROMPT BOX-----------------
     messageModalDisplay: "none",      
     messageTitle:"", 
     messageContents: "", 
     userMsgContVarialbeDisplay:"none",
     nameMsgDisplay:"none",
     emailMsgDisplay:"none",
     msgbtn:""});
    
})

//===================DELETE ACCOUNT=============================================
app.post("/deleteAcct", async (req,res)=>{
var password = req.body.deleteAcctuserPW;
var username = req.session.username;

let user = await User.findOne({username: username});//check user collection for username
console.log("user located for delete" + user);
const isMatch = await bcrypt.compare(password, user.password);//compares input password with hashed password

    if(!isMatch){//if the password doesn't match, do not submit, stay on user page
        console.log("not matched");
        return res.redirect("/user");
    }
    else if(isMatch){//if the password does match, check for matching re-entered passwords
            console.log("user to be deleted: " + user);
            await User.findOneAndDelete({username: username});
            await Recipes.findOneAndDelete({username: username});
            req.session.destroy((err)=>{
                if(err){
                    console.log("Error: " + err);
                }});
            console.log("user deleted: " + user);
            return res.render("home.ejs", 
            {
            //------------MESSAGE PROMPT BOX----------//
            messageTitle:"Account Deleted", 
            display2:"block", 
            messageContents: "Goodbye", 
            homeMsgFunc: "closeMsgPrompt()",
            loginAlt:"none", 
            //--------PUBLIC RECIPE PROMPT BOX--------//
            display:"none",
            homePubNum:"",
            publicRecipes: [],
            //-------------RECIPE DOC------------------//
            documentModalDisplay:"none",
            chef: "",
            publicRecipesTitle: "",
            publicRecipesIngredients: "",
            publicRecipesPreparation: ""
            });
        }
        
})

//=========================START SERVER=================================
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});