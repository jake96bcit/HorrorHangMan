//Initial setup form
//If user is in logout, show login form.
window.onload = function()
{	
	//Get change event on Firebase Authenticatation
	firebase.auth().onAuthStateChanged(function(user)
	{
			// If user auth data exixts, ture
			if(user) 
			{		
				//If email verifying is done, true
				if(user.emailVerified)
				{
					document.images["loginPic"].src = "../images/keyrock1.png";	
					document.getElementById("loginPic").style.display="block";	
					document.getElementById("email").style.display="none";
					document.getElementById("password").style.display="none";
					document.getElementById("messageText0").style.display="block";
					document.getElementById("messageText1").style.display="block";
					document.getElementById("repairPassword").style.display="none";
					document.getElementById("login").style.display="none";
					document.getElementById("cancel").style.display="inline-block";
					cancel.textContent = "Back to Home";
					if(user.displayName == null)
					{	
						//If signin is not completed, put "Guest" as user name
						messageText0.textContent = "Welcome, Guest ! ";	
					}
					else
					{
						//If signin is completed, put Username from Authenticatation Database
						messageText0.textContent = "Welcome, "+user.displayName+" ! ";	
					}
					messageText1.textContent = "The screen will back to home on 5 seconds later.";					
				}
				else
				{
					//If email verifying is not done, sugests to continue signin process
					document.images["loginPic"].src = "../images/keyrock0.png";	
					document.getElementById("loginPic").style.display="block";	
					document.getElementById("messageText0").style.display="block";
					document.getElementById("messageText1").style.display="none";
					document.getElementById("repairPassword").style.display="none";
					document.getElementById("email").style.display="none";
					document.getElementById("password").style.display="none";
					document.getElementById("login").style.display="none";
					document.getElementById("cancel").style.display="inline-block";
					messageText0.textContent = "Please activate your account on Valification Email.";	
					messageText1.textContent = "Or, please Sign in another account";	
				}		
			}		
			else
			{		
				//If user account does not exist or state is in logout
				document.images["loginPic"].src = "../images/keyrock0.png";	
				document.getElementById("loginPic").style.display="block";				
				document.getElementById("email").style.display="block";
				document.getElementById("password").style.display="block";
				document.getElementById("messageText0").style.display="none";
				document.getElementById("messageText1").style.display="none";
				document.getElementById("repairPassword").style.display="block";
				document.getElementById("login").style.display="inline-block";
				document.getElementById("cancel").style.display="inline-block";
				messageText0.textContent = "";
				messageText1.textContent = "";											
			}	
	});
}
	
//Set functions for Log in
function login()
{
	//Get email and password from UI
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	
	//Authenticate email and password
	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
	
		//If login process is achieved, move to index page on 5 second later
		setTimeout(function () {jumpToLocate(location.search)},5000);
		
		}).catch(function(error) {
		alert('Failed to Login : ' + error.message);
	});	
}
