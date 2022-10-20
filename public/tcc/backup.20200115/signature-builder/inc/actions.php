<?

require_once(dirname(__FILE__) . '/settings.php');
require_once(dirname(__FILE__) . '/functions.php');

// Monitor post actions
if (!empty($_POST) && !empty($_POST['action'])) {
    switch ($_POST['action']) {

        // Upload image and return the location
        // In the future we might update the db too
        case 'signatureSave':
            if (!empty($_POST['imageType']) && $_POST['imageType'] == 'custom' && !empty($_FILES['image'])) {
                $allowedMimes = array('image/png', 'image/jpg', 'image/jpeg');
                if ($_FILES['image']['error'] == UPLOAD_ERR_OK && in_array($_FILES['image']['type'], $allowedMimes)) {
                    $fileName = 'photo-' . uniqid() . '.png';
                    $logoPath = $GLOBALS['settings']['dirUpload'] . '/' . $fileName;
                    if (uploadImage($_FILES['image']['tmp_name'], $logoPath)) {
                        $_POST['logoUrl'] = $GLOBALS['settings']['urlUpload'] . '/' . $fileName;
                    } else {
                        er('There was an issue uploading your image');
                    }
                } else {
                    er('There was an issue with your image format');
                }
            }
            break;

        // Fail
        default:
            return $return;
            break;

    }
}

?>