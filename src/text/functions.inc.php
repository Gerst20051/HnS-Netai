<?php
define('LOCAL',true);
define('ROOT',dirname(__FILE__));
define('DIR',(LOCAL)?dirname(ROOT):ROOT);

function print_json($data,$die){
	header('Content-Type: application/json; charset=utf8');
	print_r(json_encode($data));
	if ($die === true) die();
}

function error($msg,$json=false){
	if ($json) print_json(array("error"=>$msg),true);
	else die($msg);
}
?>