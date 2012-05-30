<?php
session_start();
header('Access-Control-Allow-Origin: *');

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

if (varcheck($_GET['action'])) $ACTION = $_REQ['action'];

switch ($_SERVER['REQUEST_METHOD']) {
case 'POST':

break;
case 'GET':
	if ($ACTION == 'logged') {
		if (isset($_SESSION['logged'])) print_json(array('logged'=>true),true);
		else print_json(array('logged'=>false),true);
	} elseif ($ACTION == 'hnsuser') {
?>
<div class="lightbox">
<div id="hnsuser" class="modal">
<div id="login">
<header>Login</header>
<form id="f_login" onsubmit="return false">
<input type="hidden" name="login"/>
<div><label for="lusername">Username:</label><input type="text" name="lusername" id="lusername" value=""/></div>
<div><label for="lpassword">Password:</label><input type="password" name="lpassword" id="lpassword" value=""/></div>
<div class="buttonTools">
<ul class="toolList lfloat">
<li class="listItem"><label class="loginButton" for="b_login_splash"><input id="b_login_splash" value="Login" type="submit"/></label></li>
<li class="listItem"><label class="registerButton" for="b_register_splash"><input id="b_register_splash" value="Register" type="button"/></label></li>
</ul>
</div>
</form>
</div>
<div id="register">
<header>Register</header>
<form id="f_register" onsubmit="return false">
<input type="hidden" name="register"/>
<div><label for="reg_username">Username:</label><input id="reg_username" name="reg_username" type="text" value=""/></div>
<div><label for="reg_password">Password:</label><input id="reg_password" name="reg_password" type="password" value=""/></div>
<div><label for="reg_name">Full Name:</label><input id="reg_name" name="reg_name" type="text" value=""/></div>
<div><label for="reg_email">Email:</label><input id="reg_email" name="reg_email" type="email" value=""/></div>
<div><label for="reg_city">Current City:</label><input id="reg_city" name="reg_city" type="text" value=""/></div>
<div><label for="reg_hometown">Hometown:</label><input id="reg_hometown" name="reg_hometown" type="text" value=""/></div>
<div>
<label for="reg_gender">Gender:</label>
<select name="reg_gender" id="reg_gender">
<option value="0"></option>
<option value="male">Male</option>
<option value="female">Female</option>
</select> 
</div>
<div>
<label for="reg_bmonth">Birth Date:</label>
<select name="reg_bmonth" id="reg_bmonth">
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
<select name="reg_bday" id="reg_bday"><option value="0"></option></select>
<select name="reg_byear" id="reg_byear"><option value="0"></option></select>
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
var bday="",byear="",theDate=new Date();
for (i=1;i<=31;i++){bday+="<option value=\""+i+"\">"+i+"</option>";}
for (i=theDate.getFullYear();i>=1902;i--){byear+="<option value=\""+i+"\">"+i+"</option>";}
$("#reg_bday").append(bday);
$("#reg_byear").append(byear);
})();
</script>
</div>
</div>
<?php
	} elseif ($ACTION == "username") {
		try {
			$db = new MySQL();
			$db->query('SELECT username FROM login WHERE username = "'.$_REQ['username'].'" LIMIT 1');
			if ($db->numRows() == 1) print_json(array('user'=>true),true);
			else print_json(array('user'=>false),true);
		} catch(Exception $e) {
			echo $e->getMessage();
			exit();
		}
	}
break;
}
?>