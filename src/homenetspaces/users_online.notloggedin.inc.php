<?php
include ("db.om.inc.php");
include ("validip.inc.php");

$t_stamp = time();
$timeout = ($t_stamp - 600);

if (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != null) $phpself = $_SERVER['PHP_SELF'] . "?" . $_SERVER['QUERY_STRING'];
else $phpself = $_SERVER['PHP_SELF'];

mysql_db_query($om, "INSERT INTO users_online VALUES ('$t_stamp','$ip','0','guest','$phpself')") or die("Database INSERT Error");
mysql_db_query($om, "DELETE FROM users_online WHERE timestamp < $timeout") or die("Database DELETE Error");
?>