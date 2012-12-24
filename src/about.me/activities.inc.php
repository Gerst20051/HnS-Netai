<?php
/**
 * facebook:	https://developers.facebook.com/docs/reference/api/
 * instagram:	http://instagram.com/developer/
 * 
 *
 */

class UserActivities {
private $available_services;
private $user_services;
private $services;
private $data;

public function __construct(){
	$this->available_services = array('facebook');
	$this->user_services = array('facebook');
	$this->services = array_values(array_intersect($available_services, $user_services));
	$this->data = array();
}

public function retrieve(){
	foreach ($services as $service) {
		array_push($this->data, call_user_func_array(array($this,$service)));
	}
	return $this->data;
}

public function facebook(){
	require_once 'api/facebook.inc.php';
	$facebook = new Facebook(array(
		'appId'  => '404460542963529',
		'secret' => '8da32c67b3de74a40ffce87be9388ad2',
	));

	$fb_user = $facebook->api('/'.$fb_username);
}
}
?>