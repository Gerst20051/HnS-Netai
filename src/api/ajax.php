<?php
session_start();
header('Access-Control-Allow-Origin: *');

require_once 'config.inc.php';
require_once 'functions.inc.php';
require_once 'api.inc.php';
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
	$VARS = array_map('varcheck',$_REQ['form']);
	if ($VARS['formname'] != 'login') print_json(array('logged'=>false));
	else unset($VARS['formname']);
	if (!validateinput($VARS,array('username','password'))) print_json(array('logged'=>false));
	extract($VARS);
	try {
		$db = new MySQL();
		$db->sfquery(array('SELECT * FROM login u JOIN info i ON u.user_id = i.user_id WHERE username = "%s" AND pass = PASSWORD("%s") LIMIT 1',$username,substr(base64_decode($password),3)));		
		if ($db->numRows() == 1) {
			$row = $db->fetchParsedRow();
			$_SESSION['logged'] = true;
			$_SESSION['user_id'] = $row['user_id'];
			$_SESSION['username'] = $row['username'];
			$_SESSION['access_level'] = $row['access_level'];
			$_SESSION['last_login'] = $row['last_login'];
			if (varcheck($row['middlename'],true)) $_SESSION['fullname'] = $row['firstname'] . ' ' . $row['middlename'] . ' ' . $row['lastname'];
			else $_SESSION['fullname'] = $row['firstname'] . ' ' . $row['lastname'];
			$_SESSION['firstname'] = $row['firstname'];
			if (varcheck($row['middlename'],true)) $_SESSION['middlename'] = $row['middlename'];
			$_SESSION['lastname'] = $row['lastname'];
			if (varcheck($row['images'],true)) $_SESSION['images'] = $row['images'];
			$last_login = date('Y-m-d');
			$logins = $row['logins']+1;
			$db->sfquery(array('UPDATE `%s` SET last_login = "%s", logins = "%s" WHERE user_id = %s','login',$last_login,$logins,$_SESSION['user_id']));
			print_json(array('logged'=>true));
		} else print_json(array('logged'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'register') {
	$VARS = array_map('varcheck',$_REQ['form']);
	if ($VARS['formname'] != 'register') print_json(array('logged'=>false));
	else unset($VARS['formname']);
	$required = array('username','password','name','email','city','gender','bmonth','bday','byear');
	if (!validateinput($VARS,$required)) print_json(array('logged'=>false));
	extract($VARS);
	if (empty($hometown)) $hometown = $city;
	list($firstname, $middlename, $lastname) = split(' ',ucname($name));
	if (!isset($lastname)) { $lastname = $middlename; $middlename = ''; }
	try {
		$db = new MySQL();
		$db->insert('login', array(
			'username'=>$username,
			'access_level'=>1,
			'last_login'=>date('Y-m-d'),
			'date_joined'=>date('Y-m-d'),
			'logins'=>1
		));
		$user_id = $db->insertID();
		$db->query('UPDATE login SET pass = PASSWORD("'.mysql_real_escape_string(substr(base64_decode($password),3)).'") WHERE user_id = '.$user_id);
		$db->insert('info', array(
			'user_id'=>$user_id,
			'firstname'=>$firstname,
			'middlename'=>$middlename,
			'lastname'=>$lastname,
			'email'=>$email,
			'gender'=>$gender,
			'hometown'=>$hometown,
			'current_city'=>$city,
			'birth_month'=>$bmonth,
			'birth_day'=>$bday,
			'birth_year'=>$byear
		));
		if ($db->affectedRows() == 1) {
			$_SESSION['logged'] = true;
			$_SESSION['user_id'] = $user_id;
			$_SESSION['username'] = $username;
			$_SESSION['access_level'] = 1;
			$_SESSION['last_login'] = date('Y-m-d');
			if (varcheck($middlename,true)) {
				$_SESSION['fullname'] = $firstname . ' ' . $middlename . ' ' . $lastname;
				$_SESSION['middlename'] = $middlename;
			} else $_SESSION['fullname'] = $firstname . ' ' . $lastname;
			$_SESSION['firstname'] = $firstname;
			$_SESSION['lastname'] = $lastname;
			print_json(array('logged'=>true));
		} else print_json(array('logged'=>false));
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == 'logout') {
	logout();
	print_json(array('logged'=>false));
}
break;
case 'GET':
if ($ACTION == 'init') {
$content = <<<CONTENT
	<div class="hns lightbox">
	<div id="hns" class="modal">
	<div id="login">
	<header>Login using Homenet Spaces</header>
	<form id="f_login" onsubmit="return false">
	<input type="hidden" name="formname" value="login"/>
	<div><label for="lusername">Username:</label><input id="lusername" name="username" type="text" value=""/></div>
	<div><label for="lpassword">Password:</label><input id="lpassword" name="password" type="password" value=""/></div>
	<div class="buttonTools">
	<ul class="toolList rfloat">
	<li class="listItem"><label class="loginButton" for="b_login_splash"><input id="b_login_splash" value="Login" type="submit"/></label></li>
	<li class="listItem"><label class="registerButton" for="b_register_splash"><input id="b_register_splash" value="Register" type="button"/></label></li>
	</ul>
	</div>
	</form>
	</div>
	<div id="register">
	<header>Register for Homenet Spaces</header>
	<form id="f_register" onsubmit="return false">
	<input type="hidden" name="formname" value="register"/>
	<div><label for="reg_username">Username:</label><input id="reg_username" name="username" type="text" value=""/></div>
	<div><label for="reg_password">Password:</label><input id="reg_password" name="password" type="password" value=""/></div>
	<div><label for="reg_name">Full Name:</label><input id="reg_name" name="name" type="text" value=""/></div>
	<div><label for="reg_email">Email:</label><input id="reg_email" name="email" type="email" value=""/></div>
	<div><label for="reg_city">Current City:</label><input id="reg_city" name="city" type="text" value=""/></div>
	<div><label for="reg_hometown">Hometown:</label><input id="reg_hometown" name="hometown" type="text" value=""/></div>
	<div>
	<label for="reg_gender">Gender:</label>
	<select id="reg_gender" name="gender">
	<option value="0"></option>
	<option value="male">Male</option>
	<option value="female">Female</option>
	</select> 
	</div>
	<div>
	<label for="reg_bmonth">Birth Date:</label>
	<select id="reg_bmonth" name="bmonth">
	<option value="0"></option>
	<option value="1">January</option>
	<option value="2">February</option>
	<option value="3">March</option>
	<option value="4">April</option>
	<option value="5">May</option>
	<option value="6">June</option>
	<option value="7">July</option>
	<option value="8">August</option>
	<option value="9">September</option>
	<option value="10">October</option>
	<option value="11">November</option>
	<option value="12">December</option>
	</select>
	<select id="reg_bday" name="bday"><option value="0"></option></select>
	<select id="reg_byear" name="byear"><option value="0"></option></select>
	</div>
	<div class="buttonTools">
	<ul class="toolList lfloat">
	<li class="listItem"><label class="loginButton" for="b_login"><input id="b_login" value="Login" type="submit"/></label></li>
	<li class="listItem"><label class="registerButton" for="b_register"><input id="b_register" value="Register" type="submit"/></label></li>
	</ul>
	</div>
	</form>
	</div>
	<script>
	(function(){
	var bday="",byear="",date=new Date();
	for (i=1;i<=31;i++){bday+="<option value=\""+i+"\">"+i+"</option>";}
	for (i=date.getFullYear();i>=1902;i--){byear+="<option value=\""+i+"\">"+i+"</option>";}
	$("#reg_bday").append(bday);
	$("#reg_byear").append(byear);
	})();
	</script>
	</div>
	</div>
CONTENT;
	if (isset($_SESSION['logged'])) print_json(array('logged'=>true,'html'=>$content),true);
	else print_json(array('logged'=>false,'html'=>$content),true);
} elseif ($ACTION == 'username') {
	try {
		$db = new MySQL();
		$db->query('SELECT username FROM login WHERE username = "'.$USERNAME.'" LIMIT 1');
		if ($db->numRows() == 1) print_json(array('user'=>true),true);
		else print_json(array('user'=>false),true);
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
} elseif ($ACTION == "userdata") {
	// print_r($_SESSION);
	if (LOCAL) {
		// Rethink this strategy because register globals is disabled for netai.
		varcheck($UID,true,$_SESSION['user_id'],"uid");
	} else {
		// $UID = $_SESSION['user_id'];
		$UID = 1;
	}
	try {
		$db = new MySQL();
		$db->query('SELECT u.user_id,u.username,i.firstname,i.middlename,i.lastname,i.images FROM (login u JOIN info i ON u.user_id = i.user_id) WHERE u.user_id = '.$UID.' LIMIT 1');
		if ($db->numRows() == 1) {
			header('Content-Type: application/json; charset=utf8');
			print_json(array('user'=>$db->fetchParsedRow()));
		} else print_json(array('user'=>false),true);
	} catch(Exception $e) {
		echo $e->getMessage();
		exit();
	}
}
break;
}
?>