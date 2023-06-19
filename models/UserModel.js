import logger from "../utils/logging.js";
import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function getUserById(userID) {
  // Get a connection
  const conn = db.getConnection();

  // Make a query
  const [result, _columnDefinition] = await conn.query(
    "SELECT id, name, username, email, profile_picture, role FROM Users WHERE id = ?",
    [userID]
  );

  logger.debug(`User with id(${userID}), %o`, result[0]);

  return result;
}

// create a new user
async function createUser(user) {
  const { username, name, email, password } = user;
  console.log(password);
  if (password.at(0) !== password.at(1)) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password[0], 10);

  // Get a connection
  const conn = db.getConnection();

  try {
    // Make a query
    const [result, _columnDefinition] = await conn.query(
      "INSERT INTO Users (username, name, email, password) VALUES (?, ?, ?, ?)",
      [username, name, email, hashedPassword]
    );

    logger.debug(`User with id(${result.insertId}) inserted`);

    const userRegistered = await getUserById(result.insertId);
    console.log(userRegistered);
    return userRegistered[0];
  } catch (error) {
    // Handle the error
    logger.debug(`Error creating user: ${error.message}`);
    throw error;
  } finally {
    // Release the connection
    // conn.release();
  }
}

async function findOne(username) {
  try {
    // Get a connection
    const conn = db.getConnection();

    // Make a query
    const [result, _columnDefinition] = await conn.query(
      "SELECT * FROM Users WHERE username =?",
      [username]
    );

    logger.debug(`User with id(${result[0].id}) found`);
    return result[0];
  } catch (error) {
    // Handle the error
    logger.debug(`Error finding user: ${error.message}`);
    throw error;
  } finally {
    // Release the connection
    // conn.release();
  }
}

async function getUserByToken(token) {
  try {
    const user_id = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(user_id);
    // Make a query
    const result = await getUserById(user_id.id);
    // console.log(result);
    // logger.debug(`User with id(${result[0].id}) found`);

    // console.log(result[0]);
    return result[0];
  } catch (error) {
    // Handle the error
    logger.debug(`Error finding user: ${error.message}`);
    throw error;
  } finally {
    // Release the connection
    // conn.release();
  }
}

async function getUserRoleByToken(token) {
  try {
    const result = await getUserByToken(token);
    // console.log(result);
    // logger.debug(`User with id(${result[0].id}) found`);

    // console.log(result[0]);
    return result.role;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  getUserById,
  createUser,
  findOne,
  getUserByToken,
  getUserRoleByToken,
};
