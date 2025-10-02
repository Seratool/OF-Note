<?php

namespace APP;

// Disable caching.
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

use APP\Core\Content;
use APP\Core\Route;
use APP\Exceptions\AppException;
use APP\Core\Core;
use APP\View\Lang;
use APP\View\Templater;

$templater = new Templater();
try {
    $router = new Route();
    $core = new Core($router);

    $core->defineEnvironment();
    $core->checkVersion();
    $core->checkRequest();
    $core->onAddPage();

    $content = new Content($core->getPath());
    $content->loadContent();
    $core->onDownload($content);
    $core->onSave($content);

    $response = $templater->view('editor.html.twig', [
        'title' => implode(' - ', [$router->getParam('note'), 'Note']),
        'lang' => new Lang(),
        'router' => $router,
        'options' => isset($_COOKIE['setting']) ? json_decode($_COOKIE['setting'], true) : [],
        'settings' => $content->getSetting(),
        'content' => $content->getContent(),
    ]);

} catch (AppException|\Exception $e) {
    $response = $templater->view('error.html.twig', [
        'title' => is_callable([$e, 'getTitle']) ? $e->getTitle() : 'Error occurred!',
        'headline' => is_callable([$e, 'getHeadline']) ? $e->getHeadline() : 'Warning!',
        'subHeadline' => is_callable([$e, 'getSubHeadline']) ? '<h2>'.$e->getSubHeadline().'</h2>' : '',
        'exception' => $e,
    ]);
}

echo $response;