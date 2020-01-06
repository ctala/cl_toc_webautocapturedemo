<?php
$api_key = 'XXXXXXXXXXXXXXXXXXXXXXXXXX';
getSessionLiveness($api_key);

function getSessionLiveness($api_key){
	$url_liveness = 'https://sandbox-api.7oc.cl/session-manager/v1/session-id';
	$apiKey = $api_key;
	$url = $url_liveness;
	$post = array('apiKey'=>$apiKey);
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
	curl_setopt($curl , CURLOPT_HTTPHEADER, array('Content-Type: multipart/form-data'));
	curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // Skip SSL Verification
	$result = curl_exec($curl);
	echo $result;
	if(!$result){
		die('Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl));
	}
	curl_close($curl);
	$sessionIdArray = json_decode($result);

	$arrayResponse = array(
	  'session_id' => $sessionIdArray->session_id
	);
}