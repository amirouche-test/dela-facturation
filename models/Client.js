import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  numeroRegistreCommerce: { type: String, required: true },
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
