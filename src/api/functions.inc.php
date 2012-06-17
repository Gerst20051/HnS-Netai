<?php
define('LOCAL',true);
define('ROOT',dirname(__FILE__));
define('DIR',(LOCAL)?dirname(ROOT):ROOT);

function isint($mixed){
	return (preg_match('/^\d*$/', $mixed) == 1);
}

function print_json($data,$die=true){
	header('Content-Type: application/json; charset=utf8');
	print_r(json_encode($data));
	if ($die === true) die();
}

function error($msg,$json=true,$die=true){
	if ($json === true) print_r(json_encode(array("error"=>$msg)));
	else $final['error'] = $msg;
	if ($die === true) die();
}

function check($var){
	if (isset($var) && !empty($var)) return true;
	else return false;
}

function varcheck($var,$type,$rvalue,$rname){
	if (func_num_args() == 1) {
		if (check($var)) return $var;
		else return '';
	} else {
		if ($type === true) {
			if (check($var)) return true;
			elseif (check($rvalue)) {
				if (check($rname)) {
					global ${strtoupper($rname)};
					${strtoupper($rname)} = $rvalue;
					return true;
				} else return false;
			} else return false;
		} else {
			if (check($var)) return $var;
			else return '';
		}
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

function removeWhitespace($string) {
	return preg_replace('/\s*/m', ' ', $string);
}

/* Test Functions */

function vname(&$var,$scope=false,$prefix='unique',$suffix='value'){
	if ($scope) $vals = $scope; else $vals = $GLOBALS;
	$old = $var;
	$var = $new = $prefix.rand().$suffix;
	$vname = false;
	foreach ($vals as $key => $val) {
		if ($val === $new) $vname = $key;
	}
	$var = $old;
	return $vname;
}

function var_name(&$var, $scope=0){
	$old = $var;
	if (($key = array_search($var = 'unique'.rand().'value', !$scope ? $GLOBALS : $scope)) && $var = $old) return $key;  
}
?>