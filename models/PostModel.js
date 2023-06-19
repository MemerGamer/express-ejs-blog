import logger from "../utils/logging.js";
import db from "../db/db.js";

async function getAllPosts(req, res, next) {
  try {
    // Get a connection
    const conn = db.getConnection();

    // Make a query
    //   const [result, _columnDefinition] = await conn.query("SELECT * FROM Posts");
    const [result, _columnDefinition] = await conn.query(
      `SELECT Posts.*, Users.name AS author, Categories.name AS category_name,
       COALESCE(LikeCounts.likes_count, 0) AS likes_count 
       FROM Posts 
       JOIN Users ON Posts.user_id = Users.id 
       JOIN Categories ON Posts.category_id = Categories.id 
       LEFT JOIN (
         SELECT post_id, COUNT(*) AS likes_count
         FROM Likes 
         GROUP BY post_id )
         AS LikeCounts ON Posts.id = LikeCounts.post_id
        ORDER BY Posts.published_at DESC`
    );

    //logger.debug(`Posts selected!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.release(); // Release the connection
  }
}

async function getPostBySlug(slug) {
  try {
    // Get a connection
    const conn = db.getConnection();

    // Make a query
    //   const [result, _columnDefinition] = await conn.query("SELECT * FROM Posts WHERE slug = $1", [slug]);
    const [result, _columnDefinition] = await conn.query(
      `SELECT Posts.*, Users.name AS author, Categories.name AS category_name, 
    COALESCE(LikeCounts.likes_count, 0) AS likes_count 
    FROM Posts 
    JOIN Users ON Posts.user_id = Users.id 
    JOIN Categories ON Posts.category_id = Categories.id
    LEFT JOIN (
       SELECT post_id, COUNT(*) AS likes_count 
       FROM Likes 
       GROUP BY post_id ) AS LikeCounts ON Posts.id = LikeCounts.post_id 
       WHERE Posts.slug = ?`,
      [slug]
    );

    logger.debug(`Posts selected!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.release(); // Release the connection
  }
}

export default {
  getAllPosts,
  getPostBySlug,
};
