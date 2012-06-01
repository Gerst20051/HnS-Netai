<?php
require_once 'functions.inc.php';
$REF = varcheck($_SERVER['HTTP_REFERER']);
$APIKEY = varcheck($_REQUEST['apikey']);
$ACTION = varcheck($_REQUEST['action']);
if (!empty($REF) && !empty($APIKEY)) {
	require_once 'auth.inc.php';
	$allow = true;
	foreach($auth as $key => $referer) {
		if ($APIKEY == $key && strpos($REF,$referer) !== false) { $allow = true; break; }
	}
	if (!$allow) {
		if ($ACTION != "init") die(error("Bad API Key!",true));
	}
} else {
	if (empty($APIKEY)) die(error("API Key Error!",true));
	elseif (empty($REF)) die(error("HTTP Referer Error!",true));
}
?>