$('.checkbox').click(function(){
    $(this).toggleClass('checked');
});

$('.editor').on('mouseenter', '.delete', function(e){
  $(this).siblings().hide();
  $(this).parents('.editor-element').addClass('delete');
}).on('mouseleave', '.delete', function(e){
  $(this).siblings().show();
  $(this).parents('.editor-element').removeClass('delete');
}).on('click', '.delete', function(e){
  $(this).parents('.editor-element').remove();
});


$(".elements .image").draggable({
  connectToSortable: ".editor ul",
  helper: "clone",
  revert: "invalid",
  revertDuration: 200,
  start: function(){
    // $('.editor .content').toggleClass('editing');
  },
  stop: function(event, ui){
    console.log('stopped dragging');
    $(ui.helper).hide();
    // $('.editor .content').toggleClass('editing');
  }
});

$('.editor ul').sortable({
  revert: 50,
  placeholder: "portlet-placeholder ui-corner-all",
  update: function(event, ui){
    console.log('update');
  },
  over: function(event, ui){
    $('.editor .content').addClass('editing');
    console.log(ui.sender);
    console.log(ui.placeholder);
  },
  out: function(){
    $('.editor .content').removeClass('editing');
  },
  receive: function (event, ui) {
    
    // handleDrop($(ui.draggable).data('type'), $(this), ui);
      // $(this).append($(ui.helper).clone());
      // $('.temp').remove();
      // return false;
  },
  stop: function(event, ui){
    if ($(ui.item).hasClass('ui-draggable')) {
      var li = $('<li></li>');
      li.append(handleDrop($(ui.item).data('type'), $(this), ui));
      $(ui.item).replaceWith(li);
    }
    // console.log('stop');
    // return false;
  },
  start: function(event, ui){
    // console.log('start');
  }
  // containment: 'parent',
  // tolerance: 'pointer',
  // helper: 'clone'
});

function handleDrop(type, container, ui){
    var ed = $('<div class="'+type+' editor-element"></div>');
    var ctrl = $('<div class="controls"><div class="left-handle"></div><div class="right-handle"></div><div class="bottom-handle"></div><div class="delete"></div></div>');
    ed.append(ctrl);
    if(type === 1){
      var p = $('<p class="placeholder">Start typing here</p>');
      ed.addClass('editor-element-title');
      ed.append(p);  
    }else if(type === 2){
      var p = $('<p class="placeholder">Start typing here</p>');
      ed.addClass('editor-element-text');
      ed.append(p);
    }else if(type === 3){
      var img = $('<div class="image"></div>');
      var lab = $('<div class="label">add image +</div>');
      var p = $('<div class="image-element"></div>');
      p.append(img).append(lab);
      ed.addClass('editor-element-image');
      ed.append(p);
    }else{
      var nav = $('<p>Nav</p>');
      ed.addClass('editor-element-nav');
      ed.append(nav);
    }
    return ed;
}