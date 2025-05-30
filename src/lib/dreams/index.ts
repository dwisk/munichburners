import { Dream, DreamInvoiceUpload, DreamYear, StrapiFile } from "./schema";
import { fetchAPI } from "../api";

export async function getDreams(dream_year:string):Promise<Dream[]> {
    const filters = {
      dream_year
    };
    const options:RequestInit = { 
      next : { 
        revalidate: parseInt(process.env.REVALIDATE || "120"), 
        tags: [ `root`]
      }
    };
    
    const res = await fetchAPI("/dreams", {
      filters,
      sort: ['name:asc'],
      populate: {
        
      },
      pagination: {
        pageSize: 100
      },
    }, options);
    return res.data;
}

export async function getDreamYear(id:string):Promise<DreamYear> {
  const filters = {
    $or: [
      {
        id: {
          "$eqi": id
        }
      },
      {
        slug: {
          "$eqi": id
        }
      }
    ]
  };
  
  const options:RequestInit = { 
    next : { 
      revalidate: parseInt(process.env.REVALIDATE || "120"), 
      tags: [ `root`]
    }
  };
  
    const res = await fetchAPI(`/dream-years`, {
      filters,
      populate: {
        dreams: {
          sort: ['createdAt:asc'],
        },
        realizers: true
      },
      pagination: {
        pageSize: 10
      },
    }, options);
    return res.data[0];
}

export async function getDream(id:string):Promise<Dream> {
    const filters = {
        documentId: {
        "$eqi": id
      }
    };
  
  const options:RequestInit = { 
    next : { 
      revalidate: parseInt(process.env.REVALIDATE || "120"), 
      tags: [ `root`]
    }
  };
  
    const res = await fetchAPI("/dreams", {
      filters,
      populate: {
        dream_year: {
          populate: {
            realizers: true
          }
        },
        invoices: {
          populate: {
            File: true
          }
        }
      },
      pagination: {
        pageSize: 10
      },
    }, options);
    return res.data[0];
}

export async function postDream(dream:Dream):Promise<Dream> {

  const options:RequestInit = { 
    headers: {
    'Content-Type': 'application/json'
  },
    method: 'POST',
        body: JSON.stringify({
      data: dream
    })
  };

  const res = await fetchAPI("/dreams", {
  }, options);

  return res;
}

export async function updateDream(documentId:string, dream:Dream|DreamInvoiceUpload):Promise<Dream> {

  const options:RequestInit = { 
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({
      data: dream
    })
  };

  const res = await fetchAPI(`/dreams/${documentId}`, {
  }, options);

  return res;
}

export async function uploadInvoice(file: File, dreamId: string, amount: number, comment: string): Promise<Dream> {
  // 1. Upload the file to Strapi
  const formData = new FormData();
  formData.append("files", file);

  const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`, {
    method: "POST",
    body: formData,
    // Add auth headers if needed
  });

  if (!uploadRes.ok) {
    throw new Error("File upload failed");
  }

  const uploadedFiles = await uploadRes.json();
  const uploadedFile = uploadedFiles[0];

  // 2. Fetch the dream
  const dream = await getDream(dreamId);
  if (!dream) throw new Error("Dream not found");

  // 3. Add the new invoice to the dream's invoices array
  const newInvoice = {
    Comment: comment,
    File: uploadedFile.id,
    Amount: amount,
  };
  
  // Filter out any id fields from existing invoices
  const existingInvoices = Array.isArray(dream.invoices) 
    ? dream.invoices.map(({ File, Comment, Amount }) => (
      { 
        File: (File as StrapiFile)?.id,
        Comment,
        Amount }
    )) 
    : [];
  
  const updatedInvoices = [...existingInvoices, newInvoice];

  // 4. Update the dream with the new invoices array
  const updatedDream = await updateDream(dream.documentId!, {
    invoices: updatedInvoices,
  } as DreamInvoiceUpload);

  return updatedDream;
}

export const deleteInvoice = async (dreamId: string, invoiceId: number): Promise<Dream> => {
  // 1. Fetch the dream
  const dream = await getDream(dreamId);
  if (!dream) throw new Error("Dream not found");
  if (!dream.invoices) throw new Error("Dream has no invoices!");
  // 2. Filter out the invoice to be deleted
  const existingInvoices = Array.isArray(dream.invoices) 
    ? dream.invoices
    : [];
  const updatedInvoices = existingInvoices.filter((invoice) => invoice.id !== invoiceId);
  // console.log(updatedInvoices)
  // 3. Update the dream with the new invoices array
  const updatedDream = await updateDream(dream.documentId!, {
    invoices: updatedInvoices.map(({ File, Comment, Amount }) => (
      { 
        File: (File as StrapiFile)?.id,
        Comment,
        Amount }
    )) ,
  } as DreamInvoiceUpload);

  // 4. Optionally, delete the file from Strapi if needed
  const fileToDelete = existingInvoices.find((invoice) => invoice.id === invoiceId)?.File;
  console.log(fileToDelete)
  if (fileToDelete) {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload/files/${(fileToDelete as StrapiFile).id}`, {
      method: "DELETE",
      // Add auth headers if needed
    });
  }
  return updatedDream;  
}


// RIGHTS ######################################################################

export function hasDreamRights(dream: Dream, userSecret: string) {
  if (!dream || !dream.documentId) {
    return false;
  }
  
  if (dream.dreamerSecret === userSecret) {
    return true;
  }
  
  return false;
}

export function hasDreamYearRights(dream_year: DreamYear, userSecret: string) {
  if (!dream_year || !dream_year.documentId) {
    return false;
  }
  
  const dreamYearRealizers = (dream_year as DreamYear).realizers.map((r) => r.Secret);
  
  if (dreamYearRealizers.includes(userSecret)) {
    return true;
  }
  
  return false;
}

export function getDreamRights(dream: Dream, userSecret: string):{isYearRealizer: boolean, isDreamer: boolean} {
  if (!dream || !dream.documentId) {
    return {
      isYearRealizer: false,
      isDreamer: false
    };
  }
  
  const rights = {
    isYearRealizer: hasDreamYearRights(dream.dream_year as DreamYear, userSecret),
    isDreamer: hasDreamRights(dream, userSecret),
  };
  
  
  
  return rights;
}

export function getDreamColor(grantStatus:'OPEN' | 'CANCELED' | 'PLANNED' | 'ACCEPTED' | 'INVOICES' | 'READY' | 'PAID' | undefined):string {
  switch (grantStatus) {
    case 'OPEN':
      return 'bg-blue-800';
    case 'PLANNED':
      return 'bg-teal-600';
    case 'CANCELED':
      return 'bg-red-800';
    case 'ACCEPTED':
      return 'bg-green-800';
    case 'INVOICES':
      return 'bg-cyan-600';
    case 'READY':
      return 'bg-lime-600';
    case 'PAID':
      return 'bg-green-500';
    default:
      return '';
  }
}

export function getDreamEmoji(grantStatus:'OPEN' | 'CANCELED' | 'PLANNED' | 'ACCEPTED' | 'INVOICES' | 'READY' | 'PAID' | undefined):string {
  switch (grantStatus) {
    case 'OPEN':
      return '🌈';
    case 'PLANNED':
      return '🏁';
    case 'CANCELED':
      return '❌';
    case 'ACCEPTED':
      return '✅';
    case 'INVOICES':
      return '🧾';
    case 'READY':
      return '⏳';
    case 'PAID':
      return '💶';
    default:
      return '';
  }
}

export function getDreamLabel(grantStatus:'OPEN' | 'CANCELED' | 'PLANNED' | 'ACCEPTED' | 'INVOICES' | 'READY' | 'PAID' | undefined):string {
  switch (grantStatus) {
    case 'OPEN':
      return 'offen';
    case 'PLANNED':
      return 'geplant'
    case 'CANCELED':
      return '';
    case 'ACCEPTED':
      return 'angenommen';
    case 'INVOICES':
      return 'Rechnungen';
    case 'READY':
      return 'bereit';
    case 'PAID':
      return 'ausgezahlt';
    default:
      return '';
  }
}