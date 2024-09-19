const db = require("../db/dbconnection");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const jwtKey = "task_manager";

const signupController = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    console.log("admin",role)
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
        
        const values = role ? [name, email, hashpassword, role] : [name, email, hashpassword];
        db.query(query,values,(err, result) => {
            if (err) {
              return res.status(404).json({ error: `${err}` });
            }
            if (result) {
              db.query(
                `SELECT id,name,email,role FROM users WHERE LOWER(email)= LOWER(?)`,
                [email],
                (err, result) => {
                    console.log("resulr333",result)
                  return res
                    .status(200)
                    .json({ result, message: "User Signup successfully!" });
                }
              );
            }
          }
        );
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
      
        if (result.length === 0) {
          return res
            .status(404)
            .json({ error: "User is Not Found with this email!" });
        }
        let isPassWord = await bcrypt.compare(password, result[0].password);
        if (!isPassWord) {
          return res.status(404).json({ message: "Password is incorrect!" });
        }
        let token = jwt.sign({ user: result }, jwtKey, {
            expiresIn: "1h",
          });
  
        if (result) {
          return res.status(200).json({token:token, message: "User Login Successfully!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signupController, loginController };
