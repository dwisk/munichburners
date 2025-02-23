'use client';

import { Activity } from "munichburners/lib/activities/schema";
import ActivityMeta from "./ActivityMeta";
import Link from "next/link";
import { langs, useLanguage } from "munichburners/lib/LanguageContext";
import { useCallback, useEffect, useState } from "react";
import Content from "./Content";

export default function ActivityDetails({ activity }: { activity: Activity }) {
    const [localizedActivity, setLocalizedActivity] = useState<Activity>(activity);

    const { language, setLanguage } = useLanguage();
    const locale = langs.find(l => l.title === language)?.locale;

    const loadLanguage = useCallback(async (lang: string) => {
      const locale = langs.find(l => l.title === lang)?.locale;
      const res = await fetch(`/api/activities/${activity.documentId}?locale=${locale}`);
      const data = await res.json();
      if (data.success) {
      setLocalizedActivity(data.activity);
      }
    }, [activity.documentId]);
    
    useEffect(() => {
      if (language) {
        const locale = langs.find(l => l.title === language)?.locale;
        if (localizedActivity.locale !== locale) {
          loadLanguage(language);
        }
      }
    }, [language, loadLanguage, localizedActivity.locale]);

    return (
      <div className="container mx-auto">
        {langs.filter(l => l.title !== language).map(l => (
            <button key={l.title} className="ml-2 font-bold fixed top-0 right-0 px-4 rounded-bl-xl z-50 bg-white bg-opacity-20 shadow-md backdrop-blur-sm p-2" onClick={() => setLanguage(l.title)}>{l.title}</button> 
        ))}
  
        <article>
          <h1 className="h1">
            {localizedActivity.name}
          </h1>
  
          <section className="panel content">
            <ActivityMeta activity={localizedActivity} locale={locale} />
            <Content content={localizedActivity.content} />
          </section>
        </article>
        <p className="px-4 md:px-0 ">
          <Link href="/" className="link">
            ← Startseite
          </Link>
        </p>
      </div>
    );
  }
  