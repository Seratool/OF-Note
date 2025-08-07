<?php

namespace APP\Sources;

class Js {
    public static string $JSE = <<<EOD
SOURCE_REPLACER_JS('APP/Assets/JS/JSE.js')
EOD;

    public static string $aside = <<<EOD
SOURCE_REPLACER_JS('APP/Assets/JS/aside.js')
EOD;

    public static string $editor = <<<EOD
SOURCE_REPLACER_JS('APP/Assets/JS/editor.js')
EOD;

    public static string $note = <<<EOD
SOURCE_REPLACER_JS('APP/Assets/JS/note.js')
EOD;

    public static string $connector = <<<EOD
SOURCE_REPLACER_JS('APP/Assets/JS/connector.js')
EOD;

    public static string $main = <<<EOD
SOURCE_REPLACER_JS('APP/Assets/JS/main.js')
EOD;
}
