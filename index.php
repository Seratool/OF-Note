<?php

namespace APP;

use APP\Core\Content;
use APP\Core\Route;
use APP\Exceptions\AppException;
use APP\Core\Core;
use APP\View\Lang;
use APP\View\Templater;

$templater = new Templater();
try {
    $router = new Route();

    // Disable caching.
    # header('Cache-Control', 'no-store');
    #header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    #header('Pragma', 'no-cache');
    #header('Expires', '0');

    $core = new Core($router);
    $core->defineEnvironment();
    $core->checkVersion();
    $core->checkRequest();

    $content = new Content($core->getPath());
    if ($content->isPostRequest()) {
        $content->setContent();

        die(json_encode(['status' => 'okay']));
    }

    echo $templater->view('editor.html', [
        'lang' => new Lang(),
        'router' => $router,
        'title' => implode(' - ', [$router->getParam('note'), 'Note']),
        'content' => $content->getContent(),
    ]);

} catch (AppException|\Exception $e) {
    echo $templater->view('error.html', [
        'title' => is_callable([$e, 'getTitle']) ? $e->getTitle() : 'Error occurred!',
        'headline' => is_callable([$e, 'getHeadline']) ? $e->getHeadline() : 'Warning!',
        'subHeadline' => is_callable([$e, 'getSubHeadline']) ? '<h2>'.$e->getSubHeadline().'</h2>' : '',
        'exception' => $e,
    ]);
}
