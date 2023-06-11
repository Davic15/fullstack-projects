const Follow = require('../models/follow');

const followUserIds = async (identityUserId) => {
    try {
        // Get following IDs
        // prettier-ignore
        let following = await Follow.find({ 'user': identityUserId })
            .select({ 'followed': 1, '_id': 0 })
            .exec();
        // prettier-ignore
        // prettier-ignore
        let followers = await Follow.find({ 'followed': identityUserId })
            .select({ 'user': 1, '_id': 0 })
            .exec();
        // prettier-ignore

        // Proccess Id array
        let followingClean = [];

        following.forEach((follow) => {
            followingClean.push(follow.followed);
        });

        let followersClean = [];

        followers.forEach((follow) => {
            followersClean.push(follow.user);
        });

        return {
            following: followingClean,
            followers: followersClean,
        };
    } catch (error) {
        return {};
    }
};

const followThisUser = async (identityUserId, profileUserId) => {
    // Sacar info seguimiento
    let following = await Follow.findOne(
        // prettier-ignore
        { 'user': identityUserId, 'followed': profileUserId }
    );
    // prettier-ignore
    let follower = await Follow.findOne(
        // prettier-ignore
        { 'user': profileUserId, 'followed': identityUserId });
    // prettier-ignore

    return {
        following,
        follower
    };
};

module.exports = {
    followUserIds,
    followThisUser,
};
