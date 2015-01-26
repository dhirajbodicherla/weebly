<?php

namespace ExtAuth;
use Session;

class GoogleAuth{

  private static $client_id = '361242644615-4k1p4cqlcv43d2mdgq5m4fgj7rt28h34.apps.googleusercontent.com';
  private static $client_secret = 'GcMxBwLBuA1iamr4pIRHb4ob';
  private static $redirect_uri = 'http://thawing-meadow-4550.herokuapp.com/verify';
  private static $client;
  private static $session_name = 'g_access_token';
  private static $plus;
  private static $authUrl = '';
  public static $access_token;
  public static $isAuthenticated = 'false';

  public static function init(){

    self::$client = new \Google_Client();
    self::$client->setClientId(self::$client_id);
    self::$client->setClientSecret(self::$client_secret);
    self::$client->setRedirectUri(self::$redirect_uri);
    self::$client->addScope(array('https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'));
    self::$client->setAccessType('offline');

    // echo Session::has(self::$session_name) .'&&'. self::$authUrl;

    if (Session::has(self::$session_name)) {
      self::$client->setAccessToken(Session::get(self::$session_name));
      self::$isAuthenticated = 'true';
    }
  }

  static function isAuthorized(){
    self::init();
    return self::$isAuthenticated;
  }

  static function authenticate($code){
    if(!self::$client){
      self::init();
    }
    self::$client->authenticate($code);
    Session::put('g_access_token', self::getAccessToken());
  }

  static function getAccessToken(){
    if(!self::$client){
      self::init();
    }
    return self::$client->getAccessToken();
  }

  static function setToken($token){
    if(!self::$client){
      self::init();
    }
    self::$access_token = $token;
    self::$client->setAccessToken($token);
  }

  static function getAuthURL(){
    if(!self::$client){
      self::init();
    }
    return self::$client->createAuthUrl();
  }

  static function getClientId(){
    return self::$client_id;
  }

  public static function logout(){
    Session::forget(self::$session_name);
  }

  public static function getMe(){
    if(!self::$client){
      self::init();
    }
    if(self::$client->isAccessTokenExpired()){
      $authUrl = self::$client->createAuthUrl();
      header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
    }else{
      self::$plus = new \Google_Service_Plus(self::$client);
      return self::$plus->people->get('me');
    }
  }


}
?>