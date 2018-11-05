var firstname;
var lastname;
var username;
var photo;
var city;
var country;
var gender;
var age;
var score;
var db;
var uid;
var storageRef;
var loaded = false;
var refreshIntervalId = window.setInterval(loadProfile, 500);
if (typeof firebase != 'undefined') clearInterval(refreshIntervalId);

function loadProfile() {
    db = firebase.database();
    uid = firebase.auth().currentUser.uid;
    storageRef = firebase.storage().ref();
    db.ref('/users/' + uid).once('value').then(function (snapshot) {
        visibility = snapshot.val().visibility;
        if (visibility == "private") $("#toggle").prop('checked', true);
        else $("#toggle").prop('checked', false);
    });
    db.ref('/users/' + uid + '/public_use').once('value').then(function (snapshot) {
        firstname = snapshot.val().firstname;
        lastname = snapshot.val().lastname;
        username = snapshot.val().username;
        photo = snapshot.val().profilepic;
        city = snapshot.val().citytown;
        country = snapshot.val().country;
        gender = snapshot.val().gender;
        age = snapshot.val().age;
        score = snapshot.val().score;
        document.getElementById("firstname").innerHTML = firstname;
        document.getElementById("lastname").innerHTML = lastname;
        document.getElementById("uname").innerHTML = username;
        document.getElementById("citytown").innerHTML = city;
        document.getElementById("ctry").innerHTML = country;
        document.getElementById("a").innerHTML = age;
        document.getElementById("score").innerHTML = score;
        if (photo == "yes") {
            storageRef.child('profilePictures/' + uid + '.jpg').getDownloadURL().then(function (url) {
                var path = url;
                upload(path);
                document.getElementById("avatar").src = path;
            }).catch(function (error) { });
        }
        else {
            storageRef.child('profilePictures/anonymous-avatar-sm.jpg').getDownloadURL().then(function (url) {
                var path = url;
                document.getElementById("avatar").src = path;
            }).catch(function (error) { });
        }
        $("#avatar").show();
    });
    if (typeof uid != 'undefined' && !loaded) {
        if (gender == "male") {
            displayAll(men);
            loaded = true;
        }
        else if (gender == "female") {
            displayAll(women);
            loaded = true;
        }
    }
    db.ref('/users/' + uid + '/public_use/measurements').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            compare(childSnapshot.key, childSnapshot.val());
        });
    });
}

function edit() {
    document.getElementById("fname").value = firstname;
    document.getElementById("lname").value = lastname;
    document.getElementById("username").value = username;
    document.getElementById("towncity").value = city;
    document.getElementById("country").value = country;
    document.getElementById("age").value = age;
    $.each($('form').serializeArray(), function () {
        var id = document.getElementsByName(this.name)[0].id;
        document.getElementById(id).value = document.getElementById(id + "0").innerHTML;
        $("#" + id + "0").hide();
        $("#" + id).show();
    });
    $("#edit").hide();
    $("#show").hide();
    $("#save").show();
    $("#fname").show();
    $("#firstname").hide();
    $("#lname").show();
    $("#lastname").hide();
    $("#username").show();
    $("#uname").hide();
    $("#towncity").show();
    $("#citytown").hide();
    $("#country").show();
    $("#ctry").hide();
    $("#age").show();
    $("#a").hide();
    $("#change").show();
    $("#remove").show();
    $("#privacy").show();
    $("#delete").show();
}

function save() {
    db.ref('users/' + uid + '/public_use').update({
        firstname: $("#fname").val()
    });
    db.ref('users/' + uid + '/public_use').update({
        lastname: $("#lname").val()
    });
    db.ref('users/' + uid + '/public_use').update({
        citytown: $("#towncity").val()
    });
    db.ref('users/' + uid + '/public_use').update({
        country: $("#country").val()
    });
    db.ref('users/' + uid + '/public_use').update({
        age: $("#age").val()
    });
    db.ref('users/' + uid + '/private_use').update({
        username: $("#username").val()
    });
    db.ref('users/' + uid + '/public_use').update({
        username: $("#username").val()
    });
    db.ref('takenusernames/' + uid).set($("#username").val());
    db.ref('/users/' + uid + '/public_use/measurements').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            db.ref('/users/' + uid + '/public_use/measurements/' + childSnapshot.key).set($("#" + childSnapshot.key).val());
        });
    });
    $.each($('form').serializeArray(), function () {
        var id = document.getElementsByName(this.name)[0].id;
        $("#" + id + "0").show();
        $("#" + id).hide();
    });
    //Update display name
    update($("#username").val());
    $("#edit").show();
    $("#show").show();
    $("#save").hide();
    $("#fname").hide();
    $("#firstname").show();
    $("#lname").hide();
    $("#lastname").show();
    $("#username").hide();
    $("#uname").show();
    $("#symbol").hide();
    $("#invalid_username").hide();
    $("#towncity").hide();
    $("#citytown").show();
    $("#country").hide();
    $("#ctry").show();
    $("#age").hide();
    $("#a").show();
    $("#change").hide();
    $("#remove").hide();
    $("#pic").hide();
    $("#privacy").hide();
    $("#delete").hide();
    //refresh the page
    //location.reload();
}

function show() {
    if (document.getElementById("measurement").style.display == "none") {
        $("#measurement").show();
        document.getElementById("show").innerHTML = "Hide Measures";
    }
    else {
        $("#measurement").hide();
        document.getElementById("show").innerHTML = "Show Measures";
    }
}

function deleteAccount() {
    var sure = confirm("Are you sure you want to delete your account?");
    if (sure) {
        firebase.auth().currentUser.delete().then(function () {
            //console.log('delete successful?');
            //console.log(app.auth().currentUser);
            db.ref('/users/' + uid).remove();
            db.ref('takenusernames/' + uid).remove();
            window.location.href = 'index.html';
            alert("Profile deleted successfully.");
        }).catch(function (error) {
            console.error({
                error
            });
            alert("Please sign out and sign in again to delete your profile.");
        })
    }
}

function removeAvatar() {
    db.ref('users/' + uid + '/public_use').update({
        profilepic: "no"
    });
    upload(null);
    // Create a reference to the file to delete
    var desertRef = storageRef.child('profilePictures/' + uid + '.jpg');
    // Delete the file
    desertRef.delete().then(function () {
        // File deleted successfully
    }).catch(function (error) {
        // Uh-oh, an error occurred!
    });
}

function setPrivacy() {
    var privatemode = document.getElementById("toggle").checked;
    if (privatemode) db.ref('users/' + uid).update({
        visibility: "private"
    });
    else db.ref('users/' + uid).update({
        visibility: "public"
    });
}

function set(key, value) {
    $.each($('form').serializeArray(), function () {
        var id = document.getElementsByName(this.name)[0].id;
        if (id == key) {
            db.ref('/users/' + uid + '/public_use/measurements' + id).set(value);
        }
    });
}

function compare(key, value) {
    $.each($('form').serializeArray(), function () {
        var id = document.getElementsByName(this.name)[0].id;
        if (id == key) {
            document.getElementById(id + "0").innerHTML = value;
        }
    });
}

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
        document.getElementById("invalid_username").innerHTML = "Username can only contain alphabetic, numeric and -,_ characters. ";
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
    db.ref().child("takenusernames/").once('value', function (snapshot) {
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
//Get Elements
var fileButton = document.getElementById('pic');
//Listen for file
fileButton.onchange = function (event) {
    //Get File
    var file = fileButton.files[0];
    uploadPhoto(file);
}

function uploadPhoto(file) {
    var uid = firebase.auth().currentUser.uid;
    //Create a Storage Ref
    var storageRef = firebase.storage().ref('profilePictures/' + uid + '.jpg');
    //Upload file
    var task = storageRef.put(file);
    db.ref('users/' + uid + '/public_use').update({
        profilepic: "yes"
    });
}