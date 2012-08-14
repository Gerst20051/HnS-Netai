<?php
require_once 'phpdom.php';

function remove_non_numeric($string) {
	return preg_replace('/\D/', '', $string);
}

function sendAlert($body){
	$header = array();
	$headers[] = 'Content-Transfer-Encoding: 7bit';
	$headers[] = 'From: alerts@hns.netai.net';
	mail('irishmanalerts@gmail.com', 'Craigslist', $body, implode("\r\n", $headers));
	mail('hnsalerts@gmail.com', 'Craigslist', $body, implode("\r\n", $headers));
}

function crawl(){
	$ret = array();
	$save = array();
	$cities = array(
		'hickory',
		'charlotte'
	);
	$keywords = array(
		'washer'=>250,
		'dryer'=>250,
		'stove'=>150,
		'range'=>150,
		'oven'=>150,
		'refrigerator'=>250,
		'refridgerator'=>250,
		'fridge'=>250
	);
	$blacklist = array(
		'gas',
		'dishwasher',
		'microwave',
		'toaster'
	);
	$f='save.json';
	$oldsavedata = file_get_contents($f);
	if ($oldsavedata === false) echo "Cannot open file ($f)<br/><br/>";
	$oldsave = json_decode($oldsavedata,true);
	foreach ($cities as $city) {
		$html = file_get_html('http://'.$city.'.craigslist.org/ppa/');
		$ret[$city] = array();
		foreach ($html->find('p.row') as $index=>$row) {
			$valid = true;
			$item = $row->innertext;
			$link = $row->find('a', 0);
			$linktext = $link->plaintext;
			$smalltext = strtolower($linktext);
			$href = $link->href;
			$type = $row->find('a', 1)->plaintext;
			$price = remove_non_numeric($row->find('span.itempp', 0)->plaintext);
			if (0 === $index) $save[$city] = $href;
			if ($href == $oldsave[$city]) break;
			if ($type === 'appliances - by dealer') continue;
			foreach ($blacklist as $black) {
				if (-1 < strpos($smalltext, $black)) {
					$valid = false;
					break;
				}
			}
			if ($valid !== true) continue;
			foreach ($keywords as $keyword=>$value) {
				if (-1 < strpos($smalltext, $keyword) && (int)$price < $value) {
					array_push($ret[$city], '$'.$price.' - '.$linktext);
					break;
				}
			}
		}
	}
	$save = json_encode($save);
	if ($oldsavedata == $save) die('No new postings.');
	if (is_writable($f)) {
		if (!$handle = fopen($f, 'w')) {
			 echo "Cannot open file ($f)";
			 exit;
		}
		if (fwrite($handle, $save) === false) {
			echo "Cannot write to file ($f)";
			exit;
		}
		// echo "Success, wrote data to file ($f)";
		fclose($handle);
	} else echo "The file $f is not writable";
	return $ret;
}

$current_time = date('G');
if ($current_time >= 7 && $current_time <= 24) {
	$data = crawl();
	$body = '';
	$citycount = 1;
	foreach ($data as $city=>$items) {
		if (1 > count($items)) continue;
		if ($citycount > 1) $body .= "\r\n\r\n".strtoupper($city)."\r\n\r\n";
		else $body .= strtoupper($city)."\r\n\r\n";
		foreach ($items as $item) {
			$body .= ucwords(strtolower(htmlspecialchars_decode($item)))."\r\n";
		}
		$citycount++;
	}
	if (0 < strlen($body)) {
		sendAlert($body);
		// print_r($data);
	}
}
?>