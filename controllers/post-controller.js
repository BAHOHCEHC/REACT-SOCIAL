const prisma = require('../prisma/prisma-client');

const PostController = {
  getPosts: async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          likes: true,
          comments: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while fetching posts',
        details: error.message,
      });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          likes: {
            include: {
              user: true,
            },
          },
          comments: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while fetching the post',
        details: error.message,
      });
    }
  },

  createPost: async (req, res) => {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: req.user.id,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while creating the post',
        details: error.message,
      });
    }
  },

  updatePost: async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.authorId !== req.user.id) {
        return res.status(403).json({ error: 'You are not allowed to update this post' });
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while updating the post',
        details: error.message,
      });
    }
  },

  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.authorId !== req.user.id) {
        return res.status(403).json({ error: 'You are not allowed to delete this post' });
      }

      await prisma.comment.deleteMany({ where: { postId: id } });
      await prisma.like.deleteMany({ where: { postId: id } });

      await prisma.post.delete({ where: { id } });

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while deleting the post',
        details: error.message,
      });
    }
  },
};

module.exports = PostController;
