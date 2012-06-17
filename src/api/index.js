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
	/*
	$("article > header #logoaction").live('click',function(){
		var subject = $.trim($("#subject").val()), message = $.trim($("#message").val());
		if (subject == "" || message == "") return;
		$.post("ajax.php", {subject:subject,message:message,apikey:"hnsapi"}, function(response){

		});
	});
	$("#message").live('focus',function(){
		if ($(this).val() == "Enter your message here.") $(this).val('');
	}).live('blur',function(){
		if ($.trim($(this).val()) == "") $(this).val('Enter your message here.');
	})
	*/
}
};

$(document).ready(window.aC.init);

return true;
}