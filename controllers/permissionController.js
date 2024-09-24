const db= require("../db/dbconnection")
const permissionController = (req, res) => {
    try {
      const { user_id, task_id, can_edit, can_delete } = req.body;
      console.log(req.body)
      const canEditValue = can_edit ? 1 : 0;
      const canDeleteValue = can_delete ? 1 : 0;
      console.log(canDeleteValue)
      if (!user_id) {
        return res
          .status(404)
          .json({ error: "Required field user_id is missing" });
      } else if (!task_id) {
        return res
          .status(404)
          .json({ error: "Required field task_id is missing" });
      } if (typeof can_edit === 'undefined') {
        return res.status(404).json({ error: "Required field can_edit is missing" });
      }
      if (typeof can_delete === 'undefined') {
        return res.status(404).json({ error: "Required field can_delete is missing" });
      }
  
      db.query(
        `
        INSERT INTO permissions (user_id,task_id,can_edit,can_delete) VALUES ('${user_id}','${task_id}','${canEditValue}','${canDeleteValue}')`,
        (err,result) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ error: "DB error occurred" });
          }
          return res.status(200).json({ message: "permissions successfully!" });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  module.exports={permissionController}