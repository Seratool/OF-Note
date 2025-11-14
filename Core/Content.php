<?php

namespace APP\Core;

class Content
{
    private string $divider = "\n".'~=~=~ ✄ ~=~=~  ✄ ~=~=~ ✄ ~=~=~ ✄ ~=~=~ ✄ ~=~=~ ✄ ~=~=~ ✄ ~=~=~ ✄ ~=~=~'."\n";

    private string $path = '';

    private string $content = '';

    private array $settings = [
        'lock' => false,
        'font' => 'font-sans',
        'bg' => 'bg-lined',
        'size' => 'size-m',
        'spellcheck' => false,
        'passhash' => '',
    ];

    private array $settingsDefault = [
        'lock' => [false, true],
        'font' => ['font-sans', 'font-serif', 'font-monospace'],
        'bg' => ['bg-blank', 'bg-lined'],
        'size' => ['size-xs', 'size-s', 'size-m', 'size-l', 'size-xl'],
        'spellcheck' => [false, true],
        'passhash' => '',
    ];

    public function __construct(string $path)
    {
        $this->path = $path;
    }

    public function loadContent(): void
    {
        $this->content = is_readable($this->path) ? file_get_contents($this->path) : '';
        $parts = explode($this->divider, $this->content);

        if (sizeof($parts) > 1) {
            $this->settings = array_merge($this->settings, unserialize(trim($parts[0], '/')));
            $this->content = $parts[1];
        }
    }

    public function getSetting(): array
    {
        return $this->settings;
    }

    public function getContent($raw = false): string
    {
        if ($raw) {
            return $this->content;
        }

        return nl2br(htmlspecialchars($this->content, ENT_QUOTES, 'UTF-8'), false);
    }

    /**
     * extract setting from array, validate and store in settings property.
     */
    public function extractSetting(array $opts): void
    {
        foreach ($this->settings as $key => $value) {
            if (isset($opts[$key])) {
                $this->settings[$key] = in_array($opts[$key], $this->settingsDefault[$key]) ? $opts[$key] : $value;
            }
        }
    }

    public function setContent(): void
    {
        $text = $_POST['text'];

        if (strlen($text)) {
            $this->extractSetting($_POST);
            $this->mkDir(dirname($this->path), 0755);

            file_put_contents($this->path, '///'.serialize($this->settings).'///'.$this->divider.$text);
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