<?php
function init(){
	// include 'cod/index.php';
	// checkHnSYouTube();
}

function check($host, $find){
	$fp = fsockopen($host, 80, $errno, $errstr, 10);
	if (!$fp) echo "$errstr ($errno)\n";
	else {
		$header = "GET / HTTP/1.1\r\n";
		$header .= "Host: $host\r\n";
		$header .= "Connection: close\r\n\r\n";
		fputs($fp, $header);
		while (!feof($fp)) {
			$str .= fgets($fp, 1024);
		}
		fclose($fp);
		return (strpos($str, $find) !== false);
	}
}

function alertHost($host){
	$headers = 'From: alerts@hns.netai.net';
	if (mail('hnsalerts@gmail.com', 'Monitoring', $host.' down', $headers)) {
		echo 'Mail sent';
	} else {
		echo 'Mail not sent';
	}
}

function alertHostDown($host){
	$headers[] = 'Content-Transfer-Encoding: 7bit';
	$headers[] = 'From: alerts@hns.netai.net';
	mail('hnsalerts@gmail.com', 'Monitoring', $host.' down', implode("\r\n", $headers));
}

function checkHnSYouTube(){
	$host = 'www.hnsyoutube.webs.com';
	$find = 'HnS YouTube Instant';
	if (!check($host, $find)) alertHostDown($host);
}

init();
?>