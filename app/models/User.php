<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	protected $guarded = array('guid_usr');

	protected $primaryKey = 'id_usr';

	protected $attributes = array(
		'id_usr' => '',
		'guid_usr' => '',
		'api_token_usr' => '',
		'remember_token_usr' => ''
	);

	public function getRememberTokenName()
   	{
   		return 'remember_token_usr';
   	}

}
