<html>
  <head>
    <meta charset='utf-8' />
    <style type="text/css">
    	.login{
    		display: block;
    		margin: 10px 0px;
    	}
    	.login-btn {
	      display: inline-block;
	      background: #dd4b39;
	      color: white;
	      width: 180px;
	      border-radius: 5px;
	      white-space: nowrap;
	    }
	    .login-btn:hover {
	      background: #e74b37;
	      cursor: hand;
	    }
	    span.icon {
	      display: inline-block;
	      vertical-align: middle;
	      width: 35px;
	      height: 35px;
	      border-right: 1px solid rgba(0,0,0,0.2);
	    }
	    span.buttonText {
	    	vertical-align: middle;
	    	font-size: 13px;
	    	font-family: 'Roboto',arial,sans-serif;
	    	text-align: center;
	    }
	    .google span.icon{
	    	background: url('./img/btn_red_32.png') transparent 5px 50% no-repeat;
	    }
	    .facebook span.icon{
	    	background: url('./img/facebook.png') transparent 5px 50% no-repeat;
	    }
	    .facebook .login-btn{
	    	background: #3B5998;
	    }
	    .bg{
	    	background: url('https://c4.staticflickr.com/8/7541/15097656793_b47dc9afd7_b.jpg') no-repeat center;
	    	position: absolute;
	    	top: 0;
	    	left: 0;
	    	right: 0;
	    	bottom: 0;
	    	background-size: cover;
	    	z-index: -10;
	    }
	    .login-container{
	    	/*text-align: center;*/
	    }
	    .login-wrapper{
	    	
	    }
    </style>
  </head>
  <body>
  	<div class="bg"></div>
	  <div class="login-container">
		  <a class="login google" href={{googleAuthURL}}&state=google>
			  <div class="login-btn" class="">
			    <span class="icon"></span>
			    <span class="buttonText">Sign in with Google</span>
			  </div>
		  </a>
		  <a class="login facebook" href={{facebookAuthURL}}&state=facebook>
			  <div class="login-btn" class="">
			    <span class="icon"></span>
			    <span class="buttonText">Sign in with Facebook</span>
			  </div>
		  </a>
	  </div>
  </body>
</html>