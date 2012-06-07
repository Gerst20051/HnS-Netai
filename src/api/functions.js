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
DOWN_ARROW: 40,
DOWN_ARROW_OLD: 63233,
END: 35,
END_OLD: 63275,
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
HOME: 36,
HOME_OLD: 63273,
INSERT: 63302,
LEFT_ARROW: 37,
LEFT_ARROW_OLD: 63234,
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
NUMPAD_ENTER_OLD: 108,
NUMPAD_MINUS: 109,
NUMPAD_MULTIPLY: 106,
NUMPAD_PERIOD: 110,
NUMPAD_PLUS: 107,
NUM_LOCK: 63289,
PAGE_DOWN: 34,
PAGE_DOWN_OLD: 63277,
PAGE_UP: 33,
PAGE_UP_OLD: 63276,
PAUSE: 19,
PAUSE_OLD: 63250,
PRINT_SCREEN: 63248,
RIGHT_ARROW: 39,
RIGHT_ARROW_OLD: 63235,
RIGHT_WINDOW: 92,
SCROLL_LOCK: 63249,
SELECT: 93,
SHIFT: 16,
SHIFT_TAB: 25,
SPACE: 32,
TAB: 9,
UP_ARROW: 38,
UP_ARROW_OLD: 63232
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

$.fn.setData = function(obj){
	if (typeof obj != "object") return this;
	return this.each(function(){
		for (key in obj) {
			$(this).data(key, obj[key]);
		}
	});
};

Object.toType = (function toType(global){
	return function(obj){
		if (obj === global) return "global";
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	}
})(this);

Object.setGUI = function(obj){
	for (var property in obj){
		var orig = obj[property];
		(function(){
			var propVal;
			Object.defineProperty(obj, property, {
				get: function(){ return propVal; },
				set: (function(target){
					return function(newVal){
						propVal = newVal;
						$(target).text(propVal);
					};
				})(orig.target)
			});
		})();
		obj[property] = orig.val;
	}
	return obj;
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

function empty(mixed){
	var key;
	if (mixed === "" || mixed === 0 || mixed === "0" || mixed === null || mixed === false || typeof mixed === 'undefined') return true;
	if (typeof mixed == 'object') {
		for (key in mixed) return false;
		return true;
	}
	return false;
}

function isDefined(variable){
	return (typeof($w[variable]) === "undefined" && typeof(variable) === "undefined") ? false : true;
}

function isMobile(){
	var ua = navigator.userAgent;
	if (ua.match(/Android/i) ||
	ua.match(/webOS/i) ||
	ua.match(/iPhone/i) ||
	ua.match(/iPod/i) ||
	ua.match(/iPad/i) ||
	ua.match(/BlackBerry/)
	) return true;
	else return false;
}

tfObjSort={
	init:function(){
		Array.prototype.objSort=function(){
			tfObjSort.setThings(this);
			var a=arguments;
			var x=tfObjSort;
			x.a=[];x.d=[];
			for(var i=0;i<a.length;i++){
				if(typeof a[i]=="string"){x.a.push(a[i]);x.d.push(1)};
				if(a[i]===-1){x.d[x.d.length-1]=-1}
			}
			return this.sort(tfObjSort.sorter);
		};
		Array.prototype.strSort=function(){
			tfObjSort.setThings(this);
			return this.sort(tfObjSort.charSorter)
		}
	},
	sorter:function(x,y){
		var a=tfObjSort.a
		var d=tfObjSort.d
		var r=0
		for(var i=0;i<a.length;i++){
			if(typeof x+typeof y!="objectobject"){return typeof x=="object"?-1:1};
			var m=x[a[i]]; var n=y[a[i]];
			var t=typeof m+typeof n;
			if(t=="booleanboolean"){m*=-1;n*=-1}
			else if(t.split("string").join("").split("number").join("")!=""){continue};
			r=m-n;
			if(isNaN(r)){r=tfObjSort.charSorter(m,n)};
			if(r!=0){return r*d[i]}
		}
		return r
	},
	charSorter:function(x,y){
		if(tfObjSort.ignoreCase){x=x.toLowerCase();y=y.toLowerCase()};
		var s=tfObjSort.chars;
		if(!s){return x>y?1:x<y?-1:0};
		x=x.split("");y=y.split("");l=x.length>y.length?y.length:x.length;
		var p=0;
		for(var i=0;i<l;i++){
			p=s.indexOf(x[i])-s.indexOf(y[i]);
			if(p!=0){break};
		};
		if(p==0){p=x.length-y.length};
		return p
	},
	setThings:function(x){
		this.ignoreCase=x.sortIgnoreCase;
		var s=x.sortCharOrder;
		if(!s){this.chars=false;return true};
		if(!s.sort){s=s.split(",")};
		var a="";
		for(var i=1;i<1024;i++){a+=String.fromCharCode(i)};
		for(var i=0;i<s.length;i++){
			z=s[i].split("");
			var m=z[0]; var n=z[1]; var o="";
			if(z[2]=="_"){o=n+m} else {o=m+n};
			a=a.split(m).join("").split(n).join(o);
		};
		this.chars=a
	}
};
tfObjSort.init();

function $$(a){return $(".hns").find(a)}
function encode(a){if(a===null||typeof a==="undefined"){return""}var b=(a+'');var c="",start,end,stringl=0;start=end=0;stringl=b.length;for(var n=0;n<stringl;n++){var d=b.charCodeAt(n);var e=null;if(d<128){end++}else if(d>127&&d<2048){e=String.fromCharCode((d>>6)|192)+String.fromCharCode((d&63)|128)}else{e=String.fromCharCode((d>>12)|224)+String.fromCharCode(((d>>6)&63)|128)+String.fromCharCode((d&63)|128)}if(e!==null){if(end>start){c+=b.slice(start,end)}c+=e;start=end=n+1}}if(end>start){c+=b.slice(start,stringl)}return c}
function secure(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!a){return a}a=encode(a+'');do{c=a.charCodeAt(i++);o2=a.charCodeAt(i++);o3=a.charCodeAt(i++);bits=c<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;tmp_arr[ac++]=b.charAt(h1)+b.charAt(h2)+b.charAt(h3)+b.charAt(h4)}while(i<a.length);enc=tmp_arr.join('');switch(a.length%3){case 1:enc=enc.slice(0,-2)+'==';break;case 2:enc=enc.slice(0,-1)+'=';break}return enc}
