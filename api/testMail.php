<?php

$result = mail(
    'support@gigsda.com',
    'GIGSDA Mail Test',
    'Wenn diese Mail ankommt funktioniert der Mailversand.'
);

echo json_encode([
    'success' => $result
]);