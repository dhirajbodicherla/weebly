<div id="header">
  <a href="{{ URL::to('/') }}">
    <div class="logo">
    </div>
  </a>

  <div class="user_info">
    api key: <b>{{isset($user) ? $user->api_token_usr : ''}}</b>
  </div>
</div>
