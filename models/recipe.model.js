const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: false
  },
  description: {
    type: String,
    required: false
  },
  ingredients: [{
    name: {
      type: String,
      required: false
    },
    amount: {
      type: Number,
      required: false
    },
    unit: {
      type: String,
      required: false
    }
  }],
  instructions: [{
    type: String,
    required: false
  }],
  cookingTime: {
    type: Number,
    required: false
  },
  servings: {
    type: Number,
    required: false
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: false
  },
  cuisine: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

recipeSchema.index({ title: 'text', description: 'text', cuisine: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);

