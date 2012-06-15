<?php
error_reporting(E_ALL);
 ini_set("display_errors", 1);
include 'server.php';

$ips = array(
	'{ESC} FreezeTag HC'=>'204.62.13.235',
	'[CC] Broadcast HC SD'=>'68.232.176.242',
	'XI FreezeTag Server 1'=>'69.9.170.53',
	'XI MW2 Freezetag Chicago'=>'68.232.176.207'
);

foreach ($ips as $key => $ip) {
	$status = new COD4ServerStatus($ip,'28960');
	if ($status->getServerStatus()) {
		$status->parseServerData();
		$players = $status->returnPlayers();
		foreach ($players as $i => $v) {
			echo $players[$i];
		}
	}
}

$headers = 'From: alerts@hns.netai.net';
//mail('hnsalerts@gmail.com', 'Monitoring', $body, $headers);
?>