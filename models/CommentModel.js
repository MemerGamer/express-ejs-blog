import db from "../db/db.js";
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
      `SELECT Comments.content, Users.name AS name, Users.profile_picture AS profile_picture FROM Comments JOIN Users ON Comments.user_id = Users.id WHERE post_id = ?`,
      [postId]
    );
    const comments = commentsRows;
    console.log(comments);
    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.end();
  }
}

export default {
  getAllCommentsForPostSlug,
};
