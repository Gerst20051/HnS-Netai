<?php
class COD4ServerStatus {
	var $server = '127.0.0.1';
	var $port = '28960';
	var $protocol = 'udp';
	var $data = '';
	var $serverData = array();
	var $players = array();
	var $scores = array();
	var $pings = array();
	var $meta = array();
	var $timeout = 1;

	function COD4ServerStatus($server, $port, $timeout = 1) {
		$this -> server = $server;
		$this -> port = $port;
		$this -> timeout = $timeout;
	}

	function getServerStatus() {
		$error = false;

		if (!empty($this -> server) && !empty($this -> port)) {					
			$handle = @fsockopen($this -> protocol . '://' . $this -> server, $this -> port);

			if ($handle) {				
				// had to do this... trying to figure out a way not to do this
				socket_set_timeout($handle, $this -> timeout);
				stream_set_blocking($handle, 1);
				stream_set_timeout($handle, 5);

				fputs($handle, "\xFF\xFF\xFF\xFFgetstatus\x00");
				fwrite($handle, "\xFF\xFF\xFF\xFFgetstatus\x00");					

				// we have to do one read out here to set meta data
				$this -> data = fread($handle, 8192);
				$this -> meta = stream_get_meta_data($handle);
				$counter = 8192;

				while (!feof($handle) && !$error && $counter < $this -> meta['unread_bytes']) {
					$this -> data .= fread($handle, 8192);
					$this -> meta = stream_get_meta_data($handle);
					if ($this -> meta['timed_out']) $error = true;
					$counter += 8192;
				}

				if ($error) {
					echo 'Request timed out.';
					return false;							
				} else {
					if (strlen(trim($this -> data)) == 0) {							
						echo 'No data received from server.';
						return false;
					} else {
						return true;
					}
				}
			} else {
				echo 'Could not connect to server.';
				return false;
			}

			fclose($handle);
		}
	}

	function parseServerData() {
		$this -> serverData = explode("\n", $this -> data); // $this -> serverData = array_shift($this -> serverData); THIS WAS MISBEHAVING
		$tempplayers = array();

		for ($i = 2; $i <= (sizeof($this -> serverData) - 1); $i++) {
			$tempplayers[sizeof($tempplayers)] = trim($this -> serverData[$i]);
		}

		$tempdata = array();
		$tempdata = explode('\\', $this -> serverData[1]);
		$this -> serverData = array();

		foreach($tempdata as $i => $v) {
			if (fmod($i, 2) == 1) {
				$t = ($i + 1);
				$this -> serverData[$v] = $tempdata[$t];
			}
		}

		$this -> serverData['sv_hostname'] = $this -> colorCode($this -> serverData['sv_hostname']);
		// if (isset($this -> serverData['_Maps'])) $this -> serverData['_Maps'] = explode('-', $this -> serverData['_Maps']);

		foreach($tempplayers as $i => $v) { // frags ping "player name"
			if (strlen(trim($v)) > 1) {
				$temp = explode(' ', $v);					
				$this -> scores[sizeof($this -> scores)] = $temp[0];
				$this -> pings[sizeof($this -> pings)] = $temp[1];
				$pos = (strpos($v, '"') + 1);
				$endPos = (strlen($v) - 1);
				$this -> players[sizeof($this -> players)] = substr($v, $pos, ($endPos - $pos));
			}
		}			
	}

	function colorCode($string) {
		$string .= "^";

		$find = array(
			'/\^0(.*?)\^/is',
			'/\^1(.*?)\^/is',
			'/\^2(.*?)\^/is',
			'/\^3(.*?)\^/is',
			'/\^4(.*?)\^/is',
			'/\^5(.*?)\^/is',
			'/\^6(.*?)\^/is',
			'/\^7(.*?)\^/is',
			'/\^8(.*?)\^/is',
			'/\^9(.*?)\^/is',
		);

		$replace = array(
			'<span style="color:#000000;">$1</span>^',
			'<span style="color:#f65a5a;">$1</span>^',
			'<span style="color:#00f100;">$1</span>^',
			'<span style="color:#efee04;">$1</span>^',
			'<span style="color:#0f04e8;">$1</span>^',
			'<span style="color:#04e8e7;">$1</span>^',
			'<span style="color:#f75af6;">$1</span>^',
			'<span style="color:#ffffff;">$1</span>^',
			'<span style="color:#7e7e7e;">$1</span>^',
			'<span style="color:#6e3c3c;">$1</span>^',
		);

		$string = preg_replace($find, $replace, $string);
		return substr($string, 0, strlen($string) - 1);
	}

	function returnData() {
		return $this -> data;
	}

	function returnMeta() {
		return $this -> meta;
	}

	function returnServerData() {
		return $this -> serverData;
	}

	function returnPlayers() {
		return $this -> players;
	}

	function returnPings() {
		return $this -> pings;
	}

	function returnScores() {
		return $this -> scores;
	}
}
?>