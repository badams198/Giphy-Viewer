$(document).ready(function () {

    var styles = ["Karate", "Jiujitsu", "Judo", "Taekwondo", "Kungfu", "Muaythai"];
    var titleArray = ["nKN7E76a27Uek?", "8FoLI543l49s0I525V?", "XJnWzyYpQpZ2U?", "TaSGYePPkcjHa?","kAdfJXbqV88LK","xUA7aPjX6lUqfkzkRi"];
    var titlegetURL = "https://api.giphy.com/v1/gifs/";

    

    var getstyles = "";
    var getApiKey = "k4lIc25Cnm8PVmdTTePqX37D2HFooSyY";
    var getURL = "https://api.giphy.com/v1/gifs/search?";
    var getString = "";

    

    var stylesGifs = [];
    var currentGif = "";
    var offsetNumber = 0;

    

    //creates the page title using gifs.
    createGifTitle("fixed_height_small");

    // generates initial set of buttons based on the styles array.
    for (var i = 0; i < styles.length; i++) {
        generateButton(styles[i]);
    };

    // when a style button is clicked, invisible buttons become visible
    $("#buttons").on("click", ".btn", function () {
        $("#gallery").attr("data-array", "styles");
        $("#addGifs").css("visibility", "visible");
        $("#clearGifs").css("visibility", "visible");
        $("#clear-storage").css("visibility", "hidden");
        
        offsetNumber = 0;
        stylesGifs = [];
        activeGif = $(this).text();
        getstyles = $(this).text();
        clearGifs();
        createUrl(getstyles, offsetNumber);
        getGifs(getString);
        createStyleUrl(getstyles);
        getWeather(weathergetString);
    });

    // switches still gif to moving gif,when clicked
    $("#gallery").on("click", ".gif", function () {
        var gifValue = $(this).data("value");
        var gifMoving = $(this).data("moving");
        if (gifMoving === "off") {
            $(this).data("moving", "on");
            $(this).attr("src", stylesGifs[gifValue].images.fixed_height.url);
        } else if (gifMoving === "on") {
            $(this).data("moving", "off");
            $(this).attr("src", stylesGifs[gifValue].images.fixed_height_still.url);
        };
    });

   

    // adds more gifs to gallery when 'show more' button is clicked
    $("#addGifs").on("click", function () {
        event.preventDefault();
        createUrl(activeGif, offsetNumber);
        getGifs(getString);
    });

   

    // removes currently showing gifs when clear is clicked
    $("#clearGifs").on("click", function () {
        clearGifs();
        clearWeather();
        $("#clearGifs").css("visibility", "hidden");
        $("#addGifs").css("visibility", "hidden");
    });

    $("#clear-storage").on("click", function () {
        
        clearGifs();
        $("#clearGifs").css("visibility", "hidden");
        $("#addGifs").css("visibility", "hidden");
        $("#clear-storage").css("visibility", "hidden");
    });

   

    // switches starting gifs from still to moving
    $("#movementToggle").on("click", function () {
        if ($("#movementToggle").prop("checked")) {
            createGifTitle("fixed_height_small");
        } else {
            createGifTitle("fixed_height_small_still");
        }
    });

    // Prevents page from refreshing
    $("form").submit(function (event) {
        event.preventDefault();
        var searchedWord = $("#user-input").val().trim();
        if (searchedWord === "") {
            // $("#null-input").modal("show");
        } else {
            stylesGifs.push(searchedWord);
            generateButton(searchedWord);
            $("#user-input").val("");
        };
    });

    // Nests ajax call within a for loop
    // Source: https://stackoverflow.com/questions/21373643/jget-ajax-calls-in-a-for-loop
    function createGifTitle(str) {
        for (var t = 0; t < titleArray.length; t++) {
            (function (t) {
                $.ajax({
                    url: titlegetURL + titleArray[t] + "api_key=" + getApiKey,
                    method: "GET",
                    success: function (response) {
                        $("#letter" + t).attr("src", response.data.images[str].url);
                    }
                });
            })(t);
        };
    };

    // Dynamically generates a new button and appends it to the #buttons div.
    function generateButton(str) {
        var newButton = $("<button>").text(str);
        newButton.addClass("btn btn-info btn-lg");
        $("#buttons").append(newButton);
    };

    // Dynamically generates and returns a new getString based on the selected button value.
    function createUrl(str, num) {
        return getString = getURL + "api_key=" + getApiKey + "&" + "q=" + str + "&" + "limit=10" + "&" + "offset=" + num;
    };

    // Dynamically generates and returns a new weathergetString value based on the selected button value.
    function createStyleUrl(str) {
        return weathergetString = weathergetURL + "q=" + str + "&" + "APPID=" + weatherApiKey;
    };

    // The AJAX call to Giphy. A successful request pushes each object to the stylesGif array and increments the offsetNumber variable by 10.
    function getGifs(str) {
        $.ajax({
            url: str,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                response.data[j].favorite = false;
                stylesGifs.push(response.data[j]);
            };
            generateGif(offsetNumber, stylesGifs);
            offsetNumber += 10;
        });
    };

    // Calls the createGif function based on the length of the response array (10) and appends to the #gallery div.
    function generateGif(num, arr) {
        for (var k = num; k < arr.length; k++) {
            var newGif = createGif(k, arr);
            $("#gallery").append(newGif);
        };

    };

    // creates gif image, title and rating
    function createGif(num, arr) {
        var imageContainer = $("<figure>").addClass("figure");
        imageContainer.attr("style", "width: " + arr[num].images.fixed_height_still.width + "px;");
        var imageGif = $("<img>").attr("src", arr[num].images.fixed_height_still.url);
        imageGif.addClass("gif figure-img img-fluid rounded");
        imageGif.attr("alt", arr[num].title);
        imageGif.attr("data-value", num);
        imageGif.attr("data-moving", "off");
        
        var imageRating = $("<figcaption>");
        var ratingText = "Rated: " + arr[num].rating.toUpperCase();
        imageRating.text(ratingText);
        imageRating.addClass("figure-caption text-left");
        var imageTitle = $("<figcaption>");
        var titleText = arr[num].title.italics();
        imageTitle.html(titleText);
        imageTitle.addClass("figure-caption text-left");
        imageContainer.append(imageGif);
        
        imageContainer.append(imageRating);
        imageContainer.append(imageTitle);
        return imageContainer;
    };

    // Function to remove the currently shown gifs from the page.
    function clearGifs() {
        $("#gallery").empty();
    };

   
});