<?php

class HomeController extends BaseController {

	public function get()
	{
		$user = Session::get('user');
		$user_id = $user->id_usr;

		$pages = Page::where('usr_id_pag', '=', $user_id)->get();
		$home = Page::where('is_home_pag', '=', 1)
						->where('usr_id_pag', '=', $user_id)->get()->first();

		return View::make('home.layout')
						->with('pages', $pages)
						->with('home', $home)
						->with('page', $home)
						->with('user', $user)
						->with('view', 'home.viewPage');
	}

	public function getNew(){
		$user = Session::get('user');
		$user_id = $user->id_usr;

		$pages = Page::where('usr_id_pag', '=', $user_id)->get();
		$home = Page::where('is_home_pag', '=', 1)
					->where('usr_id_pag', '=', $user_id)->get()->first();
		
		return View::make('home.layout')
						->with('pages', $pages)
						->with('home', $home)
						->with('isNew', '1')
						->with('user', $user)
						->with('view', 'home.newPage');
	}

	public function showHome(){
		return View::make('home.home');
	}

}
