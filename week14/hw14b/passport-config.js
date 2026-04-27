// passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

module.exports = function (passport) {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            const user = await User.findOne({ email });
            if (!user) return done(null, false);

            const match = await user.comparePassword(password);
            if (!match) return done(null, false);

            return done(null, user);
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};