<?php

namespace APP\Sources;

class Template {
    public static string $head = <<<END
SOURCE_REPLACER_HTML('APP/Resource/header.html')
END;

    public static string $body = <<<END
SOURCE_REPLACER_HTML('APP/Resource/body.html')
END;

    public static string $content = <<<END
SOURCE_REPLACER_HTML('APP/Resource/content.html')
END;
}
