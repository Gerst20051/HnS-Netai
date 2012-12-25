<?php
/**
 * facebook:	https://developers.facebook.com/docs/reference/api/
 * twitter: 	https://dev.twitter.com/
 *
 */

class UserActivities {
private $available_services = array();
private $user_services = array();
private $user_accounts = array();
private $services = array();
private $user_email = '';
private $data = array();

public function __construct($data = array()){
	$this->available_services = array('facebook','twitter');
	if (is_array($data)) {
		if (is_array($data['services'])) $this->user_services = $data['services'];
		if (is_array($data['usernames'])) $this->user_accounts = $data['usernames'];
		if (check($data['email'])) $this->user_email = $data['email'];
	}
	$this->services = array_values(array_intersect($this->available_services, $this->user_services));
}

public function retrieve(){
	foreach ($this->services as $service) {
		$result = $this->$service();
		if (!is_null($result)) array_push($this->data, $result);
	}
	return $this->data;
}

public function facebook(){
	require_once 'api/facebook.inc.php';
	$fb_user = $facebook->api('/'.$this->user_accounts['facebook'].'/feed');
	//print_r($fb_user);
}

public function twitter(){
	require_once 'api/twitter.inc.php';
	$twitter->request('GET', $twitter->url('1.1/statuses/user_timeline'),
		array(
			'screen_name'		=> $this->user_accounts['twitter'],
			'include_entities'	=> false,
			'exclude_replies'	=> true,
			'trim_user'			=> true,
			'count'				=> 10
		)
	);
	$data = $twitter->response;
	if ($data['code'] == 200) {
		$tweets = json_decode($data['response']);
		$reply = array();
		foreach ($tweets as $tweet) {
			$text = $tweet->text;
			$date = $tweet->created_at;
			array_push($reply, array('text'=>$text,'date'=>$date));
		}
		$final = array("twitter"=>$reply);
		return $final;
	}
}
}

/******************************************
 ********** Possible Services *************
 ******************************************
 * Github
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