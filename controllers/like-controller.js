const prisma = require('../prisma/prisma-client');

const LikeController = {
  toggleLike: async (req, res) => {
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
        await prisma.like.delete({ where: { id: existingLike.id } });

        return res.status(200).json({
          liked: false,
          message: 'Like removed',
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

  getLikesByPost: async (req, res) => {
    const { postId } = req.params;

    try {
      const likes = await prisma.like.findMany({
        where: { postId },
        include: {
          user: true,
        },
      });

      return res.status(200).json(likes);
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
