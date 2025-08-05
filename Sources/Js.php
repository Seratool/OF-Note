<?php

namespace APP\Sources;

class Js {
    public static string $JSE = <<<EOD
SOURCE_REPLACER_JS('APP/Resource/js/JSE.js')
EOD;

    public static string $aside = <<<EOD
SOURCE_REPLACER_JS('APP/Resource/js/aside.js')
EOD;

    public static string $editor = <<<EOD
SOURCE_REPLACER_JS('APP/Resource/js/editor.js')
EOD;

    public static string $note = <<<EOD
SOURCE_REPLACER_JS('APP/Resource/js/note.js')
EOD;

    public static string $connector = <<<EOD
SOURCE_REPLACER_JS('APP/Resource/js/connector.js')
EOD;

    public static string $main = <<<EOD
SOURCE_REPLACER_JS('APP/Resource/js/main.js')
EOD;
}
