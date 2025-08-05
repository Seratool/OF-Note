<?php

namespace APP;

class View {
    private array $val = [];

    public function getContent($values = []): string
    {
        $this->val = $values;

        return $this->replace('{{ APP\Sources\Template::head }}').$this->replace('{{ APP\Sources\Template::body }}');
    }

    private function replace($str) {
        if (preg_match_all('/{{([^}]+)}}/is', $str, $matches)) {
            foreach ($matches[1] as $key => $match) {
                $temp = '';

                if (strpos($match, '::')) {
                    $match = str_replace('::', '::$', trim($match));
                    eval("\$temp = $match;");

                } elseif (strpos($match, '->')) {
                    list($obj, $value) = $this->getObjectParams($match);

                    if (strpos($value, '(') && strpos($value, ')')) {
                        list($method, $params) = $this->getFuncElements($value);

                        $temp = call_user_func_array([$obj, $method], array_map(function($val) {
                            return trim($val, '\'"');
                        }, $params));

                    } else {
                        $temp = $obj->{$value};
                    }

                } else if (strpos($match, '(') && strpos($match, ')')) {
                    list($func, $params) = $this->getFuncElements($match);
                    $func = is_callable($func) ? $func : $this->val[$func];

                    $temp = call_user_func_array($func, array_map(function($val) {
                        return trim($val, '\'"');
                    }, $params));

                } else {
                    $temp = $this->val[trim($match)] ?? '';
                }

                $str = str_replace($matches[0][$key], $this->replace($temp), $str);
            }
        }

        return $str;
    }

    private function getObjectParams($temp): array
    {
        $ar = explode('->', $temp);
        return [$this->val[trim($ar[0])], trim($ar[1])];
    }
    private function getFuncElements($temp): array
    {
        return [
            strstr(trim($temp), '(', true),
            explode(',', trim(trim(strstr($temp, '(')), '()'))
        ];
    }
}
