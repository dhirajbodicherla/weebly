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
    \t.login{
    \t\tdisplay: block;
    \t\tmargin: 10px 0px;
    \t}
    \t.login-btn {
\t      display: inline-block;
\t      background: #dd4b39;
\t      color: white;
\t      width: 180px;
\t      border-radius: 5px;
\t      white-space: nowrap;
\t    }
\t    .login-btn:hover {
\t      background: #e74b37;
\t      cursor: hand;
\t    }
\t    span.icon {
\t      display: inline-block;
\t      vertical-align: middle;
\t      width: 35px;
\t      height: 35px;
\t      border-right: 1px solid rgba(0,0,0,0.2);
\t    }
\t    span.buttonText {
\t    \tvertical-align: middle;
\t    \tfont-size: 13px;
\t    \tfont-family: 'Roboto',arial,sans-serif;
\t    \ttext-align: center;
\t    }
\t    .google span.icon{
\t    \tbackground: url('./img/btn_red_32.png') transparent 5px 50% no-repeat;
\t    }
\t    .facebook span.icon{
\t    \tbackground: url('./img/facebook.png') transparent 5px 50% no-repeat;
\t    }
\t    .facebook .login-btn{
\t    \tbackground: #3B5998;
\t    }
\t    .bg{
\t    \tbackground: url('https://c4.staticflickr.com/8/7541/15097656793_b47dc9afd7_b.jpg') no-repeat center;
\t    \tposition: absolute;
\t    \ttop: 0;
\t    \tleft: 0;
\t    \tright: 0;
\t    \tbottom: 0;
\t    \tbackground-size: cover;
\t    \tz-index: -10;
\t    }
\t    .login-container{
\t    \t/*text-align: center;*/
\t    }
\t    .login-wrapper{
\t    \t
\t    }
    </style>
  </head>
  <body>
  \t<div class=\"bg\"></div>
\t  <div class=\"login-container\">
\t\t  <a class=\"login google\" href=";
        // line 64
        echo twig_escape_filter($this->env, (isset($context["googleAuthURL"]) ? $context["googleAuthURL"] : null), "html", null, true);
        echo "&cred_type=google>
\t\t\t  <div class=\"login-btn\" class=\"\">
\t\t\t    <span class=\"icon\"></span>
\t\t\t    <span class=\"buttonText\">Sign in with Google</span>
\t\t\t  </div>
\t\t  </a>
\t\t  <a class=\"login facebook\" href=";
        // line 70
        echo twig_escape_filter($this->env, (isset($context["facebookAuthURL"]) ? $context["facebookAuthURL"] : null), "html", null, true);
        echo "&cred_type=facebook>
\t\t\t  <div class=\"login-btn\" class=\"\">
\t\t\t    <span class=\"icon\"></span>
\t\t\t    <span class=\"buttonText\">Sign in with Facebook</span>
\t\t\t  </div>
\t\t  </a>
\t  </div>
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
        return array (  93 => 70,  84 => 64,  19 => 1,);
    }
}
