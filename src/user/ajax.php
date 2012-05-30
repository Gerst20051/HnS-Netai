<?php
session_start();
header('Access-Control-Allow-Origin: *');

require_once 'functions.inc.php';
require_once 'api.inc.php';
require_once 'mysql.class.php';

if (!$con = mysql_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD)) throw new Exception('Error connecting to the server');
if (!mysql_select_db(MYSQL_DATABASE,$con)) throw new Exception('Error selecting database');

if (varcheck($_GET['action'])) $ACTION = $_GET['action'];

switch ($_SERVER['REQUEST_METHOD']) {
case 'POST':

break;
case 'GET':
	if ($ACTION == 'logged') {
		if (isset($_SESSION['logged'])) print_json(array('logged'=>true),true);
		else print_json(array('logged'=>false),true);
	} elseif ($ACTION == 'login') {
?>
<div id="login">
<form id="f_login" action="#" method="post" onsubmit="return false">
<input type="hidden" name="login"/>
<div><label for="lusername">Username:</label><input type="text" name="lusername" id="lusername" value=""/></div>
<div><label for="lpassword">Password:</label><input type="password" name="lpassword" id="lpassword" value=""/></div>
<div class="buttonTools">
<ul class="toolList lfloat">
<li class="listItem"><label class="loginButton" for="b_login_splash"><input value="Login" type="submit" id="b_login_splash"/></label></li>
<li class="listItem"><label class="registerButton" for="b_register_splash"><input value="Register" type="button" id="b_register_splash"/></label></li>
</ul>
</div>
</form>
</div>
<?php
} elseif ($_GET['p'] == 'register') {
?>
<div id="register">
<header>Register</header>
<form id="f_register" action="#" method="post" onsubmit="return false">
<input type="hidden" name="register"/>
<div><label for="reg_username">Username:</label><input type="text" name="reg_username" id="reg_username" value=""/></div>
<div><label for="reg_password">Password:</label><input type="password" name="reg_password" id="reg_password" value=""/></div>
<div><label for="reg_name">Full Name:</label><input type="text" name="reg_name" id="reg_name" value=""/></div>
<div><label for="reg_email">Email:</label><input type="email" name="reg_email" id="reg_email" value=""/></div>
<div><label for="reg_city">Current City:</label><input type="text" name="reg_city" id="reg_city" value=""/></div>
<div><label for="reg_hometown">Hometown:</label><input type="text" name="reg_hometown" id="reg_hometown" value=""/></div>
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
<li class="listItem"><label class="loginButton" for="b_login"><input value="Login" type="submit" id="b_login"/></label></li>
<li class="listItem"><label class="registerButton" for="b_register"><input value="Register" type="submit" id="b_register"/></label></li>
</ul>
</div>
</form>
</div>
<script>
(function(){
var bday="",byear="";
for (i=1;i<=31;i++){bday+="<option value=\""+i+"\">"+i+"</option>";}
for (i=2011;i>=1902;i--){byear+="<option value=\""+i+"\">"+i+"</option>";}
$("#reg_bday").append(bday);
$("#reg_byear").append(byear);
})();
</script>
<?php
}
break;
}
?>