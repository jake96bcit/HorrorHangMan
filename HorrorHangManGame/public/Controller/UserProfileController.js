var firstname;
var lastname;
var username;
var photo;
var age;
var gender;
var city;
var country;
var score;
var visibility;
var db;
var uid;
var storageRef;
var loaded = false;
var refreshIntervalId = window.setInterval(loadProfile, 500);
if (typeof firebase != 'undefined') clearInterval(refreshIntervalId);

function loadProfile() {
    db = firebase.database();
    uid = document.cookie;
    storageRef = firebase.storage().ref();
    db.ref('/users/' + uid).once('value').then(function (snapshot) {
        visibility = snapshot.val().visibility;
    });
    if (visibility == "public") {
        $("#show").show();
        $('label').show();
        db.ref('/users/' + uid + '/public_use').once('value').then(function (snapshot) {
            firstname = snapshot.val().firstname;
            lastname = snapshot.val().lastname;
            username = snapshot.val().username;
            photo = snapshot.val().profilepic;
            age = snapshot.val().age;
            gender = snapshot.val().gender;
            city = snapshot.val().citytown;
            country = snapshot.val().country;
            score = snapshot.val().score;
            document.getElementById("firstname").innerHTML = firstname;
            document.getElementById("lastname").innerHTML = lastname;
            document.getElementById("age").innerHTML = age;
            document.getElementById("uname").innerHTML = username;
            document.getElementById("citytown").innerHTML = city;
            document.getElementById("ctry").innerHTML = country;
            document.getElementById("score").innerHTML
        });
        if (!loaded) {
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

        if (photo == "yes") {
            storageRef.child('profilePictures/' + uid + '.jpg').getDownloadURL().then(function (url) {
                var path = url;
                document.getElementById("avatar").src = path;
            }).catch(function (error) { });
        } else if (photo == "no") {
            storageRef.child('profilePictures/anonymous-avatar-sm.jpg').getDownloadURL().then(function (url) {
                var path = url;
                document.getElementById("avatar").src = path;
            }).catch(function (error) { });
        }
    }

    if (visibility == "private") {
        $('#un').show();
        db.ref('/users/' + uid + '/private_use').once('value').then(function (snapshot) {
            username = snapshot.val().username;
            document.getElementById("uname").innerHTML = username;
        });

        storageRef.child('profilePictures/anonymous-avatar-sm.jpg').getDownloadURL().then(function (url) {
            var path = url;
            document.getElementById("avatar").src = path;
        }).catch(function (error) { });
    }

    $("#avatar").show();
}

function compare(key, value) {
    $.each($('form').serializeArray(), function () {
        var id = document.getElementsByName(this.name)[0].id;
        if (id == key) {
            document.getElementById(id + "0").innerHTML = value;
        }
    });
}

function show() {
}