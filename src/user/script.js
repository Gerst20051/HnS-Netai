$w.$&&main()||function(){var a=$d.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","jquery.js");a.onload=main;a.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded")main()};($d.getElementsByTagName("head")[0]||$d.documentElement).appendChild(a)}();

function main(){
$w.aC = {
title: "HnS User Dashboard",
ajaxurl: $host+"ajax.php",
apikey: "hnsapi",
logged: false,
loginFocus: false,
registerFocus: false,
user: {},
init: function(){
	$.getJSON(aC.ajaxurl, {action:"logged",apikey:aC.apikey}, function(response){
		if (response.logged === true) aC.logged = true;
		if (aC.logged === true) aC.loggedIn(); else aC.loggedOut();
	});
	aC.dom();
},
loggedIn: function(){
	if (aC.logged === false) return;
	$.getJSON(aC.ajaxurl, {action:"userdata",apikey:aC.apikey}, function(response){
		if (response.user !== false) {
			aC.user = response.user;
			if (aC.user.middlename != "") aC.user.fullname = aC.user.firstname+' '+aC.user.middlename+' '+aC.user.lastname;
			else aC.user.fullname = aC.user.firstname+' '+aC.user.lastname;
			$($d.body).html('<div>Welcome '+aC.user.fullname+' | <span class="logout-link link">Logout</span></div>');
		} else aC.logout();
	});
},
loggedOut: function(){
	$.get(aC.ajaxurl, {action:"hnsuser",apikey:aC.apikey}, function(response){
		$($d.body).html(response).find('#hnsuser').center().parent().hide().css('visibility','visible').fadeIn('slow');
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
		$.post(aC.ajaxurl, {action:"login",form:output,apikey:aC.apikey}, function(response){
			if (stringToBoolean(response.logged)) aC.logged = true;
			if (aC.logged === false) $("#f_login").find("input,textarea,select,:radio").attr('disabled',false);
			else aC.loggedIn();
		});
	}
},
logout: function(){
	$.post(aC.ajaxurl, {action:"logout",apikey:aC.apikey}, function(response){
		if (!stringToBoolean(response.logged)) {
			aC.logged = false;
			aC.user = {};
			aC.loggedOut();
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
getLocation: function(query){
	var location = "37.76999,-122.44696";
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			location = lat+","+lng;
		}, function(error){
			log("geolocation error: "+error.message);
		}, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
	}
	try {
		$.getJSON("https://maps.googleapis.com/maps/api/place/autocomplete/json", {input:encodeURIComponent(query),location:location,sensor:false,key:"AIzaSyB4AY9CTv5F7wUzhN-FJgIpWWZfbU0AEjM"}, function(response){
			log(response);
		});
	} catch(e) {
		log(e);
	}
},
checkUsername: function(uname){
	uname = $.trim(uname);
	if (uname != "") {
		$.get(aC.ajaxurl, {action:"username",username:uname,apikey:aC.apikey}, function(response){
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
	$(document).on('focus',"#lusername, #lpassword",function(){
		aC.loginFocus = true;
	}).on('blur',"#lusername, #lpassword",function(){
		aC.loginFocus = false;
	});
	$(document).on('click',"#b_login_splash",function(){
		aC.login();
	});
	$(document).on('click',"#b_register_splash",function(){
		$("#register").show();
		$("#login").hide();
		$("#hnsuser").center();
	});
	$(document).on('focus',"#reg_username, #reg_password, #reg_name, #reg_email, #reg_hometown, #reg_city",function(){
		aC.registerFocus = true;
	}).on('blur',"#reg_username, #reg_password, #reg_name, #reg_email, #reg_hometown, #reg_city",function(){
		aC.registerFocus = false;
	});
	$(document).on('blur',"#reg_username",function(){
		aC.checkUsername(this.value);
	});
	$(document).on('keyup',"#reg_hometown",function(){
		aC.getLocation(this.value);
	});
	$(document).on('click',"#b_register",function(){
		if (!aC.regValidate()) return;
		$("#f_register").find("input,textarea,select,:radio").attr('disabled',true);
		var output = {}, inputs = $("#f_register").find("input,textarea,select,:radio").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		output.password = secure('hns'+output.password);
		$.post(aC.ajaxurl, {action:"register",form:output,apikey:aC.apikey}, function(response){
			if (stringToBoolean(response.logged)) {
				aC.logged = true; aC.loggedIn();
			} else $("#f_register").find("input,textarea,select,:radio").attr('disabled',false);
		});
	});
	$(document).on('click',"#b_login",function(){
		$("#login").show();
		$("#register").hide();
		$("#hnsuser").center();
	});
	$(document).on('click',".logout-link",function(){
		aC.logout();
	});
}
};

$($d.documentElement).keydown($w.aC.onKeyDown);
$($d).ready($w.aC.init);

return true;
}