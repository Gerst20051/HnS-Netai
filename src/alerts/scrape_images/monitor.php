<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
require_once 'phpdom.php';

$images = array();

function getURL($url){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$response = curl_exec($ch);
	curl_close($ch);
	return $response;
}

function crawl(){
	global $images;
	$page = getURL('http://slashdot.org/');
	$html = str_get_html($page);
	$images = array();
	foreach ($html->find('img') as $image) {
		echo '<img src="' . $image->src . '"/><br>';
		$images[] = $image->src;
	}
	return $images;
}

print_r(crawl());
?>