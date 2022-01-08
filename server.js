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
        res.render("home.ejs");
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

    if (recipe == searchInput){//if recipe already exists
        console.log("recipe already exists: '" + searchInput + "', " + "'" + recipe + "'");
        return res.render("home.ejs", //redirect to home page
                {messageTitle:"", 
                display2:"none", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "",
                loginAlt:"none"    
            });
    }
    else if(chef == searchInput){
        console.log("chef exists: '" + chef + "'");
        return res.render("home.ejs", //redirect to home page
                {messageTitle:"", 
                display2:"none", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "",
                loginAlt:"none"    
            });
    }
    else{//if chef name/recipe title does not yet exist in public recipe db note this

        console.log("this chef/recipe not in public recipe DB. Search item submitted: '" + searchInput + "'");        
        return res.render("home.ejs", 
                {messageTitle:"", 
                display2:"none", 
                messageContents: "", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"block",
                homeMsgFunc: "",
                loginAlt:"none"    
            });
    }

})
//---------------------------USER PAGE-------------------------------------//
app.post("/publicSearch2", async (req,res) =>{
    const searchInput = req.body.searchInput;

    let chef = await PublicRecipes.find({username: searchInput});//check public recipe collection for chef name
    let recipe = await PublicRecipes.find({publicRecipesTitle: searchInput});//check public recipe collection for recipe name

    if (recipe == searchInput){//if recipe already exists
        console.log("recipe already exists: '" + searchInput + "', " + "'" + recipe + "'");
        return res.render("user.ejs");//rediredirect to user page
    }
    else if(chef == searchInput){
        console.log("chef exists: '" + chef + "'");
        return res.render("user.ejs");//redirect to user page
    }
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
                chef: "", 
                publicRecipesTitle: "", 
                publicRecipesIngredients: "", 
                publicRecipesPreparation: "",
                //-----------------RECIPE DOC 2--------------------
                //chef: "", 
                documentModalDisplay: "none",
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

})

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
                {messageTitle:"Sign Up Error...", 
                display2:"grid", 
                messageContents: "Username already taken. Please try again to sign up or ", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"inline-block"    
            });
    }

    if(username == "" || email == "" || password == "" || pwdConfirm == ""){
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "Please fill in all fields.", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none"    
            });  
    }
    //if username invalid
    var simplifiedUsername = username.replace(/[a-z\d]/ig, "");
    if (/[a-z\d]/i.test(username) == false || /[\s]/.test(username) == true || simplifiedUsername !== ""){
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "Username invalid. Please submit username without spaces using only characters a-z, A-Z and/or 0-9.", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none"    
            });  
    }
    var simplifiedEmail = email.replace(/[a-z\d@.]/ig, "");
    if (/[a-z\d]/i.test(email) == false || simplifiedEmail !== "" || /com/.test(email) == false|| /[\s]/.test(email) == true){
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "Email invalid. Please try again.", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none"    
            });      
    }
    //if passwords don't match
    if (password !== pwdConfirm){
        return res.render("home.ejs", 
                {messageTitle:"Sign Up Error...", 
                display2:"block", 
                messageContents: "'Password' and 'Confirm Password' fields did not match. Please try again.", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToSignUpPrompt()",
                loginAlt:"none"    
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
    res.render("home.ejs", 
    {messageTitle:"Welcome!", 
    display2:"block", 
    messageContents: "Please log in to access your account.", 
    userMsgContVarialbeDisplay:"none",
    nameMsgDisplay:"none",
    emailMsgDisplay:"none",
    display:"none",
    homeMsgFunc: "closeMsgPrompt()",
    loginAlt:"none"    
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
                {messageTitle:"Login Error...", 
                display2:"block", 
                messageContents: "Please fill in all fields.", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToLoginPrompt()",
                loginAlt:"none"    
            }); 
    }

    if (!user && !email){//if the user does not exsist, return to the home page
        console.log("not a user");
        //redirect to home page and display error message
        return res.render("home.ejs", 
                {messageTitle:"Login Error...", 
                display2:"block", 
                messageContents: "Wrong username or password. Please try again.", 
                userMsgContVarialbeDisplay:"none",
                nameMsgDisplay:"none",
                emailMsgDisplay:"none",
                display:"none",
                homeMsgFunc: "backToLoginPrompt()",
                loginAlt:"none"    
            }); 
    }
    if(user){
        const isMatch = await bcrypt.compare(password, user.password);//compares input password with hashed password

        if(!isMatch){//if the password doesn't match, return user to home page
            console.log("not matched");
            //redirect to home page and display error message
            return res.render("home.ejs", 
                    {messageTitle:"Login Error...", 
                    display2:"block", 
                    messageContents: "Wrong username or password. Please try again.", 
                    userMsgContVarialbeDisplay:"none",
                    nameMsgDisplay:"none",
                    emailMsgDisplay:"none",
                    display:"none",
                    homeMsgFunc: "backToLoginPrompt()",
                    loginAlt:"none"    
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
                    {messageTitle:"Login Error...", 
                    display2:"block", 
                    messageContents: "Wrong username or password. Please try again.", 
                    userMsgContVarialbeDisplay:"none",
                    nameMsgDisplay:"none",
                    emailMsgDisplay:"none",
                    display:"none",
                    homeMsgFunc: "backToLoginPrompt()",
                    loginAlt:"none"    
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
            {messageTitle:"", 
            display2:"none", 
            messageContents: "", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            display:"none",
            homeMsgFunc: "",
            loginAlt:"none"    
        });
})

app.post("/closeMsg2", (req,res)=>{
    return res.render("user.ejs", 
    {
    //-----------------USER INFO-----------------------
     name: sessionuser,
     email: userEmail,
    //----------PUBLIC RECIPES PROMPT BOX---------------
     publicRecipesModalDisplay: "none",
     chef: "", 
     publicRecipesTitle: "", 
     publicRecipesIngredients: "", 
     publicRecipesPreparation: "",
     //-----------------RECIPE DOC 2--------------------
     //chef: "", 
     documentModalDisplay: "none",
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
    
});

//==============================USER PAGE====================================================
app.post("/getRecipeList", async (req,res)=>{

var sessionuser = req.session.username;//session user's name
var userEmail = req.session.userEmail;//session user's email
var userID = req.session.userID;//session user's ID

let userRecipes = await Recipes.find({username: sessionuser});
console.log("userRecipes variable: " + userRecipes);
if(userRecipes ==""){
    return res.render("user.ejs", 
                {
                //-----------------USER INFO-----------------------
                name: sessionuser,
                email: userEmail,
    
                //----------PUBLIC RECIPES PROMPT BOX---------------
                publicRecipesModalDisplay: "none",
                chef: "", 
                publicRecipesTitle: "", 
                publicRecipesIngredients: "", 
                publicRecipesPreparation: "",
                //-----------------RECIPE DOC 2--------------------
                //chef: "", 
                documentModalDisplay: "none",
                //-------------MY RECIPES PROMPT BOX---------------
                myRecipesModalDisplay: "block",
                num:"0",
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
    return res.redirect("/user");
}

})
//==============================SUBMIT RECIPE NOTES TO DATABASE==============================
app.post("/submit_recipe",async (req,res)=>{

var sessionuser = req.session.username;
var recipenotes = req.body.notes;
console.log(sessionuser);
let userRecipeNotes = await Recipes.findOne({username: sessionuser});//check recipes collection for username

if (userRecipeNotes){//if notes already exist***place for update
    console.log("notes already exist.");
    //note new text and current session user as for entry-------------
    userRecipeNotes.username = sessionuser;
    userRecipeNotes.notes = recipenotes;

    await userRecipeNotes.save();//save updated notes to DB
    return res.redirect("/user");//stay on notes page
}
else{//if notes do not yet exist, prepare notes document

    //encryption of notes is good but not in this method
    //const hashedPW = await bcrypt.hash(password, 10);//hash password with salt of 10 times encryption
    userRecipeNotes = new Recipes({
        username: sessionuser,
        notes: recipenotes
    })

    await userRecipeNotes.save();//save new notes to DB
    res.redirect("/user");//stay on notes page
}

})

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
         chef: "", 
         publicRecipesTitle: "", 
         publicRecipesIngredients: "", 
         publicRecipesPreparation: "",
         //-----------------RECIPE DOC 2--------------------
         //chef: "", 
         documentModalDisplay: "none",
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
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Please fill in all fields.", 
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
         chef: "", 
         publicRecipesTitle: "", 
         publicRecipesIngredients: "", 
         publicRecipesPreparation: "",
         //-----------------RECIPE DOC 2--------------------
         //chef: "", 
         documentModalDisplay: "none",
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
                chef: "", 
                publicRecipesTitle: "", 
                publicRecipesIngredients: "", 
                publicRecipesPreparation: "",
                //-----------------RECIPE DOC 2--------------------
                //chef: "", 
                documentModalDisplay: "none",
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
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Password incorrect. Please try again.", 
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
             chef: "", 
             publicRecipesTitle: "", 
             publicRecipesIngredients: "", 
             publicRecipesPreparation: "",
             //-----------------RECIPE DOC 2--------------------
             //chef: "", 
             documentModalDisplay: "none",
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
            chef: "", 
            publicRecipesTitle: "", 
            publicRecipesIngredients: "", 
            publicRecipesPreparation: "",
            //-----------------RECIPE DOC 2--------------------
            //chef: "", 
            documentModalDisplay: "none",
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
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:"",
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "Username already taken. Please try again.", 
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
         chef: "", 
         publicRecipesTitle: "", 
         publicRecipesIngredients: "", 
         publicRecipesPreparation: "",
         //-----------------RECIPE DOC 2--------------------
         //chef: "", 
         documentModalDisplay: "none",
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
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Password incorrect. Please try again.", 
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
         chef: "", 
         publicRecipesTitle: "", 
         publicRecipesIngredients: "", 
         publicRecipesPreparation: "",
         //-----------------RECIPE DOC 2--------------------
         //chef: "", 
         documentModalDisplay: "none",
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
         chef: "", 
         publicRecipesTitle: "", 
         publicRecipesIngredients: "", 
         publicRecipesPreparation: "",
         //-----------------RECIPE DOC 2--------------------
         //chef: "", 
         documentModalDisplay: "none",
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
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Please fill in all fields.", 
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
         chef: "", 
         publicRecipesTitle: "", 
         publicRecipesIngredients: "", 
         publicRecipesPreparation: "",
         //-----------------RECIPE DOC 2--------------------
         //chef: "", 
         documentModalDisplay: "none",
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
         //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
         recipesTitle0:"",
         //---------------MESSAGE PROMPT BOX-----------------
         messageModalDisplay: "block",      
         messageTitle:"Error...", 
         messageContents: "Email invalid. Please try again.", 
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
                chef: "", 
                publicRecipesTitle: "", 
                publicRecipesIngredients: "", 
                publicRecipesPreparation: "",
                //-----------------RECIPE DOC 2--------------------
                //chef: "", 
                documentModalDisplay: "none",
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
                //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
                recipesTitle0:"",
                //---------------MESSAGE PROMPT BOX-----------------
                messageModalDisplay: "block",      
                messageTitle:"Error...", 
                messageContents: "Password incorrect. Please try again.", 
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
             chef: "", 
             publicRecipesTitle: "", 
             publicRecipesIngredients: "", 
             publicRecipesPreparation: "",
             //-----------------RECIPE DOC 2--------------------
             //chef: "", 
             documentModalDisplay: "none",
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
            chef: "", 
            publicRecipesTitle: "", 
            publicRecipesIngredients: "", 
            publicRecipesPreparation: "",
            //-----------------RECIPE DOC 2--------------------
            //chef: "", 
            documentModalDisplay: "none",
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
            //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
            recipesTitle0:"",
            //---------------MESSAGE PROMPT BOX-----------------
            messageModalDisplay: "block",      
            messageTitle:"Error...", 
            messageContents: "Email already taken. Please try again.", 
            userMsgContVarialbeDisplay:"none",
            nameMsgDisplay:"none",
            emailMsgDisplay:"none",
            msgbtn:"returnAccountPromptBox()"});
        }//end of else statement
    }//end of if (newEmail[0] !== undefined")
    //if new email does not exist...
    if(!isMatch){//if the password doesn't match, return user to user page
        console.log("Password does not match for user update");
        console.log("Password does not match for user update");
        return res.render("user.ejs", 
        {
        //-----------------USER INFO-----------------------
        name: sessionuser,
        email: userEmail,
        //----------PUBLIC RECIPES PROMPT BOX---------------
        publicRecipesModalDisplay: "none",
        chef: "", 
        publicRecipesTitle: "", 
        publicRecipesIngredients: "", 
        publicRecipesPreparation: "",
        //-----------------RECIPE DOC 2--------------------
        //chef: "", 
        documentModalDisplay: "none",
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
        //-----DELETE RECIPE CONFIRMATION PROMPT BOX-------
        recipesTitle0:"",
        //---------------MESSAGE PROMPT BOX-----------------
        messageModalDisplay: "block",      
        messageTitle:"Error...", 
        messageContents: "Password incorrect. Please try again.", 
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
             chef: "", 
             publicRecipesTitle: "", 
             publicRecipesIngredients: "", 
             publicRecipesPreparation: "",
             //-----------------RECIPE DOC 2--------------------
             //chef: "", 
             documentModalDisplay: "none",
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
    const username = req.session.username;//name of user for current session
    const oldPW = req.body.oldPassword;//what the user entered to be the current DB passowrd for their acct
    const newPW = req.body.newPassword;//what the user entered for new passoword
    const confirmNewPW = req.body.reEnteredNewPWD;//what the user re-entered for new passoword

    let user = await User.findOne({username: username});//check user collection for username

    const isMatch = await bcrypt.compare(oldPW, user.password);//compares input password with hashed password

    if(!isMatch){//if the password doesn't match, do not submit, stay on user page
        console.log("not matched");
        return res.redirect("/user");
    }
    else if (isMatch){//if the password does match, check for matching re-entered passwords
        if(newPW === confirmNewPW){//if re-entered passwords do match, submit new password to DB
            const hashedPW = await bcrypt.hash(confirmNewPW, 10);//hash password with salt of 10 times encryption
            user.password = hashedPW;
            await user.save();//save updated password to DB 
            return res.redirect("/user");//stay on notes page
        }
        else{
            console.log("not matched");
            return res.redirect("/user");//stay on notes page
        }
    }
    
})

//===============LOGOUT FUNCTION========================================
app.post("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log("Error: " + err);
            res.redirect("/");
        }
    })
    console.log("Logging out");
    res.redirect("/");
})

//==========================LANDING PAGE ROUTE ("/")================================
app.get("/", (req,res) =>{
    //display home page with all modals hidden and message fields cleared
    res.render("home.ejs", 
    {messageTitle:"", 
    display2:"none", 
    messageContents: "", 
    userMsgContVarialbeDisplay:"none",
    nameMsgDisplay:"none",
    emailMsgDisplay:"none",
    display:"none",
    homeMsgFunc: "",
    loginAlt:"none"    
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
     chef: "", 
     publicRecipesTitle: "", 
     publicRecipesIngredients: "", 
     publicRecipesPreparation: "",
     //-----------------RECIPE DOC 2--------------------
     //chef: "", 
     documentModalDisplay: "none",
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
            return res.render("home.ejs");//stay on notes page
        }
        
})

//=========================START SERVER=================================
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});