<?php

namespace APP\Core;

class Content
{
    private string $path = '';

    public function __construct($path)
    {
        $this->path = $path;
    }

    public function isPostRequest(): bool
    {
        return $_SERVER['REQUEST_METHOD'] === 'POST';
    }

    public function getContent(): string
    {
        if (!is_readable($this->path)) {
            return '';
        }

        $content = htmlspecialchars(file_get_contents($this->path), ENT_QUOTES, 'UTF-8');
        return nl2br($content, false);
    }

    public function setContent(): void
    {
        $text = $_POST['text'] ?? file_get_contents("php://input");

        if (strlen($text)) {
            $this->mkDir(dirname($this->path), 0755);
            file_put_contents($this->path, $text);
        } else {
            unlink($this->path);
        }
    }

    private function mkDir(string $dir, int $mode = 0777): void
    {
        if (!file_exists($dir)) {
            $umask = umask(0);
            mkdir($dir, $mode, true);
            umask($umask);
        }

        chmod($dir, $mode);
    }
}