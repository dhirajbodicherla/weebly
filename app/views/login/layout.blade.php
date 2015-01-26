@extends('base.layout')

@section('content')

	{{ HTML::style('css/login.css', array('media' => 'screen')) }}

	<div class="bg">
		<div class="login-container">
		  <a class="login google" href={{$URLS['googleAuthURL']}}&state=google>
			  <div class="login-btn" class="">
			    <span class="icon"></span>
			    <span class="buttonText">Sign in with Google</span>
			  </div>
		  </a>
		  <!-- <a class="login facebook" href=&state=facebook>
			  <div class="login-btn" class="">
			    <span class="icon"></span>
			    <span class="buttonText">Sign in with Facebook</span>
			  </div>
		  </a> -->
		</div>
	</div>

@stop