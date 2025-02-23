'use client';

import { langs, useLanguage } from "munichburners/lib/LanguageContext";
import { useCallback, useEffect, useState } from "react";
import Content from "./Content";
import { Page } from "munichburners/lib/pages/schema";
import Image from "next/image";

export default function PageDetails({ page }: { page: Page }) {
    const [localizedPage, setLocalizedPage] = useState<Page>(page);

    const { language, setLanguage } = useLanguage();

    const loadLanguage = useCallback(async (lang: string) => {
      const locale = langs.find(l => l.title === lang)?.locale;
      const res = await fetch(`/api/pages/${page.documentId}?locale=${locale}`);
      const data = await res.json();
      if (data.success) {
      setLocalizedPage(data.activity);
      }
    }, [page.documentId]);
    
    useEffect(() => {
      if (language) {
        const locale = langs.find(l => l.title === language)?.locale;
        if (localizedPage.locale !== locale) {
          loadLanguage(language);
        }
      }
    }, [language, loadLanguage, localizedPage.locale]);

    return (
      <div className="container mx-auto px-4 md:px-0">
        {langs.filter(l => l.title !== language).map(l => (
            <button key={l.title} className="ml-2 font-bold fixed top-0 right-0 px-4 rounded-bl-xl z-50 bg-white bg-opacity-20 shadow-md backdrop-blur-sm p-2" onClick={() => setLanguage(l.title)}>{l.title}</button> 
        ))}
  
        <article>
        {!!page.showSignet && (
          <div className="max-w-xs mx-auto mt-10 mb-4">
            <Image className="mx-auto" src="/signet.svg" alt="Munich Burners Logo" width={255} height={277}/>
          </div>
        )}
          <h1 className={`h1 ${!page.showSignet ? '' : 'h1-title'}`}>
            {localizedPage.name}
          </h1>
  
          <section className={!page.childPages || page.childPages.length == 0 ? 'panel content' : ''}>
            {page.coverImage && (
              <figure>
                <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${page.coverImage.formats.large.url}`}
                alt={page.coverImage.caption}
                width={page.coverImage.formats.large.width}
                height={page.coverImage.formats.large.height}
                />
                {page.coverImage.caption && <figcaption>{page.coverImage.caption}</figcaption>}
            </figure>
            )}
            <Content content={localizedPage.content} />
          </section>
        </article>
      </div>
    );
  }
  