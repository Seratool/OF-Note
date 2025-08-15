<?php

namespace APP\View;

use APP\Sources\Dictionary;

class Lang
{
    public array $dict = [];
    public string $lang = '';
    private Dictionary $dictionary;

    public function __construct()
    {
        $this->dictionary = new Dictionary();

        $lang = strtoupper(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2));
        if (isset($_COOKIE['setting'])) {
            $setting = json_decode($_COOKIE['setting'], true);
            $lang = $setting['l'] ?? $lang;
        }

        $this->lang = $this->dictionary->{$lang} ? $lang : 'EN';
        $this->dict = $this->dictionary->get($this->lang);
    }

    public function getAvailableLanguages(): array
    {
        return array_map(function ($item) {
            return $item['LanguageIcon'] . '&nbsp;' . $item['LanguageTitle'];
        }, get_object_vars($this->dictionary));
    }

    public function __invoke(string $term): string
    {
        return $this->dict[$term] ?? $term;
    }
}