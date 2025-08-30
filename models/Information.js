import mongoose from 'mongoose';

const InformationSchema = new mongoose.Schema({
  marque: { type: String },
  nomFabricant: { type: String },
  prenomFabricant: { type: String },
  numeroRC: { type: String },
  numeroART: { type: String },
  numeroNIF: { type: String },
  numeroNIS: { type: String },
  telephone: { type: String },
  email: { type: String },
  adressePhysique: { type: String },
});

export default mongoose.models.Information || mongoose.model('Information', InformationSchema);
