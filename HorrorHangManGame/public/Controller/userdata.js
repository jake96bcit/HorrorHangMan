/*

TEST.
1. Avatar and photo storage.	
    1.1. Verify placement of return variables in storePhoto and checkIfNew, minding recursion and call back functions nested inside... 
2. Test username validation.

TO-DO.
Make another method to view data...


5. update_user_data() needs to interact with authentication table too, since it deals email, password...

*/

var config = {
    apiKey: "AIzaSyD_knM3N3H4PX0VuZd3a4PyLlzdT71MoJE",
    authDomain: "justforfun-6975e.firebaseapp.com",
    databaseURL: "https://justforfun-6975e.firebaseio.com",
    projectId: "justforfun-6975e",
    storageBucket: "justforfun-6975e.appspot.com",
    messagingSenderId: "616271711232"
};
firebase.initializeApp(config);

function read() {
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    });
}

/*
    Checks if username is available. Returns TRUE if username already exists. False otherwise
*/
function checkIfNew(dusername) {
	var username_avb;
    firebase.database().ref().child("users")
            .orderByChild("username").equalTo(dusername).on('value', function(snapshot) {
        if (snapshot.exists()) {
            $("#exists").show(); 
			username_avb = false;
        } else {
            $("#exists").hide();
			username_avb = true;
          }
    });
	return username_avb;
}

/*
    Stores photo on cloud storage. New users will have previous_pic == null.
    Else, this overwrites the previous picture with the new one.
        Doing so, this call itself recurisively.
    Returns full_path of picture.
	
	Params. 
		UID. uid of user in current session.
		file. file uploaded.
		previous_pic. filename of previously uploaded picture.
*/
function storePhoto(uid, picture, previous_pic) {
    if(previous_pic == null) { //for first-time/new users
        //var user = firebase.auth().currentUser; 
        var path;
        var profile_pic;
        // Get a reference to the storage service, which is used to create references in your storage bucket
        // then... Create a storage reference from our storage service
        var storageRef = firebase.storage().ref();
        var profPicRef = storageRef.child('users/' + uid );
        var uidprofPicRef = profPicRef.child(uid);
        var filename = uidprofPicRef.name; //should be same as file.name?

        var uploadTask = uidprofPicRef.put(picture); //Adding metadata as second-parameter optional.
    
        //shortcut upload
        /*profPicRef.put(file).then(function(snapshot) {
            console.log('File uploaded!');
        });*/
    
        //Long-cut upload with catches.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        }, function(error) {
        // https://firebase.google.com/docs/storage/web/handle-errors
			switch (error.code) {
				case 'storage/unauthorized':
				// User doesn't have permission to access the object
				break;
		
				case 'storage/canceled':
				// User canceled the upload
				break;
		
				case 'storage/unknown':
				// Unknown error occurred, inspect error.serverResponse
				break;
				}
        }, function() {

				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					var filename = uidprofPicRef.name; //! PELIGROSO check WHICH PATH to refer. MUST BE FILENAME only!
					path = { url : downloadURL,
							 nameFile : filename}; 
					console.log('File available at', downloadURL);
					});
				});
    } else { //there is previous reference then delete it and recurisively call function...

        // Create a reference to the existing pic for removal
        var desertRef = storageRef.child('users/'+ uid + '/' + previous_path.nameFile); 

        // Delete the file
        desertRef.delete().then(function() {
            // File deleted successfully
        }).catch(function(error) {
            // Uh-oh, an error occurred!
        });
        path = storePhoto(uid, pic, null);
    }
    //if success. you'll get the spaceRef.fullPath, CHECK if downloadURL == spaceRef.fullPath
    //path = spaceRef.fullPath;
    return path;
}

/*
    In the event a new user cannot supply userprofile picture, an name-initial avatar
    is created. Returns file?*/
function generateAvatar(firstNameLetter, firstSurnameLetter) {

    //MORE INFORMATION HERE https://ui-avatars.com/
    var avatar_pic;
    var _BGcolor = Math.random().toString(16).slice(2, 8);
    var _FONTcolor = Math.random().toString(16).slice(2, 8);

    $.get({
        url: "https://ui-avatars.com/api?",
        headers: {'size' : 128,
                 'name' : firstNameLetter "+" firstSurnameLetter,
                 'background' : _BGcolor,
                 'color' : _FONTcolor
                 },
        success: function(avatar_generated) {
		avatar_pic = avatar_generated;
        }
    });
	return avatar_pic;
}

/*
	Adds user to database. Puts generated/uploaded picture onto storage.
*/
function new_user(event) {
    var db = firebase.database().ref();
	var user = $("#user").val();
    var isAvailable = checkIfNew(user); 
    if (isAvailable) {
		
		var uid = firebase.auth().currentUser.uid;
        var picture = $("#pic").val();
        var fn = $("#fname").val();
        var ln = $("#lname").val();
		var email = $("#emailAd").val();
		var sex = $("input[name='_Gender']:checked").val();
		
		/*Process photo first, then define object below for database*/
        if (!picture) { //check if user attached personal pic
            picture = generateAvatar(fn.substring(0,1), ln.substring(0,1));  
        }
		
        var photoURL = storePhoto(uid, picture, null); //userID, picture file..., null since new user no pic yet before.
        public_use = {
            firstname : fn,
            lastname : ln,
			email_address : email,
            username : user,
            gender : sex,
            phothPATH : photoURL,
            citytown : $("#towncity").val(),
            country : $("#country").val()
        }
		
		private_use = {
			firstname : fn,
			lastname : ln,
			username : user,
			photoPATH : photoURL,
			citytown : $("#towncity").val(),
            country : $("#country").val()
		}
		
		var visibility = 'public'; //default value on profile creation
        var usersRef = db.ref().child('users/' + uid); //data node for public-visibility
		usersRef.set({
			private_use,
			public_use,
			visibility
		});
		
        var geoRef = db.ref().child('market/' + $("#country").val() + '/' + uid); //Geomaps the user	
		geoRef.set(allPublic);
		
    } else {
        /* RETURN? Sorry, USERNAME USED / Email is USED!*/
		event.preventDefault();
		alert("Username is not available. Please try again");
    }
	/*PROMISE HERE*/
    /*ERROR-HANDLING*/
}

/*
	Gets user data on profile. Calls authentication interface if changing email and/or password 
*/
function edit_user_data() {
    var db = firebase.database().ref();
    var auth = firebase.auth();
    var user = auth.currentUser;

    var first, last, email, username, pw, picPATH, citytown, country;
    var uid = auth.currentUser.uid;

    if (user != null) {
        email = user.email;
        pw = user.password; //CHECK IF RETRIEVABLE
    }

    var userinfoRef = firebase.database().ref('users/' + uid + '/public');
    userinfoRef.on('value', function(snapshot) {
      //updateStarCount(postElement, snapshot.val());
		//PARSE JSON
		    $("#fname").val(first);
			$("#lname").val(last);
			$("#photoDiv").val(photoPATH);
			$("#cityTown").val(citytown);
			$("#country").val(country);
    });
	/*add promise to collect authentication data and bind those to textboxes*/
}