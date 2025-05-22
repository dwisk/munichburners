import { Dream, DreamYear } from "./schema";
import { fetchAPI } from "../api";

// export async function getDreams():Promise<Activity[]> {
//     const options:RequestInit = { 
//       next : { 
//         revalidate: parseInt(process.env.REVALIDATE || "120"), 
//         tags: [ `root`]
//       }
//     };
    
//     const res = await fetchAPI("/activities", {
//       populate: {
        
//       },
//       pagination: {
//         pageSize: 25
//       },
//     }, options);
//     return res.data;
// }


  
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
      revalidate: 0,// parseInt(process.env.REVALIDATE || "120"), 
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
      revalidate: 0,// parseInt(process.env.REVALIDATE || "120"), 
      tags: [ `root`]
    }
  };
  
    const res = await fetchAPI("/dreams", {
      filters,
      populate: {
      },
      pagination: {
        pageSize: 10
      },
    }, options);
    return res.data[0];
}