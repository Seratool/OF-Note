<?php

namespace APP\View;

use APP\Exceptions\AppException;
use APP\Sources\Assets;

class Templater
{
    private string $code = '';

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
     * @throws AppException
     */
    private function includeFiles(string $template): string
    {
        $template = str_replace('.', '_', $template);

        if (!property_exists('\APP\Sources\Assets', $template)) {
            throw new AppException(
                "Suurce $template in Assets not found!",
                '500',
                'Internal Server Error',
                '500 Server Error'
            );
        }
        $code = Assets::$$template;

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
