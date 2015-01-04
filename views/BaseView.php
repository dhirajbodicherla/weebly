<?php
class BaseView extends \Slim\View
{
    public function render($template)
    {
        return 'The final rendered template';
    }
}