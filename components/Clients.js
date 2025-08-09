'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiPencilAlt, HiTrash, HiX, HiUser, HiIdentification } from 'react-icons/hi';

function ModalWrapper({ isOpen, onClose, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = '';
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 p-4
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-white rounded-md shadow-lg max-w-md w-full p-6 relative
          transform transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
      >
        {children}
      </div>
    </div>
  );
}

function ClientSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex items-center justify-between animate-pulse"
        >
          <div className="flex flex-col space-y-2 w-3/4">
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
          <div className="flex space-x-3 w-20 justify-end">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Erreur chargement clients');
      const data = await res.json();
      setClients(data);
    } catch {
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(client) {
    setEditingClient(client);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditingClient(null);
    setEditModalOpen(false);
  }

  function openDeleteModal(client) {
    setDeletingClient(client);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeletingClient(null);
    setDeleteModalOpen(false);
  }

  function handleChange(e) {
    setEditingClient({ ...editingClient, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/update/${editingClient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClient),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      toast.success('Client mis à jour');
      closeEditModal();
      fetchClients();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/delete/${deletingClient._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur suppression');
      toast.success('Client supprimé');
      closeDeleteModal();
      fetchClients();
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#212b36] select-none">
        Liste des clients
      </h2>

      {loading ? (
        <ClientSkeleton />
      ) : clients.length === 0 ? (
        <p className="text-center text-gray-500">Aucun client trouvé.</p>
      ) : (
        <div className="space-y-4">
          {clients.map(client => (
            <div
              key={client._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex items-center justify-between hover:shadow-lg transition cursor-default"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#27ae60] select-text flex items-center space-x-2">
                  <HiUser className="text-[#27ae60]" />
                  <span>{client.nom} {client.prenom}</span>
                </h3>
                <p className="text-gray-700 text-sm select-text flex items-center space-x-2">
                  <HiIdentification className="text-gray-500" />
                  <span><span className="font-semibold">N° Registre :</span> {client.numeroRegistreCommerce}</span>
                </p>
              </div>

              {/* Boutons icônes à droite */}
              <div className="flex space-x-3">
                <button
                  onClick={() => openEditModal(client)}
                  aria-label={`Modifier ${client.nom} ${client.prenom}`}
                  className="cursor-pointer text-[#27ae60] hover:text-[#1f7a34] transition p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
                >
                  <HiPencilAlt size={20} />
                </button>
                <button
                  onClick={() => openDeleteModal(client)}
                  aria-label={`Supprimer ${client.nom} ${client.prenom}`}
                  className="cursor-pointer text-red-600 hover:text-red-800 transition p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <HiTrash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal édition */}
      <ModalWrapper isOpen={editModalOpen} onClose={closeEditModal}>
        {editingClient && (
          <>
            <button
              onClick={closeEditModal}
              className="cursor-pointer absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Fermer"
            >
              <HiX size={24} />
            </button>

            <h3 className="text-xl font-semibold mb-4">Modifier le client</h3>

            <label className="block mb-3">
              <span className="block text-sm font-medium text-gray-700">Nom</span>
              <input
                type="text"
                name="nom"
                value={editingClient.nom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
              />
            </label>

            <label className="block mb-3">
              <span className="block text-sm font-medium text-gray-700">Prénom</span>
              <input
                type="text"
                name="prenom"
                value={editingClient.prenom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
              />
            </label>

            <label className="block mb-5">
              <span className="block text-sm font-medium text-gray-700">Numéro registre de commerce</span>
              <input
                type="text"
                name="numeroRegistreCommerce"
                value={editingClient.numeroRegistreCommerce}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
              />
            </label>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`cursor-pointer px-4 py-2 rounded-md font-semibold text-white ${
                  saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#27ae60] hover:bg-[#1f7a34]'
                } transition`}
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </>
        )}
      </ModalWrapper>

      {/* Modal suppression */}
      <ModalWrapper isOpen={deleteModalOpen} onClose={closeDeleteModal}>
        {deletingClient && (
          <>
            <button
              onClick={closeDeleteModal}
              className="cursor-pointer absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Fermer"
            >
              <HiX size={24} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Confirmer la suppression
            </h3>

            <p className="mb-6">
              Voulez-vous vraiment supprimer{' '}
              <span className="font-semibold">
                {deletingClient.nom} {deletingClient.prenom}
              </span>{' '}
              ?
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`cursor-pointer px-4 py-2 rounded-md font-semibold text-white ${
                  deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                } transition`}
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </>
        )}
      </ModalWrapper>
    </div>
  );
}
