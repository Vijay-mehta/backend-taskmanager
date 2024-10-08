const db = require("../db/dbconnection");
const createTaskController = (req, res) => {
  try {
    const {
      title,
      description,
      due_date,
      priority,
      assigned_to,
      created_by,
      location_reminder,
    } = req.body;
    if (!title) {
      return res.status(404).json({ error: "Required field title is missing" });
    } else if (!description) {
      return res
        .status(404)
        .json({ error: "Required field description is missing" });
    } else if (!due_date) {
      return res
        .status(404)
        .json({ error: "Required field due_date is missing" });
    } else if (!priority) {
      return res
        .status(404)
        .json({ error: "Required field priority is missing" });
    } else if (!location_reminder) {
      return res
        .status(404)
        .json({ error: "Required field location_reminder is missing" });
    } else if (!assigned_to) {
      return res
        .status(404)
        .json({ error: "Required field assigned_to is missing" });
    } else if (!created_by) {
      return res
        .status(404)
        .json({ error: "Required field created_by is missing" });
    }
    db.query(
      `
  INSERT INTO tasks (title, description, due_date, priority, location_reminder, assigned_to,created_by)
  VALUES ('${title}', '${description}', '${due_date}', '${priority}', '${location_reminder}', '${assigned_to}','${created_by}')
`,
      (err, result) => {
        console.log("updateresu",result)

        if (err) {
          console.log(err);
          return res.status(404).json({ error: "DB error" });
        }
        if (result) {
          db.query(
            `
        SELECT * FROM tasks WHERE id='${result.insertId}'`,
            (err, result) => {
              console.log("resu888",result)
              return res

                .status(200)
                .json({ message: "Task added successfully!", result });
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "server internal errro" });
  }
};

const getAllTaskController = (req, res) => {
  try {
    const { id } = req.params;
    db.query(`SELECT created_by FROM tasks`,(err,result)=>{
      existId = result.map((itme)=>itme.created_by);
     if(existId.includes(Number(id))){
      db.query(
        `SELECT * FROM TASKS WHERE created_by = ${Number(id)}`,
        (err, result) => {
          if (err) {
            return res.status(404).json({ error: `DB error ${err}` });
          }
          return res
            .status(200)
            .json({ result, message: "All Task Fetch Successfully!" });
        }
      );
     }else{
      return res
      .status(404)
      .json({  error: "User is Not Found!" });
     }
    })
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};



module.exports = { createTaskController, getAllTaskController };
