<?php

class LoginController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function get()
	{

		if(ExtAuth\GoogleAuth::isAuthorized() == 'false' || !Auth::check()){
			Session::flush();
			return View::make('login.layout')
					->with(array('URLS'=>array(
							'googleAuthURL'=> ExtAuth\GoogleAuth::getAuthURL(),
							'googleClient_id'=> ExtAuth\GoogleAuth::getClientId()
							)));
		}

		return Redirect::to('/');
	}

	public function verify()
	{
		
		$type = Input::get('state');
		$code = Input::get('code');
		if($type == 'google'){
			ExtAuth\GoogleAuth::authenticate($code);
		}else if($type == 'facebook'){
			// facebook later
		}

		$me = ExtAuth\GoogleAuth::getMe();
		$user = User::firstOrNew(array('guid_usr' => $me->id));
		if(!$user->guid_usr){
			$user->guid_usr = $me->id;
			$user->api_token_usr = rand(10000000, 99999999);
			$user->save();

			$page = new Page();
			$page->is_home_pag = 1;
			$page->title_pag = 'Home';
			$page->usr_id_pag = $user->id_usr;
			$page->save();

		}
		Auth::login($user);
		Session::put('user', $user);
		
		return Redirect::to('/');
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function logout()
	{
		ExtAuth\GoogleAuth::logout();
		Auth::logout();
		Session::forget('user');

		return Redirect::to('/login');
	}


}
