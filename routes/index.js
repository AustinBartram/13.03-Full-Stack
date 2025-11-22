var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function (req, res, next) {
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

/* CREATE TODO */
router.post('/create', function (req, res, next) {
  const { task } = req.body;

  try {
    req.db.query(
      'INSERT INTO todos (task, completed) VALUES (?, 0);',
      [task],
      (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Error adding todo');
  }
});

/* DELETE TODO */
router.post('/delete', function (req, res, next) {
  const { id } = req.body;

  try {
    req.db.query(
      'DELETE FROM todos WHERE id = ?;',
      [id],
      (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Error deleting todo');
  }
});

/* TOGGLE COMPLETED */
router.post('/toggle', function (req, res, next) {
  const { id, completed } = req.body;

  const newState = completed === "1" ? 0 : 1;

  try {
    req.db.query(
      'UPDATE todos SET completed = ? WHERE id = ?;',
      [newState, id],
      (err, results) => {
        if (err) {
          console.error('Error updating todo state:', err);
          return res.status(500).send('Error updating todo state');
        }
        console.log('Todo state toggled successfully:', results);
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error toggling todo state:', error);
    res.status(500).send('Error updating todo state');
  }
});

module.exports = router;
