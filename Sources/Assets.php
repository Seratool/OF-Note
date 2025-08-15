<?php

namespace APP\Sources;

class Assets
{
    /**
     * define template sources.
     */
    public static string $base_html = 'SOURCE_REPLACER_HTML("APP/Assets/Tpl/base.html")';
    public static string $editor_html = 'SOURCE_REPLACER_HTML("APP/Assets/Tpl/editor.html")';
    public static string $error_html = 'SOURCE_REPLACER_HTML("APP/Assets/Tpl/error.html")';

    /**
     * define style sources.
     */
    public static string $init_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/base.css")';
    public static string $header_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/header.css")';
    public static string $asides_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/asides.css")';
    public static string $main_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/main.css")';
    public static string $connector_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/connector.css")';

    /**
     * define java script sources.
     */
    public static string $JSE_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/JSE.js")';
    public static string $cookies_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/cookies.js")';
    public static string $aside_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/aside.js")';
    public static string $editor_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/editor.js")';
    public static string $note_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/note.js")';
    public static string $connector_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/connector.js")';
    public static string $main_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/main.js")';

    /**
     * define media sources.
     */
    public static string $favicon_ico = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.ico")';
    public static string $favicon_svg = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.svg")';
    public static string $icons_svg = 'SOURCE_REPLACER_CONTENT("APP/Assets/Img/icons.svg")';
}
