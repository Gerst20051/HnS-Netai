<?php
function error($msg,$json=false) {
	if ($json) print_r(json_encode(array("error"=>$msg)));
	else $final['error'] = $msg;
}
?>