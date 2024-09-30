// SUSSEX DIRECT

//This script finds every table on the web page and gets the width (in pixels) of the widest table.
//If a table is wider than 980 pixels (the standard container width), the script resizes the #container div to accommodate the large table. 

// NOTE: The script looks for anything with the 'table' tag. So if tables are used for layout, this may cause problems.
// One way to get round this would be to add a class to every data (not layout) table and add it the the script below. The script will then only look at the 'right' tables. E.G:

// In the HTML - <table class="data_table"...............></table>
// In the script below - Change $("table") to $("table.data_table")


$(document).ready(function() {

	var largestTable = 0;
	
	$("table").each(function(){
        if ($(this).outerWidth(true) > largestTable) {
            largestTable = $(this).outerWidth();   
		}
	});
    
	if (largestTable > 980) {
		$("#container").css("min-width", largestTable+28);
		$("#container").css("max-width", largestTable+28);
		$("#container").css("width", largestTable+28);
	}
	
});
