'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Phone, Mail, MapPin } from 'lucide-react';

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
        setImgData(dataUrl)
        downloadImage()
      })
      .catch(() => setError("Erreur lors de la génération de l'image."));
  };

  return (
    <div className="w-[595px] mx-auto font-sans select-none">
  <div
    ref={factureRef}
    className="displa bg-white p-10 w-[595px] h-[842px] flex flex-col justify-between border border-gray-200 shadow-sm"
    style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#111827' }}
    aria-label={`Facture numéro ${facture.numeroFacture}`}
  >
    {/* HEADER */}
    <header className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
      <div>
        <div className="text-2xl font-extrabold tracking-wide text-gray-900">
          {facture.fabricant.marque || "NOM ENTREPRISE"}
        </div>
        <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">
          Chaussette de qualité supérieure
        </div>
      </div>

      <div className="text-4xl font-black text-gray-800 leading-none select-none">
        FACTURE
      </div>
    </header>

    {/* Dates */}
    <section className="flex justify-between text-sm mb-6" aria-label="Dates facture">
      <div>
      <div className="text-left">
        DATE : {`${new Date(facture.dateFacture).getDate().toString().padStart(2, '0')} / ${
          (new Date(facture.dateFacture).getMonth() + 1).toString().padStart(2, '0')
        } / ${new Date(facture.dateFacture).getFullYear()}`}
      </div>
        <div>ÉCHÉANCE : {facture.dateEcheance || "-- / -- / ----"}</div>
      </div>
      <div className="font-semibold">FACTURE N° : {facture.numeroFacture}</div>
    </section>

    {/* Infos émetteur / destinataire */}
    <section className="flex justify-between text-sm mb-8" aria-label="Informations émetteur et destinataire">
      <div>
        <div className="font-bold uppercase mb-2 text-gray-700">ÉMETTEUR :</div>
        <div className="font-medium">{facture.fabricant.nomFabricant} {facture.fabricant.prenomFabricant}</div>
        <div className="text-gray-500">RC : {facture.fabricant.numeroRegistreCommerce}</div>
      </div>
      <div>
        <div className="font-bold uppercase mb-2 text-gray-700">DESTINATAIRE :</div>
        <div className="font-medium">{facture.client.nom} {facture.client.prenom}</div>
        <div className="text-gray-500">RC : {facture.client.numeroRegistreCommerce}</div>
      </div>
    </section>

    {/* Tableau des produits */}
    <table className="w-full border-collapse text-sm mb-8" aria-label="Liste des produits">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-3 text-left">Produit</th>
          <th className="border border-gray-300 p-3 text-right">Prix unitaire (DA)</th>
          <th className="border border-gray-300 p-3 text-right">Quantité</th>
          <th className="border border-gray-300 p-3 text-right">Montant (DA)</th>
        </tr>
      </thead>
      <tbody>
        {facture.produits.map((prod, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="border border-gray-300 px-3 py-1">{prod.nom}</td>
            <td className="border border-gray-300 px-3 py-1 text-right">{prod.prixUnitaire}</td>
            <td className="border border-gray-300 px-3 py-1 text-right">{prod.quantite}</td>
            <td className="border border-gray-300 px-3 py-1 text-right">{prod.montant}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Totaux */}
    <div className="text-sm flex justify-end mb-8" aria-label="Totaux">
      <table className="text-right">
        <tbody>
          <tr>
            <td className="pr-6 text-gray-700">TOTAL HT :</td>
            <td>{facture.totalHT} DA</td>
          </tr>
          <tr>
            <td className="pr-6 text-gray-700">TVA 20% :</td>
            <td>{facture.tva} DA</td>
          </tr>
          <tr>
            <td className="pr-6 text-gray-700">REMISE :</td>
            <td>{facture.remise || "0"} DA</td>
          </tr>
          <tr className="border-t border-gray-400 font-bold">
            <td className="pr-6 text-gray-900">TOTAL TTC :</td>
            <td>{facture.total} DA</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Bas de page */}
    <footer className="flex justify-between text-xs text-gray-500 mt-6" aria-label="Coordonnées de l'émetteur">
      <div className="flex items-center space-x-2">
        <Phone className="w-5 h-5 text-gray-400" aria-hidden="true" />
        <span>{facture.fabricant.telephone}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Mail className="w-5 h-5 text-gray-400" aria-hidden="true" />
        <span>{facture.fabricant.email}</span>
      </div>
      <div className="flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-gray-400" aria-hidden="true" />
        <span>{facture.fabricant.adressePhysique}</span>
      </div>
    </footer>
  </div>

  {/* Boutons */}
  <div className="mt-10 flex flex-col items-center space-y-5">
    <button
      onClick={generateImage}
      className="bg-gray-900 cursor-pointer hover:bg-gray-800 transition duration-300 ease-in-out text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:-translate-y-0.5"
      aria-label="Générer l'image PNG de la facture au format A4"
    >
      Télécharger La Facture
    </button>
  </div>
</div>

  );
}
