// auth.js
const path = require('path')
const jsonFile = require('jsonfile')
const fileName = path.join(__dirname, '../data/users.json')

const bcrypt = require('bcrypt')
const passport = require("passport")
const passportJWT = require("passport-jwt")
const jwt = require("jwt-simple")
const cfg = require("./config.js")
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const params = {
    secretOrKey: cfg.jwtSecret || 'my53cr3tK3y',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const users = jsonFile.readFileSync(fileName, function(err, jsonData) {
    if (err) throw err
    return jsonData
})

module.exports = function () {
    var strategy = new Strategy(params, function (payload, done) {
        var user = users[payload.id] || null
        if (user) {
            return done(null, { id: user.id })
        } else {
            return done(new Error("User not found"), null)
        }
    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize()
        },
        authenticate: function () {
            return passport.authenticate("jwt", cfg.jwtSession)
        },
        generateToken: (req, res) => {
            if (req.body.email && req.body.password) {
                var email = req.body.email
                var password = req.body.password

                var user = users.find(function (u) {
                    var data = password.toString()
                    var hash = u.password.toString()
                    var match = bcrypt.compareSync(data, hash)

                    return u.email === email && match
                });
                if (user) {
                    var payload = { id: user.id };
                    var token = jwt.encode(payload, cfg.jwtSecret)
                    res.json({ token: token })
                } else {
                    res.sendStatus(401)
                }
            } else {
                res.sendStatus(401)
            }
        }
    };
};
