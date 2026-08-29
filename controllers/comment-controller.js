const prisma = require('../prisma/prisma-client');

const CommentController = {
  createComment: async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    try {
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          userId: req.user.id,
          postId,
        },
        include: {
          user: true,
          post: true,
        },
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while creating the comment',
        details: error.message,
      });
    }
  },

  getCommentsByPost: async (req, res) => {
    const { postId } = req.params;

    try {
      const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
          user: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while fetching comments',
        details: error.message,
      });
    }
  },

  updateComment: async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    try {
      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (comment.userId !== req.user.id) {
        return res.status(403).json({ error: 'You are not allowed to edit this comment' });
      }

      const updatedComment = await prisma.comment.update({
        where: { id },
        data: { content },
        include: { user: true },
      });

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while updating the comment',
        details: error.message,
      });
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params;

    try {
      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (comment.userId !== req.user.id) {
        return res.status(403).json({ error: 'You are not allowed to delete this comment' });
      }

      await prisma.comment.delete({ where: { id } });

      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while deleting the comment',
        details: error.message,
      });
    }
  },
};

module.exports = CommentController;
