$w=window,$d=document,$host=(($w.location.host=='localhost')?'api/':'http://hns.netai.net/api/');(function(){a="link",b="script",c="stylesheet",d="createElement",e="setAttribute",f="getElementsByTagName",g=$w.navigator.userAgent,h=g.indexOf("Firefox")!==-1||g.indexOf("Opera")!==-1?true:false;var i=["base.css","style.css"],j=["http://code.jquery.com/jquery.min.js","https://raw.github.com/Modernizr/Modernizr/master/modernizr.js","functions.js","script.js"],k=function(a){return a.match("^http")=="http"?a:$host+a};for(var l=0,m=i.length;l<m;++l){if(h){var n=$d[d](a);n[e]("rel",c);n[e]("href",k(i[l]));$d[f]("head")[0].appendChild(n)}else{$d.write("<"+a+' rel="'+c+'" href="'+k(i[l])+'" />')}}for(var l=0,m=j.length;l<m;++l){if(h){var n=$d[d](b);n[e]("src",k(j[l]));$d[f]("head")[0].appendChild(n)}else{$d.write("<"+b+' src="'+k(j[l])+'"></'+b+">")}}})();