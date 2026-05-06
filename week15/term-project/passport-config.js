const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

module.exports = function initializePassport(passport) {
    // --- Local Strategy ---
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

    // --- Google Strategy ---
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check for existing user by googleId
                let user = await User.findOne({ googleId: profile.id });
                if (user) return done(null, user);

                // Check for existing user by email (link accounts)
                user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
                if (user) {
                    user.googleId = profile.id;
                    user.provider = 'google';
                    user.displayName = profile.displayName;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value.toLowerCase(),
                    displayName: profile.displayName,
                    provider: 'google'
                });
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Serialize and deserialize
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};