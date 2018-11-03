//Initial setup form
//If user is in logout, show Authenticatation for new user.
window.onload = function()
{	
	//Get change event on Firebase Authenticatation
	firebase.auth().onAuthStateChanged(function(user)
	{			
			if(user) 
			{		
				// If user auth data exixts
				if(user.emailVerified)
				{	//If email verifying is done
					document.getElementById("authTitle").style.display="block";
					document.getElementById("email").style.display="none";
					document.getElementById("password").style.display="none";
					document.getElementById("passwordConf").style.display="none";
					document.getElementById("messageText").style.display="inline";
					document.getElementById("valify").style.display="none";
					document.getElementById("reload").style.display="none";
					document.getElementById("regist").style.display="block";
					document.getElementById("cancel").style.display="block";
					authTitle.textContent = "Welcome, "+user.email+" ! ";	
				}
				else
				{
					//If email verifying is not done:
					document.getElementById("authTitle").style.display="block";
					document.getElementById("messageText").style.display="block";
					document.getElementById("email").style.display="none";
					document.getElementById("password").style.display="none";
					document.getElementById("passwordConf").style.display="none";
					document.getElementById("valify").style.display="none";
					document.getElementById("reload").style.display="block";
					document.getElementById("regist").style.display="none";
					document.getElementById("cancel").style.display="none";
					authTitle.textContent = "Please activate your account from Verification Email";
					messageText.textContent = "Then, please push \"verified\".";	
				}		
			}		
			else
			{	// If user auth data does not exixts, or logout		
				document.getElementById("authTitle").style.display="block";
				document.getElementById("email").style.display="block";
				document.getElementById("password").style.display="block";
				document.getElementById("passwordConf").style.display="block";
				document.getElementById("messageText").style.display="none";
				document.getElementById("valify").style.display="block";
				document.getElementById("reload").style.display="none";
				document.getElementById("regist").style.display="none";
				document.getElementById("cancel").style.display="block";
				messageText.textContent = "Welcome to ColorSizeMe ! ";							
			}	
	});
}

//Compare the typed password and Confirmation password is same.
//If same, return true
function checkSamePassWord(password, passwordConf)
{	
	if(password != "")
	{
		if(password === passwordConf)
		{
			return true;
		}
	}
	return false;
	
}
	
//Set functions for Log in, Sign in, and Log out.
function execute(id)
{
	//Get email and password from UI
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var passwordConf = document.getElementById('passwordConf').value;
	var messageText = document.getElementById('messageText');
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) 
		{
			//execute when pushed Log in button
			if(id == "regist" && user.displayName == null)
			{			
				location.href = "/signup.html";
			}
		  }
		  else 
		  {	//execute when pushed Sign in button
			if(id == "valify")
			{
				if(!checkSamePassWord(password, passwordConf))
				{
					alert("Please check Password and Confirmation Password");
					location.reload(false);
				}
				else
				{
					firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {

						user.sendEmailVerification().then(function() {
							
					}).catch(function(error) {
					  alert(error);
					});
					
				  }, err => {
					alert(err);
				  });
				}
			}
		}
	});
	//execute when pushed Log in button
	if(id == "reload")
	{			
		location.reload(true);
	}
	else if(id == "cancel")//execute when pushed Log in button
	{			
		location.href = "/index.html";
	}
}