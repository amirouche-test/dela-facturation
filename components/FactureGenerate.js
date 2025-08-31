"use client";
import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { Phone, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import n2words from "n2words";

export default function FactureGenerate({ facture }) {
  const factureRef = useRef(null);

  if (!facture) return null;

  const generateAndDownloadImage = () => {
    if (!factureRef.current) return;
    toPng(factureRef.current, {
      cacheBust: true,
      skipFonts: false,
      width: 595,
      height: 842,
      pixelRatio: 3,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `facture-${facture.numeroFacture}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => toast.error("Erreur lors de la génération de l'image."));
  };

  const maxProduitsSansReduc = 5;
  const shouldReduceSpace = facture.produits.length > maxProduitsSansReduc;
  const signatureHeight = shouldReduceSpace ? 50 : 80; // plus haut pour cachet/signature
  const paddingVertical = shouldReduceSpace ? "p-4" : "p-6";
  const fontSize = shouldReduceSpace ? 10 : 11;

  return (
    <div className="w-[595px] mx-auto font-sans select-none">
      <div
        ref={factureRef}
        className={`w-[595px] h-[842px] flex flex-col justify-between bg-white shadow-lg`}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: fontSize,
          color: "#1F2937",
        }}
      >
        {/* HEADER */}
        <header
          className="flex justify-between items-center px-6 py-5"
          style={{
            background: "#1E3A8A",
            color: "white",
            margin: 0,
            width: "100%",
          }}
        >
          <div className="flex flex-col">
            <div className="text-2xl font-bold tracking-wide">
              {facture.fabricant.marque || "NOM ENTREPRISE"}
            </div>
            <div className="text-[11px] mt-1 opacity-90">
              {facture.fabricant.slogan || "Chaussette de qualité supérieure"}
            </div>
          </div>
          <div className="text-3xl font-extrabold text-yellow-400 drop-shadow-sm">
            FACTURE
          </div>
        </header>

        {/* CONTENU */}
        <div
          className={`flex-1 flex flex-col justify-between ${paddingVertical}`}
        >
          {/* Dates */}
          <section className="flex justify-between mb-3 mt-2">
            <div className="font-semibold text-blue-800 text-lg">
              FACTURE N° : {facture.numeroFacture}
            </div>
            <div className="font-semibold text-teal-600 text-sm">
              DATE : {`${new Date(facture.dateFacture)
                .getDate()
                .toString()
                .padStart(2, "0")}/
                ${(new Date(facture.dateFacture).getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/
                ${new Date(facture.dateFacture).getFullYear()}`}
            </div>
          </section>

          {/* Infos émetteur / destinataire */}
          <section className="flex justify-between text-xs mb-4">
            {/* Émetteur */}
            <div className="space-y-1 p-3 bg-blue-50 border-l-4 border-blue-600 rounded-md shadow-sm">
              <div className="font-bold text-blue-900 text-sm">
                {facture.fabricant.nomFabricant} {facture.fabricant.prenomFabricant}
              </div>
              <div className="text-gray-800">R.C : {facture.fabricant.numeroRC}</div>
              <div className="text-gray-800">ATR : {facture.fabricant.numeroART}</div>
              <div className="text-gray-800">N.I.F : {facture.fabricant.numeroNIF}</div>
              <div className="text-gray-800">N.I.S : {facture.fabricant.numeroNIS}</div>
            </div>

            {/* Destinataire */}
            <div className="space-y-1 p-3 bg-green-50 border-r-4 border-green-400 rounded-md shadow-sm">
              <div className="font-bold text-green-700 text-sm">
                Doit : {facture.client.nom} {facture.client.prenom}
              </div>
              <div className="text-gray-800">R.C : {facture.client.numeroRC}</div>
              <div className="text-gray-800">ART : {facture.client.numeroART}</div>
              <div className="text-gray-800">N.I.F : {facture.client.numeroNIF}</div>
            </div>
          </section>

          {/* Tableau produits */}
          <table className="w-full border-collapse text-xs mb-4">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border border-gray-200 p-1 text-left">N°</th>
                <th className="border border-gray-200 p-1 text-left">Désignation</th>
                <th className="border border-gray-200 p-1 text-center">P.U (DA)</th>
                <th className="border border-gray-200 p-1 text-center">Quantité</th>
                <th className="border border-gray-200 p-1 text-center">Montant (DA)</th>
              </tr>
            </thead>
            <tbody>
              {facture.produits.map((prod, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-blue-50" : "bg-teal-50"}>
                  <td className="border border-gray-200 px-1 py-0.5">{prod.id}</td>
                  <td className="border border-gray-200 px-1 py-0.5">{prod.nom}</td>
                  <td className="border border-gray-200 px-1 py-0.5 text-center">{prod.prixUnitaire}</td>
                  <td className="border border-gray-200 px-1 py-0.5 text-center">{prod.quantite}</td>
                  <td className="border border-gray-200 px-1 py-0.5 text-center">{prod.montant}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totaux */}
          <div className="flex justify-end mb-3 text-xs font-semibold">
            <table className="text-right">
              <tbody>
                <tr>
                  <td className="pr-4 text-blue-800">TOTAL HT :</td>
                  <td className="text-blue-900">{facture.totalHT} DA</td>
                </tr>
                <tr>
                  <td className="pr-4 text-teal-700">TVA 19% :</td>
                  <td className="text-teal-800">{facture.TVA || "0.00"} DA</td>
                </tr>
                <tr>
                  <td className="pr-4 text-red-600">REMISE :</td>
                  <td className="text-red-700">{facture.remise || "0.00"} DA</td>
                </tr>
                <tr className="border-t border-gray-300 font-bold text-lg text-blue-900">
                  <td className="pr-4">TOTAL TTC :</td>
                  <td>{facture.totalHT} DA</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Montant en lettres */}
          <div className="text-xs p-2 border-l-4 border-blue-600 bg-blue-50">
            Montant en lettres :
            <div className="font-bold mt-1 uppercase tracking-wide text-blue-900">
              {n2words(facture.totalHT, { lang: "fr" })} Dinars Algériens
            </div>
          </div>

          {/* Signature avec plus d'espace */}
          <div
            className="flex justify-between items-end mb-16" // espace augmenté en bas
            style={{ minHeight: signatureHeight }}
          >
            <div className="font-semibold text-gray-800 text-xs">
              {facture.typePaiement}
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs border-b border-gray-300 pt-1">
                Cachet & Signature
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex justify-between text-[11px] text-gray-900 mt-3 pt-1 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3 text-gray-800" />
              <span>{facture.fabricant.telephone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-gray-800" />
              <span>{facture.fabricant.adressePhysique}</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Bouton téléchargement */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={generateAndDownloadImage}
          className="bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out text-white font-semibold py-2 px-6 rounded-md shadow-sm transform hover:-translate-y-0.5 text-sm"
        >
          Télécharger La Facture
        </button>
      </div>
    </div>
  );
}
