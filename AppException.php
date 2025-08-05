<?php

namespace APP;

class AppException extends \Exception
{
    protected string $title = '';
    protected string $headline = '';
    protected string $subHeadline = '';
    public function __construct($message, $headline = '', $subHeadline = '', $title = '', $code = 0, \Throwable $previous = null)
    {
        $this->title = $title;
        $this->headline = $headline;
        $this->subHeadline = $subHeadline;
        parent::__construct($message, $code, $previous);
    }

    final public function getTitle(): string
    {
        return $this->title;
    }
    final public function getHeadline(): string
    {
        return $this->headline;
    }
    final public function getSubHeadline(): string
    {
        return $this->subHeadline;
    }
}