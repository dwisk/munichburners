'use client';

import { useEffect, useState } from "react";
import type { FullstackDreamListItem } from "munichburners/lib/fullstackDreams";

const emptyMessage = "No dreams available for this year.";

type DreamLoadState =
  | { dreams: FullstackDreamListItem[]; status: "ready" }
  | { dreams: []; status: "error" | "loading" };

export default function ContentFullstackDreamsList({ pool }: { pool: string }) {
  const [state, setState] = useState<DreamLoadState>({ dreams: [], status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadDreams() {
      try {
        setState({ dreams: [], status: "loading" });

        const response = await fetch(`/api/fullstack-dreams/${encodeURIComponent(pool)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Dreams request failed with ${response.status}`);
        }

        const result = (await response.json()) as { dreams?: FullstackDreamListItem[]; success?: boolean };

        setState({
          dreams: result.success ? result.dreams || [] : [],
          status: "ready",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load fullstack dreams", error);
        setState({ dreams: [], status: "error" });
      }
    }

    loadDreams();

    return () => {
      controller.abort();
    };
  }, [pool]);

  if (state.status === "loading") {
    return null;
  }

  if (state.status === "error" || state.dreams.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div className="flex flex-col md:gap-px gap-2">
      {state.dreams.map((dream) => (
        <div key={dream.id} className="flex flex-col md:flex-row gap-px">
          <div className="md:w-1/3 bg-black p-2 bg-opacity-60 font-bold">
            {dream.title}
          </div>
          <div className="md:w-1/2 bg-black p-2 bg-opacity-40">
            {dream.shortDescription}
          </div>
          <div className="md:w-1/6 bg-black p-2 bg-opacity-40">
            {dream.dreamer && <span className="md:block">by {dream.dreamer}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
