<?php

namespace APP;
// APP start.

use APP\AppException;

try {
    // Disable caching.
    header('Cache-Control: no-store');

    $core = new \APP\Core();
    $core->defineEnvironment();
    $core->checkVersion();

    $core->checkRequest();
    $core->checkPostRequest();

    echo $core->run();

} catch (AppException|\Exception $e) {
    $title = is_callable([$e, 'getTitle']) ? $e->getTitle() : 'Error occurred!';
    $headline = is_callable([$e, 'getHeadline']) ? $e->getHeadline() : 'Warning!';
    $subHeadline = is_callable([$e, 'getSubHeadline']) ? '<h2>'.$e->getSubHeadline().'</h2>' : '';

    echo (<<<END
SOURCE_REPLACER_HTML('APP/Resource/error.html')
END);
}
