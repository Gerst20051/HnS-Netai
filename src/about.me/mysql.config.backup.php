<?php
if (LOCAL) {
	define('MYSQL_HOST','');
	define('MYSQL_DATABASE','');
	define('MYSQL_USER','');
	define('MYSQL_PASSWORD','');
	define('MYSQL_TABLE','');
} else {
	define('MYSQL_HOST','');
	define('MYSQL_DATABASE','');
	define('MYSQL_USER','');
	define('MYSQL_PASSWORD','');
	define('MYSQL_TABLE','');
}

define('MYSQL_ALL', 'user_id, email, pageurl, firstname, lastname, access_level, last_login, date_joined, logins, pages');
?>