'use client';

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import n2words from "n2words";

export default function FactureGenerate({ facture }) {
  const factureRef = useRef(null);

  if (!facture) return null;

  const generateAndDownloadImage = () => {
    if (!factureRef.current) return;
    toPng(factureRef.current, {
      cacheBust: true,
      skipFonts: true,
      width: 595,
      height: 842,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `facture-${facture.numeroFacture}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => toast.error("Erreur lors de la génération de l'image."));
  };

  // Logique adaptative selon nombre de produits
  const maxProduitsSansReduc = 5;
  const shouldReduceSpace = facture.produits.length > maxProduitsSansReduc;
  const signatureHeight = shouldReduceSpace ? 40 : 60; // espace signature
  const paddingVertical = shouldReduceSpace ? 'p-6' : 'p-10'; // padding général
  const fontSize = shouldReduceSpace ? 11 : 13; // ajuste la taille si beaucoup de produits

  return (
    <div className="w-[595px] mx-auto font-sans select-none">
      <div
        ref={factureRef}
        className={`bg-white w-[595px] h-[842px] flex flex-col justify-between border border-gray-300 shadow-md rounded ${paddingVertical}`}
        style={{ fontFamily: 'Arial, sans-serif', fontSize: fontSize, color: '#111827' }}
      >
        {/* HEADER */}
        <header className="flex justify-between items-start mb-4 border-b border-gray-400 pb-2">
          <div>
            <div className="text-xl font-extrabold tracking-wide text-gray-900">
              {facture.fabricant.marque || "NOM ENTREPRISE"}
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">
              Chaussette de qualité supérieure
            </div>
          </div>

          <div className="text-3xl font-black text-gray-900">FACTURE</div>
        </header>

        {/* Dates */}
        <section className="flex justify-between text-sm mb-4">
          <div className="font-semibold">FACTURE N° : {facture.numeroFacture}</div>
          <div>
            DATE :{" "}
            {`${new Date(facture.dateFacture).getDate().toString().padStart(2, '0')} / ${
              (new Date(facture.dateFacture).getMonth() + 1).toString().padStart(2, '0')
            } / ${new Date(facture.dateFacture).getFullYear()}`}
          </div>
        </section>

        {/* Infos émetteur / destinataire */}
        <section className="flex justify-between text-sm mb-4">
          <div className="space-y-0.5">
            <div className="font-bold">{facture.fabricant.nomFabricant} {facture.fabricant.prenomFabricant}</div>
            <div className="text-gray-600">R.C : {facture.fabricant.numeroRC}</div>
            <div className="text-gray-600">ATR : {facture.fabricant.numeroART}</div>
            <div className="text-gray-600">N.I.F : {facture.fabricant.numeroNIF}</div>
            <div className="text-gray-600">N.I.S : {facture.fabricant.numeroNIS}</div>
          </div>

          <div className="text-right space-y-0.5">
            <div className="font-bold">Doit : {facture.client.nom} {facture.client.prenom}</div>
            <div className="text-gray-600">R.C : {facture.client.numeroRC}</div>
            <div className="text-gray-600">ART : {facture.client.numeroRC}</div>
            <div className="text-gray-600">N.I.F : {facture.client.numeroRC}</div>
          </div>
        </section>

        {/* Tableau produits */}
        <table className="w-full border-collapse text-sm mb-4">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 p-1 text-left">N°</th>
              <th className="border border-gray-300 p-1 text-left">Désignation</th>
              <th className="border border-gray-300 p-1 text-right">P.U (DA)</th>
              <th className="border border-gray-300 p-1 text-right">Quantité</th>
              <th className="border border-gray-300 p-1 text-right">Montant (DA)</th>
            </tr>
          </thead>
          <tbody>
            {facture.produits.map((prod, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-2 py-0.5">{prod.id}</td>
                <td className="border border-gray-300 px-2 py-0.5">{prod.nom}</td>
                <td className="border border-gray-300 px-2 py-0.5 text-right">{prod.prixUnitaire}</td>
                <td className="border border-gray-300 px-2 py-0.5 text-right">{prod.quantite}</td>
                <td className="border border-gray-300 px-2 py-0.5 text-right">{prod.montant}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="text-sm flex justify-end mb-4">
          <table className="text-right">
            <tbody>
              <tr>
                <td className="pr-6 text-gray-700">TOTAL HT :</td>
                <td className="font-medium">{facture.totalHT} DA</td>
              </tr>
              <tr>
                <td className="pr-6 text-gray-700">TVA 19% :</td>
                <td className="font-medium">{facture.TVA || "0.00"} DA</td>
              </tr>
              <tr>
                <td className="pr-6 text-gray-700">REMISE :</td>
                <td className="font-medium">{facture.remise || "0.00"} DA</td>
              </tr>
              <tr className="border-t border-gray-400 font-bold">
                <td className="pr-6 text-gray-900">TOTAL TTC :</td>
                <td>{facture.totalHT} DA</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Montant en lettres */}
        <div className="text-sm">
          Arrêtée la présente facture à la somme de :  
          <div className="font-bold mt-1 uppercase tracking-wide text-gray-900">
            {n2words(facture.totalHT, { lang: "fr" })} Dinars Algériens
          </div>
        </div>

        {/* Signature */}
        <div className="flex justify-between items-center mb-8" style={{ minHeight: signatureHeight }}>
          <div className="font-semibold text-gray-700 text-sm">{facture.typePaiement}</div>
          <div className="text-center">
            <div className="font-semibold text-sm">Cachet & Signature</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t border-gray-300">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{facture.fabricant.telephone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{facture.fabricant.adressePhysique}</span>
          </div>
        </footer>
      </div>

      {/* Bouton téléchargement */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={generateAndDownloadImage}
          className="bg-gray-900 hover:bg-gray-800 transition duration-300 ease-in-out text-white font-semibold py-3 px-8 rounded-lg shadow-md transform hover:-translate-y-0.5"
        >
          Télécharger La Facture
        </button>
      </div>
    </div>
  );
}
