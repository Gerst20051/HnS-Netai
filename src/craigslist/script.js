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

function getCities(){
	$.each(window.cities, function(i,city){
		$.get("cycles.php", {city:window.cities[i]}, function(response){
			if (0 < response.length) {
				$("#main").append('<br/><br/><div class="city">' + window.cities[i].toUpperCase() + "</div><br/>" + response);
			}
		}, 'html');
	});
}

$(document).ready(getCities);