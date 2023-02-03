<?php

define('DEV', (!empty($_ENV['REDIRECT_APPLICATION_ENV']) && $_ENV['REDIRECT_APPLICATION_ENV'] == 'dev'));

if (DEV) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

$GLOBALS['settings']['version'] = '2.0';

$GLOBALS['settings']['dirRoot'] = dirname(dirname(__FILE__));
$GLOBALS['settings']['dirLib'] = $GLOBALS['settings']['dirRoot'] . '/lib';
$GLOBALS['settings']['dirUpload'] = $GLOBALS['settings']['dirRoot'] . '/uploads';
$GLOBALS['settings']['dirTemplate'] = $GLOBALS['settings']['dirRoot'] . '/templates';
$GLOBALS['settings']['dirOverlay'] = $GLOBALS['settings']['dirRoot'] . '/overlays';

$GLOBALS['settings']['urlRoot'] = 'http' . (((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443) ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . '/3group';
$GLOBALS['settings']['urlUpload'] = $GLOBALS['settings']['urlRoot'] . '/uploads';
$GLOBALS['settings']['urlTemplate'] = $GLOBALS['settings']['urlRoot'] . '/templates';

$GLOBALS['settings']['themes'] = array(
    1 => array(
        'name' => '3Group',
        'domain' => '3group.co.nz',
    ),
    2 => array(
        'name' => 'A3',
        'domain' => 'a3assetmanagement.co.nz',
    ),
    3 => array(
        'name' => 'B3',
        'domain' => 'b3buildings.co.nz',
    ),
    4 => array(
        'name' => 'C3',
        'domain' => 'c3construction.co.nz',
    ),
    5 => array(
        'name' => 'D3',
        'domain' => 'd3development.co.nz',
    )
);
