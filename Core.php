<?php

namespace APP;

use APP\AppException;
use APP\Sources\Template;

class Core
{
    public static string $version = '0.12.240513.1254';
    private Route $route;
    private View $view;
    private Lang $lang;
    private string $path = '';

    public function __construct()
    {
        $this->view = new View();
        $this->route = new Route();
        $this->lang = new Lang();
        $this->path = Config::Storage . DIRECTORY_SEPARATOR . '.n_' . $this->route->getParam('note');
    }

    public function defineEnvironment(): void
    {
        $errorPrint = !empty(Config::ErrorPrint);

        ini_set('display_errors', $errorPrint ? 1 : 0);
        ini_set('display_startup_errors', $errorPrint ? 1 : 0);
        error_reporting($errorPrint ? E_ALL : 0);
        set_error_handler([$this, 'errorHandler'], E_ALL);
    }

    /**
     * @throws \Exception
     */
    public function errorHandler($errno, $errstr, $errfile, $errline) {
        throw new AppException(
            'Error occurred: <b>' . $errstr . '</b> in ' . $errfile . ' on line ' . $errline,
            '500',
            'Internal Server Error',
            '500 Server Error'
        );
    }

    /**
     * @throws AppException
     */
    public function checkVersion(): void
    {
        $version = phpversion();

        if (version_compare('7.4', $version, '>=')) {
            throw new AppException(
                "Your PHP version is old $version! Please Updateto PHP version 7.4 or hight to use this APP!",
                'Warning!',
                'PHP version is too old!',
                'PHP version is too old!'
            );
        }
    }

    /**
     * @throws AppException
     */
    public function checkRequest(): void
    {
        $note = $this->route->getParam('note');

        if (!$note || strlen($note) > 64 || !preg_match('/^[a-zA-Z0-9_-]+$/', $note)) {
            do {
                $note = substr(str_shuffle('234579abcdefghjkmnpqrstwxyz'), -16);
                $file = Config::Storage . DIRECTORY_SEPARATOR . '.n_' . $note;
            } while (is_file($file));

            $this->route->setParam('note', $note);
            header("Location: ".$this->route->getUrl());
            die;
        }

        if ($this->route->getParam('download')) {
            if (is_file($this->path)) {
                header("Content-Type: text/plain");
                header("Content-Disposition: attachment; filename=".$note."_".date('Y-m-d_H-i').".txt");
                header("Content-Length: ". filesize($this->path));
                readfile($this->path);
                die;

            } else {
                header('HTTP/1.0 404 Not Found');

                throw new AppException(
                    'The requested file could not be found!',
                    '404',
                    'File not found!',
                    '404 Not Found!'
                );
            }
        }
    }

    public function checkPostRequest()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $text = isset($_POST['text']) ? $_POST['text'] : file_get_contents("php://input");

            if (!strlen($text)) {
                unlink($this->path);
            } else {
                file_put_contents($this->path, $text);
            }
            die(json_encode(['status' => 'okay']));
        }
    }

    public function run(): string
    {
        $note = $this->route->getParam('note');

        return $this->view->getContent([
            'lang' => $this->lang,
            'title' => ($note ? $note . ' - ' : '').'Note',
            'url' => $this->route->getUrl(),
            'baseUrl' => $this->route->getBaseUrl(),
            'downloadUrl' => $this->route->getQueryUrl(['download' => true]),
            'template' => Template::$content,
            'note' => $this->route->getParam('note'),
            'content' => is_file($this->path) ? nl2br(htmlspecialchars(file_get_contents($this->path), ENT_QUOTES, 'UTF-8'), false) : ''
        ]);
    }
}
