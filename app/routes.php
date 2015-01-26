<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
Route::get('/login', 'LoginController@get');
Route::get('/logout', 'LoginController@logout');
Route::get('/verify', 'LoginController@verify');
Route::get('/', 'HomeController@get')->before('auth');
Route::get('/new-page', 'HomeController@getNew')->before('auth');
Route::post('/page', 'PageController@add')->before('auth');
Route::get('{title}', 'PageController@showSlug')->before('auth');
Route::get('/page/{page_id}', 'PageController@get')->before('auth');
Route::put('/page/{page_id}', array('as' => 'page.edit', 'uses' => 'PageController@update'))->before('auth');
Route::get('/page/{page_id}/delete', 'PageController@delete')->before('auth');

App::missing(function($exception)
{
    return Response::view('error.404', array(), 404);
});