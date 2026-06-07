<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://vitabi.vercel.app',
        'https://vita-bi.vercel.app',
        'https://*.vercel.app',
        'https://vitabi-*.vercel.app',
        'https://vitabi-backend.boushera-bai.alwaysdata.net',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
