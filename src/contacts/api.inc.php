<?php
require_once 'functions.inc.php';
$REF = (isset($_SERVER['HTTP_REFERER']))?$_SERVER['HTTP_REFERER']:'';
$APIKEY = (isset($_REQUEST['apikey']))?$_REQUEST['apikey']:'';
if (!empty($REF) && !empty($APIKEY)){
	require_once 'auth.inc.php';
	$allow = false;
	foreach($auth as $key => $referer) {
		if ($APIKEY == $key && strpos($REF,$referer) !== false) { $allow = true; break; }
	}
	if (!$allow) die(error("Bad API Key!",true));
} else {
	if (empty($APIKEY)) die(error("API Key Error!",true));
	elseif (empty($REF)) die(error("HTTP Referer Error!",true));
}
?>