import { fetchAPI } from "../api";
import { Activity } from "./schema.d";

export async function getActivities():Promise<Activity[]> {
    const options:RequestInit = { 
      next : { 
        revalidate: parseInt(process.env.REVALIDATE || "120"), 
        tags: [ `root`]
      }
    };
    
    const res = await fetchAPI("/activities", {
      populate: {
        
      },
      pagination: {
        pageSize: 25
      },
    }, options);
    return res.data;
}


  
export async function getActivity(region:string, locale:string = 'de-DE'):Promise<Activity> {
    const filters = {
        documentId: {
        "$eqi": region
      }
    };
  
  const options:RequestInit = { 
    next : { 
      revalidate: parseInt(process.env.REVALIDATE || "120"), 
      tags: [ `root`]
    }
  };
  
    const res = await fetchAPI("/activities", {
      filters,
      locale,
      populate: {
        content: true
      },
      pagination: {
        pageSize: 10
      },
    }, options);
    return res.data[0];
}