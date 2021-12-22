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
        res.redirect("/");
        console.log("logged in: " + req.session.isAuth);
    }
}

//require the user model needed-----------
let User = require('./models/user.model');//require the user model needed
let Recipes = require('./models/recipes.model');//require the recipes model needed
const { Store } = require('express-session');

//===================SIGN UP FUNCTION===============================================
app.post("/sign_up", async (req,res) => {
    const username = req.body.newUsername;//username inserted to form
    const password = req.body.newPassword;//password inserted to form

    let user = await User.findOne({username: username});//check user collection for username

    if (user){//if username already exists
        console.log("user already exists.");
        return res.redirect("/");//rediredirect to home page
    }
    else{//if username does not yet exist, prepare new user

        const hashedPW = await bcrypt.hash(password, 10);//hash password with salt of 10 times encryption
        user = new User({
            username,
            password: hashedPW
        })

        await user.save();//save new user to DB
        res.redirect('/');//redirect to root page***change to redirect to home/landing page
    }
})
//======================LOGIN FUNCTION========================================
app.post("/login", async (req,res)=>{
    const username = req.body.username;//username inserted to form
    const password = req.body.password;//password inserted to form

    let user = await User.findOne({username: username});//check user collection for username

    //console.log("located user for login: " + user);

    if (!user){//if the user does not exsist, return to the home page
        console.log("not a user");
        return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);//compares input password with hashed password

    if(!isMatch){//if the password doesn't match, return user to home page
        console.log("not matched");
        return res.redirect("/");
    }
    req.session.isAuth = true;
    req.session.username = username;
    res.redirect("/user");
})

//==============================SUBMIT RECIPE NOTES TO DATABASE==============================
app.post("/submit_recipe",async (req,res)=>{

var sessionuser = req.session.username;
var recipenotes = req.body.notes;
console.log(sessionuser);
let userRecipeNotes = await Recipes.findOne({username: sessionuser});//check notes collection for username

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
app.post("/editUsername", async (req,res)=>{//this froze the DB**,did update username in notes collection, include update for sessionuser's name

    var sessionuser = req.session.username;
    var editedUserName = req.body.editedusername;
    var currentPW = req.body.currentPWEditUN;

    console.log(sessionuser);//current username

    let specificUser = await User.find({username: sessionuser});//find current user in database
    let newUsername = await User.find({username: editedUserName});//find, if available, proposed new username in database

    console.log("specific user: " + specificUser);//check which user was located
    
    const isMatch = await bcrypt.compare(currentPW, specificUser[0].password);//compares input password with hashed password

    if(!isMatch){//if the password doesn't match, return user to user page**insert flash error here**
        console.log("Password does not match for user update");
        return res.redirect("/user");
    }

    else{

        console.log("This username already taken in database: " + newUsername);//display attempted username if it was already taken in the users collection

        if (newUsername ==""){//if new entered username does not yet exist in user collection, update username in user and notes collections (because all usernames from notes collections are inherited from users collection)
            console.log("new username not yet used in user database");
            //take the current username from users and notes collections and update it to the new entered username-------------
            
            let specificUserNotes = await Recipes.findOneAndUpdate({username: sessionuser}, { username: editedUserName });//update username in notes collection
            let specificUserUpdate = await User.findOneAndUpdate({username: sessionuser}, { username: editedUserName });//update username in users collection

            req.session.username = editedUserName;
            //reload session to contain new username
            req.session.reload(function(err) {
                console.log(err);
              })

        }

        return res.redirect('/user');//stay on user page
    }

});
    
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

// app.get("/", (req,res) =>{
//     //res.send("Hello from Root");
//     res.redirect("/");
// })

//=====================WHAT TO DO WHEN '/USER' ROUTE IDENTIFIED====================
app.get("/user", isAuth,  async (req,res)=>{

var sessionuser = req.session.username;//session user's name

    console.log(sessionuser);
let recipeNotes = await Recipes.findOne({username: sessionuser});//check user collection for username

if (recipeNotes){//if notes already exist for user, load to page
        console.log("notes already exist: " + recipeNotes.notes);
        console.log("session username: " + sessionuser);
        //call back notes submitted to database-------------
        res.render("user.ejs", {notes: recipeNotes.notes, name: sessionuser});//, photo: photovariable

    }
else{//if notes do not yet exist for user, render empty notes document
        res.render("user.ejs", {notes: "", name: sessionuser});//, photo: photovariable
    }
    
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
            return res.redirect("/");//stay on notes page
        }
        
})

//=========================START SERVER=================================
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});