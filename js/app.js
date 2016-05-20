$(document).ready(function(){
	//Device event listener
	document.addEventListener('deviceready', onDeviceReady, false);

});
function onDeviceReady(){
	console.log("hi from space");
	$('#show_more_location').click(function(e){
		e.preventDefault();
		getMoreLocation();
	});
	$('#clear_info').click(function(e){
		e.preventDefault();
		clearInfo();
	});
	$('#other_location').submit(function(e){
		e.preventDefault();
		getOtherLocation();
	});
	getDate(); 
	getLocation();
}
//get current date
function getDate(){
	var currentdate =new Date();
	var dateTime = currentdate.getDate() + '/'
				+  (currentdate.getMonth()+1)+'/'
				+	currentdate.getFullYear()+' @ '
				+	currentdate.getHours()+':'
				+	currentdate.getMinutes()+':'
				+	currentdate.getSeconds();
	$("#datetime_display").html(dateTime);
}
//get user loaction
function getLocation(){
	console.log("getting location");
	navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var city = '';
		var state = '';
		var html = '';

		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
			datatype: 'jsonp',
			success: function(response){
				city = response.results[0].address_components[2].long_name;
				state = response.results[0].address_components[4].short_name;
				html = '<h1>'+city+', '+state+'</h1>';
				$('#myLocation').html(html);

				//get weather info
				getWeather(city, state);
				$('#show_more_weather').click(function(e){
					e.preventDefault();
					//close dropdown
					$('.navbar-toggle').click();
					getMoreWeather(city, state);
				});
			}
		});
	});
}
//get some extra location info
function getMoreLocation(){
	console.log("getting more location info");

	//close dropdown
	$('.navbar-toggle').click();

	var html = '';
	navigator.geolocation.getCurrentPosition(function(position){
		html = '<ul id="more_location_list" class="list-group">'+
				'<li class="list-group-item"><strong>Latitude  : </strong>'+position.coords.latitude+'</li>'+
				'<li class="list-group-item"><strong>Longitude : </strong>'+position.coords.longitude+'</li>'+
				'<li class="list-group-item"><strong>Altitude  : </strong>'+position.coords.altitude+'</li>'+
				'<li class="list-group-item"><strong>Acuuracy  : </strong>'+position.coords.accuracy+'</li></ul>';
		$('#more_location_display').html(html);
	});
}

function getWeather(city, state){
	console.log("weather for:"+city);
	var html = '';
	$.ajax({
		url: "http://api.wunderground.com/api/3f102a095eb841bb/conditions/q/"+state+"/"+city+".json",
		datatype: 'jsonp',
		success: function(parsedjson){
			console.log(parsedjson);

			weather = parsedjson['current_observation']['weather'];
			tempString = parsedjson['current_observation']['temperature_string'];
			iconUrl = parsedjson['current_observation']['icon_url'];

			html = '<h1 class="text-center"><img src="'+iconUrl+'"> '+weather+'</h1>'
				+	'<h2 class="text-center">'+tempString+'</h2>';
			$("#weather").html(html);
		}
	});
}
//display more weather info
function getMoreWeather(city, state){
	console.log("getting more weather");
	var html = '';
	$.ajax({
		url: "http://api.wunderground.com/api/3f102a095eb841bb/conditions/q/"+state+"/"+city+".json",
		datatype: 'jsonp',
		success: function(parsedjson){
			feelString = parsedjson['current_observation']['feelslike_string'];
			dewpString = parsedjson['current_observation']['dewpoint_string'];
			windString = parsedjson['current_observation']['wind_string'];
			relHumidit = parsedjson['current_observation']['relative_humidity'];

			html = '<ul id="more_weather_list" class="list-group">'+
				'<li class="list-group-item"><strong>Feels Like  		: </strong>'+feelString+'</li>'+
				'<li class="list-group-item"><strong>Dewpoint    		: </strong>'+dewpString+'</li>'+
				'<li class="list-group-item"><strong>Wind 		 		: </strong>'+windString+'</li>'+
				'<li class="list-group-item"><strong>Relative Humidity  : </strong>'+relHumidit+'</li></ul>';
			$('#more_weather_display').html(html);
		}
	});
}
//Clear additional information
function clearInfo(){
	getLocation();
	$('.navbar-toggle').click();
	$('#more_weather_display').html('');
	$('#more_location_display').html('');
	$('#city').val('');
	$('#state').val('');
}
//getting other location information
function getOtherLocation(){
	$('#more_weather_display').html('');
	$('#more_location_display').html('');
	city = $('#city').val();
	state= $('#state').val();
	var html = '';
	html = '<h1>'+city+', '+state+'</h1>';
	$('#myLocation').html(html);
	getWeather(city, state);
	$('#show_more_weather').click(function(e){
		e.preventDefault();
		//close dropdown
		$('.navbar-toggle').click();
		getMoreWeather(city, state);
	});
}