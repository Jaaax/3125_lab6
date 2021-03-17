// jQuery that will "listen" to the html niceSurvey.html
$(document).ready(function(){

  $("#start").on("click", function(){
    $("#start").parent().addClass('negative');
    $("#first").parent().removeClass("negative");
  });
  $("#first").on("click", function(){
    $("#first").parent().addClass('negative');
    $("#second").parent().removeClass("negative");
  });
  $("#second").on("click", function(){
    $("#second").parent().addClass('negative');
    $("#third").parent().removeClass("negative");
  });
  $("#third").on("click", function(){
    $("#third").parent().addClass('negative');
    $("#forth").parent().removeClass("negative");
  });
  $("#forth").on("click", function(){
    $("#forth").parent().addClass('negative');
    $("#fifth").parent().removeClass("negative");
  });



  $('form').on('submit', function(){

    console.log("123");
      
      // var item = $('form input');
      // console.log(item.serializeArray());

      $.ajax({
        type: 'POST',
        url: '/niceSurvey',
        data: $(this).serializeArray(),
        success: function(data){
          // do something with the data via front-end framework
          // Make the submit button red, disabled and saying Thank you
          $("#fifth").css("background-color", "red");
          $("#fifth").prop("disabled", "true");
          $("#fifth").text("Thank you!");
        }
      });
      return false;
  });
});
