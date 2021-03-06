
var soldiers = [];
var db_soldier_find = function (client,db,people){
   online = [];
  for(i in people){
    online.push(people[i]);
  }
    client.emit("update", online);//update you
    console.log('online',online);

  db.collection('players').find({dono:{$in:online}},
      function(err,docs){
        for(i in docs){
          docs[i].db = true;
          client.emit('client_get_soldier',docs[i]);
        }
      }
  );
};
var db_soldier_save = function (client,db,soldier,people){
      if(!soldier.db){
        db.collection('players').save(soldier, function(err, saved) {
          if( err || !saved ) {
            client.emit("update", "You NOT insert soldier.");//update you
          }else{
            client.emit("update", "You insert soldier.");//update you
          }
        });
      }
      client.broadcast.emit("client_get_soldier",soldier);
      client.broadcast.emit("update", people[client.id] + " insert soldier.");//update others
};
var db_soldier_delete = function (client,db,dono){
      console.log('remove',dono);
      //db.collection('players').remove({dono:dono});
};
var db_soldier_update = function (socket,db,soldier){
  /*  db.collection('players').findOne({_id:db.ObjectId(soldier._id)},//find({ _id:{ $eq:"$soldier._id" }},
        function(err,docs){
          console.log('search',soldier,docs);
        }
    );  */
    db.collection('players').findAndModify({
        query: { _id:db.ObjectId(soldier._id) },
        update: { $set: { x: soldier.x, y:soldier.y} },
        new: true
    }, function(a,b,c) {
        console.log('updated',a,b,c);
    });
};
var set_soldier = function (socket,db,soldier,people){
    db_soldier_save(socket,db,soldier,people);
};
var get_soldier = function (socket,db,people){
    db_soldier_find(socket,db,people);
};
var delete_soldier = function (socket,db,dono){
     db_soldier_delete(socket,db,dono);
};
var update_soldier = function (socket,db,soldier){
     db_soldier_update(socket,db,soldier);
};






exports.get_soldier = get_soldier;
exports.set_soldier = set_soldier;
exports.delete_soldier = delete_soldier;
exports.update_soldier = update_soldier;
