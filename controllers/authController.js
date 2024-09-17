const db = require("../db/dbconnection");
const bcrypt = require('bcrypt');
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
        let saltRounds=10;
        let hashpassword = await bcrypt.hash(password,saltRounds)
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
        db.query(
          `INSERT INTO users (name,email,password) VALUES ('${name}','${email}','${hashpassword}')`,
          (err, result) => {
            if (err) {
              return res.status(404).json({ error: `${err}` });
            }
            if (result) {
              db.query(
                `SELECT id,name,email FROM users WHERE LOWER(email)= LOWER(?)`,
                [email],
                (err, result) => {
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

const loginController = (req, res) => {
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
      `SELECT email FROM users WHERE LOWER(email) = LOWER(?)`,
      [email],
      (err, result) => {
        if (result.length === 0) {
          return res.status(404).json({ error: "User is Not Found" });
        } else if (result) {
          return res.status(200).json({ message: "User Login Successfully!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signupController, loginController };
