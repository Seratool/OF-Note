<?php

namespace APP;

use APP\Sources\Dictionary;

class Lang
{
    public array $dict = [];
    public string $lang = '';
    private string $defLang = 'EN';

    public function __construct()
    {
        $lang = strtoupper(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2));
        $defLang = $this->defLang;

        if (isset(Dictionary::$$lang)) {
            $this->lang = strtolower($lang);
            $this->dict = array_merge(Dictionary::$$defLang, Dictionary::$$lang);
        } else {
            $this->lang = strtolower($defLang);
            $this->dict = Dictionary::$$defLang;
        }
    }

    public function __invoke(string $term): string
    {
        return $this->dict[$term] ?? $term;
    }
}