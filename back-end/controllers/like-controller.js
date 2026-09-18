const prisma = require('../prisma/prisma-client');

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          postId,
        },
      });

      if (existingLike) {
        return res.status(409).json({
          liked: true,
          error: 'You have already liked this post',
        });
      }

      const newLike = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      return res.status(201).json({
        liked: true,
        like: newLike,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while toggling like',
        details: error.message,
      });
    }
  },

  unlikePost: async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId) {
      return res.status(400).json({ error: 'Dislike already exists' });
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId }
      });

      if (!existingLike) {
        return res.status(404).json({ error: 'Dislike denied' });
      }

      await prisma.like.deleteMany({ where: { postId, userId } });

      return res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while fetching likes',
        details: error.message,
      });
    }
  },
};

module.exports = LikeController;
