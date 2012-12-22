<?php
session_start();

require_once 'config.inc.php';
require_once 'functions.inc.php';
require_once 'mysql.class.php';

if (!$con = mysql_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD)) throw new Exception('Error connecting to the server');
if (!mysql_select_db(MYSQL_DATABASE,$con)) throw new Exception('Error selecting database');

switch ($_SERVER['REQUEST_METHOD']) {
case 'POST': $_REQ = $_POST; break;
case 'GET': $_REQ = $_GET; break;
default: $_REQ = $_GET; break;
}

setglobal($_REQ);

switch ($_SERVER['REQUEST_METHOD']) {
case 'POST':
if ($ACTION == 'login') {
	require_once 'encryption.inc.php';
	$VARS = array_map('varcheck',$FORM);
	if ($VARS['formname'] != 'login') print_json(array('logged'=>false));
	else unset($VARS['formname']);
	if (!validateinput($VARS,array('email','password'))) print_json(array('logged'=>false));
	extract($VARS);
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT salt FROM `%s` WHERE email = "%s" LIMIT 1',MYSQL_TABLE,$email));
		if ($db->numRows()) {
			$result = $db->fetchAssocRow();
			$salt = $result['salt'];
			$secure_password = pbkdf2($password,$salt);
			$db->sfquery(array('SELECT %s FROM `%s` WHERE email = "%s" AND pass = "%s" LIMIT 1',MYSQL_ALL,MYSQL_TABLE,$email,$secure_password));
			if ($db->numRows()) {
				$row = $db->fetchAssocRow();
				$_SESSION['logged'] = true;
				$_SESSION['user_id'] = $row['user_id'];
				$_SESSION['email'] = $row['email'];
				$_SESSION['pageurl'] = $row['pageurl'];
				$_SESSION['fullname'] = $row['firstname'] . ' ' . $row['lastname'];
				$_SESSION['firstname'] = $row['firstname'];
				$_SESSION['lastname'] = $row['lastname'];
				$_SESSION['access_level'] = $row['access_level'];
				$_SESSION['last_login'] = $row['last_login'];
				$last_login = time();
				$logins = $row['logins']+1;
				$db->sfquery(array('UPDATE `%s` SET last_login = "%s", logins = "%s" WHERE user_id = %s',MYSQL_TABLE,$last_login,$logins,$_SESSION['user_id']));
				print_json(array('logged'=>true));
			} else print_json(array('logged'=>false));
		} else print_json(array('logged'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'register') {
	require_once 'encryption.inc.php';
	$VARS = array_map('varcheck',$FORM);
	if ($VARS['formname'] != 'register') print_json(array('registered'=>false));
	else unset($VARS['formname']);
	$required = array('name','email','password','pageurl');
	if (!validateinput($VARS,$required)) print_json(array('registered'=>false));
	extract($VARS);
	list($firstname, $lastname) = split(' ',ucname($name));
	$salt = genSalt();
	$secure_password = pbkdf2($password,$salt);
	$timestamp = time();
	try {
		$db = new MySQL();
		$db->insert(MYSQL_TABLE, array(
			'email'=>$email,
			'pass'=>$secure_password,
			'salt'=>$salt,
			'pageurl'=>$pageurl,
			'firstname'=>$firstname,
			'lastname'=>$lastname,
			'access_level'=>1,
			'last_login'=>$timestamp,
			'date_joined'=>$timestamp,
			'logins'=>1
		));
		if ($db->affectedRows()) {
			$user_id = $db->insertID();
			$_SESSION['logged'] = true;
			$_SESSION['user_id'] = $user_id;
			$_SESSION['email'] = $email;
			$_SESSION['pageurl'] = $pageurl;
			$_SESSION['fullname'] = $firstname . ' ' . $lastname;
			$_SESSION['firstname'] = $firstname;
			$_SESSION['lastname'] = $lastname;
			$_SESSION['access_level'] = 1;
			$_SESSION['last_login'] = $timestamp;
			print_json(array('registered'=>true));
		} else print_json(array('registered'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'logout') {
	logout();
	print_json(array('logged'=>false));
} elseif ($ACTION == 'addpage') {
	$VARS = array_map('varcheck',$FORM);
	if ($VARS['formname'] != 'addpage') print_json(array('added'=>false));
	else unset($VARS['formname']);
	$required = array('name','url');
	if (!validateinput($VARS,$required)) print_json(array('added'=>false));
	extract($VARS);
	$page = array("name"=>$name,"url"=>$url);
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT pages FROM `%s` WHERE user_id = %s LIMIT 1',MYSQL_TABLE,$_SESSION['user_id']));
		if ($db->numRows()) {
			$row = $db->fetchAssocRow();
			$pages = json_decode($row['pages']);
			array_push($pages,$page);
			$data = json_encode($pages);
			$db->sfquery(array('UPDATE `%s` SET pages = "%s" WHERE user_id = %s',MYSQL_TABLE,$data,$_SESSION['user_id']));
			if ($db->affectedRows()) print_json(array('added'=>true));
			else print_json(array('added'=>false));
		} else print_json(array('added'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'deletepage') {
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT pages FROM `%s` WHERE user_id = %s LIMIT 1',MYSQL_TABLE,$_SESSION['user_id']));
		if ($db->numRows()) {
			$row = $db->fetchAssocRow();
			$pages = json_decode($row['pages']);
			$original_amount = count($pages);
			array_splice($pages, $index, 1);
			$new_amount = count($pages);
			$diff = $original_amount - $new_amount;
			$data = json_encode($pages);
			$db->sfquery(array('UPDATE `%s` SET pages = "%s" WHERE user_id = %s',MYSQL_TABLE,$data,$_SESSION['user_id']));
			if ($db->affectedRows() && $diff) print_json(array('deleted'=>true));
			else print_json(array('deleted'=>false));
		} else print_json(array('deleted'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'updatepage') {
	$VARS = array_map('varcheck',$FORM);
	if ($VARS['formname'] != 'updatepage') print_json(array('added'=>false));
	else unset($VARS['formname']);
	$required = array('index','name','url');
	if (!validateinput($VARS,$required)) print_json(array('added'=>false));
	extract($VARS);
	$page = array("name"=>$name,"url"=>$url);
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT pages FROM `%s` WHERE user_id = %s LIMIT 1',MYSQL_TABLE,$_SESSION['user_id']));
		if ($db->numRows()) {
			$row = $db->fetchAssocRow();
			$pages = json_decode($row['pages']);
			$pages[$index] = $page;
			$data = json_encode($pages);
			$db->sfquery(array('UPDATE `%s` SET pages = "%s" WHERE user_id = %s',MYSQL_TABLE,$data,$_SESSION['user_id']));
			if ($db->affectedRows()) print_json(array('updated'=>true));
			else print_json(array('updated'=>false));
		} else print_json(array('updated'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
}
break;
case 'GET':
if ($ACTION == 'logged') {
	if (isset($_SESSION['logged'])) print_json(array('logged'=>true));
	else print_json(array('logged'=>false));
} elseif ($ACTION == 'checkemail') {
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT email FROM `%s` WHERE email = "%s" LIMIT 1',MYSQL_TABLE,$EMAIL));
		if ($db->numRows()) print_json(array('email'=>true));
		else print_json(array('email'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'userdata') {
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT %s FROM `%s` WHERE user_id = %s LIMIT 1',MYSQL_ALL,MYSQL_TABLE,$_SESSION['user_id']));
		if ($db->numRows()) {
			$data = $db->fetchParsedRow();
			print_json(array('user'=>$data));
		} else print_json(array('user'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'profile') {
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT %s FROM `%s` WHERE pageurl = "%s" LIMIT 1',MYSQL_ALL,MYSQL_TABLE,$PAGEURL));
		if ($db->numRows()) {
			$data = $db->fetchParsedRow();
			print_json(array('user'=>$data));
		} else print_json(array('user'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
}
break;
}

exit();
?>