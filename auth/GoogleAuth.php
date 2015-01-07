<?php

class GoogleAuth{

  private static $client_id = '361242644615-4k1p4cqlcv43d2mdgq5m4fgj7rt28h34.apps.googleusercontent.com';
  private static $client_secret = 'GcMxBwLBuA1iamr4pIRHb4ob';
  private static $redirect_uri = 'http://localhost:8989/verify';
  private static $client;
  public static $access_token;
  private static $session_name = 'g_access_token';
  private static $plus;
  public static $isAuthenticated = 'false';

  public static function init(){

    self::$client = new Google_Client();
    self::$client->setClientId(self::$client_id);
    self::$client->setClientSecret(self::$client_secret);
    self::$client->setRedirectUri(self::$redirect_uri);
    self::$client->addScope(array('https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'));
    self::$client->setAccessType('offline');

    if (isset($_SESSION[self::$session_name]) && $_SESSION[self::$session_name]) {
      self::$client->setAccessToken($_SESSION[self::$session_name]);
      self::$isAuthenticated = 'true';
    }
  }

  static function isAuthorized(){
    return self::$isAuthenticated;
  }

  static function authenticate($code){
    self::$client->authenticate($code);
  }

  static function getAccessToken(){
    return self::$client->getAccessToken();
  }

  static function setToken($token){
    self::$access_token = $token;
    self::$client->setAccessToken($token);
  }

  static function getAuthURL(){
    return self::$client->createAuthUrl();
  }

  static function getClientId(){
    return self::$client_id;
  }

  public static function refresh(){
    unset($_SESSION[self::$session_name]);
  }

  public static function getMe(){
    self::$plus = new Google_Service_Plus(self::$client);
    return self::$plus->people->get('me');
  }

}
?>