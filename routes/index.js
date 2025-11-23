var express = require('express');
var router = express.Router();

/* HOME PAGE — returns HTML */
router.get('/', function (req, res) {
  req.db.query("SELECT * FROM todos;", (err, results) => {
    if (err) return res.send("DB Error");

    let list = results.map(
      todo => `
        <li>
          <!-- COMPLETE / NOT COMPLETE BUTTON -->
          <form action="/toggle" method="POST" style="display:inline;">
            <input type="hidden" name="id" value="${todo.id}">
            <input type="hidden" name="completed" value="${todo.completed}">
            <button style="background:none;border:none;color:blue;cursor:pointer;">
              ${todo.completed ? "Mark Not Complete" : "Mark Complete"}
            </button>
          </form>

          <!-- TASK TEXT (no line-through) -->
          <span>${todo.task}</span>

          <!-- EDIT FORM -->
          <form action="/edit" method="POST" style="display:inline;">
            <input type="hidden" name="id" value="${todo.id}">
            <input type="text" name="task" value="${todo.task}">
            <button>Save</button>
          </form>

          <!-- DELETE BUTTON -->
          <form action="/delete" method="POST" style="display:inline;">
            <input type="hidden" name="id" value="${todo.id}">
            <button>Delete</button>
          </form>
        </li>
      `
    ).join("");

    res.send(`
      <html>
      <body>
        <h1>TODO LIST</h1>

        <!-- CREATE FORM -->
        <form action="/create" method="POST">
          <input type="text" name="task" placeholder="New task">
          <button>Add</button>
        </form>

        <ul>
          ${list}
        </ul>
      </body>
      </html>
    `);
  });
});

/* CREATE TODO */
router.post('/create', function (req, res) {
  const { task } = req.body;

  if (!task || task.trim() === "")
    return res.send("<h1>Task cannot be blank</h1><a href='/'>Go Back</a>");

  req.db.query(
    "INSERT INTO todos (task, completed) VALUES (?, 0);",
    [task.trim()],
    () => res.redirect("/")
  );
});

/* DELETE TODO */
router.post('/delete', function (req, res) {
  req.db.query(
    "DELETE FROM todos WHERE id=?;",
    [req.body.id],
    () => res.redirect("/")
  );
});

/* TOGGLE COMPLETED */
router.post('/toggle', function (req, res) {
  const newState = req.body.completed === "1" ? 0 : 1;

  req.db.query(
    "UPDATE todos SET completed=? WHERE id=?;",
    [newState, req.body.id],
    () => res.redirect("/")
  );
});

/* EDIT TODO */
router.post('/edit', function (req, res) {
  const { id, task } = req.body;

  if (!task || task.trim() === "")
    return res.send("<h1>Task cannot be blank</h1><a href='/'>Go Back</a>");

  req.db.query(
    "UPDATE todos SET task=? WHERE id=?;",
    [task.trim(), id],
    () => res.redirect("/")
  );
});

module.exports = router;
