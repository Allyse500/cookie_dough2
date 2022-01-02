# COOKIE DOUGH 2
## Introduction
This is my third application using EJS specifically. It also includes MongoDB and Node.js. I prepared this project copying the work I've done in another project to help showcase some of what I had done. Unlike Cookie Dough, I have not yet installed message prompt boxes for this application, recipe list panels, fully enabled the search bar (it will still query for public recipes) or prepared more detailed recipe prompts. However, in this application, I've started to prepare a way for users to choose their own background and change the color of their text. In this application one can still update their account information and save their notes but their recipes would all be listed on one document.
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
Users of this app can currently save their recipe notes, choose their own background or font-color in their user page and update their account information.
#### Home Page
###### Sign Up
To sign up, submit the requested data into all fields and click 'submit'. If you'd like to cancel sign up, click the 'close' button on the Sign Up prompt box.

Note: The password in this application is hashed to enable privacy upon database storage.
###### Log In
To log in, enter your username and password to the fields indicated on the login form. Upon successful login, you will be redirected to your user page in which you can enter your recipe notes as well as update your account information.
#### User Page
###### Options Button

Background:
If you would like to update your background photo or color of your text, you would need to first click the 'Options' button toward the top of the user's page then select the 'Background' option from the 'Options' prompt box to display the 'Background' form. In this form, you would need to choose either the 'Background Photo' to change the background photo or 'Text' option to change the color of the text. Selecting the 'Background Photo' option will display two default photo backgrounds you may choose and one option to upload a photo of your choice. To choose a photo, you would need to select the respective checkbox by your preferred photo. To upload a photo, you need to first select the checkbox next to the upload photo option then select a photo you'd upload. Selecting the 'Text' option will display two text color options. The first, labeled 'Header(Title & Date)', controls the color for the document title and time not. The second, labeled 'Body Text' controls the color for the document's inner text. To select a new color for either of these aspects, select the color box to the right of the 'Header(Title & Date)' or 'Body Text' labels, select the color of your choice from the color picker and click the 'Submit' button. **Note, this application is not yet developed to record any changes of background photo or text color after a user logs out or if the page would refresh. 

Edit Account:
If you would like to update your account (edit username/password or delete account), you would need to first click the 'Optoins' button toward the top of the user's page then select the 'Edit Account' option in the 'Options' prompt box to display the 'Edit Account' form.  In this form, you would need to select the 'Edit' button next to the account information you would like to edit. When done submitting the updated information, select 'Save'. To delete your account, you would need to first select the 'Delete Account' checkbox, enter in your password to confirm the request then select the 'Delete' button. If the requested username is currently being used by another user, the original password entered is incorrect or if the passwords for new password confirmation don't match the accont informatin the update request will not be submitted. Upon successful submission to delete your account, all your recipe notes and user info will be removed from the Cookie Dough 2 website.

Logout:
To log out, you would need to first click the 'Optoins' button toward the top of the user's page then select the 'Logout' button.
###### Save Button
This is the green button listed on the left of the time display. Click this button to save any updates you've made to your recipe note document. 
#### Functions for Smaller Screen Size
When the screen reaches 1270px, the three buttons listed on the far right of the home or user page are hidden and alternative buttons are displayed from a drop down button grouped with the display of the search bar. Aside from the physical look, the function of each button is the same as the former buttons they are titled after (About, Sign Up, Log In).
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