<?php
session_start();

require_once 'mysql.class.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
if (isset($_POST['input']) && !empty($_POST['input'])) {
try {
	$db = new MySQL();
	$db->insert(MYSQL_TABLE, array(
		'input'=>$_POST['input'],
		'output'=>$_POST['output']
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
<header><div>Multiuser Calculator<div></header>
<div id="out"><ol id="results"></ol></div>
<div id="in"><input id="calc" type="text"/></div>
</div>
<?php
} elseif (isset($_GET['data'])) {
try {
	$db = new MySQL();
	$db->query('SELECT * FROM '.MYSQL_TABLE.' WHERE id > '.$_GET['data']);
	if ($db->numRows() > 0) {
		header('Content-Type: text/javascript; charset=utf8');
		print_r(json_encode($db->fetchRows()));
	} else die('0');
} catch(Exception $e) {
	echo $e->getMessage();
	exit();
}
}
}
?>