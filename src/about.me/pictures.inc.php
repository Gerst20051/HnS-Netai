<?php
class UserPictures {
private $available_services;
private $user_services;
private $services;
private $data;

public function __construct(){
	$this->available_services = array('facebook','instagram');
	$this->user_services = array('facebook');
	$this->services = array_values(array_intersect($available_services, $user_services));
	$this->data = array();
}

public function retrieve(){
	$gravatar = $this->gravatar();

	if (is_array($gravatar)) {
		array_push($this->data, $gravatar);
	}

	foreach ($services as $service) {
		array_push($this->data, call_user_func_array(array($this,$service)));
	}

	return $this->data;
}

public function gravatar(){
	$email = "gerst20051@gmail.com";
	$md5email = md5(strtolower($email));
	$gravatar = "http://www.gravatar.com/avatar/$md5email?d=404";
	$headers = get_headers($gravatar,1);
	if ($headers[0] == 'HTTP/1.0 200 OK') {
		$gravatar = 'http://www.gravatar.com/avatar/'.$md5email.'?s=250';
		$data = array("gravatar"=>$gravatar);
		return $data;
	} else {
		return null;
	}
}

public function facebook(){
	require_once 'api/facebook.inc.php';
	$facebook_picture = "https://graph.facebook.com/andrew.gerst/picture?type=large";
	$facebook = new Facebook(array(
		'appId'  => '404460542963529',
		'secret' => '8da32c67b3de74a40ffce87be9388ad2',
	));

	$fb_user = $facebook->api('/'.$fb_username);
}

public function instagram(){
	// work to be done
	// parse web profile using phpdom
}
}
?>