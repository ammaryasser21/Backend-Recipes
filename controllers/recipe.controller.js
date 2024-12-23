const Recipe = require('../models/recipe.model');
const User = require('../models/user.model');

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user.userId
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'username profileImage')
      .sort('-createdAt');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username profileImage')
      .populate('comments.user', 'username profileImage')
      .populate('ratings.user', 'username profileImage');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id  },
      req.body,
      { new: true }
    );
    
    
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId
    });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const likeIndex = recipe.likes.indexOf(req.user.userId);
    if (likeIndex > -1) {
      recipe.likes.splice(likeIndex, 1);
    } else {
      recipe.likes.push(req.user.userId);
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.comments.push({
      user: req.user.userId,
      text: req.body.text
    });

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const existingRating = recipe.ratings.find(
      rating => rating.user.toString() === req.user.userId
    );

    if (existingRating) {
      existingRating.rating = req.body.rating;
      existingRating.review = req.body.review;
    } else {
      recipe.ratings.push({
        user: req.user.userId,
        rating: req.body.rating,
        review: req.body.review
      });
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error adding rating', error: error.message });
  }
};

exports.searchRecipes = async (req, res) => {
  try {
    const { query, cuisine, difficulty, cookingTime } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (cuisine) {
      searchQuery.cuisine = cuisine;
    }

    if (difficulty) {
      searchQuery.difficulty = difficulty;
    }

    if (cookingTime) {
      searchQuery.cookingTime = { $lte: parseInt(cookingTime) };
    }

    const recipes = await Recipe.find(searchQuery)
      .populate('author', 'username profileImage')
      .sort('-createdAt');

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
};