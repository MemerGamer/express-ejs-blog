import db from "../db/db.js";
import jwt from "jsonwebtoken";
async function getAllCommentsForPostSlug(slug) {
  const conn = db.getConnection();
  try {
    // Get post id by slug
    const [postIdRows] = await conn.query(
      `SELECT id FROM Posts WHERE slug = ?`,
      [slug]
    );
    const postId = postIdRows[0]?.id;

    if (!postId) {
      throw new Error("Post not found");
    }

    // Get all comments by post id
    const [commentsRows] = await conn.query(
      `SELECT Comments.content, Comments.posted_at, Users.name AS name, Users.profile_picture AS profile_picture FROM Comments JOIN Users ON Comments.user_id = Users.id WHERE post_id = ? ORDER BY posted_at DESC`,
      [postId]
    );
    const comments = commentsRows;
    // console.log(comments);
    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.end();
  }
}

// create a new comment for a post by slug
async function createCommentForPostSlug(slug, content, token) {
  const conn = db.getConnection();
  try {
    // Get post id by slug
    const [postIdRows] = await conn.query(
      "SELECT id FROM Posts WHERE slug = ?",
      [slug]
    );
    const postId = postIdRows[0]?.id;

    if (!postId) {
      throw new Error("Post not found");
    }

    if (!token) {
      throw new Error("No token found");
    }

    // Get user id by token with jwt
    const user_id = jwt.verify(token, process.env.JWT_SECRET);
    const posted_at = new Date();
    // Create a new comment
    const [newComment, _columnStuff] = await conn.query(
      "INSERT INTO Comments (content, posted_at, user_id, post_id) VALUES (?, ?, ?, ?)",
      [content, posted_at, user_id.id, postId]
    );

    return newComment;
  } catch (error) {
    // Rollback the transaction on error
    // await conn.rollback();
    console.error(error);
    throw error;
  } finally {
    // Release the database connection
    // conn.release();
  }
}

export default {
  getAllCommentsForPostSlug,
  createCommentForPostSlug,
};
