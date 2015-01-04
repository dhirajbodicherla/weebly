<?php

/* ./BaseView.php */
class __TwigTemplate_c9863a6eb669e559c46789fe0d78e6591f6ce31a99c5c44fe20770969751f038 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<?php
class BaseView extends \\Slim\\View
{
    public function render(\$template)
    {
        return 'The final rendered template';
    }
}";
    }

    public function getTemplateName()
    {
        return "./BaseView.php";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
