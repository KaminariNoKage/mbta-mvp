(function(){
	'use strict';

	$( document ).ready(function() {
		var DELAY = 30*1000;	// update every 30 seconds

		updateView();
	   setInterval(updateView, DELAY);

	   function updateView(){
	   		setCurrentTime();
			extractCSV(function(data){
				// remove existing
				$('.train').remove();
				// Insert each row into the grid
				data.forEach(makeRow);
			});
	   }

	});

	function setCurrentTime(){
    	var currentTime = new Date();
    	$('#currentDate').html(convertDate(currentTime.getTime()));
    	$('#currentTime').html('Current Time: '+ stringTime(currentTime.getHours(), currentTime.getMinutes()));
	}
	

	function extractCSV(next){
		$.ajax({
	        type: "POST",
	        url: '/checkTrains',
	        success: function (data){
		    	next(data);		
			}
	     });
	}
	
	function makeRow(row, index){
		// creates html element with respective display data
		var elem = $('<div>', { class: 'row train' })
			.append(divify(row.Origin).addClass('wide'))
			.append(divify(row.Destination).addClass('wide'))
			.append(divify(convertTime(row.ScheduledTime, row.Lateness)))
			.append(divify(row.Trip))
			.append(divify(row.Track))
			.append(divify(row.Status));

		$('#grid').append(elem);
	}

	function divify(content){
		return $('<div>'+(content || '')+'</div>');
	}

	function convertTime(time, lateby){
		// Adjust time to include late by (converted to milliseconds)
		var actualTime = (time + lateby)*1000,
			date = new Date(actualTime),
			hour = date.getHours(),
			mins = date.getMinutes();

		return stringTime(hour, mins);		
	}

	function stringTime(hour, mins){
		return ((hour > 12)? hour-12 : hour) +':'+ ((mins < 10)? '0'+mins : mins )+' ' + ((hour>12)? 'PM' : 'AM');
	}

	function convertDate(time){
		var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var date = new Date(time),
			weekday = weekdayNames[date.getDay()],
			month = date.getMonth()+1,
			day = date.getDate(),
			year = date.getFullYear();

		return weekday + '<br>' + month + '-' + day + '-' + year;
	}

})();