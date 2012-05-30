<?php
define('LOCAL',true);
define('ROOT',dirname(__FILE__));
define('DIR',(LOCAL)?dirname(ROOT):ROOT);

function isint($mixed){
	return (preg_match('/^\d*$/', $mixed) == 1);
}

function print_json($data,$die){
	header('Content-Type: application/json; charset=utf8');
	print_r(json_encode($data));
	if ($die === true) die();
}

function error($msg,$json=false){
	if ($json) print_r(json_encode(array("error"=>$msg)));
	else $final['error'] = $msg;
}

function varcheck($var,$type){
	if ($type === true) {
		if (isset($var) && !empty($var)) return true;
		else return false;
	} else {
		if (isset($var) && !empty($var)) return $var;
		else return '';
	}
}

function setglobal($var){
	if (varcheck($var,true)) {
		foreach($var as $key=>$value) {
			if (varcheck($value,true)) {
				global ${strtoupper($key)};
				${strtoupper($key)} = varcheck($value);
			}
		}
		return true;
	} else return false;
}

function filtervars($var){
	if (isset($var) && !empty($var)) return $var;
	else return '';
}

function validateinput($vars,$required){
	foreach ($vars as $key=>$value) {
		if (in_array($key,$required) && trim($value) == "") return false;
	}
	return true;
}

function logout(){
	if (isset($_SESSION)) {
		session_unset();
		session_destroy();
	}
}

function ucname($string){
	$string = ucwords(strtolower($string));
	foreach (array('-', '\'', 'Mc') as $delimiter) {
		if (strpos($string,$delimiter) !== false) {
			$string = implode($delimiter, array_map('ucfirst', explode($delimiter,$string)));
		}
	}
	return $string;
}
?>