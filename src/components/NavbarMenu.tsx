'use client';

import { Menu } from "munichburners/lib/menu/schema";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarMenu({menu}:{menu:Menu}) {
    const pathname = usePathname();
    return (
        <>
        {pathname !== '/' && (
            <li><Link href="/">
                Home
            </Link></li>
        )}
        {menu.mainmenu.map((item) => {
            const href = item.__component === 'menu.menu-page' 
                ? `/pages/${item.page.slug}` 
                : `/activities/${item.activity.documentId}`;

            return (
                <li key={item.__component === 'menu.menu-page' ? item.page.documentId : item.activity.documentId}>
                    <Link href={href} className={pathname === href ? 'font-bold' : ''}>{item.name}</Link>
                </li>
            )           
        }
        )}
    </>
    )
}