import express from 'express';
import {
  getPostsByType,
  getPostById,
  getPostsByCategory,
  createPost,
  updatePost,
  deletePost,
  likePost,
  toggleFeaturedPost,
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

  // Admin CRUD & Feature toggle
  router.post(
    '/',
    optionalAuth,
    upload.single('featured_image'),
    createPost(type)
  );
  router.put(
    '/:id',
    optionalAuth,
    upload.single('featured_image'),
    updatePost(type)
  );
  router.patch(
    '/:id/feature',
    optionalAuth,
    toggleFeaturedPost(type)
  );
  router.put(
    '/:id/feature',
    optionalAuth,
    toggleFeaturedPost(type)
  );
  router.delete('/:id', optionalAuth, deletePost(type));

  return router;
};


export default createPostRouter;
