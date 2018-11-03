
//Responsive by size of Window.
//If window width is less than 769px include mobile screen, user picture on header will be hidden.
var timer = 0; 
window.onresize = function () {
  if (timer > 0) {
    clearTimeout(timer);
  }
 
  timer = setTimeout(function () {
	firebase.auth().onAuthStateChanged(function(user)
	{
		if(user.displayName != null)
		{
			//Compare current window size
			if(window.innerWidth < 769)
			{
				//Hide user picutre
				document.getElementById("accountMenu").style.display="none";
			}
			else
			{
				//Appier user picture
				document.getElementById("accountMenu").style.display="inline-block";
			}	
		}
	});	
  }, 0); //Set 0 timw as waiting responce timw
}

//Load this part when web page include this script file
window.onload = function()
{	
	//Get change event on Firebase Authenticatation
	firebase.auth().onAuthStateChanged(function(user)
	{
		// If user auth data exixts, ture
		if(user) 
		{		
			//If email verifying is done:
			if(user.emailVerified)
			{
				//If user.displayName is null(means not registered yet)
				if(user.displayName == null)
				{
					document.getElementById("login").style.display="none";
					document.getElementById("signup").style.display="inline-block";
					document.getElementById("logout").style.display="inline-block";
					document.getElementById("accountMenu").style.display="none";
					messageText0.textContent = "Please continue \"Sign Up\" ";
					messageText1.textContent = "or";	
          messageText2.textContent = "Please sign in or complete registration process to start playing!";	
					$("#users").hide(); //Hide link to User list
          document.getElementById("search").disabled = true; 					
				}
				else //If user.displayName is not null(means registered already)
				{
					document.getElementById("login").style.display="none";
					document.getElementById("logout").style.display="inline-block";
					document.getElementById("signup").style.display="none";
					document.getElementById("accountMenu").style.display="inline-block";
					messageText0.textContent = "Welcome, "+user.displayName+" ! ";
          messageText2.textContent = "Thank you for signing up now let start playing!";
          document.getElementById("search").disabled = false;
					$("#users").show(); //show link to User list 	
					
					if(user.photoURL == null)
					{
						document.images["accountImage"].src = "../images/sampleHumanIcon.jpg";
					}
					else
					{
						document.images["accountImage"].src = user.photoURL;
					}
				}
			}
			else //If email verrifying is not done:
			{
				document.getElementById("accountMenu").style.display="none";
				document.getElementById("login").style.display="inline-block";
				document.getElementById("signup").style.display="inline-block";
				messageText.textContent = "";	
        messageText2.textContent = "Please complete the confirmation of your registration email to start playing!";
        $("#users").hide(); //Hide link to User list
        document.getElementById("search").disabled = true; 
			}		
		}		
		else //If user auth data does not exists and logout:
		{				
			document.getElementById("accountMenu").style.display="none";
			document.getElementById("login").style.display="inline-block";
			document.getElementById("logout").style.display="none";
			messageText0.textContent = "or";	
			messageText1.textContent = "";	
      messageText2.textContent = "Please sign in or complete registration process to start playing!";
			document.getElementById("signup").style.display="inline-block";
			$("#users").hide();	
      $("#users").hide(); //Hide link to User list
      document.getElementById("search").disabled = true; 
		}	
	});		
}

//User Login function
function loginFunction(locate)
{			
	firebase.auth().onAuthStateChanged(function(user)
	{
		//If User exist, ture
		if(user) 
		{							
		}		
		else
		{	//Jump to login.html with location parameter 
			//which for returning to previous page after login process.		
			location.href = "/login.html?"+locate ;	
		}	
	});						
}

//Logout function. If logout is executed, move to index page .
function logoutFunction()
{
	if(window.confirm('Do you want to log out?')){

		firebase.auth().onAuthStateChanged(function(user) {
			if(user) {	
				firebase.auth().signOut().then(function() {
					//move to index page
					location.href = "/index.html" ;
				}).catch(function(error) {
					alert('Failed to Logout : ' + error.message);
				});
			}
		});
	}
}

//Move to signup page
function signupFunction()
{			
	location.href = "../../View/auth.html" ;						
}