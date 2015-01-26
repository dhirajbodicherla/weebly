<!doctype html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">	
	<title>Mini Weebly</title>
  	{{ HTML::style('css/main.less', array('rel' => 'stylesheet/less', 'media' => 'screen')) }}

	<!--[if lt IE 9]>
    	<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    	<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
  	<![endif]-->
</head>
<body>
<?php echo gethostname(); ?>
	@yield('content')

  {{ HTML::script('js/libs/jquery-min.js') }}
  
  {{ HTML::script('js/libs/less-min.js') }}
  {{ HTML::script('js/application.js') }}
	
  <!-- <script type="text/javascript" src="js/libs/jquery-ui.min.js"></script> -->
	<!-- <script type="text/javascript" src="http://fb.me/react-0.12.2.min.js"></script> -->
	<!-- <script type="text/javascript" src="http://fb.me/react-0.12.2.js"></script>
	<script type="text/javascript" src="http://fb.me/JSXTransformer-0.12.2.js"></script> -->

	<!--
	<script type="text/javascript" src="js/libs/react.js"></script>
	<script type="text/javascript" src="js/libs/JSXTransformer.js"></script>
	<script type="text/jsx" src="js/application.js"></script> -->
</body>
</html>
