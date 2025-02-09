<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '/tmp/php_error_log');

$secret = "48789958446ce0906a073ef2cc29e9584d9ee882";
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');
$hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($hash, $signature)) {
    http_response_code(403);
    exit('Invalid signature');
}

// Log received webhook payload
file_put_contents('/tmp/github_webhook_received', $payload);

// Run Git pull and log the output
exec('sudo -u www-data git -C /var/www/html/PiProduction pull 2>&1', $output, $return_var);
file_put_contents('/tmp/git_debug_log', implode("\n", $output));

if ($return_var !== 0) {
    http_response_code(500);
    exit('Git pull failed. Check /tmp/git_debug_log');
}

// Run npm install and build
exec('cd /var/www/html/PiProduction && sudo -u www-data npm install --omit=dev 2>&1', $npmInstallOutput, $npmInstallStatus);
file_put_contents('/tmp/npm_install_log', implode("\n", $npmInstallOutput));

if ($npmInstallStatus !== 0) {
    http_response_code(500);
    exit('npm install failed. Check /tmp/npm_install_log');
}

exec('cd /var/www/html/PiProduction && sudo -u www-data npm run build 2>&1', $npmBuildOutput, $npmBuildStatus);
file_put_contents('/tmp/npm_build_log', implode("\n", $npmBuildOutput));

if ($npmBuildStatus !== 0) {
    http_response_code(500);
    exit('npm build failed. Check /tmp/npm_build_log');
}

// If everything succeeded
http_response_code(200);
echo "Deployment successful.";
?>
