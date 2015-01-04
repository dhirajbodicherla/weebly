$('.checkbox').click(function(){
    $(this).toggleClass('checked');
});

$('.image').draggable({
    scroll: true,
    helper: "clone",
    // helper: function(){
    //     return $(this).clone();
    // },
    addClasses: false,
    revert: 'invalid',
    containment: 'document'
});

$(".editor .content .body").droppable({
    accept: ".image",
    drop: function (event, ui) {
        
        handleDrop($(ui.draggable).data('type'), $(this), ui);

        // $(this).append($(ui.helper).clone());
        $('.temp').remove();

    },
    over: function (event, ui) {
        var d = 0, dd = 0;
        var clone = $(ui.helper).clone();
        clone.addClass('temp');
        clone.css('top', ui.position.top - $(ui.draggable).offset().top);
        clone.css('left', ui.position.left - $(ui.draggable).offset().left);

        d = ui.position.top - $(ui.draggable).offset().top;
        dd = ui.position.left - $(ui.draggable).offset().left;
        // console.log(d, ui.position.top, $(ui.draggable).offset().top, ui);
        console.log(clone);
        $(this).append(clone);
    },
    out: function (event, ui) {
        console.log('out');
        $('.temp').remove();
        $(this).removeClass("over");
    }
});

function handleDrop(type, container, ui){
    if(type === 1){
        
    }else if(type === 2){

    }else if(type === 3){

    }else{

    }
    container.append($(ui.helper).clone());
}