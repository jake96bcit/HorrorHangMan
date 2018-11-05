//The function to jump to any location
//For using this function, need instance variable of page address
function jumpToLocate(param)
{
	param = param.substring(1);
	location.href = param;
}

//The function to jump to index page
function jumpToIndex()
{
	location.href = "/";
}