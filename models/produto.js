import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  preco: Number,
  imagemUrl: String,
  estoque: Number,
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria', // precisa ter um model Categoria
  },
});

export default mongoose.model('Produto', produtoSchema);