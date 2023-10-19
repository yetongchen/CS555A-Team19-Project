const admin = require('../config/FirebaseConfig');

class Middleware {
  async verifyAccessToken(token) {
    try {
      if (token) {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (decodeValue) {
          return decodeValue;
        }
      }
      throw new Error('Invalid or missing access token');
    } catch (e) {
      throw new Error('Access Token Validation Failed. Please Login Again');
    }
  }

  async decodeToken(req, res, next) {
    try {
      const token = req.headers && req.headers.accesstoken;
      const decodedToken = await this.verifyAccessToken(token);
      req.session.email = decodedToken.email;
      req.session.save((err) => {
        if (err) next(err);
      });
      return next();
    } catch (e) {
      return res.status(403).json({ message: e.message });
    }
  }

  async checkAuth(req, res, next) {
    try {
      if (req.session.user || !req.headers.authorization) {
        return next();
      }

      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = await this.verifyAccessToken(token);
      
      req.session.user = {
        email: decodedToken.email,
        name: decodedToken.name
      };

      return next();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new Middleware();
