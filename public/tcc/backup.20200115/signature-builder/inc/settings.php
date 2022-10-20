<?

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$GLOBALS['settings']['dirRoot'] = dirname(dirname(__FILE__));
$GLOBALS['settings']['dirLib'] = $GLOBALS['settings']['dirRoot'] . '/lib';
$GLOBALS['settings']['dirUpload'] = $GLOBALS['settings']['dirRoot'] . '/uploads';
$GLOBALS['settings']['dirTemplate'] = $GLOBALS['settings']['dirRoot'] . '/templates';
$GLOBALS['settings']['dirOverlay'] = $GLOBALS['settings']['dirRoot'] . '/overlays';

$GLOBALS['settings']['urlRoot'] = 'http' . (((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443) ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . '/tcc/signature-builder';
$GLOBALS['settings']['urlUpload'] = $GLOBALS['settings']['urlRoot'] . '/uploads';
$GLOBALS['settings']['urlTemplate'] = $GLOBALS['settings']['urlRoot'] . '/templates';

$GLOBALS['settings']['themes'] = array(
    1 => 'Culinary Collective',
    2 => 'NZ College of Massage',
    3 => 'NZ Institute of Sport',
    4 => 'NZMA',
    5 => 'NZMA Group'
);

?>