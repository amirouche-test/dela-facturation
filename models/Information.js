import mongoose from 'mongoose';

const InformationSchema = new mongoose.Schema({
  marque: { type: String },
  nomFabricant: { type: String },
  prenomFabricant: { type: String },
  numeroRegistreCommerce: { type: String },
  telephone: { type: String },
  email: { type: String },
  adressePhysique: { type: String },
});

export default mongoose.models.Information || mongoose.model('Information', InformationSchema);
