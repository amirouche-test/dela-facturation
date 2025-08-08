'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import {
  HiTag,
  HiUser,
  HiIdentification,
  HiPhone,
  HiMail,
  HiLocationMarker,
} from 'react-icons/hi';

const iconsMap = {
  marque: <HiTag className="inline mr-1 text-[#27ae60]" size={18} />,
  nomFabricant: <HiUser className="inline mr-1 text-[#27ae60]" size={18} />,
  prenomFabricant: <HiUser className="inline mr-1 text-[#27ae60]" size={18} />,
  numeroRegistreCommerce: <HiIdentification className="inline mr-1 text-[#27ae60]" size={18} />,
  telephone: <HiPhone className="inline mr-1 text-[#27ae60]" size={18} />,
  email: <HiMail className="inline mr-1 text-[#27ae60]" size={18} />,
  adressePhysique: <HiLocationMarker className="inline mr-1 text-[#27ae60]" size={18} />,
};

export default function Information() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await fetch('/api/information');
        if (!res.ok) throw new Error('Erreur chargement');
        const data = await res.json();
        setInfo(data || {});
      } catch {
        toast.error('Impossible de charger les informations');
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, []);

  function handleChange(e) {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/information', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      if (!res.ok) throw new Error('Erreur sauvegarde');
      toast.success('Informations sauvegardées');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto bg-[#f4f6f8] rounded-md shadow-md">
        <Skeleton
          height={30}
          count={8}
          className="mb-3 rounded"
          baseColor="#e1e5ea"
          highlightColor="#d1d5db"
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-md border border-gray-300 shadow-sm"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 tracking-tight">
        Informations du fabricant et d'atelier
      </h2>

      {[
        { label: 'Marque', name: 'marque', type: 'text' },
        { label: 'Nom fabricant', name: 'nomFabricant', type: 'text' },
        { label: 'Prénom fabricant', name: 'prenomFabricant', type: 'text' },
        { label: 'Numéro registre de commerce', name: 'numeroRegistreCommerce', type: 'text' },
        { label: 'Téléphone', name: 'telephone', type: 'text' },
        { label: 'Adresse email', name: 'email', type: 'email' },
      ].map(({ label, name, type }) => (
        <label key={name} className="block mb-4 text-sm text-gray-700 select-none">
          <span className="flex items-center mb-1 text-[#27ae60] font-semibold">
            {iconsMap[name]} {label}
          </span>
          <input
            type={type}
            name={name}
            value={info?.[name] || ''}
            onChange={handleChange}
            placeholder={`Entrez ${label.toLowerCase()}`}
            spellCheck={false}
            autoComplete="off"
            className="block w-full rounded border border-gray-300 px-3 py-2
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-[#27ae60]
                       transition-shadow hover:shadow-sm"
          />
        </label>
      ))}

      <label className="block mb-6 text-sm text-gray-700 select-none">
        <span className="flex items-center mb-1 text-[#27ae60] font-semibold">
          {iconsMap.adressePhysique} Adresse physique
        </span>
        <textarea
          name="adressePhysique"
          value={info?.adressePhysique || ''}
          onChange={handleChange}
          rows={3}
          placeholder="Entrez l'adresse physique"
          spellCheck={false}
          autoComplete="off"
          className="block w-full rounded border border-gray-300 px-3 py-2
                     text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-[#27ae60]
                     transition-shadow resize-none hover:shadow-sm"
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-3 cursor-pointer rounded-md font-semibold text-white text-sm
          ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#27ae60] hover:bg-[#1f7a34]'}
          transition-colors shadow-sm select-none`}
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </form>
  );
}
