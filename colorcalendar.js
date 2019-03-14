/*
    Creator: Aurel Schwitter
    Version: 1.2 
    Date:    14.03.2019

    Integrate to Sharepoint:
    1) Upload to public Document library
    2) Copy url of uploaded Document
    3) Add Script editor on specified Page
    3.1) Paste following
    <script src="{url to script}" type="text/javascript"></script>
*/


// Editable elements
// Separators separating Name and Text
const COL_CAL_SEPARATORS = [":", "-", " "];
// Random values for different colors
const CAL_RANDOM = 99;
const RED_MODIFIER = 0;
const GREEN_MODIFIER = 0;
const BLUE_MODIFIER = 0;

_spBodyOnLoadFunctionNames.push("LoadColoredCalendar");

// Waits for Sharepoint to load everything (1000ms)
function LoadColoredCalendar() {
    LoadSodByKey("SP.UI.ApplicationPages.Calendar.js", function () {
        window.setTimeout(ColorCalendar, 600);
    });
}

// Colores the calendar
function ColorCalendar() {
    // Get all calendar items
    var calitems = document.getElementsByClassName("ms-acal-item");

    // check if any exists
    if (calitems.length > 0) {
        for (let calitem of calitems) {

            var link = calitem.getElementsByTagName("a")[0];
            var text = link.innerHTML;

            // Is calendar already colored?
            if (!calitem.hasAttribute("data-calitem-colored")) {

                // Get color from Name
                var colors = GetColorCodeFromCategory(GetName(text));
                // Convert color array to rgb(R,G,B)
                var rgbcolors = "rgb(" + colors + ")";

                // calculate black or white Text
                var fcolor = GetForegroundColor(colors);
                // Set foreground color
                calitem.style.backgroundColor = rgbcolors;
                link.style.color = fcolor;

                // set attribute, it is already colored
                calitem.setAttribute("data-calitem-colored", true)
            } else {
                // calendar is alredy colored, do not do again
                return;
            }
        };

    };
    // rerun this function in 2s
    window.setInterval(ColorCalendar, 1800);
};

// Generate number from string
function HashCode(str) {
    let hash;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return hash & 0xffffff; // convert to number between 0x000000-0xfffff
};

// Get Name from category
function GetName(originalText) {
    var res = "";
    COL_CAL_SEPARATORS.forEach(function (e) {
        if (originalText.indexOf(e) > -1) {
            res = originalText.split(e)[0].trim();
            return false;
        }
    });
    return res === "" ? originalText : res;
}

function GetColorCodeFromCategory(category) {
    if (category === undefined) return [0, 0, 0];

    var hash = HashCode(category.trim());
    hash = hash * CAL_RANDOM / 7;


    // Convert to positive number
    // Randomize negative numbers 
    // Remove any decimal points
    hash = Math.floor(Math.abs(hash));

    // Convert decimal to r,g,b array
    return [((hash & 0xff0000) >> 16) + RED_MODIFIER, ((hash & 0x00ff00) >> 8) + GREEN_MODIFIER, (hash & 0x0000ff) + BLUE_MODIFIER];

}

function GetForegroundColor(rgb) {
    if (rgb.length != 3) return "#000000 !important";
    var rounded = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);
    return rounded > 150 ? "#000000 !important" : "#ffffff !important";
}