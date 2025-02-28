'use client';

import { MenuActivity, MenuPage } from "munichburners/lib/menu/schema";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarMenu({menu, showHome = false}:{menu:(MenuPage | MenuActivity)[], showHome?:boolean}) {
    const pathname = usePathname();
    if (!menu) {
        return null;
    }

    return (
        <>
        {pathname !== '/' && showHome && (
            <li><Link href="/">
                Home
            </Link></li>
        )}
        {menu.map((item) => {
            const href = item.__component === 'menu.menu-page' 
                ? `/pages/${item.page.slug}` 
                : `/activities/${item.activity.documentId}`;

            return (
                <li key={item.__component === 'menu.menu-page' ? item.id : item.id}>
                    <Link href={href} className={pathname === href ? 'font-bold' : ''}>{item.name}</Link>
                </li>
            )           
        }
        )}
    </>
    )
}