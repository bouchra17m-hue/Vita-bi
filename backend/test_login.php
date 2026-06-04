<?php
// Test login script

$url = 'http://127.0.0.1:8000/api/login';
$data = [
    'email' => 'ahmed@vitabi.com',
    'password' => 'password123'
];

$options = [
    'http' => [
        'header' => "Content-Type: application/json\r\n" .
                    "Accept: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo "Response:\n";
echo $result;
?>
