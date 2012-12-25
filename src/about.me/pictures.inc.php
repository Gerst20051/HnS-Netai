<?php
/**
 * facebook:	https://developers.facebook.com/docs/reference/api/
 * instagram:	http://instagram.com/developer/
 * 
 *
 */

class UserPictures {
private $available_services = array();
private $user_services = array();
private $user_accounts = array();
private $services = array();
private $data = array();

public function __construct($data = array()){
	$this->available_services = array('facebook','instagram');
	if (is_array($data)) {
		if (is_array($data['services'])) $this->user_services = $data['services'];
		if (is_array($data['usernames'])) $this->user_accounts = $data['usernames'];
	}
	$this->services = array_values(array_intersect($this->available_services, $this->user_services));
}

public function retrieve(){
	$gravatar = $this->gravatar();

	if (is_array($gravatar)) {
		array_push($this->data, $gravatar);
	}

	foreach ($this->services as $service) {
		$result = $this->$service();
		if (!is_null($result)) array_push($this->data, $result);
	}

	return $this->data;
}

public function gravatar(){
	$email = "gerst20051@gmail.com";
	$md5email = md5(strtolower($email));
	$gravatar = "http://www.gravatar.com/avatar/$md5email?d=404";
	$headers = get_headers($gravatar,1);
	if (strpos($headers[0], '200 OK')) {
		$gravatar = 'http://www.gravatar.com/avatar/'.$md5email.'?s=180';
		$data = array("gravatar"=>$gravatar);
		return $data;
	} else {
		return null;
	}
}

public function facebook(){
	$facebook = 'https://graph.facebook.com/'.$this->user_accounts['facebook'].'/picture?type=large';
	$data = array("facebook"=>$facebook);
	return $data;
}

public function instagram(){
	// work to be done
	// parse web profile using phpdom
}
}

/******************************************
 ********** Possible Services *************
 ******************************************
 * Github
 * Twitter
 * Vizify
 * Foursquare
 * Pandora
 * YouTube
 * MySpace
 * Dailybooth
 * Xfire
 * Tastebuds.fm
 * Hulu
 * Khan Academy
 * Last.fm
 * Soundcloud
 * Stumbleupon
 * Qik
 * Diigo
 * Linkedin
 * Yahoo
 * Imageshack
 * Photobucket
 * Quora
 * StackOverflow Careers
 * about.me
 * Ted
 * SlideShare
 * Spotify
 * Coderwall
 * Google Code
 * Pastebin
 * StackOverflow
 * Blogger
 * Google+
 */
?>