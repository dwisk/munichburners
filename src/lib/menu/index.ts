import { fetchAPI } from "../api";
import { Menu } from "./schema";
  
export async function getMenu(locale:string = 'de-DE'):Promise<Menu> {
 
  const options:RequestInit = { 
    next : { 
      revalidate: parseInt(process.env.REVALIDATE || "120"), 
      tags: [ `root`]
    }
  };
  
    const res = await fetchAPI("/menu", {
      locale,
      populate: {
        mainmenu: {
          populate: '*'
        },
        footermenu: {
          populate: '*'
        }
      },
      pagination: {
        pageSize: 10
      },
    }, options);

    return res.data;
}