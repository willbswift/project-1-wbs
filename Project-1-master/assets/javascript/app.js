/* 
NOTE the expression *** denotes a place where code needs to be added or completed.  
STUFF THE HTML FILES WILL NEED
class="zipdiv" class that shows or hides the zip code input at appropriate time
class="listdiv" class that shows or hides the lists of parks at appropriate time
class="userdiv" class that shows or hides the add user input forms
id="zipbutton" for the submit button for the zip code
id="zip" for the inputed zip code form
id="mapdiv" ID where map will go.   
id="active" this is where the parks with dogs will show up.
id="inactive" this is where the parks with no dogs will show up.
class="parkbutton" this class should be attached to the select button for each park.  
id="dogdaybutton" for the submit button for the user's time and dog info
id="startH" for the inputed arrival time Hours form
id="startM" for the inputed arrival time Minutes form
id="endH" for the inputed end time Hours form
id="endM" for the inputed end time Minutes form
id="dogName" for inputed name of dog form
id="dogBreed" for inputed breed of dog breed form
id="dogAge"for inputed age of dog breed form
// --------------------------------------------------------------
OUTLINE OF HOW CODE IS LAID OUT
//Initialize Firebase
//set up variables
//Code to collect Zip Code
//Code to converts zip to Latitude and Longitude
	// Calls function to convert that to Park List
//function to retrieve a list of parks
//function to print an Inactive Park to html
//Code to retrieve Active Park Locations
//Code to retrieve current date and time
//Code to compare Park List to Active Park List
	//should exclude ones with less then 15 min on time?
//function to print an Active Park to html
//Code to store the location picked by user.  
	//with links to that parks' Google Map / Google Locations page
//Code to collect data of new user and upload to Firebase
//Code to delete expired users?
//Code to present available dog at active park
//Code to factoids and pics of available dog. 
*/



	//load Jqery stuff
//$(document).ready(function () {

	markerArray = []; 

		// Initialize Firebase
	let config = {
	    apiKey: "AIzaSyCReXH7G9fqpAGvccatlqbBf-FW0u0NB7c",
	    authDomain: "puppy-b6f53.firebaseapp.com",
	    databaseURL: "https://puppy-b6f53.firebaseio.com",
	    projectId: "puppy-b6f53",
	    storageBucket: "puppy-b6f53.appspot.com",
	    messagingSenderId: "75752689696"
	};

  	firebase.initializeApp(config);

		// Create a variable to reference the database
	let database = firebase.database();

// --------------------------------------------------------------

		//switch things on and off
	$(".zipdiv").show();
	$(".page3").hide();
	$(".listdiv").hide();
	$(".userdiv").hide();

		// Set up variables
	let zip = "";
	let numberOfParks = 10;
	let name = "";
	let response = "";
	let parkName = "";
	let parkLocation = "";
	let startTime = "";
	let endTime = "";
	let dogName = "";
	let dogBreed = "";

//--CODE TO TAKE ZIP AND FIND LAT AND LONG AND TRIGGER SUBEQUENT STUFF-------/

		//Setting up URL for ZIPCODE
		//Code to collect Zip Code whenever a user clicks the submit button  
    $("#zipbutton").on("click", function (zip){
            zip.preventDefault(); 
            let zipInput = $("#zip").val().trim();

            // console.log("your zip code: ", zipInput);

            if(zipInput !==""){
                zipAdded = true;
                // console.log("zip added? ", zipAdded);
       
                // CALL API IF ZIP CODE HAS BEEN ADDED 
                // var APIKey = "166a433c57516f51dfab1f7edaed8413";
                // var queryURL = "https:api.openweathermap.org/data/2.5/weather?zip=" + zipInput + ",us&units=imperial&appid=" + APIKey;
                // $.ajax({
                //   url: queryURL,
                //   method: "GET"
                // }).then(function(response) {
                //     // console.log("response object: ", response);
                //     let temperature = response.main.temp;
                //     let roundedT = Math.round(temperature);
                //     $("#temp").prepend("<p>" + roundedT + " &#8457;</p>")

                // });  //ENDS fn(response)
	   
				var APIKey = "166a433c57516f51dfab1f7edaed8413";
				var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipInput + ",us&units=imperial&appid=" + APIKey;
				$.ajax({
				url: queryURL,
				method: "GET"
				}).then(function(response) {
				console.log("response object: ", response);
				let temperatureMin = response.list[0].main.temp_min;
				let temperatureMax = response.list[0].main.temp_max;
				let roundedMax = Math.round(temperatureMax);
				let roundedMin = Math.round(temperatureMin);
				let conditions = response.list[0].weather[0].description;


				$("#forecast").append("<tr><td>" + roundedMin + " &deg;F</td><td>" + roundedMax + "&deg;F</td><td>" + conditions + "</td></tr>");

				});  //ENDS fn(response)


            }; 

				//code to create request to google locations and Generate key request for Latitude and Longitude
            let url = "https://maps.googleapis.com/maps/api/geocode/json";
            url += '?' + $.param({
               'key': "AIzaSyAjOzz5XzUwhDvQ7JNpCTWs1v4dqfDbtZI",
               'address': zipInput,
               'async': true
        
            });
	       $.ajax({
	           url: url,
               method: 'GET',   
               async: true,
	       }).done(function (result) {
	       			//Latitude and Longitude results!
               	userLL = result.results[0].geometry.location.lat+","+result.results[0].geometry.location.lng;
            //    console.log("User lat and long: ",userLL)

			$(".zipdiv").hide();
			$(".listdiv").show();

					// Once Longitude and Latitude are collected, use this function (from above) to find parks closest to your location:
                parkList(userLL);
                initMap();


	       }).fail(function (err) {
	           throw err;
	       });
          // return userLL;
         
	});


//------------- PARK LIST Function START  --------------------------/

		// Once Longitude and Latitude are collected, use this function to find parks closest to your location:
function parkList (latlong){
		//Generate key request for JSON object list of parks
    let latLngUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    latLngUrl += '?' + $.param({
       'key': "AIzaSyAjOzz5XzUwhDvQ7JNpCTWs1v4dqfDbtZI",
       'location': latlong,//your long/lat go here
       'rtype': "park",
       'rankby': "distance",
       'name': "park"
    }); 

    $.ajax({
        url: latLngUrl,
        method: 'GET',   
        async: true,
            //we store the retrieved data in an object called "result"
    }).done(function (result) {	  
        	//Code to console log data of nearby parks

            //grab and console log out name of park #2 as a test
		let name = result.results[1].name;
    		//grab and console log out Place ID of park #2 as a test
    	place_id = result.results[1].place_id;
    		 //grab and console log out Address of park #2 as a test
    	address = result.results[1].vicinity;

		loopAllParks(result);

    		//Input Park List into Firebase so we can access it easier??  
		database.ref("/parks").set({
			parkListObject: result
		});

//***parse results or loop through results and render map      

    }).fail(function (err) {
        throw err;
    });
}

//----- PARK LIST END  -----------------------------/

//---------Quick and Dirty Loop for printing 

	function loopAllParks (result) {

			//loop to go through every available park
		for (let i = 0; i <= numberOfParks - 1; i++) {

			printInactiveParks(i, result);

			//Code to store the location picked by user.  
		$(".parkbutton").on("click", function(e){
			console.log("park button: ", e);
				e.preventDefault();

			$(".listdiv").hide();
			$(".page3").show();


	        console.log("park button info: ", e.currentTarget.dataset.id);
	        
			let selectedParkLL = JSON.parse(e.currentTarget.dataset.id);
			console.log("selectedParkLL: ", selectedParkLL);
	        markerArray.push(selectedParkLL);

			// createMarker(markerArray);
			initMap(markerArray);
		});

		};

	};

//------Function to make Inactive Park List and present it-------

	function printInactiveParks (i, result) {

		//grab and console log out name of park
      	name = result.results[i].name;
      		console.log("Inactive Park Name: " + result.results[i].name);
		
		let parkName = $("<button>");
		parkName.addClass("parkbutton");
		parkName.addClass("btn");

		// Adding a data-attribute
		parkName.attr("data-name", name);
	
		// Providing the initial button text
		parkName.text(name);
		//Adding the button to the buttons-view div
  		$("#inactive").append(parkName);

		//grab and console log out Place ID of park
      	let selectedParkObj = JSON.stringify(result.results[i]);

		//Adding a data-attribute with the place ID.  
		parkName.attr("data-id", selectedParkObj);

		//grab and console log out Place ID of park
      	let placeLL = result.results[i].geometry.location;
		//Adding a data-attribute with the place ID.  
		parkName.attr("data-ll", placeLL);
		//test to see if it works
		valuell = $(parkName).attr("data-ll");

		//Grabbing and console logging the address data
      	let address = result.results[i].vicinity;

		// Creating an element to have the name displayed
      	let addressOut = $("<p>");
		// Adding a data-attribute
		addressOut.attr("data-address", address);
		// Providing the initial button text
		addressOut.text(address);
		//Adding the button to the buttons-view div
  		$("#inactive").append(addressOut);



	}; //close for print inactive parks


	
	//Initialize Map
	let map;
	function initMap() {

		map = new google.maps.Map(document.getElementById('map'), {
	    center: markerArray[0].geometry.location,
	    zoom: 13,
	    disableDefaultUI: true,
	  });
	  
	  
	  console.log("map exists!")
	  console.log("maker array i: ", markerArray[0]);
	  createMarker();
	}; // ENDS initMap

		//Code to present choosen park on map.  
	function createMarker(){
	//   console.log("markerarray", markerArray[0])
	  for (i=0; i<markerArray.length; i++){
	    let marker = new google.maps.Marker({
	      position: markerArray[i].geometry.location,
	      map: map,
	      title: markerArray[i].name
	    });
	  }
	}

//----------------------------------------------------Adding a dog---------------------------------------------------------------//

$("#add-pup-3").on("click", function(newPup){
	$(".page3").hide();
	$(".userdiv").show();
})

// -----Code to get current time --------------------------------

		// Current Time
	let currentTime = moment();
	let currentTimeM = moment(currentTime).format("MM DD hh:mm a");
	let currentTimeU = moment(currentTime).format("X");


	//Code to collect data of new user and upload to Firebase
$("#dogdaybutton").on("click", function (event) {
		event.preventDefault();

		let parkName = $("#parkname").val().trim();
		let parkLocation = $("#park_id").val().trim();
		let startTimeH = $("#startH").val().trim();
		let startTimeM = $("#startM").val().trim();
		let endTimeH = $("#endH").val().trim();
		let endTimeM = $("#endM").val().trim();
		let dogName = $("#dogName").val().trim();
		let dogBreed = $("#dogBreed").val().trim();
		let dogAge = $("#dogAge").val().trim();

		let startTime = moment().hour(startTimeH).minute(startTimeM).format("dddd, MMMM Do YYYY, h:mm:ss a");
		let startTimeU = moment().hour(startTimeH).minute(startTimeM).format("X");

		let endTime = moment().hour(endTimeH).minute(endTimeM).format("dddd, MMMM Do YYYY, h:mm:ss a");
		let endTimeU = moment().hour(endTimeH).minute(endTimeM).format("X");

			// Save the new data in Firebase. This will cause our "value" callback above to fire and update the UI.
		database.ref("/dogday").push({
			parkName: parkName,
			parkLocation: parkLocation,
			startTimeH: startTimeH,
			startTimeM: startTimeM,
			endTimeH: endTimeH,
			endTimeM: endTimeM,
			startTimeU: startTimeU,
			endTimeU: endTimeU,
			dogName: dogName,
			dogBreed: dogBreed,
			dogAge: dogAge
		});
	});

// -------Code to retrieve Active Park Locations/Users------------------

		// At the initial load and subsequent value changes, get a snapshot of the stored data.  This function allows you to update your page in real-time when the firebase database changes.
	database.ref("/dogday").on("child_added", function (snapshot) {

			// Set the variables equal to the stored values.
		parkNameD = snapshot.val().parkName;
		parkLocationD = snapshot.val().parkLocation;
		startTimeHD = snapshot.val().startTimeH;
		startTimeMD = snapshot.val().startTimeM;
		endTimeHD = snapshot.val().endTimeH;
		endTimeMD = snapshot.val().endTimeM;
		startTimeUD = snapshot.val().startTimeU;
		endTimeUD = snapshot.val().endTimeU;
		dogNameD = snapshot.val().dogName;
		dogBreedD = snapshot.val().dogBreed;
		dogAgeD = snapshot.val().dogAge;

		// If any errors are experienced, log them to console.
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	}); // ENDS database /dogday retrieval 



	// function printActiveParks() {

	// 	database.ref('/dogday').once('value', users =>{
	// 	   users.forEach(user => {
	
	// 				   //get each place ID
	// 			   let placeID = user.ref.key; 
	
	// 				   //don't touch
	// 				   //GETS NAME OF PARK
	// 			   name = user.node_.children_.root_.value.value_
	// 				  // Creating an element to have the name displayed
	// 			  let aParkName = $("<button>");
	// 					// Adding a class of movie-btn to our button
	// 			aParkName.addClass("aparkbutton");
	// 				  // Adding a data-attribute
	// 			aParkName.attr("data-name", name);
	// 				  // Providing the initial button text
	// 			aParkName.text(name);
	// 				//Adding the button to the buttons-view div
	// 			  $("#active").append(aParkName);
	
	// 				//Adding a data-attribute with the place ID.  
	// 			aParkName.attr("data-id", placeID);
	// 				//test to see if it works
	// 				//valueID = $(aParkName).attr("data-id");
	// 				//console.log("test to see if data attribute worked " + valueID);
	
	// 				   //GIVES DOG NAME
	// 			   let dogName = user.node_.children_.root_.left.left.right.value.value_;
	// 				   console.log(dogName + " Is the Dog's name");
	// 				  // Creating an element to have the Dog Info displayed
	// 			  let dogInfo = $("<p>");
	// 				  // Adding a styling class to dog info 
	// 			aParkName.addClass("styletag");
	// 				  // Adding a data-attribute
	// 			dogInfo.attr("data-dogname", dogName);
	// 				  // Providing the initial button text
	// 			dogInfo.text(dogName);
	// 				//Adding the button to the buttons-view div
	// 			  $("#active").append("Dog's name: " + dogName);
	
	// 				   //GIVES DOG BREED
	// 			   let dogBreed = user.node_.children_.root_.left.left.value.value_;
	// 				   console.log(dogBreed + " Is the Dog's name");
	// 				  // Adding a data-attribute
	// 			dogInfo.attr("data-dogbreed", dogBreed);
	// 				  // Providing the initial button text
	// 			dogInfo.text(dogBreed);
	// 				//Adding the button to the buttons-view div
	// 			  $("#active").append("(" + dogBreed + ", ");
	
	// 				   //GIVES DOG AGE
	// 			   let dogAge = user.node_.children_.root_.left.left.left.value.value_;
	// 				   console.log(dogAge + " Years Old");
	// 				  // Adding a data-attribute
	// 			dogInfo.attr("data-dogbreed", dogAge);
	// 				  // Providing the initial button text
	// 			dogInfo.text(dogAge);
	// 				//Adding the button to the buttons-view div
	// 			  $("#active").append(dogAge + " Years Old)");
	
	// 				  //GIVES TIMES
	
	// 				   //end time minutes No longer need if using code snippet below
	// 			   console.log(user.node_.children_.root_.left.right.left.value);
	
	// 				   //gives start time in UNIX
	// 			   let startTimeU = user.node_.children_.root_.right.right.value.value_;
	// 			   console.log(startTimeU);
	// 				   //reformat time
	// 			   startTimeMJS = moment(startTimeU, 'X').format("hh:mm a");
	// 			console.log("START TIME IS " + startTimeMJS);
	// 				  // Providing the text
	// 			dogInfo.text(startTimeMJS);
	// 				//Adding the test to the div
	// 			  $("#active").append("Arrival: " + startTimeMJS);
	// 	   });
	// 	});
	// };



 //  }); // ENDS doc.ready
