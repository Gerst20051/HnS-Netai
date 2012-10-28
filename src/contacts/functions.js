window.log = function(){
	log.history = log.history || [];
	log.history.push(arguments);
	if (this.console) console.log(Array.prototype.slice.call(arguments));
};

window.keys = {
ALT: 18,
BACKSPACE: 8,
CAPS_LOCK: 20,
CLEAR: 12,
CTRL: 17,
DELETE: 63272,
DOWN_ARROW: 63233,
END: 63275,
ENTER: 13,
ESCAPE: 27,
F1: 63236,
F2: 63237,
F3: 63238,
F4: 63239,
F5: 63240,
F6: 63241,
F7: 63242,
F8: 63243,
F9: 63244,
F10: 63245,
F11: 63246,
F12: 63247,
F13: 124,
F14: 125,
F15: 126,
HELP: 47,
HOME: 63273,
INSERT: 63302,
LEFT_ARROW: 63234,
LEFT_WINDOW: 91,
NUMPAD_0: 96,
NUMPAD_1: 97,
NUMPAD_2: 98,
NUMPAD_3: 99,
NUMPAD_4: 100,
NUMPAD_5: 101,
NUMPAD_6: 102,
NUMPAD_7: 103,
NUMPAD_8: 104,
NUMPAD_9: 105,
NUMPAD_DIVIDE: 111,
NUMPAD_ENTER: 108,
NUMPAD_MINUS: 109,
NUMPAD_MULTIPLY: 106,
NUMPAD_PERIOD: 110,
NUMPAD_PLUS: 107,
NUM_LOCK: 63289,
PAGE_DOWN: 63277,
PAGE_UP: 63276,
PAUSE: 63250,
PRINT_SCREEN: 63248,
RIGHT_ARROW: 63235,
RIGHT_WINDOW: 92,
SCROLL_LOCK: 63249,
SELECT: 93,
SHIFT: 16,
SHIFT_TAB: 25,
SPACE: 32,
TAB: 9,
UP_ARROW: 63232
};

$.fn.digits = function(){
	return this.each(function(){
		$(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
	});
}

$.fn.pixels = function(property){
	return parseInt(this.css(property));
};

$.fn.center = function(){
	var w = $(window);
	return this.each(function(){
		$(this).css("position","absolute");
		$(this).css("top",((w.height() - $(this).height()) / 2) - (($(this).pixels('padding-top') + $(this).pixels('padding-bottom')) / 2) + w.scrollTop() + "px");
		$(this).css("left",((w.width() - $(this).width()) / 2) - (($(this).pixels('padding-left') + $(this).pixels('padding-right')) / 2) + w.scrollLeft() + "px");
	});
};

$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function(){
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) o[this.name] = [o[this.name]];
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

function timestamp(){
	return Date.now || +new Date;
}

function timestamp_sec(){
	return parseInt(Date.now / 1000) || parseInt(+new Date / 1000);
}

function today(datetime){
	var today = new Date(timestamp());
	return (datetime.getDate() == today.getDate() && datetime.getMonth() == today.getMonth() && datetime.getYear() == today.getYear());
}

function yesterday(datetime){
	var yesterday = new Date(timestamp() - 86400000);
	return (datetime.getDate() == yesterday.getDate() && datetime.getMonth() == yesterday.getMonth() && datetime.getYear() == yesterday.getYear());
}

function stringToBoolean(string){
	if (typeof string == "undefined") {
		log("stringToBoolean Undefined Error");
		return false;
	}
	if (typeof string == "boolean") return string;
	switch(string.toLowerCase()) {
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return false;
	}
}

function empty(mixed){
	var key;
	if (mixed === "" || mixed === 0 || mixed === "0" || mixed === null || mixed === false || typeof mixed === 'undefined') return true;
	if (typeof mixed == 'object') {
		for (key in mixed) return false;
		return true;
	}
	return false;
}

function addSlashes(str){
	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function stripSlashes(str){
	return (str + '').replace(/\\(.?)/g, function (s, n1){
		switch (n1) {
			case '\\': return '\\';
			case '0': return '\u0000';
			case '': return '';
			default: return n1;
		}
	});
}

function getRandomInt(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDomain(url){
	if (url.indexOf('http')) return url.match(/:\/\/(.[^/]+)/)[1];
	else return url.match(/:\/\/(.[^/]+)/)[1];
}

function doCallback(args){
	if (args.length > 1) {
		if ($.isFunction(args[args.length-1])) {
			args[args.length-1]();
		}
	}
}

function isDefined(variable){
	return (typeof window[variable] !== "undefined" || typeof variable !== "undefined") ? true : false;
}

function getHash(){ return decodeURIComponent(window.location.hash.substring(1)); }
function clearHash(){ window.location.replace("#"); }
function setHash(hash){ window.location.replace("#" + encodeURI(hash)); }
function getTitle(){ return document.title; }
function setTitle(title){ document.title = title; }

function removeChars(needle, string){
	if (typeof needle == "string") return string.split(needle).join('');
	else { $.each(needle, function(index, value){ string = string.split(value).join(''); }); return string; }
}

function replaceAll(yourstring, from, to){
	var idx = str.indexOf(from);
	while (idx > -1) { str = str.replace(from, to); idx = str.indexOf(from); }
	return str;
}

function mt_rand(min, max){
	var argc = arguments.length;
	if (argc === 0) { min = 0; max = 2147483647; }
	else if (argc === 1) throw new SyntaxError('Warning: mt_rand() expects exactly 2 parameters, 1 given');
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function implode(glue, pieces){
	var i = '', retVal = '', tGlue = '';
	if (arguments.length === 1) { pieces = glue; glue = ''; }
	if (typeof(pieces) === 'object') {
		if (pieces instanceof Array) return pieces.join(glue);
		else { for (i in pieces) { retVal += tGlue + pieces[i]; tGlue = glue; } return retVal; }
	} else return pieces;
}

function explode(delimiter, string, limit){ 
	var emptyArray = { 0 : '' };
	if (arguments.length < 2 || typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined') return null;
	if (delimiter === '' || delimiter === false || delimiter === null) return false;
	if (typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object') return emptyArray;
	if (delimiter === true) delimiter = '1';
	if (!limit) return string.toString().split(delimiter.toString());
	else {
		var splitted = string.toString().split(delimiter.toString());
		var partA = splitted.splice(0, (limit - 1));
		var partB = splitted.join(delimiter.toString());
		partA.push(partB);
		return partA;
	}
}

function array_map(callback){
	var argc = arguments.length, argv = arguments;
	var j = argv[1].length, i = 0, k = 1, m = 0;
	var tmp = [], tmp_ar = [];
	while (i < j) {
		while (k < argc) { tmp[m++] = argv[k++][i]; }
		m = 0; k = 1;
		if (callback) {
			if (typeof callback === 'string') callback = this.window[callback];
			tmp_ar[i++] = callback.apply(null, tmp);
		} else tmp_ar[i++] = tmp;
		tmp = [];
	}
	return tmp_ar;
}

function ucfirst(str){
	str += '';
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1);
}

function ucwords(str){
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) { return $1.toUpperCase(); });
}

function ucname(string){
	string = string.toLowerCase().capitalize();
	$(["-", "'", "Mc"]).each(function(i, delimiter) {
		if (string.indexOf(delimiter) !== false) string = implode(delimiter, array_map('ucfirst', explode(delimiter, string)));
	});
	return string;
}

function in_array(needle, haystack, argStrict){
	var key = '', strict = !!argStrict;
	if (strict) {	for (key in haystack) { if (haystack[key] === needle) return true; }}
	else { for (key in haystack) { if (haystack[key] == needle) return true; }}
	return false;
}

function removeKey(arrayName, key){
	var x, tmpArray = new Array();
	for (x in arrayName) { if (x != key) tmpArray[x] = arrayName[x]; }
	return tmpArray;
}

function str_split(string, slength){
	if (slength === null) slength = 1;
	if (string === null || slength < 1) return false;
	string += '';
	var chunks = [], pos = 0, len = string.length;
	while (pos < len) chunks.push(string.slice(pos, pos += slength));
	return chunks;
}

function isplit(string, regexp, flags){
	var splitter = "#@#";
	while (string.indexOf(splitter) != -1) { splitter += "#"; };
	flags = (flags && typeof(flags) == "string") ? flags : (!isNaN(parseFloat(flags))) ? "" : "g";
	string = string.replace(((typeof(regexp) == "string") ? new RegExp(regexp, flags) : regexp), splitter);
	return string.split(splitter);
}

function IsRightButtonClicked(e){
	var rightclick = false;
	e = e || window.event;
	if (e.which) rightclick = (e.which == 3);
	else if (e.button) rightclick = (e.button == 2);
	return rightclick;
}

 function maxWindow() {
	window.moveTo(0, 0);
	if (document.all) top.window.resizeTo(screen.availWidth, screen.availHeight);
	else if (document.layers || document.getElementById) {
		if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
			top.window.outerHeight = screen.availHeight; top.window.outerWidth = screen.availWidth;
		}
	}
}

function extractHost(url) {
	var returnArry = /^(?:[^:\/?#]+):\/\/([^\/?#]+)(?::\d+)?(?:[^?#]*)\//i.exec(url);
	if (returnArry && (typeof returnArry === "object")) return returnArry[1];
	else return "";
}

function bustFrame() {
	var blacklist = ['homenetspaces.tk','hnsdesktop.tk'];
	if (top.location != window.location) {
		var topURL = extractHost(document.referrer);
		if (topURL) {
			for (var i=0; i < blacklist.length; i++) {
				if (topURL.indexOf(blacklist[i]) != -1) {
					top.location.replace(window.location);
					return;
				}
			}
		}
	}
}

function setCookie(name, value, expires, path, domain, secure) {
	var today = new Date();
	today.setTime(today.getTime());
	if (expires) expires = (expires * 1000 * 60 * 60 * 24);
	var expires_date = new Date(today.getTime() + expires);
	document.cookie = name + "=" + escape(value) + (expires ? ";expires=" + expires_date.toGMTString() : "") + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + (secure ? ";secure" : "");
}

function getCookie(check_name) {
	var a_all_cookies = document.cookie.split(';');
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false;
	for (i = 0; i < a_all_cookies.length; i++) {
		a_temp_cookie = a_all_cookies[i].split('=');
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		if (cookie_name == check_name) {
			b_cookie_found = true;
			if (a_temp_cookie.length > 1) cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if (!b_cookie_found) return null;
}

function deleteCookie(name, path, domain) {
	if (getCookie(name)) document.cookie = name + "=" + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

Array.prototype.clear = function(){ this.splice(0,this.length); };
Array.prototype.diff = function(a){ return this.filter(function(i){return!(a.indexOf(i)>-1)}); };
Array.prototype.random = function(){ return this[getRandomInt(0,this.length-1)]; };

Array.prototype.remove = function(from, to){
	var rest = this.slice(((to || from) + 1) || this.length);
	this.length = (from < 0) ? (this.length + from) : from;
	return this.push.apply(this, rest);
};

Array.prototype.kIndex = function(key){
	for (i = 0; i < this.length; i++) { if (this[i].key == key) return i; }
	return -1;
};

Array.prototype.vIndex = function(value){
	for (i = 0; i < this.length; i++) { if (this[i] == value) return i; }
	return -1;
};

Array.prototype.contains = function(obj){
	for (var i = (this.length - 1); i >= 0; i--) { if (this[i] === obj) return true; }
	return false;
};

Number.prototype.toLength = function(n){
	var str = this.toString();
	while (str.length < n) str = '0' + str;
	return str;
};

String.prototype.startsWith = function(str){ return (this.match("^" + str) == str) };
String.prototype.capitalize = function(){ return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) { return p1 + p2.toUpperCase(); }); };
String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g,''); };
String.prototype.ltrim = function(){ return this.replace(/^\s+/,''); };
String.prototype.rtrim = function(){ return this.replace(/\s+$/,''); };
String.prototype.whitespace = function(){ return this.replace(/^\s*|\s*$/g,''); };
String.prototype.toTitleCase = function(){
	return this.replace(/([\w&`'‘’"“.@:\/\{\(\[<>_]+-? *)/g, function(match, p1, index, title) {
		if (index > 0 && title.charAt(index - 2) !== ":" && match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ \-]/i) > -1)
			return match.toLowerCase();
		if (title.substring(index - 1, index + 1).search(/['"_{(\[]/) > -1)
			return match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2);
		if (match.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || title.substring(index - 1, index + 1).search(/[\])}]/) > -1)
			return match;
		return match.charAt(0).toUpperCase() + match.substr(1);
	});
};

function encode(a){if(a===null||typeof a==="undefined"){return""}var b=(a+'');var c="",start,end,stringl=0;start=end=0;stringl=b.length;for(var n=0;n<stringl;n++){var d=b.charCodeAt(n);var e=null;if(d<128){end++}else if(d>127&&d<2048){e=String.fromCharCode((d>>6)|192)+String.fromCharCode((d&63)|128)}else{e=String.fromCharCode((d>>12)|224)+String.fromCharCode(((d>>6)&63)|128)+String.fromCharCode((d&63)|128)}if(e!==null){if(end>start){c+=b.slice(start,end)}c+=e;start=end=n+1}}if(end>start){c+=b.slice(start,stringl)}return c}
function secure(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!a){return a}a=encode(a+'');do{c=a.charCodeAt(i++);o2=a.charCodeAt(i++);o3=a.charCodeAt(i++);bits=c<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;tmp_arr[ac++]=b.charAt(h1)+b.charAt(h2)+b.charAt(h3)+b.charAt(h4)}while(i<a.length);enc=tmp_arr.join('');switch(a.length%3){case 1:enc=enc.slice(0,-2)+'==';break;case 2:enc=enc.slice(0,-1)+'=';break}return enc}
