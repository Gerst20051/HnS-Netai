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
			if (self.user.pages.length) self.user.pages = JSON.parse(response.user.pages);
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
				$login.find(".error").removeClass('error');
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
			$f_register.find(".error").removeClass('error');
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
createLinkListItem: function(page){
	var url = parseURL(page.url);
	var span = $("<span/>", {
		"class": "profilelink"
	});
	var image = $("<img/>", {
		"class": "profilelinkimage",
		src: getDomainIcon(url.host)
	});
	span.data('href', url.url);
	return span.append(image);
},
createPictureItem: function(item){
	for (var prop in item) {
		var span = $("<span/>", {
			"class": "userpicture"
		});
		var image = $("<img/>", {
			"class": "userpictureimage",
			src: item[prop]
		});
	}
	return span.append(image);
},
twitterDate: function(datetime){
	var datetime = new Date(datetime),
		hours = datetime.getHours(),
		prefix = "AM",
		minutes = datetime.getMinutes(),
		seconds = datetime.getSeconds();
	if (hours > 12) { hours = hours - 12; prefix = "PM"; }
	else if (hours == 0) hours = 12;
	if (minutes < 10) { minutes = '0'+minutes; }
	var monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'],
		monthShortArray = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
		dayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		dayShortArray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
		time = hours + ":" + minutes + " " + prefix,
		timeordate = '';
	if (today(datetime)) {
		timeordate = time;
	} else if (yesterday(datetime)) {
		timeordate = 'Yesterday ' + time;
	} else {
		var date = dayShortArray[datetime.getDay()] + ", " + monthShortArray[datetime.getMonth()] + " " + datetime.getDate() + ", " + datetime.getFullYear();
		timeordate = time+' on '+date;
	}
	return timeordate;
},
createActivityItem: function(name,data){
	var self = this;
	var container = $("<div/>",{id:"activity-"+name,"class":"activity"});
	var header = $("<div/>", {
		"class": "activityheader",
		text: name.toUpperCase()
	});
	var headercontent = $("<div/>", {
		"class": "activityheader_content"
	});
	var activities = {
		facebook: function(){
			var panel = $("<div/>", {
				"class": "activitypanel"
			});
			return panel;
		},
		twitter: function(){
			var handle = $("<span/>", {
				"class": "panel-twitter-handle",
				html: '<a target="_blank" href="http://twitter.com/'+data.handle+'">@'+data.handle+'</a>'
			});
			var statuscount = $("<span/>", {
				"class": "panel-twitter-statuscount",
				text: "tweets: "+data.statuscount
			});
			var followerscount = $("<span/>", {
				"class": "panel-twitter-followerscount",
				text: "followers: "+data.followerscount
			});
			headercontent.append(followerscount).append(statuscount).append(handle);
			var panel = $("<div/>", {
				"class": "activitypanel",
			});
			$.each(data.tweets, function(i,v){
				var item = $("<div/>", {
					"class": "panel-twitter-item",
					html: self.twitterDate(v.date) + " - " + v.text
				});
				item.appendTo(panel);
			});
			return panel;
		},
		github: function(){
			var handle = $("<span/>", {
				"class": "panel-github-handle",
				html: '<a target="_blank" href="http://github.com/'+data.handle+'">@'+data.handle+'</a>'
			});
			var statuscount = $("<span/>", {
				"class": "panel-github-repocount",
				text: "repos: "+data.repos.length
			});
			headercontent.append(statuscount).append(handle);
			var panel = $("<div/>", {
				"class": "activitypanel"
			});
			$.each(data.repos, function(i,v){
				var header = $("<div/>", {
					"class": "panel-github-item-header",
				});
				var repolink = $("<span/>", {
					"class": "panel-github-item-repolink",
					html: '<a target="_blank" href="'+v.url+'">'+v.name+'</a>'
				});
				var repodate = $("<span/>", {
					"class": "panel-github-item-repodate",
					html: self.twitterDate(v.date_pushed)
				});
				var item = $("<div/>", {
					"class": "panel-github-item"
				});
				item.append(header.append(repolink).append(repodate))
				if (v.description) {
					var description = $("<div/>", {
						"class": "panel-github-item-description",
						text: v.description
					});
					item.append(description);
				}
				item.appendTo(panel);
			});
			return panel;
		}
	};
	container.append(header.append(headercontent)).append(activities[name]());
	return container;
},
loadCoverPhoto: function(){
	var self = this;
	$.getJSON(this.ajaxurl, {action:"coverphoto",pageurl:this.page.pageurl}, function(response){
		if (response.coverphoto !== false) {
			if (self.logged) {
				$("#user_profilecover").show().find('.coverphoto').attr('src',response.coverphoto);
			} else {
				$("#preview_profilecover").show().find('.coverphoto').attr('src',response.coverphoto);
			}
		}
	});
},
loadPictures: function(){
	var self = this, pictures = $("<div/>");
	$.getJSON(this.ajaxurl, {action:"pictures",pageurl:this.page.pageurl}, function(response){
		if (response.pictures !== false) {
			$.each(response.pictures, function(i,v){
				self.createPictureItem(v).appendTo(pictures);
			});
			if (self.logged) {
				$("#user_profilepictures_content").html(pictures);
			} else {
				$("#preview_profilepictures_content").html(pictures);
			}
		}
	});
},
loadActivities: function(){
	var self = this, activities = $("<div/>");
	$.getJSON(this.ajaxurl, {action:"activities",pageurl:this.page.pageurl}, function(response){
		if (response.activities !== false) {
			$.each(response.activities, function(i,v){
				self.createActivityItem(i,v).appendTo(activities);
			});
			if (self.logged) {
				$("#user_profileactivities_content").html(activities);
			} else {
				$("#preview_profileactivities_content").html(activities);
			}
		}
	});
},
displayMe: function(){
	var self = this, pages = $("<div/>"), pictures = $("<div/>"), activities = $("<div/>");
	$("#profilename").text(this.user.fullname);
	$.getJSON(this.ajaxurl, {action:"coverphoto",pageurl:this.user.pageurl}, function(response){
		if (response.coverphoto !== false) {
			$("#profilecover").show().find('.coverphoto').attr('src',response.coverphoto);
		}
	});
	$.each(this.user.pages, function(i,v){
		self.createLinkListItem(v).appendTo(pages);
	});
	var span = $("<span/>", {
		"class": "addpagelink"
	});
	var image = $("<img/>", {
		"class": "profilelinkimage",
		src: "plus.png"
	});
	span.append(image).appendTo(pages);
	$("#profilelinklist").html(pages);
	$.getJSON(this.ajaxurl, {action:"pictures",pageurl:this.user.pageurl}, function(response){
		if (response.pictures !== false) {
			$.each(response.pictures, function(i,v){
				self.createPictureItem(v).appendTo(pictures);
			});
			$("#profilepictures_content").html(pictures);
		}
	});
	$.getJSON(this.ajaxurl, {action:"activities",pageurl:this.user.pageurl}, function(response){
		if (response.activities !== false) {
			$.each(response.activities, function(i,v){
				self.createActivityItem(i,v).appendTo(activities);
			});
			$("#profileactivities_content").html(activities);
		}
	});
},
displayProfile: function(){
	var self = this, pages = $("<div/>");
	if (this.logged) {
		$("#user_profilename").text(this.page.fullname);
		if (this.page.pages.length) {
			$.each(this.page.pages, function(i,v){
				self.createLinkListItem(v).appendTo(pages);
			});
			$("#user_profilelinklist").html(pages);
		}
	} else {
		$("#preview_profilename").text(this.page.fullname);
		if (this.page.pages.length) {
			$.each(this.page.pages, function(i,v){
				self.createLinkListItem(v).appendTo(pages);
			});
			$("#preview_profilelinklist").html(pages);
		}
	}
	this.loadCoverPhoto();
	this.loadPictures();
	this.loadActivities();
},
loadProfile: function(pageurl){
	var self = this;
	$.getJSON(this.ajaxurl, {action:"profile",pageurl:pageurl}, function(response){
		if (response.user !== false) {
			self.page = response.user;
			self.page.fullname = self.page.firstname+' '+self.page.lastname;
			if (self.page.pages.length) self.page.pages = JSON.parse(response.user.pages);
			if (self.logged === false) {
				$("#splash").hide();
				$("#preview_profile").show();
				self.displayProfile();
			} else {
				$("#profile").hide();
				$("#user_profile").show();
				self.displayProfile();
			}
		}
	});
},
addPage: function(){
	var self = this, e = false, $f_addpage = $("#f_addpage"),
		$name = $f_addpage.find("#name"), name_trim = $.trim($name.val()),
		$url = $f_addpage.find("#url"), url_trim = $.trim($url.val());
	if (!name_trim.length) { $name.addClass('error'); e = true; } else $name.removeClass('error');
	if (!url_trim.length) { $url.addClass('error'); e = true; } else $url.removeClass('error');
	if (!e) {
		$f_addpage.find("input").attr('disabled',true);
		var output = {}, inputs = $f_addpage.find("input").filter("[name]");
		$.map(inputs, function(n, i){
			output[n.name] = $.trim($(n).val());
		});
		$.post(this.ajaxurl, {action:"addpage",form:output}, function(response){
			$f_addpage.find("input").attr('disabled',false);
			if (stringToBoolean(response.added)) {
				$f_addpage.find(".error").removeClass('error');
				$f_addpage.clearForm();
				$('.addpagelink').click();
				var pageitem = {name:name_trim,url:url_trim};
				self.createLinkListItem(pageitem).insertBefore($("#profilelinklist div span:last-child"));
			} else {
				$f_addpage.find("#b_addpage").addClass('error');
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
	$("#hd_home").on('click','#homelink',function(){
		Hash.clear();
		if (self.logged === false) {
			$("#preview_profile").hide();
			$("#splash").show();
		} else {
			$("#user_profile").hide();
			$("#profile").show();	
		}
	});
	$("#loggedin").on('click','.logout-link',function(){
		self.logout();
	});
	$("#profilelinklist, #user_profilelinklist, #preview_profilelinklist").on('click','.profilelink',function(){
		var url = parseURL($(this).data('href')), link = url.url;
		if (!url.scheme) {
			if (!url.slash.length) link = "http://"+link;
			else link = "http:"+link;
		}
		window.open(link);
	});
	$("#profilelinklist").on('click','.addpagelink',function(){
		if ($("#addnewpage").is(":visible")) {
			$("#addnewpage").hide();
			$(".addpagelink").find("img").attr('src','plus.png');
		} else {
			$("#addnewpage").show();
			$(".addpagelink").find("img").attr('src','minus.png');
		}
	});
	$("#addnewpage").on('click','#b_addpage',function(){
		self.addPage();
	});
}
};

$(document.documentElement).keydown(bind(aC,aC.onKeyDown));
$(document).ready(bind(aC,aC.init));

return true;
}
})(this, this.document, this.jQuery);