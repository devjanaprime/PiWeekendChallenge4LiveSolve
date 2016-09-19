console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );

  $( 'body' ).on( 'click', '.completeMe', function(){
    var id = $( this ).attr( 'myId' );
    console.log( 'in body on click completeMe:', id );
    // assemble objectToSend
    var objectToSend = {
      id: id
    }; // end objectToSend
    $.ajax({
      url: '/completeTask',
      type: 'PUT',
      data: objectToSend,
      success: function(){
        showTasks();
      }
    });
  }); // end body on click completeMe

  $( 'body' ).on( 'click', '#submitTask', function(){
    console.log( 'in body on click submitTask');
    // create object to send
    var objectToSend = {
      name: $( '#nameIn' ).val(),
      description: $( '#descriptionIn' ).val()
    }; // end objectToSend
    console.log( 'sending:', objectToSend );
    // ajax call
    $.ajax({
      type:'POST',
      url: '/newTask',
      data: objectToSend,
      success: function( data ){
        console.log( 'back from server:', data );
        showTasks();
      }
    }); //end ajax call
  }); //end body on click submitTask

  showTasks();
});

var showTasks = function(){
  console.log( 'in getTasks' );
  $.ajax({
    type: 'GET',
    url: '/getTasks',
    success: function( data ){
      console.log( data );
      var outputDiv = $( '#allTasks' );
      outputDiv.empty();
      for (var i = 0; i < data.length; i++) {
        if( data[i].complete ){
          outputDiv.append( '<p><b>' + data[i].name + '</b>: ' + data[i].description + ' [completed]</p>' );
        }
        else{
          outputDiv.append( '<p><b>' + data[i].name + '</b>: ' + data[i].description + ' <button class="completeMe" myId=' + data[i].id + '>Complete</button></p>' );
        }
      } // end for
    } // end success
  }); // end ajax
} // end show tasks
