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

function getTime(){
	return Math.round(+new Date()/1000);
}

function getHash(){ return decodeURIComponent(window.location.hash.substring(1)); }
function clearHash(){ window.location.replace("#"); }
function setHash(hash){ window.location.replace("#" + encodeURI(hash)); }
function parseHash(){
	var queryString = {};
	getHash().replace(
	    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
	    function($0, $1, $2, $3) { queryString[$1] = $3; }
	);
	return queryString;
}

function main(){
window.aC = {
title: "HnS Quotes",
quotes: [],
search: [],
init: function(){
	HNS.init({"apikey":"hnsapi","logoutaction":true});
	HNS.loggedIn = function(){
		$("#hns-logout-button").show();
		$("#hns-login-button").hide();
		alert("Hello "+HNS.user.fullname+" welcome to our website!");
	};
	HNS.loggedOut = function(){
		$("#hns-login-button").show();
		$("#hns-logout-button").hide();
	};
	aC.handleHash();
	aC.dom();
},
handleHash: function(){
	if (getHash() == "all") {
		$.getJSON("ajax.php", {type:"all",apikey:"hnsapi"}, function(response){
			if ($.isArray(response)) {
				aC.quotes = response;
				var quotes = "";
				$.each(response, function(i,v){
					var quote = v.quote;
					quotes += aC.listQuote(v.id,quote.name,quote.quote);
				});
				$("ul#quotes").html(quotes);
			} else {
				$("ul#quotes").html('<li class="empty">No Quotes</li>');
			}
		});
	} else if (getHash() == "user") {
		$.getJSON("ajax.php", {type:"user",apikey:"hnsapi"}, function(response){
			if ($.isArray(response)) {
				aC.quotes = response;
				var quotes = "";
				$.each(response, function(i,v){
					var quote = v.quote;
					quotes += aC.listQuote(v.id,quote.name,quote.quote);
				});
				$("ul#quotes").html(quotes);
			} else {
				$("ul#quotes").html('<li class="empty">No Quotes</li>');
			}
		});
	} else if (parseHash().id) {
		$.getJSON("ajax.php", {id:parseHash().id,apikey:"hnsapi"}, function(response){
			if ($.isArray(response)) {
				aC.quotes = response;
				var quotes = "";
				$.each(response, function(i,v){
					var quote = v.quote;
					quotes += aC.listQuote(v.id,quote.name,quote.quote);
				});
				$("ul#quotes").html(quotes);
			} else {
				$("ul#quotes").html('<li class="empty">No Quotes</li>');
			}
		});
	} else {
		$.getJSON("ajax.php", {type:"user",apikey:"hnsapi"}, function(response){
			if ($.isArray(response)) {
				aC.quotes = response;
				var quotes = "";
				$.each(response, function(i,v){
					var quote = v.quote;
					quotes += aC.addQuote(v.id,quote.name,quote.quote);
				});
				$("#quotes").html(quotes);
			} else {
				$("#quotes").html('<li class="empty">No Quotes</li>');
			}
		});
	}
},
dom: function(){
	var quotes = $("#quotes");
	$("#showall > span").on('click',function(){
		setHash("all");
		aC.handleHash();
	});
	$("article > header").on('keyup','#search',function(){
		aC.search.splice(0,this.length);
		if (0 < aC.quotes.length){
			$.each(aC.quotes, function(i,v){
				if (-1 < v.name.indexOf($(this).val())) aC.search.push(i);
			});
			$.each(aC.search, function(i,v){
				alert(v);
			});
		}
	});
	$("article > header").on('click','#logoaction',function(){
		var name = $.trim($("article > header #search").val());
		if (name.length == 0 || 0 < aC.search.length) name = "";
		else $("article > header #search").val('');
		var len = aC.quotes.push({"name":name,"quote":""});
		$("ul#quotes").prepend(aC.addQuote(len,name)).find("li:first").fadeIn().find("header").click();
	});
	quotes.on('click','li > header',function(){
		$(this).parent().find('.details').slideToggle('fast');
		if ($(this).find('.more').is(":visible")){
			$(this).find('.more').hide().parent().find('.less').show();
		} else {
			$(this).find('.less').hide().parent().find('.more').show();
		}
	});
	quotes.on('click','.details',function(){
		return false;
	});
	quotes.on('click','.save',function(){
		var target = $(this).parents('li');
		var id = target.attr('id').substring(6);
		var name = target.find('#name').val();
		var quote = target.find('#quote').val();
		aC.quotes[id-1] = {"name":name,"quote":quote};
		$.post("ajax.php", {id:id,quote:aC.quotes[id-1],timestamp:getTime(),type:1,apikey:"hnsapi"}, function(response){
			target.find('.savespan').hide();
		});
		return false;
	});
	quotes.on('click','.undo',function(){
		var target = $(this).parents('li');
		var id = target.attr('id').substring(6);
		var quote = aC.quotes[id-1];
		target.find('.name').html(quote.name);
		target.find('#name').val(quote.name);
		target.find('#quote').val(quote.quote);
		return false;
	});
	quotes.on('click','.delete',function(){
		var target = $(this).parents('li');
		var id = target.attr('id').substring(6);
		var name = target.find('#name').val();
		if (confirm("Are you sure you want to delete "+name+"?")) {
			$.post("ajax.php", {id:id,type:2,apikey:"hnsapi"}, function(response){
				var deleteindex = aC.quotes.length-id+1;
				$("ul#quotes li:eq("+deleteindex+")").remove();
			});
			aC.quotes.splice(id-1,1);
			if (aC.quotes.length == 0) $("ul#quotes").html('<li class="empty">No Quotes</li>');
		}
		return false;
	});
	quotes.on('change','li input',function(){
		$(this).parents('li').find('.savespan').show();
	}).on('click','input',function(){
		$(this).select();
	});
	quotes.on('change','textarea',function(){
		alert("hey");
		$(this).parents('li').find('.savespan').show();
	}).on('click','textarea',function(){
		$(this).select();
	});
	quotes.on('keyup','input#name',function(){
		var name = $(this).val();
		if (name == "") name = "No Name";
		$(this).parents('li').find('.name').html(name);
	});
},
addQuote: function(id,name,quote){
	if (aC.quotes.length < 2) $("ul#quotes").find('.empty').remove();
	var html = '<li id="quote-'+id+'">';
	if (arguments.length == 2){ html = '<li id="quote-'+id+'" class="new">'; if ($.trim(name) == "") name="New Quote"; quote=""; }
	html += '<header><aside class="links"><span class="savespan"><a href="#" class="save">save</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#" class="undo">undo</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a href="#" class="more">more</a><a href="#" class="less">less</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#" class="delete">delete</a></aside><aside class="name">'+name+'</aside></header>';
	html += '<div class="details">';
	html += '<div><label for="name">name</label><input id="name" type="text" value="'+name+'"/></div>';
	html += '<div><label for="quote">quote</label><textarea id="quote">'+quote+'</textarea></div>';
	html += '</div></li>';
	return html;
},
listQuote: function(id,name,quote){
	if (aC.quotes.length < 2) $("ul#quotes").find('.empty').remove();
	var html = '<li id="quote-'+id+'"><div class="quotelist">';
	html += '<div class="quotename"><h2>'+name+'</h2></div>';
	html += '<div class="quotequote">"'+quote+'"</div>';
	html += '</div></li>';
	return html;
}
};

$(document).ready(window.aC.init);

return true;
}