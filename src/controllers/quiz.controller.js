const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const Quiz = db.Quiz;

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, quiz, order } = req.body;

    const newQuiz = await Quiz.create({
      id: uuidv4(),
      title,
      description,
      quiz,
      order,
    });

    res.status(201).json({ message: 'Quiz created successfully', data: newQuiz });
  } catch (error) {
    console.error('Create Quiz Error:', error);
    res.status(500).json({ message: 'Failed to create quiz', error: error.message });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.status(200).json({ data: quizzes });
  } catch (error) {
    console.error('Get All Quizzes Error:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes', error: error.message });
  }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ data: quiz });
  } catch (error) {
    console.error('Get Quiz By ID Error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz', error: error.message });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, quiz } = req.body;

    const [updated] = await Quiz.update(
      { title, description, quiz },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const updatedQuiz = await Quiz.findByPk(req.params.id);
    res.status(200).json({ message: 'Quiz updated successfully', data: updatedQuiz });
  } catch (error) {
    console.error('Update Quiz Error:', error);
    res.status(500).json({ message: 'Failed to update quiz', error: error.message });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const deleted = await Quiz.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete Quiz Error:', error);
    res.status(500).json({ message: 'Failed to delete quiz', error: error.message });
  }
};
