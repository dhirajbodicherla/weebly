<div id="navbar">
  <div class="links-container">
    <ul>
      <?php 
        if(isset($page))
          $id = $page->id_pag;
        else
          $id = -1;
      ?>

      @foreach($pages as $p)
        <li class="link {{ $p->id_pag == $id ? 'active' : '' }}">
          <a href={{ action('PageController@get', $p->id_pag) }}/>
            <div>{{$p->title_pag}}</div>
          </a>
        </li>
      @endforeach
    </ul>
  </div>
  <a class="new-page" href={{ URL::to('/') . '/new-page'}}>
    <span class="text">
    <span class="icon add"></span> New Page</span>
  </a>
</div>