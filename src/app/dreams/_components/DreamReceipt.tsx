'use client';

import { Dream, DreamYear } from 'munichburners/lib/dreams/schema';
import React from 'react';

import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});



export default function DreamReceipt({dream}: {dream: Dream}) {
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

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={{ fontSize: 12 }}>Munich Burners e.V.</Text>
          <Text style={{ fontSize: 12, marginTop: 8 }}>Forstenrieder Allee 78, 81476 München</Text>
          <Text style={{ fontSize: 12, marginTop: 8 }}>E-Mail: vorstand@munichburners.org</Text>
          <Text style={{ fontSize: 12, position: 'absolute', right: 20, top: 36 }}>Beleg-Nr.: {belegNr}</Text>
          
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 28, marginBottom: 10 }}>Auszahlungsbeleg</Text>
          
          {lines.map(([label, value], index) => (
            <View key={index} style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={{ fontSize: 12, width: 100 }}>{label}</Text>
              <Text style={{ fontSize: 12 }}>{value}</Text>
            </View>
          ))}
          
          <Text style={{ fontSize: 10, marginTop: 20 }}>
            Hinweis: Dieser Beleg wird mit dem Kontoauszug archiviert. Unterschrift ist nicht erforderlich.
          </Text>

          <Text style={{ fontSize: 16, marginTop: 28, marginBottom: 10 }}>Einzelbelege</Text>
          {dream.invoices?.filter(i => i.reviewStatus === 'ACCEPTED').map((invoice, index) => (
            <View key={index} style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={{ fontSize: 12, flexGrow: 1 }}>{belegNr}.zip/{(invoice.File as any).name}</Text>
              <Text style={{ fontSize: 12 }}>{invoice.Amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (

    <PDFDownloadLink document={<MyDocument />} className='btn btn-neutral btn-lg grow' fileName={`${belegNr}.pdf`}>
      {({ loading }) =>
        loading ? 'Loading document...' : `Auszahlungsbeleg ${belegNr}.pdf`
      }
    </PDFDownloadLink>
    
  );
}
