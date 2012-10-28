<?php
session_start();
header('Access-Control-Allow-Origin: *');

require_once 'functions.inc.php';
//require_once 'api.inc.php';
require_once 'mysql.class.php';

if (!$con = mysql_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD)) throw new Exception('Error connecting to the server');
if (!mysql_select_db(MYSQL_DATABASE,$con)) throw new Exception('Error selecting database');

if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) $UID = (int)$_SESSION['user_id'];
if (isset($_POST['id']) && !empty($_POST['id'])) $PID = (int)$_POST['id'];
if (isset($_POST['quote']) && !empty($_POST['quote'])) $QUOTE = $_POST['quote'];
if (isset($_POST['timestamp']) && !empty($_POST['timestamp'])) $TIMESTAMP = (int)$_POST['timestamp'];
if (isset($_REQUEST['type']) && !empty($_REQUEST['type'])) $TYPE = $_REQUEST['type'];

switch ($_SERVER['REQUEST_METHOD']) {
case 'GET':

if (isset($_GET['id']) && !empty($_GET['id'])) {
	$ID = (int)$_GET['id'];
	try {
		$db = new MySQL();
		$db->query('SELECT * FROM `'.MYSQL_TABLE.'` WHERE owner_id = '.$ID);
		$rows = $db->fetchAssocRows();
		for ($i=0;$i<count($rows);$i++) {
			$rows[$i]["quote"] = json_decode($rows[$i]["quote"]);
		}
		if (0 < $db->numRows()) {
			header('Content-Type: text/javascript; charset=utf8');
			print_r(json_encode($rows));
		} else die('0');
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif (!empty($TYPE)) {
	if ($TYPE == 'all') {
		try {
			$db = new MySQL();
			$rows = $db->fetchAssocAll(MYSQL_TABLE);
			for ($i=0;$i<count($rows);$i++) {
				$rows[$i]["quote"] = json_decode($rows[$i]["quote"]);
			}
			if (0 < $db->numRows()) {
				header('Content-Type: text/javascript; charset=utf8');
				print_r(json_encode($rows));
			} else die('0');
		} catch(Exception $e) {
			echo $e->getMessage();
			exit();
		}
	} elseif ($TYPE == 'user') {
		try {
			$db = new MySQL();
			$db->query('SELECT * FROM `'.MYSQL_TABLE.'` WHERE owner_id = '.$UID);
			$rows = $db->fetchAssocRows();
			for ($i=0;$i<count($rows);$i++) {
				$rows[$i]["quote"] = json_decode($rows[$i]["quote"]);
			}
			if (0 < $db->numRows()) {
				header('Content-Type: text/javascript; charset=utf8');
				print_r(json_encode($rows));
			} else die('0');
		} catch(Exception $e) {
			echo $e->getMessage();
			exit();
		}
	}
}

break;
case 'POST':

if (!empty($UID) && !empty($PID) && !empty($QUOTE) && !empty($TIMESTAMP) && !empty($TYPE)) {
	$type = (int)$TYPE;
	$quote = json_encode($QUOTE);
	try {
		$db = new MySQL();
		$db->query('SELECT * FROM `'.MYSQL_TABLE.'` WHERE id = '.$PID);
		if ($type === 1) {
			if (0 < $db->numRows()) {
				$db->sfquery(array('UPDATE `%s` SET quote = "%s" WHERE id = %s',MYSQL_TABLE,$quote,$PID));
			} else {
				$db->insert(MYSQL_TABLE, array(
					'owner_id'=>$UID,
					'quote'=>$quote,
					'timestamp'=>$TIMESTAMP
				));
			}
		} elseif ($type === 2) {
			if (0 < $db->numRows()) {
				$db->query('DELETE FROM `'.MYSQL_TABLE.'` WHERE id = '.$PID);
			}
		}
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
}

break;
}
?>