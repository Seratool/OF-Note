<?php

namespace APP\Sources;

class Css {
    public static string $init = <<<END
SOURCE_REPLACER_CSS('APP/Resource/css/base.css')
END;

    public static string $header = <<<END
SOURCE_REPLACER_CSS('APP/Resource/css/header.css')
END;

    public static string $asides = <<<END
SOURCE_REPLACER_CSS('APP/Resource/css/asides.css')
END;

    public static string $main = <<<END
SOURCE_REPLACER_CSS('APP/Resource/css/main.css')
END;

    public static string $connector = <<<END
SOURCE_REPLACER_CSS('APP/Resource/css/connector.css')
END;
}