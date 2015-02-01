@extends('base.layout')

@section('content')
	<div id="main"></div>

	{{ HTML::script('js/libs/jquery-ui.min.js' ) }}
	{{ HTML::script('js/libs/react.js' ) }}
	{{ HTML::script('js/libs/JSXTransformer.js' ) }}
	{{ HTML::script('js/application.js', array('type' => 'text/jsx')) }}
	{{ HTML::style('css/home.less', array('rel' => 'stylesheet/less', 'media' => 'screen') ) }}
@stop