<html>
  <head>
    <meta charset='utf-8' />
    <style type="text/css">
    	#customBtn {
	      display: inline-block;
	      background: #dd4b39;
	      color: white;
	      width: 165px;
	      border-radius: 5px;
	      white-space: nowrap;
	    }
	    #customBtn:hover {
	      background: #e74b37;
	      cursor: hand;
	    }
	    span.icon {
	      background: url('./img/btn_red_32.png') transparent 5px 50% no-repeat;
	      display: inline-block;
	      vertical-align: middle;
	      width: 35px;
	      height: 35px;
	      border-right: #bb3f30 1px solid;
	    }
	    span.buttonText {
	      display: inline-block;
	      vertical-align: middle;
	      padding-left: 35px;
	      padding-right: 35px;
	      font-size: 14px;
	      font-weight: bold;
	      /* Use the Roboto font that is loaded in the <head> */
	      font-family: 'Roboto',arial,sans-serif;
	    }
    </style>
  </head>
  <body>
  <div class="login-container">
	  <a class="login" href={{authURL}}>
	  	<div id="gSignInWrapper">
		  <div id="customBtn" class="customGPlusSignIn">
		    <span class="icon"></span>
		    <span class="buttonText">Google</span>
		  </div>
		</div>
	  </a>
  </div>
  <script src="https://apis.google.com/js/client:platform.js?onload=render" async defer></script>
  </body>
</html>