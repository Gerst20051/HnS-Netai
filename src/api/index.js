window.$ && main() || (function(){
	var j = document.createElement("script");
	j.setAttribute("type","text/javascript");
	j.setAttribute("src","jquery.js");
	j.onload = main;
	j.onreadystatechange = function(){
		if (this.readyState == "complete" || this.readyState == "loaded") main();
	};
	(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(j);
})();

function main(){
window.aC = {
title: "HnS Netai API",
init: function(){
	aC.dom();
},
dom: function(){
	$("article > header #logoaction").live('click',function(){
		alert("Submit App");
		/*
		var subject = $.trim($("#subject").val()), message = $.trim($("#message").val());
		if (subject == "" || message == "") return;
		$.post("ajax.php", {subject:subject,message:message,apikey:"hnsapi"}, function(response){

		});
		*/
	});
}
};

$(document).ready(window.aC.init);

return true;
}