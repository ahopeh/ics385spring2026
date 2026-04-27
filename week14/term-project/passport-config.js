const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

module.exports = function initializePassport(passport) {
    // Use email instead of default 'username' field
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) return done(null, false, { message: 'Email not found.' });

                const match = await user.comparePassword(password);
                if (!match) return done(null, false, { message: 'Incorrect password.' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Store only user._id in session
    passport.serializeUser((user, done) => done(null, user.id));

    // Retrieve full user from DB on each request
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};