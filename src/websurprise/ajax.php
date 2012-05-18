<?php
session_start();

require_once 'mysql.class.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
if (isset($_POST['input']) && !empty($_POST['input'])) {
try {
	$db = new MySQL();
	$db->insert(MYSQL_TABLE, array(
		'website'=>$_POST['input'],
		'timestamp'=>$_POST['timestamp']
	));
} catch(Exception $e) {
	echo $e->getMessage();
	exit();
}
}
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
if (isset($_GET['body'])) {
?>
<div id="doc">
<header><div>Web Surprise<div></header>
<div id="in"><input id="website" type="text"/></div>
</div>
<?php
} elseif (isset($_GET['timestamp']) && !empty($_GET['timestamp'])) {
try {
	$db = new MySQL();
	$db->query('SELECT * FROM '.MYSQL_TABLE.' WHERE timestamp > '.$_GET['timestamp']);
	if ($db->numRows() > 0) {
		header('Content-Type: text/javascript; charset=utf8');
		print_r(json_encode($db->fetchRow()));
	} else die('0');
} catch(Exception $e) {
	echo $e->getMessage();
	exit();
}
}
}
?>