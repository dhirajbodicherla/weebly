$('.checkbox').click(function(){
	$(this).toggleClass('checked');
});

// $('.image').draggable({
// 	helper: "clone",
// 	revert: function(dropped) {
//      var dropped = dropped && dropped[0].id == "droppable";
//      return !dropped;
//   }
// });

// $(".editor").droppable({
//     accept: ".image",
//     drop: function (event, ui) {
//         $(this).append($(ui.draggable).clone());
//     },
//     over: function (event, elem) {
//         $(this).addClass("over");
//         console.log("over");
//     },
//     out: function (event, elem) {
//         $(this).removeClass("over");
//     }
// });