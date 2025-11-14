<?php

namespace APP\Assets;

class Assets
{
    /**
     * define template sources.
     */
    public static string $base_html_twig = 'SOURCE_REPLACER_HTML("APP/Assets/Tpl/base.html.twig")';
    public static string $editor_html_twig = 'SOURCE_REPLACER_HTML("APP/Assets/Tpl/editor.html.twig")';
    public static string $error_html_twig = 'SOURCE_REPLACER_HTML("APP/Assets/Tpl/error.html.twig")';

    /**
     * define style sources.
     */
    public static string $init_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/base.css")';
    public static string $header_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/header.css")';
    public static string $asides_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/asides.css")';
    public static string $main_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/main.css")';
    public static string $connector_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/connector.css")';
    public static string $print_css = 'SOURCE_REPLACER_CSS("APP/Assets/Style/print.css")';

    /**
     * define java script sources.
     */
    public static string $JSE_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/JSE.js")';
    public static string $dic_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/dic.js")';
    public static string $cookies_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/cookies.js")';
    public static string $aside_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/aside.js")';
    public static string $editor_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/editor.js")';
    public static string $note_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/note.js")';
    public static string $connector_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/connector.js")';
    public static string $main_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/main.js")';
    public static string $pwa_js = 'SOURCE_REPLACER_JS("APP/Assets/JS/pwa.js")';

    /**
     * define media sources.
     */
    public static string $favicon_ico = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.ico")';
    public static string $favicon_svg = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.svg")';
    public static string $icons_svg = 'SOURCE_REPLACER_CONTENT("APP/Assets/Img/icons.svg")';


    public static string $favicon16_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.16.png")';
    public static string $favicon32_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.32.png")';
    public static string $favicon48_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.48.png")';
    public static string $favicon96_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.96.png")';
    public static string $favicon128_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.128.png")';
    public static string $favicon180_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.180.png")';
    public static string $favicon192_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.192.png")';
    public static string $favicon256_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.256.png")';
    public static string $favicon512_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.512.png")';
    public static string $screen1_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/screen1.png")';
    public static string $screen2_png = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/screen2.png")';
}
