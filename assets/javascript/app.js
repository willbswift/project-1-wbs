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
                var APIKey = "166a433c57516f51dfab1f7edaed8413";
                var queryURL = "https:api.openweathermap.org/data/2.5/weather?zip=" + zipInput + ",us&units=imperial&appid=" + APIKey;
                $.ajax({
                  url: queryURL,
                  method: "GET"
                }).then(function(response) {
                    // console.log("response object: ", response);
                    let temperature = response.main.temp;
                    let roundedT = Math.round(temperature);
                    $("#temp").prepend("<p>" + roundedT + " &#8457;</p>")

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
        // console.log("our url to send to places is "+ latLngUrl);
        	//Code to console log data of nearby parks
        // console.log(result);

            //grab and console log out name of park #2 as a test
		let name = result.results[1].name;
    		// console.log(name);
    		//grab and console log out Place ID of park #2 as a test
    	place_id = result.results[1].place_id;
    		// console.log(place_id);
    		 //grab and console log out Address of park #2 as a test
    	address = result.results[1].vicinity;
    		// console.log(address);

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
				e.preventDefault();

	        $(".userdiv").show();
			$(".listdiv").hide();

/*
//***grab park info for submissionf
			parkName = parkName;
				console.log("Park picked is " + parkName);
			parkLocation = parkLocation;
			parkLatLong = ;
*/
	        console.log("park button info: ", e.currentTarget.dataset.id);
	        
	        let selectedParkLL = JSON.parse(e.currentTarget.dataset.id);
	        markerArray.push(selectedParkLL);

	        createMarker(markerArray);
		});

		};

	};

//------Function to make Inactive Park List and present it-------

	function printInactiveParks (i, result) {

			//report which the index number of the current park
		console.log("Park Index #: " + i);

			//grab and console log out name of park
      	name = result.results[i].name;
      		console.log("Inactive Park Name: " + result.results[i].name);

		  	// Then dynamically generating buttons for each movie in the array
		  	// This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          	// Creating an element to have the name displayed
      	let parkName = $("<button>");
				// Adding a class of movie-btn to our button
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
      	    console.log("Below is Park Object"); 
      	    //console.log(selectedParkObj);
			//Adding a data-attribute with the place ID.  
		parkName.attr("data-id", selectedParkObj);
			//test to see if it works
		//let value = $(parkName).attr("data-id")
			//console.log("Retrieved Place ID " + value)

			//grab and console log out Place ID of park
      	let placeLL = result.results[i].geometry.location;
      	    console.log("Inactive Park Latitude/Longitude below");
      	    console.log(placeLL);
			//Adding a data-attribute with the place ID.  
		parkName.attr("data-ll", placeLL);
			//test to see if it works
			valuell = $(parkName).attr("data-ll");
			console.log(valuell);

			//Grabbing and console logging the address data
      	let address = result.results[i].vicinity;
      	    console.log("Inactive Park Address: " + address);
          	// Creating an element to have the name displayed
      	let addressOut = $("<p>");
		  	// Adding a data-attribute
		addressOut.attr("data-address", address);
		  	// Providing the initial button text
		addressOut.text(address);
			//Adding the button to the buttons-view div
  		$("#inactive").append(addressOut);



//***with links to that parks' Google Map / Google Locations page??

	}; //close for print inactive parks




//----------------------------------------------------------------

/*
	const getLocationID = place_id => {
		let queryURL = "***place_id***"
		$.get(queryURL)
			//we store the retrieved data in an object called Response
		.then(response => {
			console.log("Place ID: " + response.results[i].photos.place_id);
			console.log("Name: " + response.results[i].name);
			console.log("Address: " + response.results[i].vicinity);
		});
	}
		//call function
	getLocationID("place_id");
*/ 

//Code that presents links to that parks' Google Map / Google Locations page




	//Initialize Map
	let map;
	function initMap() {
        console.log(document.getElementById('map'))
	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 30.2604, lng: -97.7145},
	    zoom: 14,
	    disableDefaultUI: true,
      });
      console.log("map exists!")
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

// -----Code to get current time --------------------------------

		// Current Time
	let currentTime = moment();
	let currentTimeM = moment(currentTime).format("MM DD hh:mm a");
	let currentTimeU = moment(currentTime).format("X");
		// console.log("Current Time: " + currentTimeM);
		// console.log("Current Unix Time (sec): " + currentTimeU);




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
			// console.log("UNIX Start Time Below");
			// console.log(startTimeU);
			// console.log("Start Time U: " + startTimeU);

		let endTime = moment().hour(endTimeH).minute(endTimeM).format("dddd, MMMM Do YYYY, h:mm:ss a");
		let endTimeU = moment().hour(endTimeH).minute(endTimeM).format("X");
			// console.log("UNIX End Time Below");
			// console.log(endTimeU);
			// console.log("End Time U: " + endTimeU);

			// console.log("Park picked is " + parkName);
			// console.log("Start Location ID is " + parkLocation);
			// console.log("Start Time is " + startTimeH+":"+startTimeM);
			// console.log("End Time is " + endTimeH+":"+endTimeM);
			// console.log("Dog Name is " + dogName);
			// console.log("Dog Breed is " + dogBreed);
			// console.log("Dog Age is " + dogAge);

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

			//Code to console log Active Parks/Users to the Console
		// console.log("Park picked is (D) " + parkNameD);
		// console.log("Start Location ID is (D) " + parkLocationD);
		// console.log("Start Time is (D) " + startTimeHD+":"+startTimeMD);
		// console.log("UNIX Start Time Below");
		// console.log(startTimeUD);
		// console.log("End Time is (D) " + endTimeHD+":"+endTimeMD);
		// console.log("UNIX End Time Below");
		// console.log(endTimeUD);
		// console.log("Dog Name is (D) " + dogNameD);
		// console.log("Dog Breed is (D) " + dogBreedD);
		// console.log("Dog Age is (D) " + dogAgeD);

		// If any errors are experienced, log them to console.
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	}); // ENDS database /dogday retrieval 



 //  }); // ENDS doc.ready



/*
//***Code to get factoids and pics of available dog. 
//---------------Compare Lists Function -------------------------
//***function to compare locations on list to Active Park List
function listCompare () {
//code to pull the start time and end time for a user out of Firebase
		// Start Time
	startTime = moment(startTime, "MM DD hh:mm a")
	startTimeU = moment(startTime, "X")
		console.log("Start Time: " + startTime);
		// End Time
	endTime = moment(endTime, "hh:mm a")
	endTimeU = moment(endTime, "X")
		console.log("End Time: " + endTime);
/*
db.ref('/dogday').once('value', users =>{
 users.forEach(user => {
    // doing whatever with user.val()
  })
})
		//loop to go through every available park
	for (let i = 0; i <= numberOfParks - 1; i++) {
			//loop to go through every active user
		for (let j = 0; j <= ***OBJECTOFUSERS*** .length;; j++) {
//(so that users with less then 15 min on the clock will be excluded)
				//grabs the place_id of the current location 
			let locationPark = ***results[i].photos.place_id***
				//if the pulled location and and active location match then this triggers
			if (locationParks === ***[j]parkLocation*** ) {
					//if time hasn't expired on potential customer
				if (currentTimeU <= endTimeU - 900) {
					console.log("ACTIVE");
						//function to print Active parks to the screen 
					printActivePark("locationPark");
				}
					//Code to delete expired users
				else  {
//***delete user object code goes here - see REMOVE function
	Research "Remove"
					console.log("Expired / Delete");
			}
				//if the the current pulled park is inactive then this prints it to the correct div
			else {
					//function to print Inactive parks to the screen 
				printInactiveParks(i);
			};
		};
		}
};
// --------------------------------------------------------------
//***Function to make Active Park and present it
	//input needs to have these in the following format "ChIJA8_mGihJW4YRtjhgLrRTGk0"
	function printActivePark (place_id) {
			//console log the place_id
		console.log(place_id);
/*
3rd call:
If a park exists, then collect the places ID. To retrieve a place by ID:
https://maps.googleapis.com/maps/api/place/details/json?key=APIKEY=PLACEID
Example:
https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyAjOzz5XzUwhDvQ7JNpCTWs1v4dqfDbtZI&placeid=ChIJsfdtb3NJW4YRBKOsEYLvMU8
//***Generate key request for JSON object list of parks
		let parkIDUrl = "***";
		parkIDUrl += '?' + $.param({
		   'key': " *** ",
		   		//your place_id goes here
		   'location': place_id,
		});
			console.log(parkIDUrl);
		$(document).ready(function () {
		   	$.ajax({
		       url: parkIDUrl,
		       method: 'GET',
		       //***we store the retrieved data in an object called "result"
		   	}).done(function (activePark) {
					//test data extraction
					//***Code to console log data of nearby parks
		       	console.log(activePark);
		            //grab and console log out name of park 
				let name = activePark.results[0].name;
		    		console.log("Name of Active Park: ", name);
					// Then dynamically generating buttons for each movie in the array
				  	// This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
		          	// Creating an element to have the name displayed
		      	let parkName = $("<button>");
					// Adding a class of movie-btn to our button
				parkName.addClass("parkbutton");
				  	// Adding a data-attribute
				parkName.attr("data-name", name);
				  	// Providing the initial button text
				parkName.text(name);
					//Adding the button to the buttons-view div
		  		$("#active").append(parkName);
		    		 //grab and console log out Address of park
		    	address = activePark.results[0].vicinity;
		    		console.log("Active Address: ", address);
				  	// Then dynamically generating buttons for each movie in the array
				  	// This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
		          	// Creating an element to have the name displayed
		      	let addressOut = $("<p>");
				  	// Adding a data-attribute
				addressOut.attr("data-address", address);
				  	// Providing the initial button text
				addressOut.text(address);
					//Adding the button to the buttons-view div
		  		$("#active").append(addressOut);
		  			// Adding a data-attribute
				place_id.attr("data-ID", place_id);
				$("#active").append(place_id);
//***with links to that parks' Google Map / Google Locations page
			   	}).fail(function (e) {
			       throw e;
			   	});
		});
	};
//Code to present available dog and other user end time at active park
		let dogName = ***
			console.log("Waiting Dog" + dogName);
		$(".needfriend").text(dogName + "needs a friend!");
		let endtime = ***
		endtime = moment(endtime, "hh:mm a")
			console.log("end time of other user: " + endtime);
		$(".endtime").text("Will be there till: " + endtime);
*/