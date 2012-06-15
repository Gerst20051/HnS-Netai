<?php
function init() {
	include 'cod/index.php';
}

function check($host, $find) {
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

function alertHost($host) {
	$headers = 'From: alerts@hns.netai.net';
	if (mail('hnsalerts@gmail.com', 'Monitoring', $host.' down', $headers)) {
		echo 'Mail sent';
	} else {
		echo 'Mail not sent';
	}
}

init();
?>