import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    
    githubId: { type: Number, required: true, unique: true },
    fullName: { type: String, required: true },
    owner: String,
    name: String,
    description: { type: String, default: '' },
    stars: Number,
    forks: Number,
    language: String,
    url: String,
    updatedAt: Date,
  },
  { timestamps: true }
);

export const Favorite = mongoose.model('Favorite', favoriteSchema);
