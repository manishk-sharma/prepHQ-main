import express from 'express';
import {
  getPostsByType,
  getPostById,
  getPostsByCategory,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postsController.js';
import { verifyAdminToken, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const createPostRouter = (type) => {
  const router = express.Router();

  // Public reads
  router.get('/', getPostsByType(type));
  router.get('/category/:category', getPostsByCategory(type));
  router.get('/:id', getPostById(type));

  // User interaction
  router.post('/:id/like', optionalAuth, likePost(type));

  // Admin CRUD
  router.post(
    '/',
    verifyAdminToken,
    upload.single('featured_image'),
    createPost(type)
  );
  router.put(
    '/:id',
    verifyAdminToken,
    upload.single('featured_image'),
    updatePost(type)
  );
  router.delete('/:id', verifyAdminToken, deletePost(type));

  return router;
};

export default createPostRouter;
