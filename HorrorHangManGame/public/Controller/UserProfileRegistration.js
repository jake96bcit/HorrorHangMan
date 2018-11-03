var photoUploaded;
var file;
var gender;
var username_avb;
var condition1 = false;
var condition2 = false;
var condition3 = false;
$(':input[type="submit"]').prop('disabled', true);
//Validate the inputs
function validate() {
    if (condition1 && condition2 && condition3) $(':input[type="submit"]').prop('disabled', false);
    else $(':input[type="submit"]').prop('disabled', true);
}
$("input[type=text]").attr({
    maxlength: 50
});
//Sorted by class name of names! -or- A-Za-z
$("#fname").keyup(function () {
    if (!(/^[A-Za-z]+$/.test(this.value))) {
        condition1 = false;
        $("#invalid_fname").show();
    }
    else {
        condition1 = true;
        $("#invalid_fname").hide();
    }
    validate();
});
$("#lname").keyup(function () {
    if (!(/^[A-Za-z]+$/.test(this.value))) {
        condition2 = false;
        $("#invalid_lname").show();
    }
    else {
        condition2 = true;
        $("#invalid_lname").hide();
    }
    validate();
});
//Username Regex
$("#username").keyup(function () {
    if (!(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(this.value))) {
        condition3 = false;
        document.getElementById("invalid_username").innerHTML = "Username cannot contain any spaces or special characters.";
        document.getElementById("invalid_username").style.color = "red";
        $("#invalid_username").show();
        $("#symbol").hide();
    }
    else checkIfNew(this.value)
    validate();
});

/*
  Checks if username is available. Returns TRUE if username already exists. False otherwise
*/
function checkIfNew(dusername) {
    var taken;
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref().child("takenusernames/").once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val() == dusername) {
                document.getElementById("invalid_username").innerHTML = "This user name is already taken. ";
                document.getElementById("invalid_username").style.color = "red";
                document.getElementById("symbol").style.color = "red";
                $("#symbol").html('&#10008;');
                $("#symbol").show();
                $("#invalid_username").show();
                username_avb = false;
                condition3 = false;
                taken = true;
            }
            else if (!taken) {
                document.getElementById("invalid_username").innerHTML = "This user name is available. ";
                document.getElementById("invalid_username").style.color = "green";
                document.getElementById("symbol").style.color = "green";
                $("#symbol").html('&#10004;');
                $("#symbol").show();
                $("#invalid_username").show();
                username_avb = true;
                condition3 = true;
                taken = false;
            }
        });
    });
    return username_avb;
}
/*
  Adds user to database. Puts generated/uploaded picture onto storage.
*/
function new_user() {
    var db = firebase.database();
    var un = $("#username").val();
    var isAvailable = checkIfNew(un);
    if (isAvailable) {
        var uid = firebase.auth().currentUser.uid;
        var picture = $("#pic").val();
        var fn = $("#fname").val();
        var ln = $("#lname").val();
        /*Process photo first, then define object below for database*/
        if (!file) //check if user attached personal pic
            photoUploaded = "no";
        else uploadPhoto();
        public_use = {
            firstname: fn
            , lastname: ln
            , username: un
            , profilepic: photoUploaded
        }
        private_use = {
            username: un
        }
        var visibility = 'public'; //default value on profile creation
        var usersRef = db.ref().child('users/' + uid); //data node for public-visibility
        usersRef.set({
            private_use, public_use, visibility
        });
        $("#symbol").hide();
        $("#invalid_username").hide();
        create(un);
        alert("Profile created successfully.");
    }
    else {
        /* RETURN? Sorry, USERNAME USED / Email is USED!*/
        //event.preventDefault();
        alert("Username is not available. Please try again");
    }
    /*PROMISE HERE*/
    /*ERROR-HANDLING*/
}
/*
  Stores photo on cloud storage.
*/
//Get Elements
var fileButton = document.getElementById('pic');
//Listen for file 
fileButton.onchange = function (event) {
    //Get File
    file = fileButton.files[0];
}

function uploadPhoto() {
    var uid = firebase.auth().currentUser.uid;
    //Create a Storage Ref
    var storageRef = firebase.storage().ref('profilePictures/' + uid + '.jpg');
    //Upload file
    var task = storageRef.put(file);
    photoUploaded = "yes";
}
