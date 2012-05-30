window.$&&main()||function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","jquery.js");a.onload=main;a.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded")main()};(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(a)}();

function main(){
window.aC = {
title: "HnS User",
logged: false,
loginFocus: false,
registerFocus: false,
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
	$.getJSON("ajax.php", {action:"userdata",apikey:"hnsapi"}, function(response){
		aC.user = response;
		if (aC.user.middlename != "") aC.user.fullname = aC.user.firstname+' '+aC.user.middlename+' '+aC.user.lastname;
		else aC.user.fullname = aC.user.firstname+' '+aC.user.lastname;
	});
	$(document.body).html('Logged In | <a class="logoutLink">Logout</a>');
},
loggedOut: function(){
	$.get("ajax.php", {action:"hnsuser",apikey:"hnsapi"}, function(response){
		$(document.body).html(response).find('#hnsuser').center().parent().hide().css('visibility','visible').fadeIn('slow');
	});
},
login: function(){
	var e = false, username = $("#lusername"), password = $("#lpassword");
	if ($.trim(username.val()) == "") { username.addClass('error'); e = true; } else username.removeClass('error');
	if ($.trim(password.val()) == "") { password.addClass('error'); e = true; } else password.removeClass('error');
	if (!e) {
		$("#f_login").find("input,textarea,select,:radio").attr('disabled',true);
		var output = {}, inputs = $("#f_login").find("input").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		output.password = secure('hns'+output.password);
		$.post("ajax.php", {action:"login",form:output,apikey:"hnsapi"}, function(response){
			if (stringToBoolean(response.logged)) aC.logged = true;
			if (aC.logged === false) $("#f_login").find("input,textarea,select,:radio").attr('disabled',false);
			else aC.loggedIn();
		});
	}
},
logout: function(){
	$.post("ajax.php", {action:"logout",apikey:"hnsapi"}, function(response){
		if (!stringToBoolean(response.logged)) {
			aC.logged = false;
			aC.user = {};
		}
	});
},
regValidate: function(){
	var e = false,
	username = $("#reg_username"), username_trim = $.trim(username.val()),
	password = $("#reg_password"), password_trim = $.trim(password.val()),
	name = $("#reg_name"), name_trim = $.trim(name.val()),
	email = $("#reg_email"), email_trim = $.trim(email.val()),
	city = $("#reg_city"), city_trim = $.trim(city.val()),
	bmonth = $("#reg_bmonth"),
	bday = $("#reg_bday"),
	byear = $("#reg_byear"),
	usernameReg = /\W/,
	nameReg = /[A-Za-z'-]/,
	emailReg = /^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}?$/i;

	if (username_trim == "") { username.addClass('error'); e = true; }
	else if (usernameReg.test(username_trim)) { username.addClass('error'); e = true; }
	else { aC.checkUsername(username_trim); if (username.hasClass('error')) e = true; }
	if (password_trim == "") { password.addClass('error'); e = true; } else password.removeClass('error');

	if (name_trim == "") { name.addClass('error'); e = true; }
	else if (!nameReg.test(name_trim)) { name.addClass('error'); e = true; }
	else if (name_trim.split(' ').length < 2) { name.addClass('error'); e = true; } else name.removeClass('error');

	if (email_trim == "") { email.addClass('error'); e = true; }
	else if (!emailReg.test(email_trim)) { email.addClass('error'); e = true; } else email.removeClass('error');

	if (city_trim == "") { city.addClass('error'); e = true; } else city.removeClass('error');
	if (bmonth.val() == 0) { bmonth.addClass('error'); e = true; } else bmonth.removeClass('error');
	if (bday.val() == 0) { bday.addClass('error'); e = true; } else bday.removeClass('error');
	if (byear.val() == 0) { byear.addClass('error'); e = true; } else byear.removeClass('error');
	
	return !e;
},
checkUsername: function(uname){
	uname = $.trim(uname);
	if (uname != "") {
		$.get("ajax.php", {action:"username",username:uname,apikey:"hnsapi"}, function(response){
			if (stringToBoolean(response.user)) $("#reg_username").addClass('error');
			else $("#reg_username").removeClass('error');
		});
	} else $("#reg_username").addClass('error');
},
onKeyDown: function(e){
	var keyCode = e.keyCode || e.which;
	if (aC.logged === false) {
		if (keyCode == keys.ENTER) {
			if (aC.loginFocus) $("#b_login_splash").click();
			else if (aC.registerFocus) $("#b_register").click();
		}
	}
},
dom: function(){
	$("#lusername, #lpassword").live('focus',function(){
		aC.loginFocus = true;
	}).live('blur',function(){
		aC.loginFocus = false;
	});
	$("#b_login_splash").live('click',function(){
		aC.login();
	});
	$("#b_register_splash").live('click',function(){
		$("#register").show();
		$("#login").hide();
		$("#hnsuser").center();
	});
	$("#reg_username, #reg_password, #reg_name, #reg_email, #reg_hometown, #reg_city").live('focus',function(){
		aC.registerFocus = true;
	}).live('blur',function(){
		aC.registerFocus = false;
	});
	$("#reg_username").live('blur',function(){
		aC.checkUsername(this.value);
	});
	$("#b_register").live('click',function(){
		if (!aC.regValidate()) return;
		$("#f_register").find("input,textarea,select,:radio").attr('disabled',true);
		var output = {}, inputs = $("#f_register").find("input,textarea,select,:radio").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		output.password = secure('hns'+output.password);
		$.post("ajax.php", {action:"register",form:output,apikey:"hnsapi"}, function(response){
			if (stringToBoolean(response.logged)) {
				aC.logged = true; aC.loggedIn();
			} else $("#f_register").find("input,textarea,select,:radio").attr('disabled',false);
		});
	});
	$("#b_login").live('click',function(){
		$("#login").show();
		$("#register").hide();
		$("#hnsuser").center();
	});
	$(".logoutLink").live('click',function(){
		aC.logout();
	});
}
};

$(document.documentElement).keydown(window.aC.onKeyDown);
$(document).ready(window.aC.init);

return true;
}