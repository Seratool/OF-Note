<?php

namespace APP\Sources;

class Template {
    public static string $head = <<<END
SOURCE_REPLACER_HTML('APP/Assets/Tpl/header.html')
END;

    public static string $body = <<<END
SOURCE_REPLACER_HTML('APP/Assets/Tpl/body.html')
END;

    public static string $content = <<<END
SOURCE_REPLACER_HTML('APP/Assets/Tpl/content.html')
END;
}
