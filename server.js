var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
const axios = require('axios');

var PORT = process.env.PORT || 3001;
var app = express();
app.use(bodyParser());

// Database configuration
var databaseUrl = process.env.MONGODB_URI || 'googlebooks_db';
var collections = ['books'];
// // Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);
// // Log any mongojs errors to console
db.on('error', function (error) {
  console.log('Database Error:', error);
});

app.post('/api/books', function (req, res) {
  console.log(req.body)
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.book}`)
    .then(function (response) {
      // handle success

      // for (let i = 0; i < response.data.items.length; i++) {
      //     const book = {
      //         title: response.data.items[i].volumeInfo.title
      //     }
      //     db.books.insert(book, function (err, result) {
      //         // handle err

      //         if (i === response.data.items.length - 1) {
      //             res.json({
      //                 success: true,
      //                 data: response.data
      //             })
      //         }
      //     })
      // }
      

      response.data.items.map((item, index, array) => {
        const book = {
          title: item.volumeInfo.title
        }
        db.books.insert(book, function (err, result) {
          // handle err

          if (index === array.length - 1) {
            res.json({
              success: true,
              data: response.data
            })
          }
        })

      })

    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.json({ success: false })
    })
    .finally(function () {
      // always executed
    });

})

app.get('/api/books', function (req, res) {
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.book}`)
    .then(function (response) {

      if (error) {
        res.send(error);
      } else {
        res.json(oneSong);
      }
    })
})


  app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`)
})
// ======
      //documentation for mongojs:
        //https://github.com/mafintosh/mongojs
    //   app.get("/users/userId/bookshelves", function(req, res) {
    //     db.books.aggregate(function(error, books){
    //         console.log(books);
    //     });

    //   });

    //   app.post("/songs", function(req, res) {
    //     //validation here
    //       // req.body.songName.length > 1
    //     // Insert the song into the songs collection
    //     db.songs.insert({votes: req.body.votes, songName: req.body.songName, artist : req.body.artist}, function(error, savedSong) {
    //       // Log any errors
    //       if (error) {
    //         console.log(error);
    //       }else {
    //         //the reason why we are sending the savedSong back is because we now have an _id to give to the client
    //         res.json(savedSong);
    //       }
    //     });
    //   });
    //   // localhost:3000/songs/beyonce/crazy+in+love
    //   app.get("/songs/:artist/:songname", function(req, res) {
    //     //one way
    //       res.json({
    //       songname: req.params.songname,
    //       artist: req.params.artist})
    //     //another way
    //       res.json(req.params)
    //   })
    //   //one song
    //   app.get("/songs/:id", function(req, res) {
    //     db.songs.findOne({
    //       "_id": mongojs.ObjectId(req.params.id)
    //     }, function(error, oneSong) {
    //       if (error) {
    //         res.send(error);
    //       }else {
    //         res.json(oneSong);
    //       }
    //     });
    //   });
    //   //update a song
    //   app.put("/songs/:id", function(req, res) {
    //     //if we use this then we won't get the updated document back
    //     /*
    //       db.songs.update({
    //         "_id": mongojs.ObjectId(req.params.id)
    //       }, {
    //         $set: {
    //           "artist": req.body.artist,
    //           "songName": req.body.songName
    //         }
    //       }, function(error, editedSong) {
    //         if (error) {
    //           res.send(error);
    //         }else {
    //           res.json(editedSong);
    //         }
    //       });
    //     */
    //     db.songs.findAndModify({
    //       query: {
    //         "_id": mongojs.ObjectId(req.params.id)
    //       },
    //       update: { $set: {
    //         "artist": req.body.artist, "songName": req.body.songName }
    //       },
    //       new: true
    //       }, function (err, editedSong) {
    //           res.json(editedSong);
    //       });
    //   });
    //   /*  
    //     curl -X PUT http://localhost:3000/songs/votes/5cc2856ef7426dba8c8e4cda/up 
    //   */
    //   app.put("/songs/votes/:id/:direction", function(req, res){
    //     var voteChange = 0;
    //     if (req.params.direction == 'up') voteChange = 1;
    //     else voteChange = -1;
    //     //this is wrong I want to grab the current votes and increment by 1
    //     db.songs.findAndModify({
    //       query: {
    //         "_id": mongojs.ObjectId(req.params.id)
    //       },
    //       update: { $inc: { votes: voteChange} },
    //       new: true
    //       }, function (err, editedSong) {
    //           res.json(editedSong);
    //       });
    //   });
    //   /*  
    //     curl -X DELETE http://localhost:3000/songs/5cc288d471a416daebc0d4d6/
    //   */
    //   app.delete("/songs/:id", function(req, res) {
    //     var id = req.params.id;
    //     db.songs.remove({
    //       "_id": mongojs.ObjectID(id)
    //     }, function(error, removed) {
    //       if (error) {
    //         res.send(error);
    //       }else {
    //         res.json(id);
    //       }
    //     });
    //   });
    // Listen on port 3001

