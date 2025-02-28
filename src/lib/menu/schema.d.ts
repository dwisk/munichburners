import { Page } from "../pages/schema";

export interface Menu {
  mainmenu: (MenuPage | MenuActivity)[];
  footermenu: (MenuPage | MenuActivity)[];
}

interface MenuPage {
  __component: 'menu.menu-page'
  id: number;
  name:string;
  page: Page;
  subPages: Page[];
}

interface MenuActivity {
  __component: 'menu.menu'
  id: number;
  name: string
  activity: Activity;
  subPages: Page[];
}