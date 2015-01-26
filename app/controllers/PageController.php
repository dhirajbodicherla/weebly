<?php

class PageController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function get($page_id)
	{
		$user = Session::get('user');
		$user_id = $user->id_usr;
		$page = Page::where('id_pag', '=', $page_id)
					->where('usr_id_pag', '=', $user_id)
					->get();
		
		if($page->count() == 0){
			return Redirect::to('404');
		}

		$home = Page::where('is_home_pag', '=', 1)
					->where('usr_id_pag', '=', $user_id)
					->get()->first();
		$pages = Page::where('usr_id_pag', '=', $user_id)->get();

		return View::make('home.layout')
						->with('page', $page->first())
						->with('pages', $pages)
						->with('home', $home)
						->with('user', $user)
						->with('view', 'home.viewPage');
	}

	public function showSlug($title){
		$pages = Page::get();
	    $page = Page::where('title_pag', '=', $title)->first();

	    if ( is_null($page) )
	        App::abort(404);

	    return View::make('home.layout')
						->with('page', $page)
						->with('pages', $pages);
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function add()
	{
		$input = Input::all();
		$page = new Page;
		$page->title_pag = $input['title_pag'];
		$page->body_pag = $input['body_pag'];
		$page->usr_id_pag = Session::get('user')->id_usr;
		$page->save();

		return Redirect::to('/');
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($page_id)
	{
		$input = Input::all();
		$page = Page::find($page_id);
		$page->title_pag = $input['title_pag'];
		$page->body_pag = $input['body_pag'];
		$page->save();

		return Redirect::to('/page/' . $page_id);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function delete($page_id)
	{
		$page = Page::find($page_id);
		$page->delete();

		return Redirect::to('/');
	}


}
