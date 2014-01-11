<?php
/**
 * facebook:	https://developers.facebook.com/docs/reference/api/
 * twitter: 	https://dev.twitter.com/
 *				https://dev.twitter.com/docs/api/1/get/followers/ids
 *				https://api.twitter.com/1/followers/ids.json?cursor=-1&screen_name=twitterapi
 *
 *				https://api.twitter.com/1/friends/ids.json?cursor=-1&screen_name=twitterapi
 *				https://dev.twitter.com/docs/api/1/get/users/lookup
 *				https://api.twitter.com/1/users/lookup.json?screen_name=twitterapi,twitter&include_entities=true
 * github: 		http://developer.github.com/v3/
 * foursquare: 	https://developer.foursquare.com/
 * youtube: 	https://developers.google.com/youtube/2.0/reference
 *				https://developers.google.com/youtube/2.0/developers_guide_php
 *				http://gdata.youtube.com/feeds/api/users/andrewmofizzy?alt=json
 *				http://gdata.youtube.com/feeds/api/users/andrewmofizzy/playlists?alt=json
 *				http://gdata.youtube.com/feeds/api/users/andrewmofizzy/uploads?alt=json
 *				http://gdata.youtube.com/feeds/api/users/andrewmofizzy/subscriptions?alt=json
 * blogspot:	http://andrewgerst.blogspot.com/feeds/posts/default?alt=json
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
	$this->available_services = array('facebook','twitter','github','youtube');
	if (is_array($data)) {
		if (is_array($data['services'])) $this->user_services = $data['services'];
		if (is_array($data['usernames'])) $this->user_accounts = $data['usernames'];
		if (check($data['email'])) $this->user_email = $data['email'];
	}
	$this->services = array_values(array_intersect($this->available_services, $this->user_services));
}

private function parse_tweet($tweet){
	$search = array('|(http://[^ ]+)|', '/(^|[^a-z0-9_])@([a-z0-9_]+)/i', '/(^|[^a-z0-9_])#([a-z0-9_]+)/i');
	$replace = array('<a target="_blank" href="$1">$1</a>', '$1<a target="_blank" href="http://twitter.com/$2">@$2</a>', '$1<a target="_blank" href="http://search.twitter.com/search?q=$2&src=hash">#$2</a>');
	$tweet = preg_replace($search, $replace, $tweet);
	return $tweet;
}

public function retrieve(){
	foreach ($this->services as $service) {
		$result = $this->$service();
		if (!is_null($result)) $this->data[$service] = $result;
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
			'exclude_replies'	=> false,
			'trim_user'			=> true,
			'count'				=> 10
		)
	);
	$data_timeline = $twitter->response;
	$twitter->request('GET', $twitter->url('1.1/users/show'),
		array(
			'screen_name'		=> $this->user_accounts['twitter'],
		)
	);
	$data_user = $twitter->response;
	if ($data_timeline['code'] == 200 && $data_user['code'] == 200) {
		$response_timeline = json_decode($data_timeline['response']);
		$response_user = json_decode($data_user['response']);
		$url = $response_user->profile_banner_url.'/web';
		$reply = array(
			'handle'=>$this->user_accounts['twitter'],
			'statuscount'=>$response_user->statuses_count,
			'followerscount'=>$response_user->followers_count,
			'coverphoto'=>$url,
			'tweets'=>array()
		);
		foreach ($response_timeline as $tweet) {
			$text = $this->parse_tweet($tweet->text);
			$date = $tweet->created_at;
			array_push($reply['tweets'], array('text'=>$text,'date'=>$date));
		}
		return $reply;
	}
}

public function github(){
	$handle = $this->user_accounts['github'];
	$data = getJSON('https://api.github.com/users/'.$handle.'/repos', 'github');
	$reply = array(
		'handle'=>$handle,
		'repos'=>array()
	);
	foreach ($data as $repo) {
		$name = $repo->name;
		$url = str_replace(array('api.','/repos','{archive_format}{/ref}'), '', $repo->archive_url);
		$description = $repo->description;
		$language = $repo->language;
		$date = $repo->pushed_at;
		array_push($reply['repos'], array('name'=>$name,'url'=>$url,'description'=>$description,'language'=>$language,'date_pushed'=>$date));
	}
	return $reply;
}

public function youtube(){
	$handle = $this->user_accounts['youtube'];
	$data = getJSON('http://gdata.youtube.com/feeds/api/users/'.$handle.'?alt=json');
	$entry = $data->entry;
	$stats = $entry->{'yt$statistics'};
	$reply = array(
		'handle'=>$handle,
		'lastupdated'=>$entry->updated->{'$t'},
		'lastwebaccess'=>$stats->lastWebAccess,
		'subscribercount'=>(int) $stats->subscriberCount,
		'uploadviews'=>(int) $stats->totalUploadViews,
		'viewcount'=>(int) $stats->viewCount,
		'uploads'=>array(),
		'subscriptions'=>array()
	);
	return $reply;
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
 * Vimeo
 * Formspring
 ** Tumblr
 */
?>
