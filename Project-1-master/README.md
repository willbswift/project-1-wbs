# Pups-Parks-n-Playdates

A puppy playdate mobile app that utilizes Firebase, Moment, and API calls to Google Maps, Google Places, and OpenWeatherMaps.


## Description

   This mobile-first app allows users to plan outings with their dog to nearby parks.

   After entering their zipcode, the user will see brief weather info and a list of local parks(rendered as buttons) with their addresses.  Once a park button is clicked, the app will render a map with a marker, as well as a list of other users already at that park.

   Each user's input will include their dog's name, age, breed, and the times at which they will be at the park.  This allows users to better plan their pup's outing, as they will be able to see what breeds of dogs will be present for their dog to interact with. This can also be used to avoid populated parks if their pup doesn't play well with others.

   The user can then click a button to confirm that they plan to go to the selected park, which will bring up a form to input their own dog's information and time they plan to be there.  After their information is entered, others will be able to see their info populated in that park.

## Back End Components

 - Google Maps API
 - Google Places API
 - OpenWeatherMap API
 - Firebase
 - Moment
 - Jquery
 - JSON
 - Javascript
 - CSS
 - HTML

## Future Development:

 - Back buttons will be added for easier "page" navigation
 - Dropdown menu will be added to park list "page" to toggle between "all parks" and "parks with pups" 
 - Users will be deleted from Firebase database when their park session ends (or alternatively, at the end of each day)
 - User authentication
      - Allow users to create profile
      - Upload pics
      - Description of dog (temperament,likes/dislikes, etc.)
      - Allow users to coordinate and plan future pup playdates
      - Allow users to store favorite parks
      - Allow users to "friend" other users

