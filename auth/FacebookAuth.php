<?php

use Facebook\FacebookSession;
use Facebook\FacebookRedirectLoginHelper;


class FacebookAuth{

  private static $app_id = '773987962648494';
  private static $secret = '23cf376a9e73f11228cd6b06d8a9e1c4';
  private static $redirect_url = 'http://localhost:8989/verify';
  private static $fb;
  private static $session;
  public static $isAuthenticated = false;

  public static function init(){
    FacebookSession::setDefaultApplication(self::$app_id, self::$secret);
    self::$fb = new FacebookRedirectLoginHelper(self::$redirect_url);
    if (isset($_SESSION['fb_access_token']) && $_SESSION['fb_access_token']) {
      self::$session = new FacebookSession($_SESSION['fb_access_token']);
    }else{
      try {
        self::$session = self::$fb->getSessionFromRedirect();
      } catch(FacebookRequestException $ex) {
        // When Facebook returns an error
      } catch(\Exception $ex) {
        // When validation fails or other local issues
      }
    }
    if (self::$session) {
      self::$isAuthenticated = true;
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
  }

  public static function getAccessToken(){
    return self::$session;
  }
}
?>