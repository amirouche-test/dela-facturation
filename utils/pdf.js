// utils/generatePDF.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function generatePDF(invoice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Couleurs & style
  const primaryColor = "#2C3E50";
  const secondaryColor = "#16A085";

  // Logo
  if (invoice.fabricant?.logo) {
    doc.addImage(invoice.fabricant.logo, "PNG", 10, 10, 30, 30);
  }

  // Titre facture
  doc.setFontSize(20);
  doc.setTextColor(primaryColor);
  doc.text("FACTURE", pageWidth / 2, 20, { align: "center" });

  // Infos fabricant
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`${invoice.fabricant.nom}`, 10, 50);
  doc.text(`${invoice.fabricant.adresse}`, 10, 55);
  doc.text(`Email: ${invoice.fabricant.email}`, 10, 60);
  doc.text(`Tél: ${invoice.fabricant.telephone}`, 10, 65);

  // Infos client
  doc.setTextColor(primaryColor);
  doc.text("Client :", pageWidth - 80, 50);
  doc.setTextColor(60);
  doc.text(`${invoice.client.nom} ${invoice.client.prenom}`, pageWidth - 80, 55);
  doc.text(`N° RC: ${invoice.client.numeroRegistreCommerce}`, pageWidth - 80, 60);
  if (invoice.client.telephone) doc.text(`Tél: ${invoice.client.telephone}`, pageWidth - 80, 65);
  if (invoice.client.email) doc.text(`Email: ${invoice.client.email}`, pageWidth - 80, 70);

  // Infos facture
  doc.setTextColor(primaryColor);
  doc.text(`Facture N°: ${invoice.numero}`, 10, 80);
  doc.text(`Date: ${invoice.date}`, 10, 85);

  // Tableau produits
  const tableData = invoice.produits.map((p) => [
    p.nom,
    `${p.prixUnitaire.toFixed(2)} DA`,
    p.quantite,
    `${(p.prixUnitaire * p.quantite).toFixed(2)} DA`
  ]);

  doc.autoTable({
    startY: 95,
    head: [["Produit", "Prix Unitaire", "Quantité", "Montant"]],
    body: tableData,
    styles: { fontSize: 10, halign: "center" },
    headStyles: { fillColor: secondaryColor, textColor: "#fff" },
    alternateRowStyles: { fillColor: "#f8f9fa" }
  });

  // Total
  const total = invoice.produits.reduce((sum, p) => sum + p.prixUnitaire * p.quantite, 0);
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.text(`Total: ${total.toFixed(2)} DA`, pageWidth - 60, doc.lastAutoTable.finalY + 10);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Merci pour votre confiance !", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  // Enregistrer PDF
  const fileName = `facture-${invoice.numero}.pdf`;
  doc.save(fileName);
}
