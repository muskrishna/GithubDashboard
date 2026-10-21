import { Router } from 'express';
import { Favorite } from '../models/Favorite.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// GET favorites
router.get('/', async (_req, res, next) => {
  try {
    res.json(await Favorite.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!Number.isInteger(b.githubId) || typeof b.fullName !== 'string') {
      throw new ApiError(400, 'githubId and fullName are required.');
    }
    const fav = await Favorite.create({
      githubId: b.githubId,
      fullName: b.fullName,
      owner: b.owner,
      name: b.name,
      description: b.description,
      stars: b.stars,
      forks: b.forks,
      language: b.language,
      url: b.url,
      updatedAt: b.updatedAt,
    });
    res.status(201).json(fav);
  } catch (err) {
    if (err.code === 11000) return next(new ApiError(409, 'This repository is already in your favourites.'));
    next(err);
  }
});

// DELETE 
router.delete('/:githubId', async (req, res, next) => {
  try {
    const id = Number(req.params.githubId);
    if (!Number.isInteger(id)) throw new ApiError(400, 'Invalid repository id.');
    const removed = await Favorite.findOneAndDelete({ githubId: id });
    if (!removed) throw new ApiError(404, 'That repository is not in your favourites.');
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
