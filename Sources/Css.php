<?php

namespace APP\Sources;

class Css {
    public static string $init = <<<END
SOURCE_REPLACER_CSS('APP/Assets/Style/base.css')
END;

    public static string $header = <<<END
SOURCE_REPLACER_CSS('APP/Assets/Style/header.css')
END;

    public static string $asides = <<<END
SOURCE_REPLACER_CSS('APP/Assets/Style/asides.css')
END;

    public static string $main = <<<END
SOURCE_REPLACER_CSS('APP/Assets/Style/main.css')
END;

    public static string $connector = <<<END
SOURCE_REPLACER_CSS('APP/Assets/Style/connector.css')
END;
}