window.$&&main()||function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","jquery.js");a.onload=main;a.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded")main()};(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(a)}();

function main(){
window.aC = {
title: "HnS User",
logged: false,
user: {},
init: function(){
	$.getJSON("ajax.php", {action:"logged",apikey:"hnsapi"}, function(response){
		if (response.logged === true) aC.logged = true;
		if (aC.logged === true) aC.loggedIn(); else aC.loggedOut();
	});
	aC.dom();
},
loggedIn: function(){
	if (aC.logged === false) return;
	$.getJSON('ajax.php', {p:"userdata"}, function(response) {
		aC.user = response;
		if (aC.user.middlename != "") aC.user.fullname = aC.user.firstname+' '+aC.user.middlename+' '+aC.user.lastname;
		else aC.user.fullname = aC.user.firstname+' '+aC.user.lastname;
	});
	$(document.body).html('Logged In');
},
loggedOut: function(){
	$(document.body).html('Logged Out');
},
login: function(){
	var e = false, username = $("#lusername"), password = $("#lpassword");
	if ($.trim(username.val()) == "") { username.addClass('error'); e = true; } else username.removeClass('error');
	if ($.trim(password.val()) == "") { password.addClass('error'); e = true; } else password.removeClass('error');
	if (!e) {
		$('#f_login input').attr('disabled',true);
		$.post("ajax.php", {login:true,username:$.trim(username.val()),password:secure('hns'+$.trim(password.val()))}, function(response){
			if (aC.stringToBoolean(response)) aC.logged = true;
			if (!aC.logged) $('#f_login input').attr('disabled',false);
			else aC.loggedIn();
		});
	}
},
logout: function(){
	$.post('ajax.php', {action:"logout"}, function(){
		aC.logged = false;
		aC.user = {};
	});
},
regValidate: function(){
	var e = false,
	username = $("#reg_username"),
	password = $("#reg_password"),
	name = $("#reg_name"),
	email = $("#reg_email"),
	city = $("#reg_city"),
	hometown = $("#reg_hometown"),
	bmonth = $("#reg_bmonth"),
	bday = $("#reg_bday"),
	byear = $("#reg_byear"),
	usernameReg = /\W/,
	nameReg = /[A-Za-z'-]/,
	emailReg = /^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}?$/i;

	if ($.trim(username.val()) == "") { username.addClass('error'); e = true; }
	else if (usernameReg.test($.trim(username.val()))) { username.addClass('error'); e = true; }
	else { aC.checkUsername($.trim(username.val())); if (username.hasClass('error')) e = true; }
	if ($.trim(password.val()) == "") { password.addClass('error'); e = true; } else password.removeClass('error');

	if ($.trim(name.val()) == "") { name.addClass('error'); e = true; }
	else if (!nameReg.test($.trim(name.val()))) { name.addClass('error'); e = true; }
	else if ($.trim(name.val()).split(' ').length < 2) { name.addClass('error'); e = true; } else name.removeClass('error');

	if ($.trim(email.val()) == "") { email.addClass('error'); e = true; }
	else if (!emailReg.test($.trim(email.val()))) { email.addClass('error'); e = true; } else email.removeClass('error');

	if ($.trim(city.val()) == "") { city.addClass('error'); e = true; } else city.removeClass('error');
	if (bmonth.val() == 0) { bmonth.addClass('error'); e = true; } else bmonth.removeClass('error');
	if (bday.val() == 0) { bday.addClass('error'); e = true; } else bday.removeClass('error');
	if (byear.val() == 0) { byear.addClass('error'); e = true; } else byear.removeClass('error');
	
	return !e;
},
checkUsername: function(uname){
	if (uname != "") {
		$.get('ajax.php', {p:"username",username:uname}, function(response){
			if (aC.stringToBoolean(response)) $("#reg_username").addClass('error');
			else $("#reg_username").removeClass('error');
		});
	} else $("#reg_username").addClass('error');
},
onKeyDown: function(e){
	var keyCode = e.keyCode || e.which;
	if (aC.logged === false) {
		if (keyCode == 13) {
			if (aC.loginFocus) $("#b_login_splash").click();
			else if (aC.registerFocus) $("#b_register").click();
		}
	}
},
dom: function(){
	
},
};

$(document).ready(window.aC.init);

return true;
}