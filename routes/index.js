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

      /** 
      * This is the creation for the HTML part of this project, I had some issues in figuring out the full functionality
      * of this program so I ended up modifying some addition into it with HTML and in process of that I got more clarification
      * on the usage of " '" as I learned that it can be used for multiple lines in case of /n. In this function I used a 
      * large set of mapping and calls such as ".map, t.task,t.completed, .join". 
      * 
      * I learned some more of this function through Stack OVerflows: https://stackoverflow.com/questions/918806/difference-between-regular-expression-modifiers-or-flags-m-and-s 
      */
      res.send(`
        <h1>My Simple TODO</h1>
        <form method="POST" action="/create">
          <input name="task" placeholder="New task" required />
          <button type="submit">Add</button>
        </form>

        <ul>
          ${results
            .map(
              t => `
              <li>
                ${t.task} — <b>${t.completed ? "Complete" : "Not Complete"}</b>
                <form method="POST" action="/toggle" style="display:inline;">
                  <input type="hidden" name="id" value="${t.id}">
                  <button type="submit">Toggle</button>
                </form>
                <form method="POST" action="/delete" style="display:inline;">
                  <input type="hidden" name="id" value="${t.id}">
                  <button type="submit">Delete</button>
                </form>
              </li>
            `
            )
            .join("")}
        </ul>
      `);
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

/* CREATE tasks */
router.post('/create', function (req, res, next) {
  const { task } = req.body;
  try {
    req.db.query(
      'INSERT INTO todos (task, completed) VALUES (?, 0);',
      [task],
      (err) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Error adding todo');
  }
});

/* DELETE task */
router.post('/delete', function (req, res, next) {
  const { id } = req.body;
  try {
    req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err) => {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).send('Error deleting todo');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Error deleting todo');
  }
});

/* 
 * TOGGLE complete/incomplete: I tried to maintain the same format of this code as consistently as I couls 
as to what was given with some extra modifications given the assignment requirements.
 */
router.post('/toggle', function (req, res, next) {
  const { id } = req.body;

  try {
    req.db.query(
      'UPDATE todos SET completed = NOT completed WHERE id = ?;',
      [id],
      (err) => {
        if (err) {
          console.error('Error toggling todo:', err);
          return res.status(500).send('Error toggling todo');
        }
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).send('Error toggling todo');
  }
});

module.exports = router;
