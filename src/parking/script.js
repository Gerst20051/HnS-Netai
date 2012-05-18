window.$ && main() || (function() {
	var jquery = document.createElement("script");
	jquery.setAttribute("type","text/javascript");
	jquery.setAttribute("src","jquery.js");
	jquery.onload = main;
	jquery.onreadystatechange = function() {
		if (this.readyState == "complete" || this.readyState == "loaded") main();
	};
	(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(jquery);
})();

function main() {
aC = {
title: "Passport Parking",
results: [],
init: function(){
	$.get('ajax.php', {body:true}, function(response) {
		$("body").html(response);
		$("#in input").focus();
		aC.checkResults();
		setInterval("aC.checkResults()",5000);
	});
},
onKeyDown: function(e){
	var keyCode = e.keyCode || e.which;
	if (keyCode == 13) {
		var calc = $("#in input").val();
		var answer = eval(calc);
		var result = {0:0,1:calc,2:answer};
		aC.results.push(result);
		$("#in input").val('');
		aC.addResult(result);
		$.post('ajax.php', {input:calc,output:answer});
	}
},
checkResults: function(){
	$.getJSON('ajax.php', {data:aC.results.length}, function(response) {
		$.each(response, function(i,v) {
			aC.results.push(v);
			aC.addResult(v);
		});
	});
},
addResult: function(r){
	$("#results").append('<li><span id="calc">'+r[1]+'</span><span id="op">=</span><span id="answer">'+r[2]+'</span></li>');
}
};

$(document.documentElement).keydown(aC.onKeyDown);
$(document).ready(function(){ aC.init();

});

return true;
}