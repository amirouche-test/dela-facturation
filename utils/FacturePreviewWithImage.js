'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

export default function FacturePreviewWithImage({ facture }) {
  const factureRef = useRef(null);
  const [imgData, setImgData] = useState(null);
  const [error, setError] = useState('');

  if (!facture) return null;

  const downloadImage = () => {
    if (!imgData) return;
    const link = document.createElement('a');
    link.download = `facture-${facture.numeroFacture}.png`;
    link.href = imgData;
    link.click();
  };

  const generateImage = () => {
    if (!factureRef.current) return;
    setError('');
    toPng(factureRef.current, {
      cacheBust: true,
      skipFonts: true,
      width: 595,
      height: 842,
    })
      .then((dataUrl) => {
        setImgData(dataUrl);
      })
      .catch(() => setError("Erreur lors de la génération de l'image."));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg font-sans select-none">
      <div
        ref={factureRef}
        className="bg-white p-8 w-[595px] h-[842px] flex flex-col justify-between border border-gray-300"
        style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#000' }}
      >
        {/* HEADER */}
        <header className="flex justify-between items-start">
          {/* Logo & Nom */}
          <div>
            <div className="text-xl font-bold">{facture.fabricant.marque || "NOM ENTREPRISE"}</div>
            <div style={{ fontSize: 10, letterSpacing: 1, color: '#666' }}>STUDIO CREATIF</div>
          </div>
          <div className="text-3xl font-bold">FACTURE</div>
        </header>

        {/* Dates */}
        <div className="flex justify-between text-sm mt-4">
          <div>
            <div>DATE : {facture.dateFacture}</div>
            <div>ÉCHÉANCE : {facture.dateEcheance || "--/--/----"}</div>
          </div>
          <div>
            FACTURE N° : {facture.numeroFacture}
          </div>
        </div>

        {/* Infos émetteur / destinataire */}
        <div className="flex justify-between text-sm mt-6">
          <div>
            <div className="font-bold uppercase mb-2">ÉMETTEUR :</div>
            <div>{facture.fabricant.nomFabricant} {facture.fabricant.prenomFabricant}</div>
            <div>{facture.fabricant.telephone}</div>
            <div>{facture.fabricant.email}</div>
            <div>{facture.fabricant.adressePhysique}</div>
          </div>
          <div>
            <div className="font-bold uppercase mb-2">DESTINATAIRE :</div>
            <div>{facture.client.nom} {facture.client.prenom}</div>
            <div>{facture.client.telephone}</div>
            <div>{facture.client.email}</div>
            <div>{facture.client.adresse}</div>
          </div>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse mt-6 text-sm">
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-right">Prix unitaire</th>
              <th className="border border-gray-300 p-2 text-right">Quantité</th>
              <th className="border border-gray-300 p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {facture.produits.map((prod, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2">{prod.nom}</td>
                <td className="border border-gray-300 p-2 text-right">{prod.prixUnitaire} €</td>
                <td className="border border-gray-300 p-2 text-right">{prod.quantite}</td>
                <td className="border border-gray-300 p-2 text-right">{prod.montant} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="mt-4 text-sm flex justify-end">
          <table className="text-right">
            <tbody>
              <tr>
                <td className="pr-4">TOTAL HT :</td>
                <td>{facture.totalHT} €</td>
              </tr>
              <tr>
                <td className="pr-4">TVA 20% :</td>
                <td>{facture.tva} €</td>
              </tr>
              <tr>
                <td className="pr-4">REMISE :</td>
                <td>{facture.remise || "0"} €</td>
              </tr>
              <tr className="font-bold border-t border-gray-400">
                <td className="pr-4">TOTAL TTC :</td>
                <td>{facture.total} €</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Règlement */}
        <div className="mt-6 text-sm">
          <div className="font-bold uppercase">RÈGLEMENT :</div>
          <div>Par virement bancaire :</div>
          <div>Banque : {facture.banque || "Nom de la banque"}</div>
          <div>Compte : {facture.compte || "XXXX-XXXX-XXXX"}</div>
        </div>

        {/* Bas de page */}
        <footer className="mt-4 text-[10px] text-gray-500">
          Conditions générales de vente : paiement sous 30 jours
        </footer>
      </div>

      {/* Boutons */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <button
          onClick={generateImage}
          className="bg-black hover:bg-gray-800 transition-colors text-white font-semibold py-2 px-6 rounded shadow-md"
        >
          Générer image PNG (A4)
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {imgData && (
          <>
            <img
              src={imgData}
              alt="Facture PNG"
              className="border border-gray-400 rounded w-[595px] h-[842px] object-contain"
            />
            <button
              onClick={downloadImage}
              className="mt-4 bg-black hover:bg-gray-800 transition-colors text-white font-semibold py-2 px-6 rounded shadow-md"
            >
              Télécharger l'image
            </button>
          </>
        )}
      </div>
    </div>
  );
}
