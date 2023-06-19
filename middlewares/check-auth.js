// Middleware function to check if user is logged in
export default function checkAuth(req, res, next) {
  const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'

  // Check if token exists
  if (token) {
    // Token exists, user is logged in
    // You can perform any additional checks or validations here
    // For example, you might want to decode and verify the token against your authentication mechanism

    // Proceed to the next middleware or route handler
    next();
  } else {
    // Token doesn't exist, user is not logged in
    // You can redirect the user to the login page or send an error response
    res.redirect("/auth/login"); // Redirect to the login page
  }
}
