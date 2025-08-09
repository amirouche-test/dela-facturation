"use client";

import { useRef } from "react";

export default function FactureModal({ open, onClose, facture }) {
  const factureRef = useRef();

  if (!open || !facture) return null;

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default; // import dynamique
    html2pdf()
      .from(factureRef.current)
      .set({
        margin: 0.5,
        filename: `${facture.numeroFacture || "facture"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <div ref={factureRef} className="p-4 bg-white">
          <h1 className="text-center text-2xl font-bold mb-4">FACTURE</h1>
          <p className="text-right">N° {facture.numeroFacture || "-"}</p>
          <p className="text-right mb-6">Date : {facture.dateFacture || "-"}</p>

          <div className="mb-6">
            <strong>Client :</strong><br />
            {facture.client?.nom || "-"}<br />
            {facture.client?.prenom || "-"}<br />
            {facture.client?.numeroRegistreCommerce || "-"}
          </div>

          <table className="w-full border-collapse border mb-6">
            <thead>
              <tr>
                <th className="border p-2">Produit</th>
                <th className="border p-2">Prix unitaire (DA)</th>
                <th className="border p-2">Quantité</th>
                <th className="border p-2">Montant (DA)</th>
              </tr>
            </thead>
            <tbody>
              {(facture.produits || []).map((prod, i) => (
                <tr key={i}>
                  <td className="border p-2">{prod.nom || "-"}</td>
                  <td className="border p-2">{Number(prod.prixUnitaire) || 0}</td>
                  <td className="border p-2">{Number(prod.quantite) || 0}</td>
                  <td className="border p-2">{Number(prod.montant) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-right font-bold">
            TOTAL : {facture.total} (DA)
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}
