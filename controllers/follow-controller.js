const prisma = require('../prisma/prisma-client');

const FollowController = {
  followUser: async (req, res) => {
    const { id } = req.params;
    const followerId = req.user.id;

    if (followerId === id) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    try {
      const targetUser = await prisma.user.findUnique({ where: { id } });

      if (!targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const existingFollow = await prisma.follows.findFirst({
        where: {
          followerId,
          followingId: id,
        },
      });

      if (existingFollow) {
        return res.status(409).json({ error: 'You are already following this user' });
      }

      const follow = await prisma.follows.create({
        data: {
          followerId,
          followingId: id,
        },
      });

      return res.status(201).json(follow);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while following the user',
        details: error.message,
      });
    }
  },

  unfollowUser: async (req, res) => {
    const { id } = req.params;
    const followerId = req.user.id;

    try {
      const follow = await prisma.follows.findFirst({
        where: {
          followerId,
          followingId: id,
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
