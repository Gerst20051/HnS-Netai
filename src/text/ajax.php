<?php
header('Access-Control-Allow-Origin: *');
//require_once 'api.inc.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$SUBJECT = (isset($_POST['subject']) && !empty($_POST['subject'])) ? $_POST['subject'] : '';
	$MESSAGE = (isset($_POST['message']) && !empty($_POST['message'])) ? $_POST['message'] : '';

	if (!empty($SUBJECT) && !empty($MESSAGE)) {
		$header = array();
		$headers[] = 'Content-Transfer-Encoding: 7bit';
		$headers[] = 'From: alerts@hns.netai.net';
		$body = "Subject: $SUBJECT\r\nMessage: $MESSAGE";
		mail('hnsalerts@gmail.com', 'Text', $body, implode("\r\n", $headers));
	}
}
?>