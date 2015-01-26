@extends('base.layout')

@section('content')
$view 

  <div id="bodyWrapper">
    @include('home.header')
    @include('home.navigation')
    <div id="content">
      @include($view)
    </div>
  </div>
@stop