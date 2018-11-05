//Sending reset password function.
//Get Email from form, if the email is valkid, send Reset email to the address.
function repair()
{
	var auth = firebase.auth();
	var emailAddress = document.getElementById('email').value;
	
	auth.sendPasswordResetEmail(emailAddress).then(function() {
		// Email sent.
		alert("Password Reset Email had been sent");
		document.getElementById("email").style.display="none";
		document.getElementById("executeRepair").style.display="none";
		close.textContent = "Back to Home"
		
	}).catch(function(error) {
		// An error happened.
		alert("Error sending Password Reset Email : "+error.message);
	});

}