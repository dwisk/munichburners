import { getMenu } from "munichburners/lib/menu"
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";
import NavbarMenu from "./NavbarMenu";

export default async function Navbar({children}: {children: React.ReactNode}) {
    const menu = await getMenu();
    const headerList = await headers();

    const menuitems = <NavbarMenu menu={menu} />;

    return (
        <div className="drawer">
            <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="navbar bg-base-300 w-full bg-opacity-60 py-1 min-h-1 justify-center">
                    <div className="lg:hidden">
                        <label htmlFor="navbar-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost btn-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current">
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="hidden lg:block">
                        <ul className="menu menu-horizontal py-0">
                            {menuitems}
                        </ul>
                    </div>

                </div>
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="navbar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4 bg-opacity-90">
                {menuitems}
                </ul>
            </div>
            </div>
    )
}