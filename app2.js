

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
    var destination = $("#origin").val().trim(); //we don't need the destination button
    var budget = $("#budget").val().trim();
    //var departure = $("#departure").val().trim();
   // var returnDate = $("#returnDate").val().trim();

        //the push to database
        database.ref().push({
          destination: destination,
          budget: budget,
          departure: departure,
          returnDate: returnDate,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
          
      });

      window.location = "bootstrap-index1.html";
 });

 var departureDate = function getDeparture() {
    $("#departure").on("change", function(){
        return ($(this).val())
    });
 };
 
 var returnDate = function getReturn(){
    $("#return").on("change", function(){
        return ($(this).val())
    });
 };
 
 // Function to calculate number of days between depature and return
 
 var dayDepart = function getDayDeparture () {
    var departParse = Date.parse (departuredate);
    var departDay = departParse/86400;
    return departDay
 }

 var dayReturn = function getDayReturn () {
    var returnParse = Date.parse (returnDate)
    var returnDay = returnParse/86400;
    return returnDay;;
 }
// Firebase watcher + initial loader
  database.ref().on("child_added", function(childSnapshot) {


    var destination = childSnapshot.val().destination; 
    var newBudget = childSnapshot.val().budget;
    var newDeparture= childSnapshot.val().departure;
    var newReturnDatea = childSnapshot.val().returnDate; //rename or remove a from var. see note below about var name

        // TODO:  Pass this into getIdeas
    if(window.location.href.indexOf("bootstrap-index1.html") > -1){ getIdeas(); }
  });


  //API KEYS
var APIKeyAmadeus = "OfvxhHXHyaJilRi9PxAyZTudLjmcQe1c";
var APIKeyWeather = "db42f791787c1b0ce33f7b05f03ae690";
var APIKeyAviation = "4b6f40-91d38d-01a1f1-d4c66b-182e26";


var origin = "MKC";
//var newDepartureDate = $("#destination").val();
newBudgetAmt = $("#budget").val();


// // VARIABLES - GLOBAL SCOPE - may not need these & they are NOT hooked to anything right now
// var newDestinationCity = ""; //pull from firebase database & need to convert city to IATA code for API search
// var newDepartureDate = "";  //pull from firebase database & verify date format from html will work for API
// var newReturnDate = ""; // pull from firebase & verify date formate from html will work & very this var name won't conflict with same var above
// var newBudgetAmt = ""; // pull from firebase

//need to add search information from button capture to the ajax call below
function getIdeas(origin, departure, returnDate, minDuration, maxDuration, price){
    $.ajax({
        url: `https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${APIKeyAmadeus}&origin=${origin}&departure_date=${departureDate}--${returnDate}&duration=${dayDepart}--${dayReturn}&max_price=${newBudgetAmt}`,       
        method: "GET"
    })
    //"https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=" +APIKeyAmadeus+ "&origin=MKC&departure_date="+departureDate+"--"+returnDate+"&duration="+dayDepart+"--"+dayReturn+"&max_price=500"

    .then(function(response) {
        //for Travel
        for (var i = 0; i < response.results.length; i++) {
           // var results = response.results;
            // var flightIdeas = response.results[i]; 
            // console.log(JSON.stringify(flightIdeas));
            // var destination = flightIdeas.destination;
            // var depart = response.results[i].departure_date;
            // var returnDate = response.results[i].return_date;
            // var prices = response.results[i].price;
            // var airline = response.results[i].airline;
            // var cityCode = destination;
            //  newDestinationCity = destination;
             getCity(response.results[i])
                .then(function([cityResponse, idea]){
                    var cityName = cityResponse.city.name
                    getWeather(cityName)
                        .then(function(weatherResponse){
                           // console.log(weatherResponse);

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
function getCity(idea){
    var query = idea.destination;
    return $.ajax({
            url: "https://api.sandbox.amadeus.com/v1.2/location/" +query+ "?apikey=" +APIKeyAmadeus+ "", //how to get IATA code in query
            method: "GET"
        }).then(function(response) {
            return [response, idea];
        });
}

  
// Ajax API call to get weather information based on a city - ALREADY using 2 API calls?
function getWeather(query){
    return $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?" + "q="+query+ "&units=imperial&appid=" + APIKeyWeather + "",
    method: "GET"
    }).then(function(response) {
        return response;
    });
}

function generateTableRow(ideaResponse, cityResponse, weatherResponse){
    console.log(arguments);
    // TODO:  DO HTML here
    // pushes the getIdeas API call to the DOM as a table - I haven't fixed the IATA codes 
    // $("#display").append(
        // ' <tr><td>' + cityCode +
        // ' <tr><td>' + ideaResponse.destination +
        // ' </td><td>' + ideaResponse.depart +
        // ' </td><td>' + ideaResponse.returnDate +
        // ' </td><td>' + ideaResponse.prices +
        // ' </td><td>' + ideaResponse.airline + 
        // ' </td><td>' + cityResponse.cityName +
        // ' </td><td>' + weatherResponse.weather +
        // ' </td><td>' + weatherResponse.low +
        // ' </td><td>' + weatherResponse.high + ' </td></tr>');

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
        //console.log(weather);
        var low = weatherResponse.main.temp_min;
        var high = weatherResponse.main.temp_max;



//    var destination = response.results[i].destination;
//         var depart = response.results[i].departure_date;
//         var returnDate = response.results[i].return_date;
//         var prices = response.results[i].price;
//         var airline = response.results[i].airline;

    // pushes the getIdeas API call to the DOM as a table - I haven't fixed the IATA codes 
    // $("#display").append(
    //     // ' <tr><td>' + cityCode +
    //     ' <tr><td>' + newDestinationCity +
    //     ' </td><td>' + depart +
    //     ' </td><td>' + returnDate +
    //     ' </td><td>' + prices +
    //     ' </td><td>' + airline + ' </td></tr>');

    // var weather = response2.main.temp;
    // var low = response2.main.temp_min;
    // var high = response2.main.temp_max;


}

//getIdeas(); 
