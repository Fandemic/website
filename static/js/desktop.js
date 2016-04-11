/*SLIDE OUT CART MENU*/
 var cartMenu = new Slideout({
   'panel': document.getElementById('center-panel'),
   'menu': document.getElementById('cart-menu'),
   'padding': 300,
   'tolerance': 70,
   'side': 'right',
   'touch': false
 });

 //cart toggle
 // Toggle button
 document.querySelector('.cart-btn').addEventListener('click', function() {

   cartMenu.toggle();

   });


 /* ==========================================================================
  Activate Form
  ========================================================================== */
 $(function() {
   $('#activate-store-button').on('click', function() {
     var firstname = $('#activate_firstname').val();
     var email = $('#activate_email').val();
     var phone = $('#activate_phone').val();

     $('#activate-store-notification').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Sending...');
     $.ajax({
       url: '/activateStore',
       data: $('form').serialize(),
       type: 'POST',
       success: function(response) {
         $('#activate-store-notification').empty()
         $('#activate-store-notification').html('<i class="fa fa-envelope"></i> Thanks ' + firstname + ' , we will contact you within 24 hours!');
         setTimeout(function() {
           $('#myModal').modal('hide')
           $('#activate-store-notification').empty()
           $('#activate-store-modal-form').trigger("reset")
         }, 2000);
         console.log(response);
       },
       error: function(error) {
         $('#activate-store-notification').html('<p style="color:red"><i class="fa fa-exclamation-triangle"></i> Error!</p>');
         console.log(error);
       }
     });
     return false;
   });
 });


(function ($) {
  $('.spinner .btn:first-of-type').on('click', function() {
    $('.spinner input').val( parseInt($('.spinner input').val(), 10) + 1);
  });
  $('.spinner .btn:last-of-type').on('click', function() {
    $('.spinner input').val( parseInt($('.spinner input').val(), 10) - 1);
  });
})(jQuery);


$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function () {

    $('.side-panel').toggleClass('visible');

    $('[data-toggle=offcanvas]').toggleClass('btn-danger');

  });
});

/* ==========================================================================
 Caption mouseover
 ========================================================================== */

$('.caption .item-info-icon').hover(
    function(){
      $(this).parent().parent().parent().find('.mouseoverCaption').slideDown(250);
    },
    function(){
      $(this).parent().parent().parent().find('.mouseoverCaption').slideUp(250);
    }
);

/*DATA FILTERS*/
$(function() {
    //Simple filter controls
    $('.btn-filter').click(function() {
        $('.btn-filter').removeClass('active');
        $(this).addClass('active');
    });
    //Multifilter controls
    $('.multifilter li').click(function() {
        $(this).toggleClass('active');
    });
    //Shuffle control
    $('.shuffle-btn').click(function() {
        $('.sort-btn').removeClass('active');
    });
    //Sort controls
    $('.sort-btn').click(function() {
        $('.sort-btn').removeClass('active');
        $(this).addClass('active');
    });
});

/* customer service accordion */
$('.collapse').on('show.bs.collapse', function() {
    var id = $(this).attr('id');
    $('a[href="#' + id + '"]').closest('.panel-heading').addClass('active-faq');
    $('a[href="#' + id + '"] .panel-title span').html('<i class="glyphicon glyphicon-minus"></i>');
});
