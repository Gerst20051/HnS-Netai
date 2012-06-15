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

// cron job to run every hour
// 0 * * * * /usr/local/bin/php -q /htdocs/www/monitor.php
/*
Some valid examples of cron times:
0 0 * * * - will run script every midnight 0:00 AM
0 * * * * - will run script every hour
15 * * * * - will run script every 15 minutes
5 8 * * * - will run script every day 5 minutes past 8 AM
5 8 15 * * - will run script every month day 15, 5 minutes past 8 AM
5 8 * * 1 - will run script Monday only, 5 minutes past 8 AM
*/
?>