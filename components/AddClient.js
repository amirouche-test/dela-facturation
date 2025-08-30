'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiUser,
  HiIdentification,
} from 'react-icons/hi';

export default function AddClient() {
  const [client, setClient] = useState({
    nom: '',
    prenom: '',
    numeroRC: '',
    numeroNIF: '',
    numeroART: '',
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setClient({ ...client, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    if (!client.nom || !client.prenom || !client.numeroRC || !client.numeroNIF || !client.numeroART) {
      toast.error('Veuillez remplir tous les champs');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');

      toast.success('Client ajouté avec succès');
      setClient({ nom: '', prenom: '', numeroRC: '', numeroNIF: '', numeroART: '' });
    } catch {
      toast.error('Erreur lors de l\'ajout du client');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-md border border-gray-200 shadow-sm"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <h2 className="text-xl font-semibold mb-6 text-[#212b36] tracking-tight">
        Ajouter un client
      </h2>

      {[
        { label: 'Nom', name: 'nom', type: 'text', icon: <HiUser className="inline mr-1 text-[#27ae60]" size={18} /> },
        { label: 'Prénom', name: 'prenom', type: 'text', icon: <HiUser className="inline mr-1 text-[#27ae60]" size={18} /> },
        { label: 'Numéro registre de commerce', name: 'numeroRC', type: 'text', icon: <HiIdentification className="inline mr-1 text-[#27ae60]" size={18} /> },
        { label: 'Numéro NIF', name: 'numeroNIF', type: 'text', icon: <HiIdentification className="inline mr-1 text-[#27ae60]" size={18} /> },
        { label: 'Numéro ART', name: 'numeroART', type: 'text', icon: <HiIdentification className="inline mr-1 text-[#27ae60]" size={18} /> },
      ].map(({ label, name, type, icon }) => (
        <label key={name} className="block mb-5">
          <span className="block mb-1 text-xs font-medium text-gray-800 select-none">
            {icon} {label}
          </span>
          <input
            type={type}
            name={name}
            value={client[name]}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2
                       text-gray-900 text-sm placeholder-gray-400
                       focus:border-[#27ae60] focus:ring-1 focus:ring-[#27ae60] focus:outline-none
                       transition hover:shadow-sm"
            placeholder={`Entrez ${label.toLowerCase()}`}
            autoComplete="off"
            spellCheck={false}
            disabled={saving}
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-3 cursor-pointer rounded-md font-semibold text-white text-sm
          ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#27ae60] hover:bg-[#219150]'}
          transition-colors shadow-sm select-none`}
      >
        {saving ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  );
}
