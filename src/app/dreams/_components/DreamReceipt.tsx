'use client';

import { jsPDF } from 'jspdf';
import { Dream, DreamYear } from 'munichburners/lib/dreams/schema';
import React from 'react';


export default function DreamReceipt({dream, disabled = false}: {dream: Dream, disabled?: boolean}) {
  const invoiceSum = Math.round((dream.invoices ?? []).filter((i)=> i.reviewStatus === 'ACCEPTED').reduce((acc, invoice) => acc + (invoice.Amount || 0), 0)*100)/100;
    const lines: [string, string][] = [
    ['Empfänger:', dream.bankName || ''],
    ['Adresse:', `${dream.addressStreet || ''}, ${dream.addressZipcode || ''} ${dream.addressCity || ''}, ${dream.addressCountry || ''}`],
    ['IBAN:', dream.bankIBAN || ''],
    ['Zahlungsgrund:', 'Kostenrückerstattung für „' + dream.name + '"'],
    ['Betrag:', `${invoiceSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`],
    ['Zahlungsdatum:', new Date().toLocaleDateString('de-DE')],
    ['Zahlungsart:', 'Überweisung'],
    ['Erstellt am:', new Date().toLocaleDateString('de-DE')],
    ];
  const belegNr = `${(dream.dream_year as DreamYear)?.slug || 'dream'}-${dream.id}`
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text('Munich Burners e.V.', 20, 20);
    doc.text('Forstenrieder Allee 78, 81476 München', 20, 28);
    doc.text('E-Mail: vorstand@munichburners.org', 20, 36);
    doc.text(`Beleg-Nr.: ${belegNr}`, 150, 36);

    doc.setFontSize(14);
    doc.text('Auszahlungsbeleg', 20, 50);

    doc.setFontSize(12);
    let y = 60;



    lines.forEach(([label, value]) => {
      doc.text(label, 20, y);
      doc.text(value, 70, y);
      y += 10;
    });

    doc.setFontSize(10);
    doc.text(
      'Hinweis: Dieser Beleg wird mit dem Kontoauszug archiviert. Unterschrift ist nicht erforderlich.',
      20,
      y + 10
    );

    doc.save(`Auszahlungsbeleg-${belegNr}.pdf`);
  };

  return (
      <button
        onClick={() => generatePDF()}
        disabled={disabled}
        className="btn btn-neutral btn-lg grow"
      >
        Download Auszahlungsbeleg-{belegNr}.pdf
      </button>
  );
}
