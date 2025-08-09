'use client';

import { useState, useEffect } from 'react';
import {
  HiUser,
  HiIdentification,
  HiCalendar,
  HiHashtag,
  HiPlus,
  HiTrash,
  HiCube,
  HiXCircle,
} from 'react-icons/hi';
import FacturePreviewWithImage from "./FacturePreviewWithImage";
import { toast } from 'react-hot-toast';

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
      ></path>
    </svg>
  );
}

export default function AddInvoice() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [manualClient, setManualClient] = useState({
    nom: '',
    prenom: '',
    numeroRegistreCommerce: '',
  });
  const [numeroFacture, setNumeroFacture] = useState('');
  const [dateFacture, setDateFacture] = useState(new Date().toISOString().slice(0, 10));
  const [produits, setProduits] = useState([{ id: 1, nom: '', prixUnitaire: '', quantite: '', montant: 0 }]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [submit, setSubmit] = useState(false);
  const [factureData, setFactureData] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('Erreur chargement clients');
        const data = await res.json();
        setClients(data);
      } catch {
        setClients([]);
      }
    }
    fetchClients();
  }, []);

  function validate() {
    let newErrors = {};
    if (!selectedClientId) {
      if (!manualClient.nom.trim()) newErrors.nom = 'Nom requis';
      if (!manualClient.prenom.trim()) newErrors.prenom = 'Prénom requis';
      if (!manualClient.numeroRegistreCommerce.trim()) newErrors.numeroRegistreCommerce = 'Numéro requis';
    }
    if (!numeroFacture.trim()) newErrors.numeroFacture = 'Numéro facture requis';
    if (produits.length === 0) newErrors.produits = 'Ajouter au moins un produit';
    produits.forEach((p, i) => {
      if (!p.nom.trim()) newErrors[`prod_nom_${i}`] = 'Nom produit requis';
      if (!p.prixUnitaire || isNaN(p.prixUnitaire) || +p.prixUnitaire <= 0) newErrors[`prod_prix_${i}`] = 'Prix unitaire > 0 requis';
      if (!p.quantite || isNaN(p.quantite) || +p.quantite <= 0) newErrors[`prod_qte_${i}`] = 'Quantité > 0 requise';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateProduit(index, field, value) {
    setProduits((prev) => {
      const newProds = [...prev];
      newProds[index][field] = value;
      const prix = parseFloat(newProds[index].prixUnitaire);
      const qte = parseInt(newProds[index].quantite);
      newProds[index].montant = isNaN(prix) || isNaN(qte) ? 0 : prix * qte;
      return newProds;
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`prod_${field === 'nom' ? 'nom' : field === 'prixUnitaire' ? 'prix' : 'qte'}_${index}`];
      return newErrors;
    });
  }

  function addProduit() {
    setProduits((prev) => [...prev, { id: Date.now(), nom: '', prixUnitaire: '', quantite: '', montant: 0 }]);
  }

  function removeProduit(index) {
    setProduits((prev) => prev.filter((_, i) => i !== index));
  }

  const total = produits.reduce((acc, p) => acc + p.montant, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    try {
      const resFabricant = await fetch('/api/information');
      if (!resFabricant.ok) throw new Error('Erreur récupération fabricant');
      const fabricant = await resFabricant.json();

      const facture = {
        fabricant,
        client: selectedClientId
          ? clients.find((c) => c._id === selectedClientId)
          : manualClient,
        numeroFacture,
        dateFacture,
        produits: produits.map(({ id, ...rest }) => rest),
        total,
      };

      setFactureData(facture);
      setSubmit(true);

    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 bg-white rounded-lg shadow-md space-y-8 text-xs sm:text-base"
      noValidate
    >
      {/* ... Le reste du JSX reste inchangé ... */}

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Ajouter une facture
      </h2>

      {/* CLIENT */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
          <HiUser className="text-[#27ae60] w-6 h-6" />
          Client existant
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => {
            setSelectedClientId(e.target.value);
            if (e.target.value) {
              const c = clients.find((c) => c._id === e.target.value);
              if (c) setManualClient({ nom: c.nom, prenom: c.prenom, numeroRegistreCommerce: c.numeroRegistreCommerce });
            } else setManualClient({ nom: '', prenom: '', numeroRegistreCommerce: '' });
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.nom;
              delete newErrors.prenom;
              delete newErrors.numeroRegistreCommerce;
              return newErrors;
            });
          }}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition border-gray-300"
        >
          <option value="">-- Aucun --</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nom} {c.prenom} — {c.numeroRegistreCommerce}
            </option>
          ))}
        </select>
      </div>

      {/* Manual Client */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['nom', 'prenom', 'numeroRegistreCommerce'].map((field) => (
          <div key={field}>
            <label className="flex items-center gap-1 text-gray-700 font-medium mb-1">
              {field === 'nom' || field === 'prenom' ? <HiUser className={`text-[#27ae60] w-5 h-5${field==='prenom'?' rotate-180':''}`} /> : <HiIdentification className="text-[#27ae60] w-5 h-5" />}
              {field === 'nom' ? 'Nom' : field === 'prenom' ? 'Prénom' : 'N° Registre Commerce'}
            </label>
            <input
              type="text"
              value={manualClient[field]}
              onChange={(e) => setManualClient((prev) => ({ ...prev, [field]: e.target.value }))}
              disabled={selectedClientId !== ''}
              placeholder={field === 'numeroRegistreCommerce' ? 'N° Registre' : field === 'prenom' ? 'Prénom' : 'Nom'}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition disabled:bg-gray-100 ${
                errors[field] ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors[field]}
              aria-describedby={`error-${field}`}
            />
            {errors[field] && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1" id={`error-${field}`}>
                <HiXCircle className="w-4 h-4" />
                {errors[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Numéro et Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-1 text-gray-700 font-medium mb-1">
            <HiHashtag className="text-[#27ae60] w-5 h-5" />
            Numéro de facture
          </label>
          <input
            type="text"
            value={numeroFacture}
            onChange={(e) => setNumeroFacture(e.target.value)}
            placeholder="Ex: FAC2025-001"
            required
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition ${
              errors.numeroFacture ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.numeroFacture}
            aria-describedby="error-numeroFacture"
          />
          {errors.numeroFacture && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1" id="error-numeroFacture">
              <HiXCircle className="w-4 h-4" />
              {errors.numeroFacture}
            </p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-1 text-gray-700 font-medium mb-1">
            <HiCalendar className="text-[#27ae60] w-5 h-5" />
            Date
          </label>
          <input
            type="date"
            value={dateFacture}
            onChange={(e) => setDateFacture(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition border-gray-300"
          />
        </div>
      </div>

      {/* Produits */}
      <div>
        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 text-lg">
          <HiCube className="text-[#27ae60] w-6 h-6" />
          Produits
        </h3>

        {errors.produits && (
          <p className="text-red-600 mb-2 flex items-center gap-1">
            <HiXCircle className="w-5 h-5" />
            {errors.produits}
          </p>
        )}

        <div className="overflow-x-auto border border-gray-300 rounded-md max-h-[280px] sm:max-h-[320px] overflow-y-auto">
          <table className="w-full min-w-[650px] table-auto border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Produit</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Prix unitaire (DA)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quantité</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Montant (DA)</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((prod, i) => (
                <tr key={prod.id} className="hover:bg-green-50">
                  <td className="border border-gray-300 px-3 py-1">
                    <input
                      type="text"
                      value={prod.nom}
                      onChange={(e) => updateProduit(i, 'nom', e.target.value)}
                      placeholder="Nom du produit"
                      required
                      className={`w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition ${
                        errors[`prod_nom_${i}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={!!errors[`prod_nom_${i}`]}
                      aria-describedby={`error-prod-nom-${i}`}
                    />
                    {errors[`prod_nom_${i}`] && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1" id={`error-prod-nom-${i}`}>
                        <HiXCircle className="w-3 h-3" />
                        {errors[`prod_nom_${i}`]}
                      </p>
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={prod.prixUnitaire}
                      onChange={(e) => updateProduit(i, 'prixUnitaire', e.target.value)}
                      placeholder="0.00"
                      required
                      className={`w-full border rounded-md px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition ${
                        errors[`prod_prix_${i}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={!!errors[`prod_prix_${i}`]}
                      aria-describedby={`error-prod-prix-${i}`}
                    />
                    {errors[`prod_prix_${i}`] && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1" id={`error-prod-prix-${i}`}>
                        <HiXCircle className="w-3 h-3" />
                        {errors[`prod_prix_${i}`]}
                      </p>
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={prod.quantite}
                      onChange={(e) => updateProduit(i, 'quantite', e.target.value)}
                      placeholder="0"
                      required
                      className={`w-full border rounded-md px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-[#27ae60] transition ${
                        errors[`prod_qte_${i}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={!!errors[`prod_qte_${i}`]}
                      aria-describedby={`error-prod-qte-${i}`}
                    />
                    {errors[`prod_qte_${i}`] && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1" id={`error-prod-qte-${i}`}>
                        <HiXCircle className="w-3 h-3" />
                        {errors[`prod_qte_${i}`]}
                      </p>
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-right font-semibold text-green-700">
                    {prod.montant.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeProduit(i)}
                      disabled={produits.length === 1}
                      className={`inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md text-white text-sm font-semibold transition ${
                        produits.length === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                      }`}
                      aria-label="Supprimer produit"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex justify-end items-center bg-gray-50 border border-gray-300 rounded-md px-4 py-2 font-semibold text-green-800 ">
          Total : {total.toFixed(2)} DA
        </div>

        <button
          type="button"
          onClick={addProduit}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#27ae60] text-white rounded-md font-semibold hover:bg-[#1f7a34] transition cursor-pointer"
        >
          <HiPlus className="w-5 h-5" />
          Ajouter un produit
        </button>
      </div>

      <button
        type="submit"
        disabled={saving}
        className={`w-full mt-8 bg-[#27ae60] hover:bg-[#1f7a34] text-white font-bold py-3 rounded-md transition flex justify-center items-center gap-2 ${
          saving ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
        }`}
      >
        {saving && <Spinner />}
        {!saving ? 'Enregistrer la facture' : 'Enregistrement...'}
      </button>
      {submit && <FacturePreviewWithImage facture={factureData}/> }
    </form>
  );
}
