import { getDreams, hasDreamYearRights } from "munichburners/lib/dreams";
import { DreamYear } from "munichburners/lib/dreams/schema";

export default async function DreamsFinanceTable({dreamYear, userSecret}: {dreamYear: DreamYear, userSecret: string}) {
  const dreamYearRights = hasDreamYearRights(dreamYear, userSecret);

  if (!dreamYearRights) {
    return null;
  }
  const dreams = await getDreams(dreamYear.id.toString());
  
  const dreamsCSVdata = dreams.filter((dream) => dream.budgetNeed !== 'NONE').map((dream) => {
    const invoices = Math.round((dream.invoices?.reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0) * 100) / 100
    const invoicesAccepted = Math.round((dream.invoices?.filter((invoice) => invoice.reviewStatus === 'ACCEPTED').reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0) * 100) / 100;
    const invoicesDenied = Math.round((dream.invoices?.filter((invoice) => invoice.reviewStatus === 'DENIED').reduce((acc, invoice) => acc + (invoice.Amount || 0), 0) || 0) * 100) / 100;
    let real = dream.grant;
    let accepted = dream.grant;
    if (invoices > 0) {
      real = invoices;
      accepted = invoices;
    }
    if (invoicesAccepted > 0) {
      accepted = invoicesAccepted;
    }
    return ({
      name: dream.name,
      requestMin: dream.requestMin,
      requestMax: dream.requestMax,
      grantStatus: dream.grantStatus,
      grant: dream.grant,
      invoices,
      invoicesAccepted,
      invoicesDenied,
      real,
      accepted,
      address: dream.addressStreet && dream.addressZipcode && dream.addressCity && dream.addressCountry ? 'OK' : 'LEER'
    });
  });

  return (<>
  <h1 className="text-lg font-bold mb-4">Finance Table</h1>
    <table className="table table-xs w-full mt-4 bg-white text-black rounded-none">
      <thead>
        <tr className="text-black">
          {Object.keys(dreamsCSVdata[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dreamsCSVdata.map((dream, index) => (
          <tr key={index}>
            {Object.values(dream).map((value, idx) => (
                <td key={idx}>{typeof value === 'number' ? value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : value}</td>
            ))}
          </tr>
        ))}
      </tbody>
      </table>
    </>
  );
}