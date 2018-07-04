
// VARIABLES - GLOBAL SCOPE - may not need these & they are NOT hooked to anything right now
var newDestinationCity = ""; //pull from firebase database & need to convert city to IATA code for API search
var newCityCode = "";
var newDepartureDate = "";  //pull from firebase database & verify date format from html will work for API
var newReturnDate = ""; // pull from firebase & verify date formate from html will work & very this var name won't conflict with same var above
var newBudgetAmt = ""; // pull from firebase 
 
 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCEkC4CfI0aI1_oCbLNDxuqjFaczr0-Y2o",
    authDomain: "travel-app-623cb.firebaseapp.com",
    databaseURL: "https://travel-app-623cb.firebaseio.com",
    projectId: "travel-app-623cb",
    storageBucket: "",
    messagingSenderId: "532694120783"
  };
   firebase.initializeApp(config);
  //import 'firebase/database';

// Create a variable to reference the database
var database = firebase.database();

//Captures data from html from mouse click
  $("#travel").on("click", function(event){
    event.preventDefault();

    //get data from form
    var destination = $("#destination").val().trim(); //we don't need the destination button
    var budget = $("#budget").val().trim();
    var departure = $("#departure").val().trim();
    var returnDate = $("#returnDate").val().trim();

        //the push to database
        database.ref().push({
          destination: destination,
          budget: budget,
          departure: departure,
          returnDate: returnDate,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
 });
// Firebase watcher + initial loader
  database.ref().on("child_added", function(childSnapshot) {


    var destination = childSnapshot.val().destination; 
    var newBudget = childSnapshot.val().budget;
    var newDeparture= childSnapshot.val().departure;
    var newReturnDatea = childSnapshot.val().returnDate; //rename or remove a from var. see note below about var name
    // console.log(budget);
    // console.log(destination);
  });

  //API KEYS
var APIKeyAmadeus = "OfvxhHXHyaJilRi9PxAyZTudLjmcQe1c";
var APIKeyWeather = "db42f791787c1b0ce33f7b05f03ae690";
var APIKeyAviation = "4b6f40-91d38d-01a1f1-d4c66b-182e26";

// // VARIABLES - GLOBAL SCOPE - may not need these & they are NOT hooked to anything right now
// var newDestinationCity = ""; //pull from firebase database & need to convert city to IATA code for API search
// var newDepartureDate = "";  //pull from firebase database & verify date format from html will work for API
// var newReturnDate = ""; // pull from firebase & verify date formate from html will work & very this var name won't conflict with same var above
// var newBudgetAmt = ""; // pull from firebase

//need to add search information from button capture to the ajax call 
//main function that does all of the calling other functions return back to it
function getIdeas(origin, departure, returnDate, minDuration, maxDuration, price){
    $.ajax({
        url: `https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${APIKeyAmadeus}&origin=${"MKC"}&departure_date=${"2018-09-06"}--${"2018-09-26"}&duration=${"7"}--${"9"}&max_price=${"500"}`,       
        method: "GET"
    })
    .then(function(response) {
        //for Travel
        for (var i = 0; i < response.results.length; i++) {
             getCity(response.results[i])
                .then(function([cityResponse, idea]){
                    var cityName = cityResponse.city.name
                    getWeather(cityName)
                        .then(function(weatherResponse){

                           // TODO: parse all response to build your Html
                            generateTableRow(idea, cityResponse, weatherResponse);
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                })
                .catch(function(err){
                    console.log(err);
                });
            }
    })
    .catch(function(err){
        console.log(err);
    });
    
 }

// Ajax API call to get IATA city code and exchange to City Name (DEN = Denver)
//this function returns the promise to the idea function, which then parses the city data out
function getCity(idea){
    var query = idea.destination;
    return $.ajax({
            url: "https://api.sandbox.amadeus.com/v1.2/location/" +query+ "?apikey=" +APIKeyAmadeus+ "", //how to get IATA code in query
            method: "GET"
        }).then(function(response) {
            return [response, idea];
        });
}

  
// Ajax API call to get weather information based on a city
//this function returns the weather promise to the idea function, which then parses the weather out.
function getWeather(query){
    return $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?" + "q="+query+ "&units=imperial&appid=" + APIKeyWeather + "",
    method: "GET"
    }).then(function(response) {
        return response;
    });
}

//this function handles the parsing for the data to the table as well as the weather logic.
function generateTableRow(ideaResponse, cityResponse, weatherResponse){
    console.log(arguments);

        var row = $("<tr>");
        row.append("<td>" + ideaResponse.destination + "</td>")
        row.append("<td>" + ideaResponse.departure_date + "</td>")
        row.append("<td>" + ideaResponse.return_date + "</td>")
        row.append("<td>" + ideaResponse.price + "</td>")
        row.append("<td>" + ideaResponse.airline + "</td>")
        row.append("<td>" + cityResponse.city.name + "</td>")
        row.append("<td>" + weatherResponse.main.temp + "</td>")
        row.append("<td>" + weatherResponse.main.temp_min + "</td>")
        row.append("<td>" + weatherResponse.main.temp_max + "</td>")
        $("#display").append(row);

        var weather = weatherResponse.main.temp;
        var low = weatherResponse.main.temp_min;
        var high = weatherResponse.main.temp_max;


}
  
getIdeas(); 
