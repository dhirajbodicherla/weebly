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
  <div class=\"nav\">
    <div class=\"bg\"></div>
    <div class=\"logomark\"></div>
    <div class=\"publish\">Save & Publish</div>
  </div>
  <div class=\"sidebar\">
    <div class=\"bg\"></div>
    <div class=\"item templates\">
      <div class=\"divider\">
        Templates
      </div>
      <div class=\"content\">
        <div class=\"pages\">
          <ul>
            <li>
              <div class=\"page selected\"><span class=\"name\">Page</span>
                <span class=\"icon delete\"></span>
                <span class=\"icon edit\"></span>
              </div>
            </li>
            <li>
              <div class=\"page delete\">Page</div>
            </li>
            <li>
              <div class=\"page\">
                <span class=\"name\">Page</span>
                <span class=\"icon delete\"></span>
                <span class=\"icon edit\"></span>
              </div>
            </li>
            <li>
              <div class=\"add-page\">
                <input type=\"text\" class=\"input\" placeholder=\"add new page\">
                <span class=\"icon add\"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class=\"item elements\">
      <div class=\"divider\">
        Elements
      </div>
      <div class=\"content\">
        <ul>
          <li>
            <div class=\"element\">
              <div class=\"image title-icon\" data-type=\"1\"></div>
              <div class=\"label\">Title</div>
            </div>
          </li>
          <li>
            <div class=\"element\">
              <div class=\"image text-icon\" data-type=\"2\"></div>
              <div class=\"label\">Text</div>
            </div>
          </li>
          <li>
            <div class=\"element\">
              <div class=\"image img-icon\" data-type=\"3\"></div>
              <div class=\"label\">Image</div>
            </div>
          </li>
          <li>
            <div class=\"element\">
              <div class=\"image nav-icon\" data-type=\"4\"></div>
              <div class=\"label\">Nav</div>
            </div>
          </li>
        </ul>
        <div class=\"clearfix\"></div>
      </div>
    </div>
    <div class=\"item settings\">
      <div class=\"divider\">
        Settings
      </div>
      <div class=\"content\">
        <ul>
          <li>
            <div class=\"settings-item site-grid\">
              site grid
              <span class=\"checkbox\">

              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class=\"editor\">
    <div class=\"navigation\">
      <ul>
        <li>
          <div class=\"page\">
            <span class=\"name\">Page</span>
          </div>
        </li>
      </ul>
    </div>
    <div class=\"heading-image\">
      <div class=\"placeholder\">
        <div class=\"image\"></div>
        <div class=\"label\">add image +</div>
      </div>
    </div>
    <div class=\"content\">
      <div class=\"title\">
        Add title here
      </div>
      <div class=\"body\">
        <div class=\"text\">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </div>
        <div id=\"dd\"></div>
      </div>
    </div>
  </div>
  <script type=\"text/javascript\" src=\"js/libs/jquery-min.js\"></script>
  <script type=\"text/javascript\" src=\"js/libs/jquery-ui.min.js\"></script>
  <script type=\"text/javascript\" src=\"js/libs/less-min.js\"></script>
  <script type=\"text/javascript\" src=\"js/main.js\"></script>
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
