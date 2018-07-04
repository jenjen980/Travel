
//     function displayResults(price){

var APIKeyAmadeus = "OfvxhHXHyaJilRi9PxAyZTudLjmcQe1c";
var APIKeyWeather = "db42f791787c1b0ce33f7b05f03ae690";


    $.ajax({
        url: "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=" + APIKeyAmadeus + "&origin=BOS&departure_date=2018-09-06--2018-09-26&duration=7--9&max_price=700",
        //url: "https://api.sandbox.amadeus.com/v1.2/location/" +cityCode+ "?apikey=" +APIKeyAmadeus+ "",
        //url: "https://api.openweathermap.org/data/2.5/weather?" + "q=Chicago&units=imperial&appid=" + APIKeyWeather + "",
        //url: "https://aviation-edge.com/api/public/airlineDatabase?key=4b6f40-91d38d-01a1f1-d4c66b-182e26&codeIataAirline=B6",
       
        method: "GET"
      }).then(function(response) {

        console.log(response);

        var priceDiv = $("<div class = 'price'>");

            //for Travel
        for (var i = 0; i < response.results.length; i++) {
            var results = response.results;
            var destination = response.results[i].destination;
            var depart = response.results[i].departure_date;
            var returnDate = response.results[i].return_date;
            var prices = response.results[i].price;
            var airline = response.results[i].airline;
            var cityCode = destination;

        console.log(cityCode);
        console.log(results);
        console.log(destination);
        console.log(depart);
        console.log(returnDate);
        console.log(prices);
        console.log(airline);


            //for City
        // var city = response.city.name;
        // console.log(city);

            //for Weather
        // var weather = response.main.temp;
        // var low = response.main.temp_min;
        // var high = response.main.temp_max;
        //var description = response.weather[].description;
        //console.log(description);



      //  var nameAir = response[0];
      //  console.log(nameAir);

            
            
       // }

//});

}


     });
    
