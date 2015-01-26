<?php

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Page extends Eloquent {

	use SoftDeletingTrait;

	protected $primaryKey = 'id_pag';
	protected $table = 'page';
	protected $dates = ['deleted_at'];
	protected $attributes = array(
		'id_pag' => '',
		'title_pag' => '',
		'body_pag' => '',
		'is_home_pag' => '',
		'usr_id_pag' => ''
	);

	public function getUpdatedAtAttribute($date)
	{
    	return Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('M d, Y  h:ia');
	}
}
