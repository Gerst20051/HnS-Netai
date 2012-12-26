<?php
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

function removeWhitespace($string){
	return preg_replace('/\s*/m', ' ', $string);
}

function parseURL($url){
	$urlReg = '/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/';
	preg_match($urlReg,$url,$result);
	return array(
		'url'=>$result[0],
		'scheme'=>$result[1],
		'slash'=>$result[2],
		'host'=>$result[3],
		'port'=>$result[4],
		'path'=>$result[5],
		'query'=>$result[6],
		'hash'=>$result[7]
	);
}

function getJSON($url){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$response = curl_exec($ch);
	curl_close($ch);
	if (strlen($response)) {
		$data = json_decode($response);
		if (is_array($data)) return $data;
	}
}
?>