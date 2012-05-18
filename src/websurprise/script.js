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

function getTime(){
	return Math.round(+new Date()/1000);
}

function main(){
window.aC = {
title: "Web Surprise",
lastUpdate: 0,
init: function(){
	$.get('ajax.php', {body:true}, function(response){
		$("body").html(response);
		$("#in input").focus();
		aC.lastUpdate = getTime();
		aC.pingServer();
		setInterval("aC.pingServer()",5000);
	});
},
onKeyDown: function(e){
	var keyCode = e.keyCode || e.which;
	if (keyCode == 13){
		var website = $.trim($("#in input").val());
		if (website.length > 0){
			aC.lastUpdate = getTime();
			$("#in input").val('');
			$.post('ajax.php', {input:website,timestamp:aC.lastUpdate});
		}
	}
},
pingServer: function(){
	$.getJSON('ajax.php', {timestamp:aC.lastUpdate}, function(response){
		if (response){
			aC.lastUpdate = response["timestamp"];
			window.open(response["website"]);
		}
	})
}
};

$(document.documentElement).keydown(window.aC.onKeyDown);
$(document).ready(window.aC.init);

return true;
}