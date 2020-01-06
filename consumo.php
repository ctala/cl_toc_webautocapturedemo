<?php
 	$id_front =  $_POST["id_front"];
   	$id_back = $_POST["id_back"];
   	$selfie = $_POST["selfie"];
   	$documentType = $_POST["documentType"];
	$api_key = 'XXXXXXXXXXXXXXXXXXXXXX';
	   
   	$params = array(
   	 'apiKey' => $api_key,
   	 'id_front' => $id_front,
   	 'id_back' => $id_back,
   	 'selfie' => $selfie,
   	 'documentType' => $documentType
   	);
	
	$respuesta = CallAPI('POST', 'https://sandbox-api.7oc.cl/v2/face-and-document', $params );

	echo json_decode($respuesta);


function CallAPI($method, $url, $data = false)
    {
   	 $curl = curl_init();

   	 switch ($method)
   	 {
   		 case "POST":
   		 curl_setopt($curl, CURLOPT_POST, 1);

   		 if ($data)
   			 curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
   		 break;
   		 case "PUT":
   		 curl_setopt($curl, CURLOPT_PUT, 1);
   		 break;
   		 default:
   		 if ($data)
   			 $url = sprintf("%s?%s", $url, http_build_query($data));
   	 }

	// Optional Authentication:
   	 curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
   	 curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type:multipart/form-data"));
   	 curl_setopt($curl, CURLOPT_URL, $url);
   	 curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
   	 curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
   	 $result = curl_exec($curl);

	curl_close($curl);
		
	echo $result;

    }