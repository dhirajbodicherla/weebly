<?php

session_cache_limiter(false);
session_start();

require './vendor/autoload.php';
require_once('./auth/google.php');

GoogleAuth::init();

$app = new \Slim\Slim(array(
    'cookies.encrypt' => true,
    'cookies.lifetime' => '2 days',
    'view' => new \Slim\Views\Twig()
));
$env = $app->environment;
$env['PATH_INFO'] = strtok($_SERVER["REQUEST_URI"],'?');
$app->config(array(
    'log.level' => \Slim\Log::DEBUG,
    'log.enabled' => true,
    'debug' => true,
    'templates.path' => './views'
));
$view = $app->view();
$view->setTemplatesDirectory($app->config('templates.path'));

$view->parserOptions = array(
    'debug' => true,
    'cache' => dirname(__FILE__) . '/cache'
);
$view->parserExtensions = array(
    new \Slim\Views\TwigExtension(),
);



$app->get('/', 'checkCurrentUser', 'home');
$app->get('/verify', 'verify');

$app->get('/get_change_initiatives_list', 'getChangeInitiativesList');
$app->post('/create_ci', 'createChangeInitiative');
$app->get('/get_ci_instance/:id', 'getChangeInitiativeInstance');
$app->run();


function checkCurrentUser(){
	$app = \Slim\Slim::getInstance();
	if(!GoogleAuth::isAuthorized($app->getEncryptedCookie("access_token"))){
		$app->render('./login.php', 
					array(
						'authURL'=> GoogleAuth::authURL(),
						'client_id'=> GoogleAuth::getClientId()
						)
					);
		$app->stop();
	}
}

function home(){
	$app = \Slim\Slim::getInstance();
	$app->render('./home.html');
}

function verify(){
	$app = \Slim\Slim::getInstance();
	$code = $app->request->params('code');
	GoogleAuth::authenticate($code);
	$_SESSION['access_token'] = GoogleAuth::getAccessToken();
	$app->redirect('/');
}

function setActorDetails(){
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = $request->getBody();
    
    $con = Helpers::pdo_db_connect();

	$sql_params = array();
	
	$member_name = $req_params->member_name;
	$ci_id = $req_params->ci_id;
	$member_progress = $req_params->member_progress;
	$phase_id = $req_params->member_phase;
    
 	$insert_member_sql = "INSERT INTO member(name_mem)
			VALUES(:member_name)";
	
	$sql_params['member_name'] = $member_name;
		
	$insert_member_stmt = Helpers::execute_query($con, $insert_member_sql, $sql_params, 'insert member row');
	$member_id = $con->lastInsertId();
	
	if( $insert_member_stmt ){
				
		$insert_chi_member_sql = "INSERT INTO change_initiative_member(chi_cime_id, mem_cime_id, cip_cime_id, progress_cime)
									VALUES(:ci_id, :member_id, :phase_id, :member_progress)";
		$sql_params = array();
		$sql_params['ci_id'] = $ci_id;
		$sql_params['member_id'] = $member_id;
		$sql_params['phase_id'] = $phase_id;
		$sql_params['member_progress'] = $member_progress;
		
		$insert_chi_member_stmt = Helpers::execute_query($con, $insert_chi_member_sql, $sql_params, 'insert member row');
		
		$response['member_id'] = $member_id;
		$response['member_name'] = $member_name;
		$response['member_progress'] = $member_progress;
		
		echo json_encode($response);
		
	}
}

function createChangeInitiative() {
	
	/*
		Base story line is 12
		Get the phases and actions for storyline 12 and add them to CI
	*/
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	
	/*
	// Getting the list of phases for storyline 12
	$get_storyline_phases_sql = "SELECT id_pha as phase_id,
							name_pha as phase_name,
			 				description_pha as phase_description
						FROM phase 
						WHERE sto_pha_id=:storyline_id";

	$sql_params = array();    
    $sql_params['storyline_id'] = 1;

    $get_storyline_phases_stmt = Helpers::execute_query($con, $get_storyline_phases_sql, $sql_params, 'get storyline phases');
    $phase_count = $get_storyline_phases_stmt->rowCount();
	//$phase_rows = $get_storyline_phases_stmt->fetchAll(PDO::FETCH_ASSOC);
	*/
	
	// INSERT change initiative to get its ID
    $sql_params = array();
	
	$phase_ci_array = $req_params->change_initiative_phases;
	
	$name_ci = $req_params->change_initiative_name;
	$description_ci = $req_params->change_initiative_description;
    $start_time_ci = $req_params->change_initiative_start_time;
    $end_time_ci = $req_params->change_initiative_end_time;
	$progress_ci = 28;
    
 	$create_ci_sql = "INSERT INTO 
						change_initiative(man_chi_id,
												name_chi, 
												description_chi, 
												start_time_chi, 
												end_time_chi,
												progress_chi)
						VALUES(:man_chi_id, 
							:name_ci, 
							:description_ci, 
							:start_time_ci, 
							:end_time_chi, 
							:progress_ci)";
	
	$sql_params['man_chi_id'] = 1;
	$sql_params['name_ci']	= $name_ci;
	$sql_params['description_ci'] = $description_ci;
	$sql_params['start_time_ci'] = $start_time_ci;
	$sql_params['end_time_chi'] = $end_time_ci;
	$sql_params['progress_ci'] = $progress_ci;

	$create_ci_sql_stmt = Helpers::execute_query($con, $create_ci_sql, $sql_params, 'insert new row');
	$ci_id = $con->lastInsertId();
	
	// INSERT template phase from sto 12
	
	$insert_phases_to_ci_sql = "INSERT INTO change_initiative_phase(chi_cip_id, name_cip, description_cip, weight_cip)
								SELECT $ci_id, name_pha, description_pha, weight_pha
								FROM phase
								WHERE sto_pha_id=12";
	$insert_phases_to_ci_stmt = Helpers::execute_query($con, $insert_phases_to_ci_sql, $sql_params, 'insert templates phases');
	
	//INSERT template actions from sto 12
	$insert_actions_to_ci_sql = "INSERT INTO change_initiative_action(man_cia_id, chi_cia_id, name_cia, description_cia)
								SELECT 1, $ci_id, name_act, description_act
								FROM action
								WHERE sto_act_id=12";
	$insert_actions_to_ci_stmt = Helpers::execute_query($con, $insert_actions_to_ci_sql, $sql_params, 'insert templates actions');
	
	/*
	
	$ci_phases_sql = "INSERT INTO 
						change_initiative_phase(chi_cip_id,
												name_cip)
						VALUES";
						//"(:ci_id,:phase_name)";
	for($i=0; $i<count( $phase_ci_array ); $i++){
		$ci_phases_sql .= "(" . $ci_id . " ,'" . $phase_ci_array[$i] . "'),";
	}
	$ci_phases_sql = substr($ci_phases_sql, 0, -1);
	
	$ci_phases_stmt = Helpers::execute_query($con, $ci_phases_sql, $sql_params, 'insert new row');
	*/
	$response = array();
	$response['success'] = 0;
	
	if( $insert_actions_to_ci_stmt ){
		$response['success'] = 1;
	}else{
		$response['error_code'] = 1045;
		$response['detail'] = 'error';
	}
	echo json_encode($response);
}

function getChangeInitiativeInstance($id) {
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_ci_instance_sql = "SELECT id_chi as ci_id,
							name_chi as ci_name,
			 				description_chi as ci_description
						FROM change_initiative 
						WHERE man_chi_id=:user_id
						AND id_chi=:ci_id";

	$sql_params = array();  
	$sql_params['user_id'] = 1;
    $sql_params['ci_id'] = $id;

    $get_ci_instance_stmt = Helpers::execute_query($con, $get_ci_instance_sql, $sql_params, 'get ci instance');
    $row_count = $get_ci_instance_stmt->rowCount();
	$response = $get_ci_instance_stmt->fetchObject();
    
	echo json_encode($response);
}

function getChangeInitiativesList(){
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_ci_list_sql = "SELECT id_chi as id,
							name_chi as change_initiative_name,
			 				description_chi as change_initiative_description,
							start_time_chi as change_initiative_start_time,
							end_time_chi as change_initiative_end_time,
							progress_chi as change_initiative_progress
						FROM change_initiative 
						WHERE man_chi_id=:user_id
						ORDER BY id_chi desc";

	$sql_params = array();    
    $sql_params['user_id'] = 1;

    $stmt      = Helpers::execute_query($con, $get_ci_list_sql, $sql_params, 'user check');
    $row_count = $stmt->rowCount();
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	//print_r($rows);
	
    if ($row_count == 0) {
		$response['success'] = 1;
		$response['count'] = 0;
	}else{
		$response['error_code'] = 1045;
		$response['detail'] = 'error';
	}
	
	echo json_encode($rows);
	
}

function getDashboardLeftPanelActionBarItems(){
	$response = array();
	
	$response[0]['navHeader'] = 'nav-header';
	$response[0]['className'] = '';
	$response[0]['label'] = 'Change Initiative';
	$response[0]['hashBang'] = '';
	$response[0]['index'] = 1;
	
	$response[1]['navHeader'] = '';
	$response[1]['className'] = 'icon-plus';
	$response[1]['label'] = 'Create a new CI';
	$response[1]['hashBang'] = 'new';
	$response[1]['index'] = 2;
	/*	
	$response[2]['navHeader'] = '';
	$response[2]['className'] = 'icon-pencil';
	$response[2]['label'] = 'Edit a CI';
	$response[2]['hashBang'] = 'edit';
	$response[2]['index'] = 3;
	*/
	$response[2]['navHeader'] = '';
	$response[2]['className'] = 'icon-list-alt';
	$response[2]['label'] = 'All Initiatives';
	$response[2]['hashBang'] = 'all';
	$response[2]['index'] = 3;
	
	$response[3]['navHeader'] = 'nav-header';
	$response[3]['className'] = '';
	$response[3]['label'] = 'Organization';
	$response[3]['hashBang'] = '';
	$response[3]['index'] = 4;
	
	$response[4]['navHeader'] = '';
	$response[4]['className'] = 'icon-list-alt';
	$response[4]['label'] = 'Wall';
	$response[4]['hashBang'] = 'wall';
	$response[4]['index'] = 5;
	
	/*
	$response[5]['navHeader'] = '';
	$response[5]['className'] = 'icon-user';
	$response[5]['label'] = 'Team Members';
	$response[5]['hashBang'] = 'team';
	$response[5]['index'] = 6;
	*/
	$response[5]['navHeader'] = '';
	$response[5]['className'] = 'icon-user';
	$response[5]['label'] = 'People';
	$response[5]['hashBang'] = 'people';
	$response[5]['index'] = 6;
	/*
	$response[7]['navHeader'] = '';
	$response[7]['className'] = 'icon-tasks';
	$response[7]['label'] = 'Calendar';
	$response[7]['hashBang'] = 'calendar';
	$response[7]['index'] = 8;
	
	$response[8]['navHeader'] = '';
	$response[8]['className'] = 'icon-envelope';
	$response[8]['label'] = 'Messages';
	$response[8]['hashBang'] = 'messages';
	$response[8]['index'] = 9;
	*/
	$response[6]['navHeader'] = '';
	$response[6]['className'] = 'icon-globe';
	$response[6]['label'] = 'Org chart';
	$response[6]['hashBang'] = 'org-chart';
	$response[6]['index'] = 7;
	
	$response[7]['navHeader'] = '';
	$response[7]['className'] = 'icon-wrench';
	$response[7]['label'] = 'Settings';
	$response[7]['hashBang'] = 'settings';
	$response[7]['index'] = 8;
	
	echo json_encode($response);
}

function getDashboardWallPosts($id){
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_wall_posts_sql = "SELECT id_wap as id, 
									name_man as user_name,
									message_wap as message, 
									timestamp_wap as post_timestamp,
									IFNULL(wall_post_comments.comments_count,0) as comments_count
							FROM manager man,wall_post wp
							LEFT JOIN
							( SELECT count(id_com) as comments_count, 
									wap_com_id
							FROM comment
							GROUP BY wap_com_id ) wall_post_comments
							ON wp.id_wap = wall_post_comments.wap_com_id
							WHERE wp.target_id_wap=:target_id 
								AND wp.actor_id_wap = man.id_man
							ORDER BY wp.id_wap desc
							LIMIT 10";

	$sql_params = array();    
    $sql_params['target_id'] = $id;

    $get_wall_posts_stmt = Helpers::execute_query($con, $get_wall_posts_sql, $sql_params, 'get wall posts ');
    $row_count = $get_wall_posts_stmt->rowCount();
	$rows = $get_wall_posts_stmt->fetchAll(PDO::FETCH_ASSOC);
	
    if ($row_count == 0) {
		$response['success'] = 1;
		$response['count'] = 0;
	}else{
		$response['error_code'] = 1045;
		$response['detail'] = 'error';
	}
	
	echo json_encode($rows);
}

function putDashboardWallPosts($id){
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
    
	$sql_params = array();
	
	$message = $req_params->message;
	$user_name_wap = $req_params->user_name;
    $post_time_wap = $req_params->post_timestamp;
    
 	$create_wall_post_sql = "INSERT INTO wall_post(actor_id_wap, target_id_wap, message_wap, is_target_ci_wap)
			VALUES(:user_name, :target_id_wap, :message, :is_target_ci)";
	
	$sql_params['user_name'] = 1;
	$sql_params['target_id_wap'] = $id;
	$sql_params['message'] = $message;
	$sql_params['is_target_ci'] = 1;
		
	$create_wall_post_stmt = Helpers::execute_query($con, $create_wall_post_sql, $sql_params, 'insert new row in wallpost');
	$last_insert_id = $con->lastInsertId();
	if( $create_wall_post_stmt ){
		
		$get_wall_post_sql = "SELECT id_wap as id, 
									name_man as user_name, 
									message_wap as message, 
									timestamp_wap as post_timestamp 
							FROM manager, wall_post
							WHERE id_wap=:id
							AND actor_id_wap=id_man";

		$sql_params = array();    
	    $sql_params['id'] = $last_insert_id;

	    $get_wall_post_stmt = Helpers::execute_query($con, $get_wall_post_sql, $sql_params, 'get wall posts ');
	    $row_count = $get_wall_post_stmt->rowCount();
		$response = $get_wall_post_stmt->fetchObject();
		
	}else{
		$response['success'] = 0;
	}

	echo json_encode($response);
}

function getComments($id) {
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_wall_post_comments_sql = "SELECT id_com as id,
									wap_com_id as post_id,
									message_com as comment,
									name_man as user_name,
									timestamp_com as comment_timestamp
							FROM manager, comment
							WHERE wap_com_id=:wap_com_id
							AND man_com_id = id_man
							LIMIT 3";

	$sql_params = array();    
    $sql_params['wap_com_id'] = $id;

    $get_wall_post_comments_stmt = Helpers::execute_query($con, $get_wall_post_comments_sql, $sql_params, 'get wall post comments ');
    $row_count = $get_wall_post_comments_stmt->rowCount();
	$rows = $get_wall_post_comments_stmt->fetchAll(PDO::FETCH_ASSOC);
	
    if ($row_count == 0) {
		$response['success'] = 1;
		$response['count'] = 0;
	}else{
		$response['error_code'] = 1045;
		$response['detail'] = 'error';
	}
	
	echo json_encode($rows);
}

function putComments(){
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
    
	$sql_params = array();
	
	$message = $req_params->comment;
	$user_name_com = $req_params->user_name;
    $post_time_com = $req_params->comment_timestamp;
	$wap_com_id = $req_params->post_id;
    
 	$create_wall_post_comment_sql = "INSERT INTO comment(wap_com_id, man_com_id, message_com)
			VALUES(:wap_com_id, :man_com_id, :message)";
	
	$sql_params['wap_com_id'] = $wap_com_id;
	$sql_params['man_com_id'] = 1;
	$sql_params['message'] = $message;
		
	$create_wall_post_comment_stmt = Helpers::execute_query($con, $create_wall_post_comment_sql, $sql_params, 'insert new comment for a wallpost in comment table');
	$last_insert_id = $con->lastInsertId();
	if( $create_wall_post_comment_stmt ){

		$get_wall_post_comment_sql = "SELECT id_com as id,
		 									name_man as user_name, 
											wap_com_id as post_id, 
											message_com as comment, 
											timestamp_com as comment_timestamp 
									FROM manager, comment 
									WHERE id_com=:id
									AND man_com_id=id_man";

		$sql_params = array();    
	    $sql_params['id'] = $last_insert_id;

	    $get_wall_post_comment_stmt = Helpers::execute_query($con, $get_wall_post_comment_sql, $sql_params, 'get comments after inserting ');
	    $row_count = $get_wall_post_comment_stmt->rowCount();
		$response = $get_wall_post_comment_stmt->fetchObject();
		
	}else{
		$response['success'] = 0;
	}

	echo json_encode($response);
}

function getListOfActions($id){
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_ci_actions_sql = "SELECT id_cia as id,
									name_cia as name,
									description_cia as description
							FROM change_initiative_action
							WHERE chi_cia_id = :chi_cia_id";

	$sql_params = array();    
    $sql_params['chi_cia_id'] = $id;

	$get_ci_actions_stmt = Helpers::execute_query($con, $get_ci_actions_sql, $sql_params, 'get ci actions ');
    $row_count = $get_ci_actions_stmt->rowCount();
	$rows = $get_ci_actions_stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($rows);
}

function getListOfPhasesForCI($id){
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_change_initiative_phases_sql = "SELECT id_cip as phase_id,
										name_cip as phase_name, 
										description_cip as phase_description,
										progress_cip as phase_progress 
									FROM change_initiative_phase 
									WHERE chi_cip_id=:chi_cip_id";

	$sql_params = array();    
    $sql_params['chi_cip_id'] = $id;

    $get_change_initiative_phases_stmt = Helpers::execute_query($con, $get_change_initiative_phases_sql, $sql_params, 'get ci phases');
    $row_count = $get_change_initiative_phases_stmt->rowCount();
	$phases = $get_change_initiative_phases_stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$member_details_sql = "SELECT name_mem as member_name,
								description_mem as member_description,
								mem_cime_id as member_id,
								cip_cime_id as member_phase,
								progress_cime as member_progress 
							FROM member,
								change_initiative_member 
							WHERE member.id_mem = mem_cime_id 
								AND cip_cime_id 
								IN ( 
									SELECT id_cip 
									FROM `change_initiative_phase` 
									WHERE chi_cip_id=:chi_cip_id )";
	
	$sql_params = array();    
    $sql_params['chi_cip_id'] = $id;
	
	$member_details_stmt = Helpers::execute_query($con, $member_details_sql, $sql_params, 'get ci phases');
	$members = $member_details_stmt->fetchAll(PDO::FETCH_ASSOC);
	/*
	for($i=0; $i < count($phases); $i++){
		$phases[$i]['members'] = array();
		for($j=0; $j < count($members); $j++){
			if( $phases[$i]['phase_id'] == $members[$j]['member_phase'] ){
				array_push($phases[$i]['members'], $members[$j]);
			}
		}
	}
	*/
	
	echo json_encode($phases);
}

function getListOfMembersForCIPhase($id) {
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_ci_members_sql = "SELECT name_mem as member_name, 
											description_mem as member_description,
											mem_cime_id as member_id,
											cip_cime_id as member_phase, 
											progress_cime as member_progress
										FROM change_initiative_member, member
										WHERE mem_cime_id=id_mem
										AND cip_cime_id=:cip_cime_id";

	$sql_params = array();    
    $sql_params['cip_cime_id'] = $id;

    $get_ci_members_stmt = Helpers::execute_query($con, $get_ci_members_sql, $sql_params, 'get ci phases');
    $row_count = $get_ci_members_stmt->rowCount();
	$rows = $get_ci_members_stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($rows);
}

function registerActions() {
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
    
	$sql_params = array();
	
	$action_id = $req_params->actionID;
	$action_act = $req_params->actionObj;
	$ci_id = $req_params->ci_id;
	//$actors_array = $req_params->actors;
    
 	$insert_activty_sql = "INSERT INTO change_initiative_activity(man_act_id, cia_act_id, action_act)
			VALUES(:manager_id, :action_id, :action_act)";
	
	$sql_params['manager_id'] = 1;
	$sql_params['action_id'] = $action_id;
	$sql_params['action_act'] = $action_act;
		
	$phases = json_decode($req_params->actionObj);
	
	$insert_activty_stmt = Helpers::execute_query($con, $insert_activty_sql, $sql_params, 'insert activity log for action');
	
	if( $insert_activty_stmt ){
		$update_actor_progress_sql = "INSERT INTO change_initiative_member(chi_cime_id, mem_cime_id,cip_cime_id, progress_cime) VALUES";

		for($i=0; $i < count($phases); $i++){
			if( count($phases[$i]->phase_members) > 0 ){
				$actors = $phases[$i]->phase_members;
				for($j=0; $j< count($actors); $j++){
					$update_actor_progress_sql .= "(".$ci_id.", " . $actors[$j]->member_id . "," . $phases[$i]->phase_id . ", " . $actors[$j]->member_progress . " ),";
				}
			}
			
		}
		
		$update_actor_progress_sql = substr($update_actor_progress_sql, 0, -1);
		$update_actor_progress_sql .= "ON DUPLICATE KEY UPDATE cip_cime_id=VALUES(cip_cime_id), progress_cime=VALUES(progress_cime)";
		
		$update_actor_progress_stmt = Helpers::execute_query($con, $update_actor_progress_sql, $sql_params, $update_actor_progress_sql);
		
	}
	
	echo json_encode($sql_params);
}

function getManagerActorInteractions($id){
	
	$instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
	$sql_params = array();
	
	$get_manager_actor_interaction_sql = "SELECT act.man_act_id as manager_id,
												act.cia_act_id as activity_id, 
												cia.name_cia as action_name, 
												cia.description_cia as action_description, 
												act.timestamp_act as activity_timestamp
										FROM activity act,change_initiative_action cia
										WHERE act.id_act 
										IN (SELECT act_ata_id 
											FROM activity_target_actors 
											WHERE actor_id_ata = :actor_id)
										AND act.cia_act_id = cia.id_cia";

	$sql_params = array();    
    $sql_params['actor_id'] = $id;

    $get_manager_actor_interaction_stmt = Helpers::execute_query($con, $get_manager_actor_interaction_sql, $sql_params, 'get man act int');
    $row_count = $get_manager_actor_interaction_stmt->rowCount();
	if( $row_count > 0 ){
		$rows = $get_manager_actor_interaction_stmt->fetchAll(PDO::FETCH_ASSOC);
	}else{
		
	}
	
	echo json_encode($rows);
}

/*
function validateUser(){
	
    $instance   = Slim::getInstance();
    $request    = $instance->request();
    $req_params = json_decode($request->getBody());
    
    $con = Helpers::pdo_db_connect();
    
    $response          = $req_params;
    $response->success = 0;
    
    $randomkey = rand(0, 1000) . rand(0, 1000);
    
    $sql_params = array();
    
    $email         = $req_params->email;
	$username      = $req_params->username;
    $social_method = $req_params->social_method;
    $social_id     = $req_params->social_id;
    $password_md5  = $req_params->password;
    
    $ip_address = Helpers::get_ipaddress();
    $user_agent = Helpers::get_browser_info();

	$cookie_code = md5( $randomkey . $social_method . 'c00k1e' );
       
   
    
    if ($req_params->social_method == 6) {
		
		$sql = "SELECT user_name_usr, password_usr, id_usr
					FROM user 
					WHERE email_usr=:email";

		$sql_params = array();    
	    $sql_params['email'] = $email;

	    $stmt      = Helpers::execute_query($con, $sql, $sql_params, 'user check');
	    $row_count = $stmt->rowCount();

	    if ($row_count == 1) {
	        $user_account = $stmt->fetchObject();
	        $id_usr       = $user_account->id_usr;

	        $second_check_md5 = md5($user_account->password_usr . $randomkey);
	        $user_input_md5   = md5($password_md5 . $randomkey);

	        if ($user_input_md5 === $second_check_md5) {
	            // user exists => push randomkey generated and set signed-in boolean
	            // NOW() => MySQL built-in function to get current timestamp.

	            $randomkey_sql = "UPDATE user
										SET random_key_usr=:randomkey, timestamp_usr=NOW()
										WHERE id_usr=:id_usr
											AND cookie_code_usr=:cookie_code";

	            $sql_params              = array();
	            $sql_params['randomkey'] = $randomkey;
	            $sql_params['id_usr']    = $id_usr;
				$sql_params['cookie_code'] = $cookie_code;

	            $randomkey_stmt      = Helpers::execute_query($con, $randomkey_sql, $sql_params, 'randomkey normal');

	            $response->id        = $user_account->id_usr;
	            $response->success   = 1;
	            $response->randomkey = $randomkey;
				
				$instance->setEncryptedCookie(Helpers::$session_name, $cookie_code);
				$_SESSION[Helpers::$session_name] = $cookie_code;

	        } else {
	            $response->error_code = 101;
	            $response->message    = "username/password combination failed";
	        }
	    } else {
	        $response->error_code = 102;
	        $response->message    = "username/password combination failed";
	    }

	    echo json_encode($response);

    } else {

        $sql = "SELECT user_name_usr, password_usr, id_usr
					FROM user 
					WHERE sol_usr_id=:social_method
						AND social_id_usr=:social_id";

	    $sql_params['social_method'] = $social_method;
	    $sql_params['social_id']     = $social_id;

		$stmt      = Helpers::execute_query($con, $sql, $sql_params, 'select user for social');
	    $row_count = $stmt->rowCount();

		if ($row_count == 1) {
	        $user_account = $stmt->fetchObject();
	        $id_usr       = $user_account->id_usr;

			$randomkey_sql = "UPDATE user
									SET random_key_usr=:randomkey, timestamp_usr=NOW()
									WHERE id_usr=:id_usr
										AND cookie_code_usr=:cookie_code";

            $sql_params              = array();
            $sql_params['randomkey'] = $randomkey;
            $sql_params['id_usr']    = $id_usr;
			$sql_params['cookie_code'] = $cookie_code;

            $randomkey_stmt      = Helpers::execute_query($con, $randomkey_sql, $sql_params, 'randomkey for social');
	            
			$response->id        = $user_account->id_usr;
            $response->success   = 1;
            $response->randomkey = $randomkey;

			$instance->setEncryptedCookie('cmtsess_dev_k', $cookie_code);
			
			$_SESSION[Helpers::$session_name] = $cookie_code;
				
	    } else {
		
			//register the user
			
			$sql_params = array();
			
			$password = md5( $social_id . $social_method . 's0c1aL');
			
	        $user_register_sql = "INSERT INTO user(user_name_usr, social_id_usr, sol_usr_id, password_usr, email_usr, cookie_code_usr)
					VALUES(:username, :social_id, :social_method, :password, :email, :cookie_code)";
					
			$sql_params['username']	= $username;
			$sql_params['social_id'] = $social_id;
			$sql_params['social_method'] = $social_method;
			$sql_params['password'] = $password;
			$sql_params['email'] = $email;
			$sql_params['cookie_code'] = $cookie_code;

			$user_register_stmt      = Helpers::execute_query($con, $user_register_sql, $sql_params, 'insert new row');
			
			$instance->setEncryptedCookie(Helpers::$session_name, $cookie_code);
			
			$_SESSION[Helpers::$session_name] = $cookie_code;
			$response->success   = 1;
	    }

	    echo json_encode($response);

    }
}
function logoutUser(){
	$instance   = Slim::getInstance();
	$instance->deleteCookie(Helpers::$session_name);
	$_SESSION[Helpers::$session_name] = '';
	session_destroy();
	
	$response = array();
	$response['success'] = 1;
	echo json_encode($response);
}
*/
?>