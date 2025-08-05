<?php

namespace APP\Sources;

class Media {
    public static string $faviconIco = 'SOURCE_REPLACER_BASE64("APP/Resource/img/favicon.ico")';
    public static string $faviconSvg = 'SOURCE_REPLACER_BASE64("APP/Resource/img/favicon.svg")';
    public static string $icons = 'SOURCE_REPLACER_CONTENT("APP/Resource/img/icons.svg")';
}
