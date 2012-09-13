<?php
require_once 'phpdom.php';

$CITY = isset($_GET['city'])?trim($_GET['city']):'';

function remove_non_numeric($string) {
	return preg_replace('/\D/', '', $string);
}

function crawl($city){
	$ret = array();
	$keywords = array(
		'glide'=>16000
	);
	$blacklist = array();
	$page = '';
	for ($i = 0; $i < 5; $i++) {
		if (0 < $i) $page = 'index'.$i.'00.html';
		$html = file_get_html('http://'.$city.'.craigslist.org/mca/'.$page);
		foreach ($html->find('p.row') as $index=>$row) {
			$valid = true;
			$item = $row->innertext;
			// $image = $row->find('span.i img', 0);
			$link = $row->find('a', 0);
			$linktext = $link->plaintext;
			$smalltext = strtolower($linktext);
			$href = $link->href;
			$type = $row->find('a', 1)->plaintext;
			$price = remove_non_numeric($row->find('span.itempp', 0)->plaintext);
			if (0 < count($blacklist)) {
				foreach ($blacklist as $black) {
					if (-1 < strpos($smalltext, $black)) {
						$valid = false;
						break;
					}
				}
			}
			if ($valid !== true) continue;
			foreach ($keywords as $keyword=>$value) {
				if (-1 < strpos($smalltext, $keyword) && (int)$price <= $value) {
					array_push($ret, '$'.$price.' - '.$link);
					break;
				}
			}
		}
	}
	return $ret;
}

if (!empty($CITY)) {
	$items = crawl($CITY);
	$body = '';
	if (0 == count($items)) die();
	foreach ($items as $item) {
		$body .= ucwords(strtolower(htmlspecialchars_decode($item))).'<br/>';
	}
	if (0 < strlen($body)) echo $body;
}
?>