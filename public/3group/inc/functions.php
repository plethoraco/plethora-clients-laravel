<?php

require_once(dirname(__FILE__) . '/settings.php');

// Find the value of a field and return it safely
// For now just looks for post vars
// In the future may support defaults or db
function v($field, $sanitize = true) {
	$v = '';
	$default = array(
		'template' => 1
	);
	if (!empty($_POST[$field])) {
		$v = $_POST[$field];
	} elseif (!empty($default[$field])) {
		$v = $default[$field];
	}
	if ($sanitize) {
		$v = sanitizeString($v);
	}
	return $v;
}

// Sanitize a string
function sanitizeString($string) {
	$string = mb_convert_encoding($string, 'UTF-8', 'UTF-8');
	$string = htmlentities($string, ENT_QUOTES, 'UTF-8');
	return $string;
}

// Compare two strings
function stringsEqual($string1, $string2, $fuzzy = false) {
	if ($fuzzy) {
		$string1 = stringToAlphaNumeric($string1);
		$string2 = stringToAlphaNumeric($string2);
	}
	return $string1 == $string2;
}

// Remove all non-alpha-numeric characters from a string
function stringToAlphaNumeric($string) {
	return preg_replace('/[^a-z0-9]+/i', '', $string);
}

// Strip a tag from HTML
function stripSingleTag($string, $tag){
    $string1 = preg_replace('/<\/'.$tag.'>/i', '', $string);
    if($string1 != $string){
        $string = preg_replace('/<'.$tag.'[^>]*>/i', '', $string1);
    }
    return $string;
}

// Minify HTML
function minifyHtml($string) {
	$search = array(
        '/\>[^\S ]+/s',     // strip whitespaces after tags, except space
        '/[^\S ]+\</s',     // strip whitespaces before tags, except space
        '/(\s)+/s',         // shorten multiple whitespace sequences
        '/<!--(.|\s)*?-->/' // Remove HTML comments
    );
    $replace = array(
        '>',
        '<',
        '\\1',
        ''
    );
    $string = trim(preg_replace($search, $replace, $string));
	return $string;
}

// Output the template HTML
function template($template, $vars, $variant = 'main') {

	// Common template generation
	$vars['imageUrl'] = $GLOBALS['settings']['urlTemplate'] . '/' . $template . '/images';
	$file = $GLOBALS['settings']['dirTemplate'] . '/' . $template . '/' . $variant . '.html';
	if ($variant != 'main' && !file_exists($file)) {
		$file = $GLOBALS['settings']['dirTemplate'] . '/' . $template . '/main.html';
	}
	$code = file_get_contents($file);
	$code = stripSingleTag($code, 'body');
	
	// Hide empty optional blocks
	$optionalFields = array('ddi');
	foreach ($optionalFields as $f) {
		$blockName = $f . 'Block';
		if (empty($vars[$f])) {
			$code = preg_replace('/<' . $blockName . '>.*<\/' . $blockName . '>/im', '', $code);
		} else {
			$code = stripSingleTag($code, $blockName);
		}
	}
	
	// Replace vars
	$uppercaseFields = array('name');
	foreach ($vars as $key => $value) {
		if (in_array($key, $uppercaseFields)) {
			$value = strtoupper($value);
		}
		$code = str_replace('{' . $key . '}', nl2br(sanitizeString($value)), $code);
	}
	
	// Wrap it up
	$code = minifyHtml($code);
	return $code;

}

// Upload an image
function uploadImage($sourceFileName, $destinationFileName, $size = 'small') {
	if ($size == 'large') {
		$width = 140;
		$height = 140;
		$overlay = 'overlay-round.png';
	} else {
		$width = 70;
		$height = 70;
		$overlay = 'overlay-round.png';
	}
	require_once($GLOBALS['settings']['dirLib'] . '/SimpleImage/src/claviska/SimpleImage.php');
	try {
		$image = new \claviska\SimpleImage();
		$image
			->fromFile($sourceFileName)
			->autoOrient()
			->thumbnail($width, $height, 'center')
			->overlay($GLOBALS['settings']['dirOverlay'] . '/' . $overlay, 'top left')
			->toFile($destinationFileName, 'image/png');
			//->toScreen();
			return true;
	} catch(Exception $err) {
		echo $err->getMessage();
		return false;
	}
}

function imageUrl($image) {
	return $GLOBALS['settings']['urlRoot'];
}

function er($message, $fatal = true) {
	return $message;
	if (!empty($fatal)) {
		die;
	}
}

?>