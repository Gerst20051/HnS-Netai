<?php
include 'server.php';

$ips = array(
	'{ESC} FreezeTag HC'=>'204.62.13.235',
	'[CC] Broadcast HC SD'=>'68.232.176.242',
	'XI FreezeTag Server 1'=>'69.9.170.53',
	'XI MW2 Freezetag Chicago'=>'68.232.176.207'
);

$body = "";

foreach ($ips as $key => $ip) {
	$status = new COD4ServerStatus($ip,'28960');
	if ($status->getServerStatus()) {
		$status->parseServerData();
		$serverStatus = $status -> returnServerData();
		$players = $status->returnPlayers();
		$body .= "Server: ".$serverStatus['sv_hostname']."\r\n";
		foreach ($players as $i => $v) {
			$body .= " - ".$players[$i]."\r\n";
		}
	}
}

$header = array();
$headers[] = 'Content-Transfer-Encoding: 7bit';
$headers[] = 'From: alerts@hns.netai.net';
mail('hnsalerts@gmail.com', 'CoD Server Status', $body, implode("\r\n", $headers));
?>