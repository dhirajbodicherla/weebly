<?php

/* ./home.html */
class __TwigTemplate_4ee9454b960b54054ef04ae982dcf93815e3a51cf212cc3d1633edcfa995d36f extends Twig_Template
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
        echo "<!DOCTYPE html>
<html>
<head>
  <title></title>
  <link rel=\"stylesheet\" type=\"text/less\" href=\"css/main.less\">
</head>
<body>
  <div id=\"body\"></div>
  <script type=\"text/javascript\" src=\"js/libs/jquery-min.js\"></script>
  <script type=\"text/javascript\" src=\"js/libs/jquery-ui.min.js\"></script>
  <script type=\"text/javascript\" src=\"js/libs/less-min.js\"></script>
  <!-- <script type=\"text/javascript\" src=\"http://fb.me/react-0.12.2.min.js\"></script> -->
  <!-- <script type=\"text/javascript\" src=\"http://fb.me/react-0.12.2.js\"></script>
  <script type=\"text/javascript\" src=\"http://fb.me/JSXTransformer-0.12.2.js\"></script> -->
  <script type=\"text/javascript\" src=\"js/libs/react.js\"></script>
  <script type=\"text/javascript\" src=\"js/libs/JSXTransformer.js\"></script>
  <script type=\"text/jsx\" src=\"js/application.js\"></script>
  <!-- <script type=\"text/javascript\" src=\"js/main.js\"></script> -->
</body>
</html>";
    }

    public function getTemplateName()
    {
        return "./home.html";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
