import { Dream, DreamYear } from "./schema";
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
        }
      },
      pagination: {
        pageSize: 10
      },
    }, options);
    return res.data[0];
}

export async function getDream(id:string):Promise<Dream> {
    const filters = {
        id: {
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

export async function updateDream(documentId:string, dream:Dream):Promise<Dream> {

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