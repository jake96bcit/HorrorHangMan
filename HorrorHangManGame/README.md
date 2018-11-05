# ColorSizeMe
This program is for converting the size of clothes on local to another local one.
The size of clothes are different with Residential area like US, UK, Agian and also.
The purpose of the program is converting and showing which another residential size is abiliable for the program user.

# Technical Description
## Conversion ##
Input measurements with parameters accept 'cm' or 'inches.' Measurements in 'cm' are converted into inches by default.
## Database ##
Project utilizes Firebase realtime database to store user profile, measurement, and clothing item information. Firebase is utilized to host profile pictures. User can only host one profile picture at a time.
## Login / Logout ##
Functionality is fully functional. Search feature can be done when signed in.
## Registration ##
Users must both and subsequently register after email verification to utilize the app. Users can delete their account, effectively deleting their information except transactional records (if any).

# Installation Firebase #
  - Access on cmd / Terminal. 
  - Address is root of project folder.
  - Need to install [npm](https://www.npmjs.com/) before start this process.
   ## Open project ##
   ### Installing FireBase ###  
    npm install -g firebase-tools
   ###  Login to FireBase ###
    firebase login
   ###  Identify the project ### 
    firebase init
  ## Test project ##
  ###  Run on localhost ###
    firebase serve
  ###  Deploy to online host ###
    firebase deploy
  ###  Open hosted web page ###
    firebase open hosting:site
