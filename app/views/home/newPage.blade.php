{{ Form::open(array('url' => '/page', 
      'id' => 'pageMangementForm',
      'action' => 'PageController@add')) }}
  <div id="title">
    {{ Form::text('title_pag', Form::getValueAttribute('title_pag') , array('class'=>'input-field', 'placeholder'=>'Title', 'id'=>'title-input')) }}
  </div>
  <div id="body">
    {{ Form::textArea('body_pag', Form::getValueAttribute('body_pag'), array('class'=>'input-field', 'placeholder'=>'Body', 'id'=>'body-input')) }}
  </div>
  <div id="info">
    <div id="permalink">
      <span class="text">
        Permalink:
      </span>
    </div>
    <div id="lastUpdated">
      <span class="text">
        Updated:
      </span>
    </div>
  </div>
  <div id="actions">
    <div class="buttons-container">
      <input type="submit" value="Save" id="save-btn" class="button"/>
    </div>
  </div>
  <hr class="divider">
{{ Form::close() }}
