(function(){var a=window,b=document,c=b.location.host=="localhost"?"":"http://hns.netai.net/user/",d="link",e="script",f="stylesheet",g="createElement",h="setAttribute",i="getElementsByTagName",j=a.navigator.userAgent,k=j.indexOf("Firefox")!==-1||j.indexOf("Opera")!==-1?true:false;var l=["base.css","style.css"],m=["http://code.jquery.com/jquery.min.js","functions.js","script.js"],n=function(a){return a.match("^http")=="http"?a:c+a};for(var o=0,p=l.length;o<p;++o){if(k){var q=b[g](d);q[h]("rel",f);q[h]("href",n(l[o]));b[i]("head")[0].appendChild(q)}else{b.write("<"+d+' rel="'+f+'" href="'+n(l[o])+'" />')}}for(var o=0,p=m.length;o<p;++o){if(k){var q=b[g](e);q[h]("src",n(m[o]));b[i]("head")[0].appendChild(q)}else{b.write("<"+e+' src="'+n(m[o])+'"></'+e+">")}}})();