<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
require_once 'phpdom.php';

$keywords = array();
$items = array();

function sendAlert($body){
	$headers[] = 'Content-Transfer-Encoding: 7bit';
	$headers[] = 'From: alerts@hns.netai.net';
	mail('hnsalerts@gmail.com', 'UNC Dining', $body, implode("\r\n", $headers));
}

function getURL($url){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$response = curl_exec($ch);
	curl_close($ch);
	return $response;
}

function diningMap($value, $key){
	global $keywords, $items;
	foreach ($keywords as $index=>$keyword) {
	if (strpos($value, $keyword) !== false) {
			return $items[$key];
		}
	}
}

function crawl(){
	global $keywords, $items;
	$keywords = array(
		'Quesadilla',
		'Veal Parmesan'
	);
	$page = getURL('http://www.dining.unc.edu');
	$html = str_get_html($page);
	$ret = array();
	$content = $html->find('div#dnn_ctr3776_ModuleContent', 0);
	foreach ($content->find('li.PCTMealCardItem') as $index=>$item) {
		$items[] = $item->plaintext;
	}
	$results = array_map("diningMap", $items, array_keys($items));
	$ret = array_values(array_diff($results, array_fill(0, count($results), '')));
	return $ret;
}

$current_time = date('G');
if ($current_time >= 0 && $current_time <= 23) {
	$data = crawl();
	$body = "UNC Dining Results\r\n\r\n";
	foreach ($data as $index=>$items) {
		$body .= strtoupper($items)."\r\n";
	}
	if (strlen($body)) {
		sendAlert($body);
		print_r($data);
	}
}
?>