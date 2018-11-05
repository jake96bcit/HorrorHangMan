window.onload = function()
{

}

function create(data)
{
	firebase.auth().onAuthStateChanged(function(user)
	{
		if(user)
		{
			user.updateProfile({
			  displayName: data,
			}).then(function() {
			  // Update successful.
			  location.href = "../index.html" ;	
			}).catch(function(error) {
			  alert("An error occured. Please try again later.");
			});
		}
		else
		{
			alert("You need to login before register your info.");
		}
	});	
}

function update(name)
{
	//alert($(data).val());
	
	firebase.auth().onAuthStateChanged(function(user)
	{
		if(user)
		{
			user.updateProfile({
			  displayName: name,
			  //photoURL: "https://example.com/jane-q-user/profile.jpg"
			}).then(function() {
			  // Update successful.

			}).catch(function(error) {
			  //alert("Mistook to push displayName");
			});
		}
		else
		{
			alert("You need to login before register your info.");
		}
	});	
}

function upload(photo)
{
	//alert($(data).val());
	
	firebase.auth().onAuthStateChanged(function(user)
	{
		if(user)
		{
			user.updateProfile({
			  photoURL: photo,
			}).then(function() {
			  // Update successful.
			}).catch(function(error) {
			  // An error happened.
			});
		}
		else
		{
			alert("You need to login before register your info.");
		}
	});	
}