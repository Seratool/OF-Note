<?php

namespace APP\View;

class Templater
{
    private string $rootPath = '';

    private string $code = '';

    public function __construct(string $rootPath)
    {
      //  $this->rootPath = Templater . phprtrim($rootPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;



    }

    /**
     * view template content.
     */
    public function view(string $template, array $values = []): string
    {
        $this->code = $this->includeFiles($template);

        $this->compileBlock();
        $this->compileEscapedEchos();
        $this->compileEchos();
        $this->compilePHP();

        ob_start();
        extract($values, EXTR_SKIP);
        eval("?>$this->code");
        return ob_get_clean();
    }

    /**
     * include template content.
     */
    private function includeFiles(string $file): string
    {
        $code = file_get_contents($this->rootPath . $file);

        preg_match_all('/{% ?(extends|include) ?\'?(.*?)\'? ?%}/i', $code, $matches, PREG_SET_ORDER);
        foreach ($matches as $value) {
            $code = str_replace($value[0], $this->includeFiles($value[2]), $code);
        }

        return preg_replace('/{% ?(extends|include) ?\'?(.*?)\'? ?%}/i', '', $code);
    }

    /**
     * include compile blocks.
     */
    private function compileBlock(): void
    {
        $blocks = [];

        preg_match_all('/{% ?block ?(.*?) ?%}(.*?){% ?endblock ?%}/is', $this->code, $matches, PREG_SET_ORDER);
        foreach ($matches as $value) {
            if (!array_key_exists($value[1], $blocks)) $blocks[$value[1]] = '';

            $blocks[$value[1]] = strpos($value[2], '@parent') === false
                ? $value[2]
                : str_replace('@parent', $blocks[$value[1]], $value[2]);

            $this->code = str_replace($value[0], '', $this->code);
        }

        foreach($blocks as $block => $value) {
            $this->code = preg_replace('/{% ?yield ?' . $block . ' ?%}/', $value, $this->code);
        }

        $this->code = preg_replace('/{% ?yield ?(.*?) ?%}/i', '', $this->code);
    }

    private function compileEscapedEchos():void
    {
        $this->code = preg_replace(
            '~\{{{\s*(.+?)\s*\}}}~is',
            '<?php echo htmlentities($1, ENT_QUOTES, \'UTF-8\') ?>',
            $this->code
        );
    }

    private function compilePHP(): void
    {
        $this->code = preg_replace('~\{%\s*(.+?)\s*\%}~is', '<?php $1 ?>', $this->code);
    }

    private function compileEchos(): void
    {
        $this->code = preg_replace('~\{{\s*(.+?)\s*\}}~is', '<?php echo $1 ?>', $this->code);
    }
}
