const db = require("../db/dbconnection");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const jwtKey = "task_manager";

const signupController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/;
    let isEmailValid = emailRegex.test(email);
    if (!name) {
      return res.status(400).json({ error: "Required field name is missing" });
    } else if (!email) {
      return res.status(400).json({ error: "Required field email is missing" });
    } else if (!isEmailValid) {
      return res.status(400).json({ error: "Invalid email format" });
    } else if (!password) {
      return res
        .status(400)
        .json({ error: "Required field password is missing" });
    }
    let saltRounds = 10;
    let hashpassword = await bcrypt.hash(password, saltRounds);
    db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`,
      [email],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "DB error occurred" });
        }
        if (result && result.length) {
          return res.status(409).json({ message: "user already exist" });
        }

        const query = role
          ? `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`
          : `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

        const values = role
          ? [name, email, hashpassword, role]
          : [name, email, hashpassword];
        db.query(query, values, (err, result) => {
          if (err) {
            return res.status(404).json({ error: `${err}` });
          }
          if (result) {
            db.query(
              `SELECT id,name,email,role FROM users WHERE LOWER(email)= LOWER(?)`,
              [email],
              (err, result) => {
                return res
                  .status(200)
                  .json({ result, message: "User Signup successfully!" });
              }
            );
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Required field email is missing" });
    } else if (!password) {
      return res
        .status(400)
        .json({ error: "Required field password is missing" });
    }

    db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`,
      [email],
      async (err, result) => {
        console.log("resu", result[0]);
        const { email, role } = result[0];

        if (result.length === 0) {
          return res
            .status(404)
            .json({ error: "User is Not Found with this email!" });
        }
        let isPassWord = await bcrypt.compare(password, result[0].password);
        if (!isPassWord) {
          return res.status(404).json({ message: "Password is incorrect!" });
        }
        let token = jwt.sign({ email, role }, jwtKey, {
          expiresIn: "2h",
        });

        if (result) {
          return res
            .status(200)
            .json({ token: token, message: "User Login Successfully!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsersController = (req, res) => {
  try {
    db.query(`SELECT id, name, email, role FROM users`, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(404)
          .json({ error: "Users is Not Found Something Wrong" });
      }
      return res
        .status(200)
        .json({ result: result, message: "All Users Successfully Fetch!" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const userEditController = (req, res) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body)
      .map((key) => `${key} = '${req.body[key]}'`)
      .join(", ");
    db.query(`SELECT id FROM users`, (err, result) => {
      const idsArray = result.map((row) => row.id);
      if (idsArray.includes(Number(id))) {
        db.query(
          `UPDATE users SET ${fields} WHERE id =${id}`,
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: "DB error occurred" });
            }
            return res
              .status(200)
              .json({ message: "User Update Successfully!" });
          }
        );
      } else {
        return res.status(404).json({ error: "User is not found!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const userDelectController = (req, res) => {
  try {
    const { id } = req.params;
    db.query(`SELECT id FROM users`, (err, result) => {
      let existID = result.map((item) => item.id);
      if (existID.includes(Number(id))) {
        db.query(` DELETE FROM users WHERE id=${id}`, (err, result) => {
          if (err) {
            return res.status(500).json({ error: "DB error occurred" });
          }
          if (result) {
            return res
              .status(200)
              .json({ message: "User Successfully Delete" });
          }
        });
      } else {
        return res.status(404).json({ error: "User is not found!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).join({ error: "Internal server error" });
  }
};



module.exports = {
  signupController,
  loginController,
  getAllUsersController,
  userEditController,
  userDelectController
};
