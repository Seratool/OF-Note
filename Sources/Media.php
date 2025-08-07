<?php

namespace APP\Sources;

class Media {
    public static string $faviconIco = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.ico")';
    public static string $faviconSvg = 'SOURCE_REPLACER_BASE64("APP/Assets/Img/favicon.svg")';
    public static string $icons = 'SOURCE_REPLACER_CONTENT("APP/Assets/Img/icons.svg")';
}
