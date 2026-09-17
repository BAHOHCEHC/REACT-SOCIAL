const prisma = require('../prisma/prisma-client');

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.id;

    if (followingId === userId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    try {
      console.log('TARGET:', followingId);
      console.log('WHO:', userId);
      const targetUser = await prisma.user.findUnique({
        where: { id: followingId },
      });

      if (!targetUser) {
        console.log('TARGET USER NOT FOUND', targetUser);
        return res.status(404).json({ error: 'User not found' });
      }

      const existingFollow = await prisma.follows.findFirst({
        where: {
          followingId: followingId,
          followerId: userId,
        },
      });

      if (existingFollow) {
        return res.status(409).json({ error: 'You are already following this user' });
      }

      const follow = await prisma.follows.create({
        data: {
          followingId,
          followerId: userId,
        },
      });

      return res.status(201).json(follow, {
        message: 'Successfully followed the user',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while following the user',
        details: error.message,
      });
    }
  },

  unfollowUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.id;

    try {
      const follow = await prisma.follows.findFirst({
        where: {
          followerId: userId,
          followingId: followingId,
        },
      });

      if (!follow) {
        return res.status(404).json({ error: 'Follow relation not found' });
      }

      await prisma.follows.delete({ where: { id: follow.id } });

      return res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while unfollowing the user',
        details: error.message,
      });
    }
  },

  getFollowers: async (req, res) => {
    const { id } = req.params;

    try {
      const followers = await prisma.follows.findMany({
        where: { followingId: id },
        include: {
          follower: true,
        },
      });

      return res.status(200).json(followers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while fetching followers',
        details: error.message,
      });
    }
  },

  getFollowing: async (req, res) => {
    const { id } = req.params;

    try {
      const following = await prisma.follows.findMany({
        where: { followerId: id },
        include: {
          following: true,
        },
      });

      return res.status(200).json(following);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while fetching subscriptions',
        details: error.message,
      });
    }
  },
};

module.exports = FollowController;
