<?php

namespace APP\Core;

use APP\Assets\Assets;
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

        $path = str_replace(['/', '\\'], DIRECTORY_SEPARATOR,Config::Storage);

        $storage = [
            realpath(__DIR__.DIRECTORY_SEPARATOR),
            trim($path, DIRECTORY_SEPARATOR),
            self::$storagePrefix . $route->getParam('note')
        ];

        $this->path = implode(DIRECTORY_SEPARATOR, $storage);
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

    public function checkRequest(): void
    {
        $note = $this->route->getParam('note');

        if (!$note || strlen($note) > 64 || !preg_match('/^[a-zA-Z0-9_-]+$/', $note)) {
            $this->route->setParam('note', $this->generateNewNoteKey());
            header("Location: ".$this->route->getUrl());
            die;
        }
    }

    /**
     * create new unique note key.
     */
    public function generateNewNoteKey(): string
    {
        do {
            $note = substr(str_shuffle('234579abcdefghjkmnpqrstwxyz'), -16);
            $file = $this->path . $note;
        } while (is_file($file));

        return $note;
    }

    /**
     * if media file was required, so do download media file.
     */
    public function onMediaRequest(): void
    {
        if ($this->route->getParam('media')) {
            try {
                $file = $this->route->getParam('media');
                $template = str_replace('.', '_', $file);

                if (empty(Assets::$$template)) {
                    throw new \Exception('File not found');
                }

                [$prefix, $code] = explode(';base64,', Assets::$$template);
                [, $mimeType] = explode(':', $prefix);
                $cont = base64_decode($code);
                if (empty($cont)) {
                    throw new \Exception('File not found');
                }

                header("Content-Type: ".$mimeType);
                header("Content-Length: ". mb_strlen($cont));
                echo $cont;
                die;
            } catch (\Exception $e) {
                header("HTTP/1.0 404 Not Found");
                die();
            }
        }
    }

    /**
     * start download a file.
     * @param Content $content
     * @throws AppException
     */
    public function onDownload(Content $content): void
    {
        if ($this->route->getParam('event') == 'download') {
            $note = $this->route->getParam('note');
            $cont = !is_file($this->path) ? $content->getContent(true) : '';

            header("Content-Type: text/plain");
            header("Content-Disposition: attachment; filename=".$note."_".date('Y-m-d_H-i').".txt");
            header("Content-Length: ". mb_strlen($cont));
            echo $cont;
            die;
        }
    }

    /**
     * save send content.
     * @param Content $content
     */
    public function onSave(Content $content): void
    {
        if ($this->route->getParam('event') == 'save') {
            $content->setContent();
            die(json_encode(['status' => 'okay']));
        }
    }

    public function onAddPage(): void
    {
        if ($this->route->getParam('event') == 'add') {
            $note = $this->generateNewNoteKey();

            if ($note) {
                $this->route->setParam('event', '');
                $this->route->setParam('note', $note);

                die(json_encode([
                    'note' => $note,
                    'url' => $this->route->getUrl(),
                ]));
            }
        }
    }
}
