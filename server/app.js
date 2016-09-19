var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: false } );
var pg = require( 'pg' );
var connectionString = 'postgress://localhost:5432/todo';
var port = process.env.PORT||8081;

// spin up server
app.listen( port, function(){
  console.log( 'server up on ' + port );
});

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'public/index.html' ) );
}); // end base url

// compelte task
app.put( '/completeTask', urlencodedParser, function( req, res ){
  console.log( 'in completeTask:', req.body );
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    } // end error
    else{
      console.log( 'connected to db');
      // update this record to have "complete" as true
      var queryResult = client.query( 'UPDATE todos SET complete=true WHERE id=' + req.body.id );
      done();
      // send back something so the client gets to "success"
      res.send( true );
    } // end no error
  }); //end pg connect
});

// get tasks
app.get( '/getTasks', function( req, res ){
  console.log( 'in getTasks' );
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    } // end err
    else{
      console.log( 'connected to db');
      // array to hold our results to return to client
      var results=[];
      // get query results
      var queryResults = client.query( 'SELECT * FROM todos ORDER BY complete ASC' );
      queryResults.on( 'row' , function( row ){
        // push each row into results array
        results.push( row );
      }); // end on row
      queryResults.on( 'end', function(){
        // done? then send the results back to client
        done();
        res.send( results );
      }); //end done
    } // end no err
  }); // end pg connect
}); // end getTasks

app.post( '/newTask', urlencodedParser, function( req, res ){
  console.log( 'in newTask:', req.body );
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
    }
    else{
      console.log( 'connected to db' );
      // insert new item to db
      client.query( 'INSERT INTO todos ( name, description, complete ) VALUES ( $1, $2, $3 )', [ req.body.name, req.body.description, false ] );
    } // end no error
  }); // end pg connect
  // send back something so the client will get to "success"
  res.send( true );
}); // end newTask

// static folder
app.use( express.static( 'public' ) );
