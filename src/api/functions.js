$w.log = function(){
	log.history = log.history || [];
	log.history.push(arguments);
	if (this.console) console.log(Array.prototype.slice.call(arguments));
};

$w.keys = {
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

$.fn.pixels = function(property){
	return parseInt(this.css(property));
};

$.fn.center = function(){
	var w = $($w);
	return this.each(function(){
		$(this).css("position","absolute");
		$(this).css("top",((w.height() - $(this).height()) / 2) - (($(this).pixels('padding-top') + $(this).pixels('padding-bottom')) / 2) + w.scrollTop() + "px");
		$(this).css("left",((w.width() - $(this).width()) / 2) - (($(this).pixels('padding-left') + $(this).pixels('padding-right')) / 2) + w.scrollLeft() + "px");
	});
};

$.fn.clearForm = function(){
	return this.each(function(){
		$(this).find("input, select, textarea").not(':input[type=button], :input[type=submit], :input[type=reset], :input[type=hidden]').val('');
		$(this).find("input[type=radio], input[type=checkbox]").each(function(){
			$(this).attr('checked', false);
		});
	});
};

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

function isDefined(variable){
	return (typeof($w[variable]) === "undefined" && typeof(variable) === "undefined") ? false : true;
}

function $$(a){return $("#hns").find(a)}
function encode(a){if(a===null||typeof a==="undefined"){return""}var b=(a+'');var c="",start,end,stringl=0;start=end=0;stringl=b.length;for(var n=0;n<stringl;n++){var d=b.charCodeAt(n);var e=null;if(d<128){end++}else if(d>127&&d<2048){e=String.fromCharCode((d>>6)|192)+String.fromCharCode((d&63)|128)}else{e=String.fromCharCode((d>>12)|224)+String.fromCharCode(((d>>6)&63)|128)+String.fromCharCode((d&63)|128)}if(e!==null){if(end>start){c+=b.slice(start,end)}c+=e;start=end=n+1}}if(end>start){c+=b.slice(start,stringl)}return c}
function secure(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!a){return a}a=encode(a+'');do{c=a.charCodeAt(i++);o2=a.charCodeAt(i++);o3=a.charCodeAt(i++);bits=c<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;tmp_arr[ac++]=b.charAt(h1)+b.charAt(h2)+b.charAt(h3)+b.charAt(h4)}while(i<a.length);enc=tmp_arr.join('');switch(a.length%3){case 1:enc=enc.slice(0,-2)+'==';break;case 2:enc=enc.slice(0,-1)+'=';break}return enc}
