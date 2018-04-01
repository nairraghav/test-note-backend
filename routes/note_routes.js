var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

  //Create
  app.post('/notes', (req, res) => {
    if (req.body.name == null || req.body.note == null) {
      res.status(400)
      return res.send({ 'error': 'Please provide name and note'})
    }
    const note = { 'name': req.body.name, 'note': req.body.note };
    //add data validation for existing note
    db.collection('notes').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'Note was not created' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  //Read All
  app.get('/notes', (req, res) => {
    db.collection('notes').find({}).toArray((err, notes) => {
      if (err) {
        res.send({'error':'Notes were not found'});
      }
      res.send(notes);
    })
  });

  //Read By Id
  app.get('/notes/id/:id', (req, res) => {
    const id = {'_id': new ObjectID(req.params.id)};
    db.collection('notes').findOne(id, (err, note) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else if (note == null) {
        res.status(404);
        res.send({'error':'Note was not found'});
      }else {
        res.send(note);
      } 
    });
  });

  //Get Id By Name
  app.get('/notes/name/:name', (req, res) => {
    const name = {'name': req.params.name};
    db.collection('notes').findOne(name, (err, note) => {
      if (err) {
        res.send({'error':'Note was not found'});
      } else if (note == null) {
        res.status(404);
        res.send({'error':'Note was not found'});
      }else {
        res.send(note);
      } 
    });
  });

  //Update By Name
  app.put('/notes/name/:name', (req, res) => {
    const name = { 'name': req.params.name };
    db.collection('notes').findOne(name, (err, note) => {
      if (note == null) {
        res.status(400)
        return res.send({'error': 'No existing note'})
      }
      var note = { 'name': note.name, 'note': note.note};
      if (req.body.name != null) {
        note.name = req.body.name
      }
      if (req.body.note != null) {
        note.note = req.body.note
      }
      db.collection('notes').update(name, note, (err, result) => {
        if (err) { 
          res.status(400);
          res.send({ 'error': 'Note was not be updated' }); 
        } else {    
          db.collection('notes').findOne({'name': note.name}, (err, note) => {
            res.send(note)
          });
        };
      });
    });
  });

  //Delete By Name
  app.delete('/notes/name/:name', (req, res) => {
    const name = { 'name': req.params.name };
    db.collection('notes').remove(name, (err, result) => {
      if (err) {
        res.status(400);
        res.send({'error': 'Note was not be deleted'});
      }
      res.status(204);
      res.send();
    });
  });

  //Delete By Id
  app.delete('/notes/id/:id', (req, res) => {
    const id = { '_id': new ObjectID(req.params.id) };
    db.collection('notes').remove(id, (err, result) => {
      if (err) {
        res.status(400);
        res.send({'error': 'Note was not be deleted'});
      }
      res.status(204);
      res.send();
    });
  });
}