$w.$&&main()||function(){var a=$d.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","jquery.js");a.onload=main;a.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded")main()};($d.getElementsByTagName("head")[0]||$d.documentElement).appendChild(a)}();

function main(){
var hns = {
title: "HnS Netai API",
ajaxurl: $host+"ajax.php",
apikey: "",
loaded: false,
logged: false,
loginFocus: false,
registerFocus: false,
user: {},
visible: ["logged","user","go","logout"],
init: function(){
	if (hns.loaded !== false) return;
	$.getJSON(hns.ajaxurl, {action:"init",apikey:hns.apikey}, function(response){
		if (response.logged === true) hns.logged = true;
		$($d.body).append(response.html);
		hns.loaded = true;
	});
	hns.dom();
},
go: function(args){
	if (hns.loaded === false) {
		if (!isDefined(args)) return false;
		var options = ["apikey"];
		for (var index in args) {
			if ($.inArray(index,options) > -1) hns[index] = args[index];
		}
		hns.init();
	}
	if (hns.logged) hns.loggedIn();
	else hns.loggedOut();
},
loggedIn: function(){alert("loggedin");
	if (hns.logged === false) return false;
	$.getJSON(hns.ajaxurl, {action:"userdata",apikey:hns.apikey}, function(response){
		if (response.user !== false) {
			hns.user = response.user;
			if (hns.user.middlename != "") hns.user.fullname = hns.user.firstname+' '+hns.user.middlename+' '+hns.user.lastname;
			else hns.user.fullname = hns.user.firstname+' '+hns.user.lastname;
			$("#hns").parent().css('visibility','hidden');
		} else {
			hns.logout();
			return false;
		}
	});
	return true;
},
loggedOut: function(){alert("loggedout");
	if (hns.logged === true) return false;
	$("#hns").center().parent().hide().css('visibility','visible').fadeIn('slow');
	return true;
},
login: function(){
	var e = false, username = $$("#lusername"), password = $$("#lpassword");
	if ($.trim(username.val()) == "") { username.addClass('error'); e = true; } else username.removeClass('error');
	if ($.trim(password.val()) == "") { password.addClass('error'); e = true; } else password.removeClass('error');
	if (!e) {
		$$("#f_login").find("input,textarea,select,:radio").attr('disabled',true);
		var output = {}, inputs = $$("#f_login").find("input").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		output.password = secure('hns'+output.password);
		$.post(hns.ajaxurl, {action:"login",form:output,apikey:hns.apikey}, function(response){
			if (stringToBoolean(response.logged)) {
				hns.logged = true;
				hns.loggedIn();
				$$("#f_login").clearForm();
			}
			$$("#f_login").clearForm();
			$$("#f_login").find("input,textarea,select,:radio").attr('disabled',false);
		});
	}
},
logout: function(){
	$.post(hns.ajaxurl, {action:"logout",apikey:hns.apikey}, function(response){
		if (!stringToBoolean(response.logged)) {
			hns.logged = false;
			hns.user = {};
			hns.loggedOut();
		}
	});
},
regValidate: function(){
	var e = false,
	username = $$("#reg_username"), username_trim = $.trim(username.val()),
	password = $$("#reg_password"), password_trim = $.trim(password.val()),
	name = $$("#reg_name"), name_trim = $.trim(name.val()),
	email = $$("#reg_email"), email_trim = $.trim(email.val()),
	city = $$("#reg_city"), city_trim = $.trim(city.val()),
	bmonth = $$("#reg_bmonth"),
	bday = $$("#reg_bday"),
	byear = $$("#reg_byear"),
	usernameReg = /\W/,
	nameReg = /[A-Za-z'-]/,
	emailReg = /^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}?$/i;

	if (username_trim == "") { username.addClass('error'); e = true; }
	else if (usernameReg.test(username_trim)) { username.addClass('error'); e = true; }
	else { hns.checkUsername(username_trim); if (username.hasClass('error')) e = true; }
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
		$.get(hns.ajaxurl, {action:"username",username:uname,apikey:hns.apikey}, function(response){
			if (stringToBoolean(response.user)) $$("#reg_username").addClass('error');
			else $$("#reg_username").removeClass('error');
		});
	} else $$("#reg_username").addClass('error');
},
onKeyDown: function(e){
	var keyCode = e.keyCode || e.which;
	if (hns.logged === false) {
		if (keyCode == keys.ENTER) {
			if (hns.loginFocus) $$("#b_login_splash").click();
			else if (hns.registerFocus) $$("#b_register").click();
		}
	}
},
dom: function(){
	$$("#lusername, #lpassword").live('focus',function(){
		hns.loginFocus = true;
	}).live('blur',function(){
		hns.loginFocus = false;
	});
	$$("#b_login_splash").live('click',function(){
		hns.login();
	});
	$$("#b_register_splash").live('click',function(){
		$$("#register").show();
		$$("#login").hide();
		$("#hns").center();
	});
	$$("#reg_username, #reg_password, #reg_name, #reg_email, #reg_hometown, #reg_city").live('focus',function(){
		hns.registerFocus = true;
	}).live('blur',function(){
		hns.registerFocus = false;
	});
	$$("#reg_username").live('blur',function(){
		hns.checkUsername(this.value);
	});
	$$("#reg_hometown").live('keyup',function(){
		hns.getLocation(this.value);
	});
	$$("#b_register").live('click',function(){
		if (!hns.regValidate()) return;
		$$("#f_register").find("input,textarea,select,:radio").attr('disabled',true);
		var output = {}, inputs = $$("#f_register").find("input,textarea,select,:radio").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		output.password = secure('hns'+output.password);
		$.post(hns.ajaxurl, {action:"register",form:output,apikey:hns.apikey}, function(response){
			if (stringToBoolean(response.logged)) {
				hns.logged = true; hns.loggedIn();
			} else $$("#f_register").find("input,textarea,select,:radio").attr('disabled',false);
		});
	});
	$$("#b_login").live('click',function(){
		$$("#login").show();
		$$("#register").hide();
		$("#hns").center();
	});
	$$(".logout-link").live('click',function(){
		hns.logout();
	});
},
expose: function(){
	$w.HNS = {};
	$.each(hns.visible,function(i,v){
		$w.HNS[v] = hns[v];
	});
}
};

$($d).find('.hns').keydown(hns.onKeyDown).end().ready(hns.expose);

return true;
}