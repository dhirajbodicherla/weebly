{{ Form::model($page, array('route' => array('page.edit', $page->id_pag),
                  'method' => 'PUT',
                  'id' => 'pageMangementForm' )) }}
  <div id="title">
    {{ Form::text('title_pag', Form::getValueAttribute('title_pag') , array('class'=>'input-field', 'placeholder'=>'Title', 'id'=>'title-input')) }}
  </div>
  <div id="body">
    {{ Form::textArea('body_pag', Form::getValueAttribute('body_pag'), array('class'=>'input-field', 'placeholder'=>'Body', 'id'=>'body-input')) }}
  </div>
  <div id="info">
    <div id="permalink">
      <span class="text">
        Permalink: <a class="link" href="{{action('PageController@get', Form::getValueAttribute('id_pag'))}}">{{action('PageController@get', Form::getValueAttribute('id_pag'))}}</a>
      </span>
    </div>
    <div id="lastUpdated">
      <span class="text">
        Updated: {{ Form::getValueAttribute('updated_at') }}
      </span>
    </div>
  </div>
  <div id="actions">
    <div class="buttons-container">
    @if ($page->is_home_pag != 1)
        <a id="delete-btn" class="button" href={{URL::to('/') . '/page/' . $page->id_pag . '/delete'}}>Delete</a>
    @endif
      <input type="submit" value="Save" id="save-btn" class="button"/>
    </div>
  </div>
  <hr class="divider">
{{ Form::close() }}