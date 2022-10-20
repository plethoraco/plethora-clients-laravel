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
    1 => array(
        'name' => 'Culinary Collective',
        'addresses' => array(
            array(
                'name' => 'Auckland Central',
                'address' => '100 Symonds St, Auckland Central, 1010'
            ), array(
                'name' => 'Mt Wellington',
                'address' => '56-60 Carbine Road, Mt Wellington, 1060'
            ), array(
                'name' => 'Hamilton',
                'address' => '94 Tristram Street, Hamilton 3204'
            )
            )
    ),
    2 => array(
        'name' => 'NZ College of Massage',
        'addresses' => array(
            array(
                'name' => 'Auckland Campus',
                'address' => 'Building C, 382-384 Manukau Rd, Greenlane, Auckland'
            ), array(
                'name' => 'Wellington Campus',
                'address' => '2 Bunny St, Pipitea, Wellington 6011'
            ), array(
                'name' => 'Christchurch Campus',
                'address' => '66b Wharenui Rd, Riccarton, Christchurch'
            )
            )
    ),
    3 => array(
        'name' => 'NZ Institute of Sport',
        'addresses' => array(
            array(
                'name' => 'Auckland Campus (Head Office)',
                'address' => '382 Manukau Rd, Epsom, Auckland 1023'
            ), array(
                'name' => 'Wellington Campus',
                'address' => 'Level 1, 2 Bunny St, Pipitea, Wellington 6011'
            ), array(
                'name' => 'Christchurch Campus',
                'address' => '66b Wharenui Rd, Riccarton, Christchurch'
            )
        )
    ),
    4 => array(
        'name' => 'NZMA',
        'addresses' => array(
            array(
                'name' => 'Auckland Symonds Street Campus',
                'address' => '100 Symonds Street, Grafton, Auckland 1010'
            ), array(
                'name' => 'Auckland Manukau Campus',
                'address' => '621 Great South Road, Manukau, Auckland 2104'
            ), array(
                'name' => 'Otahuhu Campus',
                'address' => '12-16 Gordon Road, Otahuhu, Auckland 1062'
            ), array(
                'name' => 'Sylvia Park Campus',
                'address' => '56-60 Carbine Road, Mount Wellington, Auckland 1060'
            ), array(
                'name' => 'Trades Campus',
                'address' => '807 Great South Road, Mount Wellington, Auckland 1060'
            ), array(
                'name' => 'Christchurch Campus',
                'address' => '365 Madras Street, Christchurch Central City, Christchurch 8013'
            ), array(
                'name' => 'Rotorua Campus',
                'address' => '1224 Eruera Street, Rotorua 3010'
            ), array(
                'name' => 'Waikato Campus',
                'address' => '94 Tristram Street, Hamilton 3204'
            ), array(
                'name' => 'Wellington Porirua',
                'address' => '1 Prosser Street, Elsdon, Porirua 5022'
            ), array(
                'name' => 'Wellington Central Campus',
                'address' => '2 Bunny Street, Pipitea, Wellington 6011'
            )
        )
    ),
    5 => array(
        'name' => 'NZMA Group'
    )
);
$GLOBALS['settings']['themes'][5]['addresses'] = $GLOBALS['settings']['themes'][4]['addresses'];

?>