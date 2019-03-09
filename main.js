/* Weather-Project Eval
Part 1:
✔︎ A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
✔︎ A user should be able to see the current temperature (in imperial units).
✔︎ A user should be able to see the current conditions (whether it's cloudy, raining, etc).
✔︎ When a user does another search, their first search should be replaced.

Part 2:
- When a user searches, they should additionally see a 5-day forecast, and each of the five days should have an associated day of the week, weather condition and temperature.

my API key: 67a3461ef47ac031e5c7b307ce98c09c

TO DO:
-refactor icons
-refactor html design

*/

//the data should live in a data structure outside of the view
var currentWeather = [];

var fiveDayForecast = [];

//when CurrentWeather is rendered, the model should appear in the view
var renderCurrentWeather = function () {
    //ensure the div is empty before rendering
    $('.current-weather').empty();
    //loop through the data structure
    for (var i = 0; i < currentWeather.length; i++) {

        //handlebars should be used to append the data to the DOM
        var source = $('#current-weather-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(currentWeather[i]);
        $('.current-weather').append(newHTML);
    }
};

//when fiveDayForecast is rendered, the model should appear in the view
var renderForecast = function () {
    $('.forecast').empty();

    for (var i = 0; i < fiveDayForecast.length; i++) {
        console.log("this is what the forecast array looks like:", fiveDayForecast[i]);

        //uses handlebars
        var source = $('#forecast-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(fiveDayForecast[i]);
        $('.forecast').append(newHTML);
    }
};

//the weather data should be fetched and extracted from the weather API
var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=67a3461ef47ac031e5c7b307ce98c09c&units=imperial",
        dataType: "json",
        success: function(data) {
            addForecast(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

//the five day forecast data should be fetched and extracted from the weather API
var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: "api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=67a3461ef47ac031e5c7b307ce98c09c&units=imperial",
        dataType: "json",
        success: function(data) {
            addForecast(data.list);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

//currentWeather should show the city name, temperature, and condition
var addCurrentWeather = function(data) {
    //splice to remove the last search from the array
    currentWeather.splice(0);
        
        console.log("this is what the data from the current weather API looks like:", data);
            // build obj to fit handlebars template {city, temperature, condition, icon}

            var rightNow = {
                // if there is a city, temperature. condition, . . . etc, set them equal to it; if there isn't, make it an empty string
                city: data.name ? data.name : "",
                temperature: Math.round(data.main.temp) ? Math.round(data.main.temp) : "",
                condition: data.weather[0].main ? data.weather[0].main : "",
                // icon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png" ? data.weather[0].icon : "",
            };
        
        currentWeather.push(rightNow);
        renderCurrentWeather();
};

//fiveDayForecast should show the weekday, temperature, and condition for the searched city for the next five days
        //moment.min.js will be required to parse the date
var addForecast = function(data) {
    //splice to remove the last search from the array
    fiveDayForecast.splice(0);
    //for every day in the forecast API response
    for (var i = 0; i < data.length; i ++) {

        console.log("this is what the data from the forecast API looks like:", data);
            // build obj to fit handlebars template {city, temperature, condition, icon}

            var dailyForecast = {
                // if there is a city, temperature. condition, . . . etc, set them equal to it; if there isn't, make it an empty string
                weekday: data.list[i].dt ? data.list[i].dt : "", //refactor to use moment.min.js
                temperature: Math.round(data.list[i].main.temp) ? Math.round(data.list[i].main.temp) : "",
                condition: data.list[i].weather[0].main ? data.list[i].weather[0].main : "",
                // icon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png" ? data.list[i].weather[0].icon : "",
            };
        
        fiveDayForecast.push(dailyForecast);
        renderForecast();
};

//users should be able to search for a city and see the current weather
$('.search').on('click', function () {
    var search = $('#search-query').val();

    fetch(search);
})

//currentWeather should be rendered as soon as the page is loaded
renderCurrentWeather();

//fiveDayForecast should be rendered after the search button is clicked