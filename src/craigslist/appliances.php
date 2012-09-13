<?php
require_once 'phpdom.php';

function remove_non_numeric($string) {
	return preg_replace('/\D/', '', $string);
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
			foreach ($blacklist as $black) {
				if (-1 < strpos($smalltext, $black)) {
					$valid = false;
					break;
				}
			}
			if ($valid !== true) continue;
			foreach ($keywords as $keyword=>$value) {
				if (-1 < strpos($smalltext, $keyword) && (int)$price <= $value) {
					array_push($ret[$city], '$'.$price.' - '.$linktext);
					break;
				}
			}
		}
	}
	return $ret;
}

$data = crawl();
$body = '';
$citycount = 1;
foreach ($data as $city=>$items) {
	if (1 > count($items)) continue;
	if ($citycount > 1) $body .= '<br/><br/>'.strtoupper($city).'<br/><br/>';
	else $body .= strtoupper($city).'<br/><br/>';
	foreach ($items as $item) {
		$body .= ucwords(strtolower(htmlspecialchars_decode($item))).'<br/>';
	}
	$citycount++;
}
if (0 < strlen($body)) echo $body;
?>