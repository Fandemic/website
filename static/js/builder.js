var app = angular.module("app", []);

app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

app.controller("builder", function($scope) {

    //box template
    $scope.box = {
      brand_name: 'Brandon',
      box_name: 'Opal of my Eye',
      description: null,
      cost: 0,
      price: 20,
      products: [],
      packaging: []
    }

    //Takes a product object and adds it to the box
    $scope.toggle_product = function(product){

      index = -1;

      for (i in $scope.box.products){
        if ($scope.box.products[i].name == product.name){
          index = i;
        }
      }

      if (index >= 0){
         $scope.box.products.splice(index, 1);
         $scope.box.cost -= parseInt(product.cost);
         $scope.box.price = $scope.box.cost * 2;
      }

      else if ($scope.box.products.length >= 6){
        alert('We only allow 6 items total per box!');
      }

      else{
        $scope.box.products.push(product);
        $scope.box.cost += parseInt(product.cost);
        $scope.box.price = $scope.box.cost * 2;
      }

    }

    //Toggles the packaging color or material depending
    //on the packaging dictionary variable
    $scope.togglePackaging = function(packaging){

    }

});









//NAVIGATION
$("#step1").on('click', '.next-btn', function() {
  $('.steps').hide();
  $('#step2').fadeIn('fast', function() {
    $(".carousel").flickity('resize');
});
  $('#crumb1').removeClass( "current");
  $('#crumb1').addClass( "touched");
  $('#crumb2').addClass('current');
  $("html, body").animate({ scrollTop: 76 }, "slow");
});

$("#step2").on('click', '.next-btn', function() {
  $('.steps').hide();
  $('#step3').fadeIn('fast', function() {
    $(".carousel").flickity('resize');
});
  $('#crumb2').removeClass( "current");
  $('#crumb2').addClass( "touched");
  $('#crumb3').addClass('current');
  $("#next4").addClass("on");
  $("html, body").animate({ scrollTop: 76 }, "slow");
});

$("#step3").on('click', '.next-btn', function() {
  $('.steps').hide();
  $('#step4').fadeIn('fast', function() {

});
  $('#crumb3').removeClass( "current");
  $('#crumb3').addClass( "touched");
  $('#crumb4').addClass('current');
  $("#next5").addClass("on");
  $("html, body").animate({ scrollTop: 76 }, "slow");
  //$(".carousel").flickity('resize');
});

$("#step4").on('click', '.next-btn', function() {
  $('.steps').hide();
  $('#step5').fadeIn('fast', function() {

});
  $('#crumb4').removeClass( "current");
  $('#crumb4').addClass( "touched");
  $('#crumb5').addClass('current');
  $("#next6").addClass("on");
  $("html, body").animate({ scrollTop: 76 }, "slow");
});

$("#step5").on('click', '.next-btn', function() {
  $('.steps').hide();
  $('#step6').fadeIn('fast', function() {

});
  $('#crumb5').removeClass( "current");
  $('#crumb5').addClass( "touched");
  $('#crumb6').addClass('current');
  $("#finish").addClass("on");
  $("html, body").animate({ scrollTop: 76 }, "slow");
});

/*
$("#step2").on('click', '.prev', function() {
  $('.steps').hide( "fast"  );
  $('#step1').show( "slow" );
  $('.crumb').removeClass('current');
  $('#crumb1').addClass('current');
  $("html, body").animate({ scrollTop: 0 }, "slow");
});

$("#step3").on('click', '.prev', function() {
  $('.steps').hide( "fast"  );
  $('#step2').show( "slow" );
  $('.crumb').removeClass('current');
  $('#crumb2').addClass('current');
  $("html, body").animate({ scrollTop: 0 }, "slow");
});
*/

$("#crumbs").on('click', '.crumb', function() {
    var step = $(this).attr('data-step');
    $('.steps').hide( "fast"  );
    $('#'+step).show( "slow" );
    $('.crumb').removeClass('current');
    $(this).addClass('current');
});


//PART 1 - premade or custom
$("#premade").click(function(){

  $("#next2").addClass("on")
 $("#premade").addClass("active");
  $("#custom").removeClass("active");
  $('#custom').removeClass("checked");
  $(this).addClass("checked");
});

$("#custom").click(function(){

  $("#next2").addClass("on")
 $("#premade").removeClass("active");
  $("#custom").addClass("active");
  $('#premade').removeClass("checked");
  $(this).addClass("checked");

});

$(".thumbnail .content").click(function(){

  $("#next3").addClass("on")

  $(this).toggleClass("checked");

  $.notify("Product Added To Box", { position:"top right",className:"success" });
});

//story wsywig editor
tinymce.init({
  selector: 'textarea',
  height: 500,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table contextmenu paste code'
  ],
  toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  content_css: '//www.tinymce.com/css/codepen.min.css'
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var form = document.getElementById('form');
form.noValidate = true;
form.addEventListener('submit', function(event) { // listen for form submitting
        var email = validateEmail($("input[name=email]").val());

        if (!event.target.checkValidity()) {
            event.preventDefault(); // dismiss the default functionality
            document.getElementById('errorMessageDiv').innerHTML = '<strong>Name</strong> and <strong>email</strong> are required fields!'
            document.getElementById('errorMessageDiv').style.display = 'block'; //error message
        }
        else if (email == false){
            event.preventDefault(); // dismiss the default functionality
            document.getElementById('errorMessageDiv').innerHTML = 'That is not a valid email! Please try again :)'
            document.getElementById('errorMessageDiv').style.display = 'block'; //error message
        }
        else{
          document.getElementById("form").submit();
        }
    }, false);


$('a').popover({
  'trigger': 'hover',
  'container': 'body',
  'html': true
});

$(".bootstrap-touchspin").click(function() {
  setTimeout(
function()
{
  $('#collapse3').collapse("show")
}, 2000);

});


(function() {
  [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
    new SelectFx(el, {
onChange: function(val) {
  window.location.href = "/builder/" + val.toLowerCase();
}
});
  } );
})();

$(document).ready(function(){
  $('div.zoomable').zoom({url: this.src});
});


//STRIPE SAMPLE
var handler = StripeCheckout.configure({
//key: 'pk_test_z1mq9KQ3GyakW5OdduPIX94u',
key: 'pk_live_kyvM71oajfwVWnxBoy7SfqOp',
locale: 'auto',
token: function(token,args) {



  //combine all info into one object
  var result={};
  $.extend(result, args, token);
  $.extend(result, result, info);

  $.ajax({
    type: 'POST',
    url: '/charge',
    data: JSON.stringify(result, null, '\t'),
    contentType: 'application/json;charset=UTF-8',
    success: function(response) {
      $("#paymentSuccessModal").modal()
      resetCart();
    },
    error: function(error) {
      alert("payment error");
    }
  });

}
});

$('.sample-order').on('click', function(e) {
  // Open Checkout with further options
  handler.open({
  name: 'SAMPLE COST',
  description: '$30 for the headband',
  zipCode: true,
  billingAddress: true,
  shippingAddress: true,
  allowRememberMe: true,
  panelLabel: "Pay",
  amount: 3000
  });
  e.preventDefault();
});

var windw = this;


$(document).ready(function() {

    if (window.location.href.indexOf("#how-fandemic-works") != -1){
      $('#how-fandemic-works').modal('show');
     }

     //extract the id of the user from the URL
     if(window.location.hash) {
         var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character

         alert(hash);

         $.ajax({
            url: '/builder-alert',
            data: {id: hash},
            type: 'GET',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });

     } else {
         // No hash found
     }



   });
