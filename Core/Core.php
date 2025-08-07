<?php

namespace APP\Core;

use APP\Config;
use APP\Exceptions\AppException;

class Core
{
    public static string $version = '1.0';
    public static string $storagePrefix = '.n_';
    private Route $route;
    private string $path = '';

    public function __construct(Route $route)
    {
        $this->route = $route;
        $this->path = Config::Storage . DIRECTORY_SEPARATOR . self::$storagePrefix . $this->route->getParam('note');
    }

    public static function getVersion()
    {
        return self::$version.date(':ymd.Hi');
    }

    public function getPath()
    {
        return $this->path;
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
            $text = $_POST['text'] ?? file_get_contents("php://input");

            strlen($text)
                ? file_put_contents($this->path, $text)
                : unlink($this->path);

            die(json_encode(['status' => 'okay']));
        }
    }
}
