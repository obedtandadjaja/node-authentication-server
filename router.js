const AuthenticationController = require('./controllers/authentication'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Bad requests
  app.all('*', function(req, res) {
      throw new Error("Bad request")
  });

  // middleware to catch bad requests
  app.use(function(err, req, res, next) {
    if (err.message === 'Bad request') {
      res.statusMessage = 'Bad request - route does not exist';
      res.status(400).json({message: 'This is an error'});
    }
  });

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
