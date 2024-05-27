const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuizModel = new Schema({
  ListeningId: {
    type: Schema.Types.ObjectId,
    ref: 'listening',
  },
  GrammarId: {
    type: Schema.Types.ObjectId,
    ref: 'grammar',
  },

  //questions:  [{ type: Schema.Types.ObjectId, ref: 'question' }]
});

module.exports = mongoose.model('Quiz', QuizModel);
