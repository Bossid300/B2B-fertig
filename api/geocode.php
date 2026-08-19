<?php

header('Content-Type: application/json');

require_once("cors.php");

$address =
  $_GET['address'] ?? '';

if (!$address) {
  echo json_encode([
    'error' => 'address missing'
  ]);
  exit;
}

$apiKey =
  'AIzaSyA_WdxahkUPKrRmiLkjziqzBxO0C2ZgRns';

$url =
  'https://maps.googleapis.com/maps/api/geocode/json?address=' .
  urlencode($address) .
  '&key=' .
  $apiKey;

$response =
  file_get_contents($url);

echo $response;