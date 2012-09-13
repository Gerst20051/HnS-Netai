window.currCity = 0;
window.cities = [
	'asheville',
	'athensohio',
	'blacksburg',
	'boone',
	'charlestonwv',
	'charlotte',
	'charlottesville',
	'danville',
	'eastky',
	'eastnc',
	'martinsburg',
	'fayetteville',
	'fredericksburg',
	'greensboro',
	'harrisonburg',
	'hickory',
	'huntington',
	'lynchburg',
	'morgantown',
	'parkersburg',
	'raleigh',
	'richmond',
	'roanoke',
	'swv',
	'swva',
	'tricities',
	'wv',
	'westmd',
	'winchester',
	'winstonsalem'
];

function getCity(){
	if (window.currCity == window.cities.length) return;
	$.get("cycles.php", {city:window.cities[window.currCity++]}, function(response){
		if (0 < response.length) {
			$("#main").append('<br/><br/><div class="city">' + window.cities[window.currCity-1].toUpperCase() + "</div><br/>" + response);
		}
		getCity();
	}, 'html');
}

$(document).ajaxError(function(){
	window.currCity--;
	getCity();
});

$(document).ready(getCity);