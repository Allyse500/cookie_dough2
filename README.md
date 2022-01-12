# COOKIE DOUGH 2
## Introduction
This is my third application using EJS specifically. It also includes MongoDB and Node.js. I have prepared it so its contents and functions will adjust to media size. If I were to work to improve this further, possibly for publishing, some things I would do are prepare a stronger login system, enable password reset for forgotten passwords and find a stronger mean to determine what was submitted as a recipe (which may, to an extent, require a live staff).
## Installation
*For all downloads, get the latest version relative to your computer type as applicable
1. Prepare a GitHub Account: github.com
2. Install Git Bash: https://git-scm.com/downloads
    1. When you come to a prompt labeled 'Choosing the default editor by Git' (or something similar if it has changed), please choose VS Code as your default editor.
    2. When you come to a prompt that is titled 'Configuring the line ending conversions' and it lists check-out options, choose to check-out as is.
    3. When you come to the prompt that is labeled 'Configuring the terminal emulator to use with Git Bash', choose Windows for the default console.
    4. Anything else not specifically stated in these steps for installing Git Bash can be submitted in their default mode.
3. Register Git Bash with your GitHub Account(SSH Key): https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
4. Install VS Code: https://code.visualstudio.com/download
    When you come to a prompt that is labeled 'Select Additional Tasks', you should choose at least the four options below.
    1. Add "Open with Code" action to Windows Explorer file context menu
    2. Add "Open with Code" action to Windows Explorer directory context menu
    3. Register Code as an editor for supported file types
    4. Add to PATH(available after start)
5. Install this extensions: Main VS Code, HTML Extension: https://marketplace.visualstudio.com/items?itemName=techer.open-in-browser   
6. Download the code from this app:
    1. On GitHub, select the name of this repository (cookie_dough2)
    2. Click the green 'code' button and copy the link provided by selecting the clipboard on the right
    3. Open your Git Bash terminal, type 'git clone ', right click on your mouse or computer touchpad and select 'paste' to paste the code into your C drive.
    4. Hit 'enter' to clone the code
    5. Once the command has finished, type 'cd cookie_dough2' and hit 'enter' to change into the cookie_dough2 directory.
    6. Type 'code .' to open the code you've cloned into your local VS Code application
    7. Open a terminal in VS Code
    8. In the terminal, type 'npm install' to install all packages needed for this app
7. Make a directory for your project in Git Hub
8. Follow the prompts from Git Hub to add your existing project to your Git Hub page
9. Prepare an account with MongoDB: https://www.mongodb.com/
10. Prepare a database in MongoDB for this app: https://www.mongodb.com/basics/create-database
In this step, you may submit your IP address or you can submit the public IP address to make it accessible by any computer the project file is located in (0.0.0.0)
11. Follow the prompts listed in the link from step 10 to obtain and copy your database's connection link. In this step, when you get to the prompt titled "Connect to Cluster0", select the second option that says 'Connect to cluster' to get the url connection for your database
12. Make a .env file in VS Code by selecting 'File', 'New File', type in the name '.env' then hit 'enter'.
13. In the .env file, make a variable name for the MongoDB connection url and set it equal to the connection link you'd copied from MongoDB. Replace the 'password' note in the Mongo connection string with the password you enterd when making the database.
14. Use the same steps when making the .env file to prepare a file named '.gitignore'
15. In the .gitignore file, type node_modules, hit 'enter'; type '.env' and save teh document (this will hide your password as you push the change of your applicatoin to GitHub later)
16. If you used a different title for the MongoDB url link, exchange that name with 'ATLAS_URI' on the line 'const uri = process.env.ATLAS_URI;'
17. Edit code as desired in VS Code application.
    1. To display the changes and run the program to actively take user input:
        1. Open a terminal in VS Code (or use Git Bash terminal)
        2. Type 'node server.js' and hit 'enter'. If this was successful to turn on the server, you should see a note in the terminal say 'Server is running on port: 5000' and 'MongoDB database connection established successfully'.
        3. Open your browser, type 'localhost:5000' in the url and hit 'enter'. 
    3. To display an HTML template, left click in the html document and select 'Open in Default Browser'
    4. Unless you also install 'nodemon' (npm install nodemon), you will need to restart your server to view any updates you make to the project
    5. To restart the server press the 'ctrl' and 'c' keyboard keys from the terminal line in either the VS Code or Git Bash terminal.
18. Commit changes to your project:
    1. Save changes on all files
    2. In the Git Bash terminal:
        1. Type 'git add -A' and hit 'enter'
        2. Type 'git commit -m'; in single or double quotation marks, enter a note to summarize the update(s) you've made to the files, then hit 'enter'
        3. Type 'git push -u origin BRANCHNAME', substituting 'BRANCHNAME'  for the name of your branch, then hit 'enter' 
19. Deploy using Heroku: https://devcenter.heroku.com/articles/deploying-nodejs
    1. Prepare Heroku account
    2. Make a Heroku remote link in Git Bash
    3. Push to Heroku
    4. Submit the MongoDB connection name you used and its connection string value from the .env file as a 'Config Vars' listing on the Settings page of your Heroku app

## Usage
https://floating-basin-71739.herokuapp.com/
#### General
Users of this app can save their own recipes, share their recipes with the public or search for recipes others have posted. This is not restricted to cookie recipes. Users are welcome to use this app to prepare or search for whichever recipe type they'd like.
#### Search Bar
Submit either the chef name or full recipe title to locate the recipe(s) you'd like to find. If one chef has several recipes posted to the public, they would all be listed with the chef's name. Likewise, if several chefs have the same recipe title, those would all be listed with the chef name. To view an example of this, you can enter the username "Kim" or "Sugar Cookies" into the search bar. I've prepared these for the demonstration.

To pull up the recipe document you'd like to view, select the title from the Public Recipes prompt box. A scroll bar will appear within the document if the amount of text is larger than the main document size. To close the document, you'd need to click the 'Close' button to the upper right of the document.
#### Home Page
###### Sign Up
To sign up, submit the requested data into all fields and click 'Submit'. If any fields are empty, the first and second password entries don't match, the username or email is not available or the username or email is invalid, you will recieve an error promt noting this. The entry will not save until it is properly submitted. If you'd like to cancel sign up, click the 'Close' button on the Sign Up prompt box. If your entries are submitted successfully, you will recieve a success message noting you may then login to access your user page.

Note: The password in this application is hashed to enable privacy upon database storage.
###### Log In
To log in, enter either your email or username and password to the fields indicated on the login form and click 'Submit'. If either your email/username or password entry was incorrect, you will receive a prompt noting this. Upon successful login, you will be redirected to your user page on which you can make, view and edit your own recipes as well as update your account information.
#### User Page
###### My Recipes Button
This button will open a prompt box to display all the recipes you've saved. If you don't have any recipes on your account, it will display as zero.

To make a new recipe, click the 'New' button toward the bottom of the prompt box to open the 'New Recipe' form. The only field required to be filled on this form is the title. This is to enable the pensive chef time to submit the details on the recipe desired. To submit that recipe as a public recipe, you would need to select the 'public' checkbox at the bottom of the form. If the recipe name already exists as a recipe for that user or if the title field is empty, an error prompt will display noting this. The new recipe will not be stored to the user account or public database until a proper title was given to the entry. Upon successful submission of the recipe, a prompt box will display noting this. If you would like to instead cancel the request to make a new recipe, you could either select the back arrow button at the top of the form to go back to the 'My Recipes' prompt box or click the 'Cancel' button to close the form.

To edit/read a personal recipe from the My Recipes prompt box, you would need to click on the title you'd like to view from the list of recipes to open the 'Recipe' form. Like for the 'New Recipe' prompt box, only the title is required to submit the recipe update, it can be made public by selecting the 'public' checkbox and you can cancel any update to the recipe by either selecting the left arrow back button or 'Close' button. If a recipe had previously been posted to the public, the 'public' checkbox will be highlighted upon load of the 'Recipe' form. To remove it from the public log, you would need to de-select the 'public' checkbox and click the 'Save' button at the bottom of the form.
###### Account Button
If you would like to update your account (edit username, password or email), you would need to first click the account button in the navbar on the user's page then select the 'Edit' button next to the account information you would like to edit. When done submitting the updated information, select 'Save'. To delete your account, you would need to first select the 'Delete Account' checkbox, enter in your password to confirm the request then select the 'Delete' button. To update account info, all requested fields must be entered. If a field is left empty, the requested username/email is currently being used by another user, the original password entered is incorrect or if the passwords for new password confirmation don't match, an error message will display noting this. A success message will display upon successful submission for any account update. The accont informatin requested to be updated will not be updated until all needed update criteria are met. Upon successful submission to delete your account, all your recipes and user info will be removed from the Cookie Dough website.
#### Functions for Smaller Screen Size
When the screen reaches 1270px, the three buttons listed on the far right of the home or user page are hidden and alternative buttons are displayed from a drop down button grouped with the display of the search bar. Aside from the physical look, the function of each button is the same as the former buttons they are titled after (About, Sign Up, Log In, Account, My Recipes, and Log Out).
## Credits
I've searched many different pages for trouble shooting. Below are the main sources I used to get started for what I did not know.

From previous projects, I initially used this video to help me get a better understanding for MongoDB and Express:
https://www.youtube.com/watch?v=7CqJlxBYj-M&t=5752s

From previous projects, I initially learned how to connect the application to Heroku using this video:
https://www.youtube.com/watch?v=5PaUiPyBDJY&t=484s

I used these three videos to find how to prepare a login, prepare session variables and insert user-specific info to pages using EJS respectively:
https://www.youtube.com/watch?v=TDe7DRYK8vU&t=453s
https://www.youtube.com/watch?v=oYGhoHW7zqI&t=133s
https://www.youtube.com/watch?v=-RCnNyD0L-s&t=1799s

I used w3schools to find how to prepare a color picker, make a file upload prompt, make a drop down button and to make a time display.
## License
I do not approve of anyone taking the entirety of this code verbatum with its theme to prepare a public website. I do think it is fine, however, for other developers to use this code as a template to learn how to prepare similar apps (including for publishing).