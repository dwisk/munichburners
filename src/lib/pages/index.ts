import { fetchAPI } from "../api";
import { Page, RootPage } from "./schema";

export async function getPages():Promise<Page[]> {
    const options:RequestInit = { 
      next : { 
        revalidate: parseInt(process.env.REVALIDATE || "120"), 
        tags: [ `root`]
      }
    };
    
    const res = await fetchAPI("/pages", {
      populate: {
        
      },
      pagination: {
        pageSize: 25
      },
    }, options);
    return res.data;
}


  
export async function getPage(id:string, locale:string = 'de-DE'):Promise<Page> {
    const filters = {
      $or: [
        {
          documentId: {
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
  
    const res = await fetchAPI("/pages", {
      filters,
      locale,
      populate: {
        content: {
          populate: '*',
          on: {
            'content.text': { populate: '*'},
            'content.map': { populate: '*'},
            'content.image': { populate: '*'},
            'content.headline': { populate: '*'},
            'content.teaser': { populate: '*'},
            'content.linktree': { populate: '*'},
            'content.activities': { populate: '*'},
            'content.dreams': {
              populate: {
                Year: {
                  populate: '*'
                }
              }
            },
            
          }, 
        },

        childPages: {
          populate: '*'
        },
        coverImage: true,
        background: true
      },
      pagination: {
        pageSize: 10
      },
    }, options);
    return res.data[0];
}

export async function getStartpage(locale:string = 'de-DE'):Promise<RootPage> {
 
  const options:RequestInit = { 
    next : { 
      revalidate: parseInt(process.env.REVALIDATE || "120"), 
      tags: [ `root`]
    }
  };
  
    const res = await fetchAPI("/startpage", {
      locale,
      populate: {
        content: {
          populate: '*'
        }
      },
      pagination: {
        pageSize: 10
      },
    }, options);

    return res.data;
}