var app = angular.module("app", []);

app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

app.controller("shop", function($scope) {



  $scope.data = {};

  //initialize the customers
  $scope.data.customer = {
    name:'',
    email:'',
    city:'',
    state:'',
    zip:'',
    country:'US'
  };

  $scope.data.coin = {
    code:'',
    status:'',
    exists:null
  }

  $scope.data.cart = [];
  $scope.data.total_price = 0;

  $scope.data.savings = 0;

  $scope.data.shipping_method = {};

  $scope.rates = [];

  $scope.data.end_time = end_time;

  $scope.data.star_id = star_id;

  $scope.data.order_id = randomString(10);

  $scope.view_mode = 'box';

  $scope.product_view = {
    name:'',
    img_url: '',
    variation: '',
    description: ''
  }

  $scope.page = 'store';

  //name, price, img_url
  $scope.toggle_product = function(product){

    $scope.data.cart.push(product);

    $scope.data.total_price += product.price;
    $scope.data.savings += (product.retail_price - product.price);
    //$.notify("Product Added To Box", { position:"bottom left",className:"success" });
  }


  $scope.delete_product = function(product){

    for (i in $scope.data.cart){
      if ( ($scope.data.cart[i].name == product.name)){
        index = i;
      }
    }

    if (index >= 0){
       $scope.data.cart.splice(index, 1);
       $scope.data.total_price -= product.price;
       $scope.data.savings -= (product.retail_price - product.price)
       //$.notify("Product Removed From Box", { position:"bottom left",className:"success" });
    }

  }



  $scope.estimated_arrival = function(){

    date = undefined;
    end_time = Math.round((new Date()).getTime() / 1000);
    production_time = 2 * 86400; //two week production time
    time_padding = 4 * 86400; //used when a shipping method is not present

    if ($scope.data.shipping_method['rate']){
      date = new Date((end_time+production_time+parseInt($scope.data.shipping_method['delivery_days'])*86400)*1000);
    }
    else{
      date = new Date((end_time+production_time+time_padding)*1000);
    }
    return moment(date).format("MMM Do YYYY");
  }


  $scope.total_price_str = function(){

    if ($scope.data.shipping_method['rate']){
      return ('($'+ ($scope.data.total_price + parseFloat($scope.data.shipping_method['rate'])).toFixed(2).toString() +')');
    }
    else{
      return '';
    }

  };


  $scope.total_price = function(){

    if ($scope.data.shipping_method['rate']){
      return $scope.data.total_price + parseFloat($scope.data.shipping_method['rate']);
    }
    else{
      return $scope.data.total_price;
    }

  };

  $scope.process_order = function(nonce){

    $scope.data.nonce = nonce;

    if ($scope.validate_checkout_form()){

        $('#loader').show();

        $.ajax({
           url: '/charge',
           data: angular.toJson($scope.data, null, '\t'),
           type: 'POST',
           contentType: 'application/json;charset=UTF-8',
           success: function(response) {
             $("#payment-modal").modal("hide");
             $('#loader').hide();
             $("#payment-success-modal").modal("show");


             //facebook event tracking
             fbq('track', 'Purchase', {value: $scope.data.price, currency:'USD'});

           },
           error: function(error) {
             alert("Payment Error: please try again later");
             $('#loader').hide();
           }
       });

    }

  }




  $scope.process_free_order = function(){

    if ($scope.validate_checkout_form()){

        $.ajax({
           url: '/free-order',
           data: angular.toJson($scope.data, null, '\t'),
           type: 'POST',
           contentType: 'application/json;charset=UTF-8',
           success: function(response) {
             $("#payment-modal").modal("hide");
             $("#payment-success-modal").modal("show");

             //facebook event tracking
             fbq('track', 'Purchase', {value: 0.00, currency:'USD'});

           },
           error: function(error) {
             alert("Order Error: please try again later");
           }
       });
    }
  }



  $scope.validate_checkout_form = function(){

    c = $scope.data.customer;

    if (!c.email){
      $('#submit').notify("oops! you forgot your EMAIL", { position:"top center" });
      $('#email').notify("oops! you forgot your EMAIL", { position:"top center" });
      return false;
    }
    if (!validateEmail(c.email)){
      $('#submit').notify("your email is invalid!", { position:"top center" });
      $('#email').notify("your email is invalid!", { position:"top center" });
      return false;
    }
    else if (!c.name){
      $('#submit').notify("oops! you forgot your NAME", { position:"top center" });
      $('#name').notify("oops! you forgot your NAME", { position:"top center" });
      return false;
    }
    else if (!c.street){
      $('#submit').notify("oops! you forgot your ADDRESS", { position:"top center" });
      $('#addr').notify("oops! you forgot your ADDRESS", { position:"top center" });
      return false;
    }
    else if (!c.city){
      $('#submit').notify("oops! you forgot your CITY", { position:"top center" });
      $('#city').notify("oops! you forgot your CITY", { position:"top center" });
      return false;
    }
    else if (!c.state){
      $('#submit').notify("oops! you forgot your STATE", { position:"top center" });
      $('#state').notify("oops! you forgot your STATE", { position:"top center" });
      return false;
    }
    else if (!c.zip){
      $('#submit').notify("oops! you forgot your ZIP", { position:"top center" });
      $('#zip').notify("oops! you forgot your ZIP", { position:"top center" });
      return false;
    }
    else if (!c.country){
      $('#submit').notify("oops! you forgot your COUNTRY", { position:"top center" });
      $('#country').notify("oops! you forgot your COUNTRY", { position:"top center" });
      return false;
    }
    else if (!$scope.data.shipping_method.rate && !$scope.data.coin.exists){
      $('#submit').notify("a shipping method must be chosen", { position:"top center" });
      $('#shipping').notify("a shipping method must be chosen", { position:"top center" });
      return false;
    }
    else{
      return true;
    }

  }

  //watch for the customer variable to change!
  $scope.$watch('data.customer', function(c, oldValue){


      if (!$scope.data.coin.exists){
          if ((c.name !== oldValue.name) || (c.email !== oldValue.email)){

          }

          else if (c.street && c.city && c.state && c.zip && c.country){

            $('#shipping').notify("updating shipping methods...", { position:"top center",className:"info" });
            $.ajax({
               url: '/shipping-rates',
               data: JSON.stringify(c, null, '\t'),
               type: 'POST',
               contentType: 'application/json;charset=UTF-8',
               success: function(response) {

                 data = JSON.parse(response);


                 if (data.length > 0){

                   $('#shipping').notify("shipping methods updated", { position:"top center",className:"success" });
                   $scope.rates = data;
                   $scope.data.shipping_method = data[0];
                   $scope.$digest();
                 }
                 else{
                   $('#shipping').notify("Your address is invalid", { position:"top center"});
                   $scope.rates = [];
                   $scope.data.shipping_method = {};
                   $scope.$digest();
                 }

               },
               error: function(error) {
                 $('#shipping').notify("no shipping methods found", { position:"top center" });
               }
           });

          }

        }
        else{
          $scope.data.shipping_method = 'free';
        }

        },true);


      //watch for the customer variable to change!
      $scope.validateCoinCode = function(coin_code){

        coin_code = coin_code.trim();
        code_len = coin_code.length

        if (code_len == 12){

          $.ajax({
             url: '/coin-validate',
             data: {code:coin_code},
             type: 'GET',
             contentType: 'application/json;charset=UTF-8',
             success: function(response) {
                 if (response == 'success'){
                   //alert(response);
                   $scope.data.coin.exists = true;
                   $scope.$apply();
                   $scope.$digest();
                 }
                 else{
                   //alert(response);
                   $scope.data.coin.exists = false;
                   $scope.$apply();
                   $scope.$digest();
                 }


             },
             error: function(error) {
                 console.log(error);
             }
         });

        }
        else{
          $scope.data.coin.exists = false;
          //$scope.$apply();
          //$scope.$digest();
        }

      }


      $scope.$watch('data.coin.exists', function(c, oldValue){
        //alert('coin status changed');
        if ($scope.data.cart.length == 1){
          $scope.data.total_price = 0;
          $scope.data.savings = $scope.data.cart[0].retail_price;

          $scope.$apply();
          $scope.$digest();
        }
        if ($scope.data.cart.length > 0){
          $scope.data.total_price -= $scope.data.cart[0].price;
          $scope.data.savings += $scope.data.cart[0].price;

          $scope.$apply();
          $scope.$digest();
        }
      });

      //HELPER FUNCTIONS
      function validateEmail(email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
      }

      function randomString(length) {
        var chars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
      }


});


//check if an image exists
function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}
