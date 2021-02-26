const { model, Schema } = require('mongoose');

const TodoSchema = new Schema({
  descricao: {
    type: String,
    unique: true,
    required: true
  },

  status: {
    type: String,
    enum: ['pendente', 'em andamento', 'concluida']
  }
}, {
  timestamps: true
});

module.exports = model('todo', TodoSchema);
