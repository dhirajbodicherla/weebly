<?php

class GoogleAuth{

  private static $client_id = '361242644615-4k1p4cqlcv43d2mdgq5m4fgj7rt28h34.apps.googleusercontent.com';
  private static $client_secret = 'GcMxBwLBuA1iamr4pIRHb4ob';
  private static $redirect_uri = 'http://localhost:8989/verify';
  private static $client;
  public static $access_token;
  public static $isAuthenticated = false;

  public static function init(){

    self::$client = new Google_Client();
    self::$client->setClientId(self::$client_id);
    self::$client->setClientSecret(self::$client_secret);
    self::$client->setRedirectUri(self::$redirect_uri);
    self::$client->addScope("https://www.googleapis.com/auth/plus.me");

    if (isset($_SESSION['g_access_token']) && $_SESSION['g_access_token']) {
      self::$client->setAccessToken($_SESSION['g_access_token']);
      self::$isAuthenticated = true;
    }else{
      self::$isAuthenticated = false;
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

}
?>