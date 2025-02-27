import { ContentType } from "../content/schema";
import { Page } from "../pages/schema";

export interface Menu {
  mainmenu: (MenuPage | MenuActivity)[];
}

interface MenuPage {
  __component: 'menu.menu-page'
  name:string;
  page: Page;
  subPages: Page[];
}

interface MenuActivity {
  __component: 'menu.menu'
  name: string
  activity: Activity;
  subPages: Page[];
}