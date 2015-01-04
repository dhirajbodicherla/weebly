<?php

/* ./login.php */
class __TwigTemplate_5d5b7266d4cb59e060f481306d01fb96b20be589ee55836dd02b1b818691b5b4 extends Twig_Template
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
        echo "<html>
  <head>
    <meta charset='utf-8' />
    <style type=\"text/css\">
    \t#customBtn {
\t      display: inline-block;
\t      background: #dd4b39;
\t      color: white;
\t      width: 165px;
\t      border-radius: 5px;
\t      white-space: nowrap;
\t    }
\t    #customBtn:hover {
\t      background: #e74b37;
\t      cursor: hand;
\t    }
\t    span.icon {
\t      background: url('./img/btn_red_32.png') transparent 5px 50% no-repeat;
\t      display: inline-block;
\t      vertical-align: middle;
\t      width: 35px;
\t      height: 35px;
\t      border-right: #bb3f30 1px solid;
\t    }
\t    span.buttonText {
\t      display: inline-block;
\t      vertical-align: middle;
\t      padding-left: 35px;
\t      padding-right: 35px;
\t      font-size: 14px;
\t      font-weight: bold;
\t      /* Use the Roboto font that is loaded in the <head> */
\t      font-family: 'Roboto',arial,sans-serif;
\t    }
    </style>
  </head>
  <body>
  <div class=\"login-container\">
\t  <a class=\"login\" href=";
        // line 39
        echo twig_escape_filter($this->env, (isset($context["authURL"]) ? $context["authURL"] : null), "html", null, true);
        echo ">
\t  \t<div id=\"gSignInWrapper\">
\t\t  <div id=\"customBtn\" class=\"customGPlusSignIn\">
\t\t    <span class=\"icon\"></span>
\t\t    <span class=\"buttonText\">Google</span>
\t\t  </div>
\t\t</div>
\t  </a>
  </div>
  <script src=\"https://apis.google.com/js/client:platform.js?onload=render\" async defer></script>
  </body>
</html>";
    }

    public function getTemplateName()
    {
        return "./login.php";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  59 => 39,  19 => 1,);
    }
}
