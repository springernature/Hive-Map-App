
$(document).ready(function() {

    var modals = $('.modal');
    var close = $('.close');
    var areas = $('.area');
   
    $('map').imageMapResize();
    $('.panel').hide();
    
    $(areas).each(function(index, area){
        $(area).on('mouseleave',function(){
            $('.panel').hide();
        });
        $(area).on('mouseenter',function(){
            $('.panel-heading').text(area.title);
            $('#panel').css({
                left:+($(window).width()/2) - +150,
                top:0,
                position:'absolute'
            });
            $('.panel').show();
        });
    });

    $(modals).each(function(index,modal){
        $(areas[index]).on('click',function(){
            modal.style.display = 'block';
        });
        $(close[index]).on('click',function(){
            modal.style.display = 'none';
        });
    });

     // // When the user clicks anywhere outside of the modal_canada, close it
     window.onclick = function(event) {
        $(modals).each(function(index,modal){
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });    
    }
});