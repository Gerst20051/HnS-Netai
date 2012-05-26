<?php
session_start();
header('Access-Control-Allow-Origin: *');

require_once 'functions.inc.php';
require_once 'api.inc.php';
require_once 'mysql.class.php';

if (!$con = mysql_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD)) throw new Exception('Error connecting to the server');
if (!mysql_select_db(MYSQL_DATABASE,$con)) throw new Exception('Error selecting database');

if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) $UID = (int)$_SESSION['user_id'];
if (isset($_POST['id']) && !empty($_POST['id'])) $PID = (int)$_POST['id'];
if (isset($_POST['contact']) && !empty($_POST['contact'])) $CONTACT = $_POST['contact'];
if (isset($_REQUEST['type']) && !empty($_REQUEST['type'])) $TYPE = $_REQUEST['type'];

switch ($_SERVER['REQUEST_METHOD']) {
case 'GET':
	$query = mysql_query('SELECT contacts FROM `'.MYSQL_TABLE.'` WHERE user_id = '.$UID);
	$row = mysql_fetch_array($query);
	echo $row[0];
break;
case 'POST':
	if (!empty($PID) && !empty($CONTACT) && !empty($TYPE)) {
		$query = mysql_query('SELECT contacts FROM `'.MYSQL_TABLE.'` WHERE user_id = '.$UID);
		$row = mysql_fetch_array($query);
		$row = json_decode($row[0]);
		if ($TYPE == 1) {
			$row[$PID] = $CONTACT;
		} elseif ($TYPE == 2) {
			unset($row[$PID]);
			$row = array_values($row);
		}
		$contacts = json_encode($row);
		mysql_query('UPDATE `'.MYSQL_TABLE.'` SET contacts = "'.$contacts.'" WHERE user_id = '.$UID);
	}
break;
}
?>