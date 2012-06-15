<?php
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

function alert($host) {
	mail('hnsalerts@gmail.com', 'Monitoring', $host.' down');
}

$host = 'www.catswhoblog.com';
$find = 'Cats Who Code';
if (!check($host, $find)) alert($host);
?>