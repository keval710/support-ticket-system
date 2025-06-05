import { User } from '../model/user';
import { Role, OAuthProfile } from '../types';
import tokenService from './token.service';

const findOrCreateOAuthUser = async (req: { body: OAuthProfile }) => {
    const profile = req.body;
    // Try to find the user by email
    let user = await User.findOne({ email: profile.email });

    if (user) {
        // User exists — return as-is
        user.isLoggedIn = true;
        await user.save();
        return {
            userId: user._id,
            token: tokenService.generateToken(user),
        };
    }
    // Create a new user
    const newUser = new User({
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        providerId: profile.providerId,
        role: profile.role || Role.USER,
        registrationType: profile.provider,
        isEmailVerified: profile.isEmailVerified ?? false,
        isLoggedIn: true
    });
    await newUser.save();
    // Generate token for the new user
    const token = tokenService.generateToken(newUser);
    return {
        userId: newUser._id,
        token,
    };
};

const logout = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.isLoggedIn = false;
    await user.save();
    return user;
}

export default {
    findOrCreateOAuthUser,
    logout
};
