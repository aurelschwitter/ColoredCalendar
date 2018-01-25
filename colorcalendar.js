/*
    Creator: Aurel Schwitter
    Version: 1.0 
    Date:    26.01.2017

    Integrate to Sharepoint:
    1) Upload to public Document library
    2) Copy url of uploaded Document
    3) Add Script editor on specified Page
    3.1) Paste following
    <script src="{url to script}" type="text/javascript"></script>
*/


// Editable elements
// Separators separating Name and Text
var COL_CAL_SEPARATORS = [ ":",  "-", " "];
// Random values for different colors
var CAL_RANDOM = 1.4;
var CAL_RANDOM_2 = 5;


// Check for Query
if (typeof $ == undefined){
    throw "jQuery needed";
} else {
    // Load WaitForTheGodDamnSP() when Page is ready
	 _spBodyOnLoadFunctionNames.push("WaitForTheGodDamnSP");
}

// Waits for Sharepoint to load everything (1000ms)
function WaitForTheGodDamnSP (){
    LoadSodByKey("SP.UI.ApplicationPages.Calendar.js", function () {
        window.setTimeout(ColorCalendar, 1000);
    });
}

// Colores the calendar
function ColorCalendar() {
    // Get all calendar items
    var $calitems = $(".ms-acal-item");

    // check if any exists
    if ($calitems.length > 0) {
        $calitems.each(function (i) {
            var $box = $(this);
            var $text = $box.find("a");
            var text = $text[0].innerHTML;

            // Is calendar already colored?
            if ( text.indexOf(">") == -1){

                // Get color from Name
                var colors = GetColorCodeFromCategory(GetName(text));
                // Convert color array to rgb(R,G,B)
                var rgbcolors = "rgb(" + colors + ")";
                            
                // calculate black or white Text
                var fcolor = GetForegroundColor(colors);
                // Set foreground color
                $box.css("background-color", rgbcolors);
                $box.find("div, a").wrapInner("<span style=\"color:"+fcolor+"\"></span>");

            }
        });

    }
    // rerun this function in 2s
    window.setTimeout(ColorCalendar, 1000);
};

// Generate number from string
function HashCode (str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// Get Name from category
function GetName(originalText) {
	var res = "";
    COL_CAL_SEPARATORS.forEach(function(e) {
        if (originalText.indexOf(e) > -1){
            res = originalText.split(e)[0].trim();
            return false;
        }
    });
	return res === "" ? originalText : res;
}

function GetColorCodeFromCategory(category) {
	if (category === undefined) return [0,0,0];
    var bgcolor = null;
    var fgcolor = null;

    var hash = HashCode(category.trim());
    hash = hash * CAL_RANDOM;

    // Convert to positive number
    // Randomize negative numbers 
    // Remove any decimal points
    hash = Math.floor(hash < 0 ? Math.abs(hash / CAL_RANDOM_2) : hash);

    // Convert decimal to r,g,b array
    return [(hash & 0xff0000) >> 16, (hash & 0x00ff00) >> 8, (hash & 0x0000ff)];

}

function GetForegroundColor (rgb){
    if (rgb.length != 3) return "#000000 !important";
    var rounded = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);
    return rounded > 150 ? "#000000 !important" : "#ffffff !important";
}