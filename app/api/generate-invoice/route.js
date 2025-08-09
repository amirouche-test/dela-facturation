// app/api/generate-invoice/route.js
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer'; // puppeteer ou puppeteer-core selon ton déploiement
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  try {
    const body = await req.json(); // l'objet facture envoyé depuis le client
    // body: { numero, date, fabricant, client, produits: [{nom, prixUnitaire, quantite}], total }

    // 1) construire le HTML de la facture (voir fonction ci-dessous)
    const html = renderInvoiceHTML(body);

    // 2) lancer Puppeteer
    // (en local puppeteer télécharge Chromium automatiquement)
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Exceptionnellement charger la police depuis /public via file:// ou data-uri :
    // Ici on utilise setContent et on référence les ressources relatives (ex: /fonts/...)
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 3) générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    // 4) renvoyer le PDF
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length,
        'Content-Disposition': `attachment; filename="facture-${body.numero || 'unnamed'}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Erreur génération PDF', err);
    return NextResponse.json({ error: 'Impossible de générer la facture', detail: err.message }, { status: 500 });
  }
}

/* ------------------------------
   Fonction qui rend le HTML
   ------------------------------ */
function renderInvoiceHTML(data) {
  // Assure-toi d'avoir public/fonts/Roboto-Regular.ttf et public/logo.png si tu les utilises.
  const produitsRows = (data.produits || [])
    .map(
      (p, i) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${i + 1}. ${escapeHtml(p.nom)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(p.prixUnitaire)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${p.quantite}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(p.prixUnitaire * p.quantite)}</td>
    </tr>`
    )
    .join('');

  const logoUrl = '/logo.png'; // place ton logo dans public/logo.png
  const fontPath = '/fonts/Roboto-Regular.ttf'; // public/fonts/Roboto-Regular.ttf

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Facture ${escapeHtml(data.numero || '')}</title>

  <style>
    /* importer la police depuis /public */
    @font-face {
      font-family: 'RobotoCustom';
      src: url('${fontPath}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    html,body { font-family: 'RobotoCustom', Arial, sans-serif; color:#222; padding:0; margin:0; }
    .page { width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; }
    header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;}
    .logo img { max-height:60px; }
    h1 { margin:0; font-size:20px; color:#2d8559; }
    .meta { text-align:right; font-size:12px; }
    .section { margin-top:18px; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th { text-align:left; padding:8px; background:#f5f5f5; font-weight:600; }
    td { padding:8px; vertical-align:top; }
    .right { text-align:right; }
    footer { position: absolute; bottom: 20mm; left:20mm; right:20mm; font-size:11px; color:#666; }
    .totals { margin-top:10px; text-align:right; font-weight:700; font-size:14px; }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div class="left">
        <div class="logo"><img src="${logoUrl}" alt="Logo" /></div>
        <div style="margin-top:8px;">
          <strong>${escapeHtml(data.fabricant?.nom || '')}</strong><br/>
          ${escapeHtml(data.fabricant?.adresse || '') || ''}<br/>
          RC: ${escapeHtml(data.fabricant?.numeroRegistreCommerce || '')}
        </div>
      </div>

      <div class="meta">
        <h1>FACTURE</h1>
        <div>N°: <strong>${escapeHtml(data.numero || '')}</strong></div>
        <div>Date: ${escapeHtml(data.date || '')}</div>
      </div>
    </header>

    <section class="section">
      <div style="display:flex;justify-content:space-between;">
        <div>
          <strong>Facturé à:</strong><br/>
          ${escapeHtml(data.client?.nom || '')} ${escapeHtml(data.client?.prenom || '')}<br/>
          RC: ${escapeHtml(data.client?.numeroRegistreCommerce || '')}
        </div>
        <div style="text-align:right;">
          <strong>Conditions:</strong><br/>
          Paiement à réception<br/>
        </div>
      </div>
    </section>

    <section class="section">
      <table>
        <thead>
          <tr>
            <th style="width:55%">Produit / Description</th>
            <th style="width:15%">Prix U. (DA)</th>
            <th style="width:10%">Qté</th>
            <th style="width:20%">Montant (DA)</th>
          </tr>
        </thead>
        <tbody>
          ${produitsRows}
        </tbody>
      </table>

      <div class="totals">
        Total : ${formatCurrency(data.total || 0)} DA
      </div>
    </section>

    <footer>
      <div>Merci pour votre confiance. Société: ${escapeHtml(data.fabricant?.nom || '')} — RC: ${escapeHtml(data.fabricant?.numeroRegistreCommerce || '')}</div>
    </footer>
  </div>
</body>
</html>`;
}

/* petites utilitaires */
function formatCurrency(n = 0) {
  return (Number(n) || 0).toFixed(2);
}
function escapeHtml(str = '') {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
