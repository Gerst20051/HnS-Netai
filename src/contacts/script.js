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
title: "HnS Contacts",
contacts: [],
search: [],
init: function(){
	$.getJSON("ajax.php", {apikey:"hnsapi"}, function(response){
		aC.contacts = response;
		var contacts = "";
		$.each(response, function(i,v){
			contacts += aC.addContact(i,v.name,v.number,v.email);
		});
		$("ul#contacts").html(contacts);
	});
	aC.dom();
},
dom: function(){
	$("article > header #search").live('keyup',function(){
		aC.search.splice(0,this.length);
		if (aC.contacts.length > 0){
			$.each(aC.contacts, function(i,v){
				if (v.name.indexOf($(this).val()) > -1) aC.search.push(i);
			});
			$.each(aC.search, function(i,v){
				alert(v);
			});
		}
	});
	$("article > header #createcontact").live('click',function(){
		// Check for search content and seach results length. if not empty and results = 0 use term as name.
		var len = aC.contacts.push({"name":"","number":"","email":""});
		$("ul#contacts").prepend(aC.addContact(len,true)).find("li:first").fadeIn();
	});
	$("ul#contacts li").live('click',function(){
		$(this).find('.details').slideToggle('fast');
		if ($(this).find('.more').is(":visible")){
			$(this).find('.more').hide().parent().find('.less').show();
		} else {
			$(this).find('.less').hide().parent().find('.more').show();
		}
	});
	$("ul#contacts li .details").live('click',function(){
		return false;
	});
	$("ul#contacts li .save").live('click',function(){
		var target = $(this).parents('li');
		var id = target.attr('id').substring(8);
		var name = target.find('#name').val();
		var phone = target.find('#phone').val();
		var email = target.find('#email').val();
		aC.contacts[id-1] = {"name":name,"number":phone,"email":email};
		$.post("ajax.php", {id:id,contact:aC.contacts[id-1],type:1,apikey:"hnsapi"}, function(response){
			alert("updated");
		});
	});
	$("ul#contacts li .delete").live('click',function(){
		var target = $(this).parents('li');
		var id = target.attr('id').substring(8);
		var name = target.find('#name').val();
		if (confirm("Are you sure you want to delete "+name+"?")) alert(name+" deleted");
		aC.contacts.splice(id-1,1);
		
		$.post("ajax.php", {id:id,type:2,apikey:"hnsapi"}, function(response){
			alert("deleted");
		});
		return false;
	});
	$("ul#contacts li input").live('change',function(){
		$(this).parents('li').find('.savespan').show();
	});
	$("ul#contacts li input#name").live('keyup',function(){
		var name = $(this).val();
		if (name == "") name = "No Name";
		$(this).parents('li').find('.name').html(name);
	});
},
addContact: function(id,name,number,email){
	var html = '<li id="contact-'+id+'">';
	if (name === true){ var html = '<li id="contact-'+id+'" class="new">'; name="New Contact"; number=""; email=""; }
	html += '<header><aside class="links"><span class="savespan"><a href="#" class="save">save</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a href="#" class="more">more</a><a href="#" class="less">less</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#" class="delete">delete</a></aside><aside class="name">'+name+'</aside></header>';
	html += '<div class="details">';
	html += '<div><label for="name">name</label><input id="name" type="text" value="'+name+'"/></div>';
	html += '<div><label for="phone">phone</label><input id="phone" type="text" value="'+number+'"/></div>';
	html += '<div><label for="email">email</label><input id="email" type="email" value="'+email+'"/></div>';
	html += '</div></li>';
	return html;
}
};

$(document).ready(window.aC.init);

return true;
}