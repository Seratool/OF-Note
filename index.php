<?php

namespace APP;

use APP\Core\Route;
use APP\Exceptions\AppException;
use APP\Core\Core;
use APP\View\Lang;
use APP\View\Templater;

$templater = new Templater();
try {
    // Disable caching.
    #header('Cache-Control', 'no-store');
    #header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    #header('Pragma', 'no-cache');
    #header('Expires', '0');

    $router = new Route();

    $core = new Core($router);
    $core->defineEnvironment();
    $core->checkVersion();
    $core->checkRequest();
    $core->checkPostRequest();

    $contentFile = $core->getPath();
    $note = $router->getParam('note');

    echo $templater->view('editor.html', [
        'lang' => new Lang(),
        'router' => $router,
        'title' => ($note ? $note . ' - ' : '').'Note',
        'content' => is_file($contentFile) ? nl2br(htmlspecialchars(file_get_contents($contentFile), ENT_QUOTES, 'UTF-8'), false) : ''
    ]);

} catch (AppException|\Exception $e) {
    echo $templater->view('error.html', [
        'title' => is_callable([$e, 'getTitle']) ? $e->getTitle() : 'Error occurred!',
        'headline' => is_callable([$e, 'getHeadline']) ? $e->getHeadline() : 'Warning!',
        'subHeadline' => is_callable([$e, 'getSubHeadline']) ? '<h2>'.$e->getSubHeadline().'</h2>' : '',
        'exception' => $e,
    ]);
}
