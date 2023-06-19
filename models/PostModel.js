import logger from "../utils/logging.js";
import db from "../db/db.js";

async function getAllPosts(req, res, next) {
  try {
    // Get a connection
    const conn = db.getConnection();

    // Make a query
    //   const [result, _columnDefinition] = await conn.query("SELECT * FROM Posts");
    const [result, _columnDefinition] = await conn.query(
      `SELECT Posts.*, Users.id as author_id, Users.name AS author, Categories.name AS category_name,
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
      `SELECT Posts.*,Users.id as author_id, Users.name AS author, Categories.name AS category_name, 
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

    // logger.debug(`Posts selected!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.release(); // Release the connection
  }
}

async function createPost(post, user) {
  try {
    // Get a connection
    const conn = db.getConnection();
    // console.log(post);
    // Make a query
    const [result, _columnDefinition] = await conn.query(
      "INSERT INTO Posts (title, slug, content, published_at, user_id, category_id, banner_img) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        post.title,
        post.slug,
        post.content,
        new Date(),
        user.id,
        post.category,
        post.banner_img,
      ]
    );

    // logger.debug(`Posts created!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function likePost(slug, user_id) {
  try {
    // Get a connection
    const conn = db.getConnection();

    const post = await getPostBySlug(slug);

    // Check if user already liked the post
    const [likeRows, _likeColumns] = await conn.query(
      "SELECT * FROM Likes WHERE post_id = ? AND user_id = ?",
      [post[0].id, user_id]
    );

    let likeResult;

    if (likeRows.length > 0) {
      // User already liked the post, so dislike it
      const [dislikeResult, _dislikeColumns] = await conn.query(
        "DELETE FROM Likes WHERE post_id = ? AND user_id = ?",
        [post[0].id, user_id]
      );
      likeResult = dislikeResult;
    } else {
      // User hasn't liked the post yet, so like it
      const [likeInsertResult, _likeInsertColumns] = await conn.query(
        "INSERT INTO Likes (post_id, user_id) VALUES (?, ?)",
        [post[0].id, user_id]
      );
      likeResult = likeInsertResult;
    }

    // logger.debug(`Like operation completed!`, likeResult);

    return likeResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// find all posts matching the search term

async function findAllPosts(searchTerm) {
  try {
    const conn = await db.getConnection();

    const query = `
  SELECT Posts.*, Users.id AS author_id, Users.name AS author, Categories.name AS category_name,
    COALESCE(LikeCounts.likes_count, 0) AS likes_count 
  FROM Posts 
  JOIN Users ON Posts.user_id = Users.id 
  JOIN Categories ON Posts.category_id = Categories.id 
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS likes_count
    FROM Likes 
    GROUP BY post_id
  ) AS LikeCounts ON Posts.id = LikeCounts.post_id
  WHERE Posts.title LIKE ? OR Posts.content LIKE ? OR Users.name LIKE ?
  ORDER BY Posts.published_at DESC
`;

    const params = [
      `%${searchTerm.toLowerCase()}%`,
      `%${searchTerm.toLowerCase()}%`,
      `%${searchTerm.toLowerCase()}%`,
    ];

    const [result, _columnDefinition] = await conn.query(query, params);
    // logger.debug(`Posts selected!`, result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.release(); // Release the connection
  }
}

async function deletePost(slug) {
  try {
    // Get a connection
    const conn = db.getConnection();

    // Delete the comments associated with the post
    await deleteCommentsByPostId(conn, slug);

    // Delete the likes associated with the post
    await deleteLikesByPostId(conn, slug);

    // Delete the post
    const [result, _columnDefinition] = await conn.query(
      `DELETE FROM Posts WHERE slug = ?`,
      [slug]
    );

    // logger.debug(`Post deleted!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // conn.release(); // Release the connection
  }
}

async function deleteCommentsByPostId(conn, slug) {
  try {
    // Make a query to delete the comments
    const [result, _columnDefinition] = await conn.query(
      `DELETE FROM Comments WHERE post_id IN (SELECT id FROM Posts WHERE slug = ?)`,
      [slug]
    );

    // logger.debug(`Comments deleted!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function deleteLikesByPostId(conn, slug) {
  try {
    // Make a query to delete the likes
    const [result, _columnDefinition] = await conn.query(
      `DELETE FROM Likes WHERE post_id IN (SELECT id FROM Posts WHERE slug = ?)`,
      [slug]
    );

    // logger.debug(`Likes deleted!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updatePost(post) {
  try {
    // Get a connection
    const conn = db.getConnection();
    // console.log(post.slug);
    // console.log(post.original_slug);
    console.log(post);
    // Make a query
    // Make a query
    const [result, _columnDefinition] = await conn.query(
      `UPDATE Posts SET title = ?, slug = ?, content = ?, category_id = ?, banner_img = ?, published_at = ? WHERE slug = ?`,
      [
        post.title,
        post.slug,
        post.content,
        post.category,
        post.banner_img,
        post.date,
        post.original_slug,
      ]
    );

    logger.debug(`Posts updated!`, result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {
  getAllPosts,
  getPostBySlug,
  createPost,
  likePost,
  findAllPosts,
  deletePost,
  updatePost,
};
