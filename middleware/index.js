const jwt = require('jsonwebtoken'),
      config= require("../config/config")

const middleware = {
    verifyToken: function verifyToken(req,res,next){
      
      var token = req.headers.authorization;
      if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
        
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    })
  },
  isLoggedIn:function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
}




module.exports = middleware