import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  numeroRC: { type: String, required: true },
  numeroNIF: { type: String, required: true },
  numeroART: { type: String, required: true },
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
