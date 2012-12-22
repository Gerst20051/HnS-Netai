(function(window, document, $, undefined){
($ && main($) && jQueryPlugins()) || !function(){
	var s = document.createElement("script"), h = document.head || document.getElementsByTagName("head")[0] || document.documentElement, done = false;
	s.src = "jquery.js";
	s.onload = s.onreadystatechange = function(){
		if (!this.readyState || this.readyState == "complete" || this.readyState == "loaded") {
			if (!done && (done=true)) {
				main(window.jQuery) && jQueryPlugins();
				s.onload = s.onreadystatechange = null;
				if (h && s.parentNode) h.removeChild(s);
				s = undefined;
			}
		}
	};
	h.insertBefore(s, h.firstChild);
}();

function main($){
if (main.run) return;
else main.run = true;

window.aC = {
title: "about.me",
ajaxurl: "ajax.php",
loaded: false,
logged: false,
loginFocus: false,
registerFocus: false,
user: {},
page: {},
handleHash: function(){
	if (Hash.getHash().length) {
		Hash.parse();
		if (Hash.has("who")) {
			var who = Hash.get("who");
			this.loadProfile(who);
		}
	}
},
init: function(){
	if (this.loaded !== false) return;
	var self = this;
	$.getJSON(this.ajaxurl, {action:"logged"}, function(response){
		self.loaded = true;
		if (response.logged === true) {
			self.logged = true;
			self.loggedIn();
		} else self.loggedOut();
		self.handleHash();
	});
	this.dom();
},
loggedIn: function(){
	if (this.logged !== true) return;
	var self = this;
	$.getJSON(this.ajaxurl, {action:"userdata"}, function(response){
		if (response.user !== false) {
			self.user = response.user;
			self.user.fullname = self.user.firstname+' '+self.user.lastname;
			$("#loggedin").show();
			$("#loggedout").hide();
			$("body").addClass("in").removeClass("out");
			self.handleHash();
			self.displayMe();
		} else self.logout();
	});
},
loggedOut: function(){
	if (this.logged !== false) return;
	$("#loggedout").show();
	$("#loggedin").hide();
	$("body").addClass("out").removeClass("in");
},
login: function(){
	var self = this, e = false, $login = $("#f_login"), $email = $login.find("#lemail"), $password = $login.find("#lpassword");
	if (!$.trim($email.val()).length) { $email.addClass('error'); e = true; } else $email.removeClass('error');
	if (!$.trim($password.val()).length) { $password.addClass('error'); e = true; } else $password.removeClass('error');
	if (!e) {
		$login.find("input").attr('disabled',true);
		var output = {}, inputs = $login.find("input").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		$.post(this.ajaxurl, {action:"login",form:output}, function(response){
			$login.find("input").attr('disabled',false);
			if (stringToBoolean(response.logged)) {
				$login.find("#reg_name, #reg_email, #reg_password").removeClass('error');
				$login.find("#b_login_splash").removeClass('error');
				$("#f_register").clearForm();
				$login.clearForm();
				self.logged = true;
				self.loggedIn();
			} else {
				$login.find("#b_login_splash").addClass('error');
				$password.val('');
			}
		});
	}
},
logout: function(){
	var self = this;
	$.post(this.ajaxurl, {action:"logout"}, function(response){
		if (!stringToBoolean(response.logged)) {
			self.logged = false;
			self.user = {};
			self.page = {};
			self.loggedOut();
			Hash.clear();
		}
	});
},
regValidate: function(){
	var e = false,
	$reg = $("#f_register"),
	$name = $reg.find("#reg_name"), name_trim = $.trim($name.val()),
	$email = $reg.find("#reg_email"), email_trim = $.trim($email.val()),
	$password = $reg.find("#reg_password"), password_trim = $.trim($password.val()),
	$pageurl = $reg.find("#reg_pageurl"), pageurl_trim = $.trim($pageurl.val()),
	nameReg = /[A-Za-z'-]/,
	emailReg = /^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}?$/i,
	pageurlReg = /[A-Za-z0-9-_]/;

	if (!name_trim.length || !nameReg.test(name_trim) || name_trim.split(' ').length < 2) {
		$name.addClass('error');
		e = true;
	} else $name.removeClass('error');

	if (!email_trim.length || !emailReg.test(email_trim) || this.isEmailRegistered(email_trim)) {
		$email.addClass('error');
		e = true;
	} else $email.removeClass('error');
	
	if (!password_trim.length) {
		$password.addClass('error');
		e = true;
	} else $password.removeClass('error');

	if (!pageurl_trim.length || !pageurlReg.test(pageurl_trim)) {
		$pageurl.addClass('error');
		e = true;
	} else $pageurl.removeClass('error');
	
	return !e;
},
register: function(){
	if (!this.regValidate()) return;
	var self = this, output = {}, $f_register = $("#f_register"), inputs = $f_register.find("input").filter("[name]");
	$f_register.find("input").attr('disabled',true);
	$.map(inputs, function(n, i){
		output[n.name] = $.trim($(n).val());
	});
	$.post(this.ajaxurl, {action:"register",form:output}, function(response){
		$f_register.find("input").attr('disabled',false);
		if (stringToBoolean(response.registered)) {
			$f_register.find("#b_register").removeClass('error');
			$f_register.clearForm();
			self.logged = true;
			self.registered();
		} else {
			$f_register.find("#b_register").addClass('error');
		}
	});
},
registered: function(){
	this.loggedIn();
},
isEmailRegistered: function(email){
	email = $.trim(email);
	if (email.length) {
		$.get(this.ajaxurl, {action:"checkemail",email:email}, function(response){
			if (stringToBoolean(response.email)) return true;
			else return false;
		});
	}
},
onKeyDown: function(e){
	var keyCode = e.which;
	if (this.logged === false) {
		if (keyCode == keys.ENTER) {
			e.preventDefault();
			if (this.loginFocus) this.login();
			else if (this.registerFocus) this.register();
		}
	}
},
displayMe: function(pageurl){
	var pages = "";
	$("#profilename").text(this.user.fullname);
	$.each(this.user.pages, function(i,v){
		pages += $("</span>").text("hey");
	});
	$("#profilelinklist").html(pages);
},
loadProfile: function(pageurl){
	var self = this;
	$.getJSON(this.ajaxurl, {action:"profile",pageurl:pageurl}, function(response){
		if (response.user !== false) {
			self.page = response.user;
			self.page.fullname = self.page.firstname+' '+self.page.lastname;
			if (this.logged === false) {
				$("#previewprofile_name").text(response.page.fullname);
				$("#splash").hide();
				$("#previewprofile").show();
			} else {

			}
		}
	});
},
addPage: function(){
	var self = this, e = false, $f_addpage = $("#f_addpage"), $name = f_addpage.find("#name"), $url = f_addpage.find("#url");
	if (!$.trim($name.val()).length) { $name.addClass('error'); e = true; } else $name.removeClass('error');
	if (!$.trim($url.val()).length) { $url.addClass('error'); e = true; } else $url.removeClass('error');
	if (!e) {
		f_addpage.find("input").attr('disabled',true);
		var output = {}, inputs = f_addpage.find("input").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		$.post(this.ajaxurl, {action:"addpage",form:output}, function(response){
			f_addpage.find("input").attr('disabled',false);
			if (stringToBoolean(response.added)) {
				f_addpage.find("#name, #url").removeClass('error');
				f_addpage.find("#b_addpage").removeClass('error');
				f_addpage.clearForm();
			} else {
				f_addpage.find("#b_addpage").addClass('error');
			}
		});
	}
},
dom: function(){
	var self = this;
	$("#authpanel").on({
		focus: function(){
			self.loginFocus = true;
		},
		blur: function(){
			self.loginFocus = false;
		}
	},'#lemail, #lpassword');
	$("#authpanel").on({
		focus: function(){
			self.registerFocus = true;
		},
		blur: function(){
			self.registerFocus = false;
			self.regValidate();
		}
	},'#reg_name, #reg_email, #reg_password, #reg_pageurl');
	$("#authpanel").on('click','#b_login_splash',function(){
		self.login();
	});
	$("#authpanel").on('click','#b_register_splash',function(){
		$("#register").show();
		$("#login").hide();
	});
	$("#authpanel").on('click','#b_register',function(){
		self.register();
	});
	$("#authpanel").on('click','#b_login',function(){
		$("#login").show();
		$("#register").hide();
	});
	$("#hd_home").on('click','#homelink', function(){
		$("#previewprofile").hide();
		$("#splash").show();
	});
	$("#loggedin").on('click','.logout-link', function(){
		self.logout();
	});
}
};

$(document.documentElement).keydown(bind(aC,aC.onKeyDown));
$(document).ready(bind(aC,aC.init));

return true;
}
})(this, this.document, this.jQuery);