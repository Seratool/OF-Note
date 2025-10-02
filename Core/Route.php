<?php

namespace APP\Core;

class Route
{
    private array $url = [];

    private array $GET = [];

    public function __construct()
    {
        $this->url = parse_url('http' . ($_SERVER['REQUEST_SCHEME'] == 'http' ? '' : 's') . '://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
        parse_str((!empty($this->url['query']) ? $this->url['query'] : ''), $this->GET);
    }

    public function getParam(string $key) {
        return $this->GET[$key] ?? null;
    }

    public function setParam(string $key, string $value) {
        $this->GET[$key] = $value;
    }

    public function getBaseUrl(): string
    {
        return $this->url['scheme'].'://'.$this->url['host'].$this->url['path'];
    }

    public function getRelativeBaseUrl(): string
    {
        return $this->url['path'];
    }

    public function getQueryUrl(array $get): string
    {
        return $this->generateUrl(array_merge($this->GET, $get));
    }

    public function getUrl(): string
    {
        return $this->generateUrl($this->GET);
    }

    private function generateUrl(array $query): string
    {
        $url = $this->url;
        $url['query'] = http_build_query($query, '', '&');

        return $url['scheme'].'://'.$url['host'].$url['path'].(!empty($url['query']) ? '?'.$url['query'] : '');
    }
}
