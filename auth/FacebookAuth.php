<?php

// use Facebook\FacebookSession;
// use Facebook\FacebookRedirectLoginHelper;
// use Facebook\FacebookRequest;
// use Facebook\FacebookAuthorization;

use Facebook\FacebookSession;
use Facebook\FacebookRedirectLoginHelper;
use Facebook\FacebookRequest;
use Facebook\FacebookResponse;
use Facebook\FacebookSDKException;
use Facebook\FacebookRequestException;
use Facebook\FacebookAuthorizationException;
use Facebook\GraphObject;
use Facebook\GraphUser;


class FacebookAuth{

  private static $app_id = '773987962648494';
  private static $secret = '23cf376a9e73f11228cd6b06d8a9e1c4';
  private static $redirect_url = 'http://localhost:8989/verify';
  private static $fb;
  private static $session;
  private static $session_name = 'fb_access_token';
  public static $isAuthenticated = 'false';

  public static function init(){
    FacebookSession::setDefaultApplication(self::$app_id, self::$secret);
    self::$fb = new FacebookRedirectLoginHelper(self::$redirect_url);
    if (isset($_SESSION[self::$session_name]) && $_SESSION[self::$session_name]) {
      self::$session = new FacebookSession($_SESSION[self::$session_name]);
    }else{
      try {
        self::$session = self::$fb->getSessionFromRedirect();
        // die(self::$session->getToken());
      } catch(FacebookRequestException $ex) {
        // When Facebook returns an error
      } catch(\Exception $ex) {
        // When validation fails or other local issues
      }
    }
    if (self::$session) {
      self::$isAuthenticated = 'true';
    }
  }

  public static function getAuthURL(){
    $params = array(
      'scope' => 'email, publish_actions'
    );
    return self::$fb->getLoginUrl($params);
  }

  public static function isAuthorized(){
    return self::$isAuthenticated;
  }

  public static function authenticate($code){
    self::$session = new FacebookSession($code);
    try {
      // self::$session->validate();
    } catch (FacebookRequestException $ex) {
      // Session not valid, Graph API returned an exception with the reason.
      echo $ex->getMessage();
    } catch (\Exception $ex) {
      // Graph API returned info, but it may mismatch the current app or have expired.
      echo $ex->getMessage();
    }
    
  }

  public static function getAccessToken(){
    return self::$session->getToken();
  }

  public static function getMe(){
    self::$session = new FacebookSession(self::$session->getToken());
    try {
      self::$session->validate();
    } catch (FacebookRequestException $ex) {
      // Session not valid, Graph API returned an exception with the reason.
      echo $ex->getMessage();
    } catch (\Exception $ex) {
      // Graph API returned info, but it may mismatch the current app or have expired.
      echo $ex->getMessage();
    }
    
    $request = new FacebookRequest(self::$session, 'GET', '/me');
    $response = $request->execute();
    $me = $response->getGraphObject();
    $graph_user = $response->getGraphObject(GraphUser::className());

    return $graph_user;
  }

  public static function getSession(){
    return self::$session;
  }

  public static function refresh(){
    unset($_SESSION[self::$session_name]);
  }
}
?>