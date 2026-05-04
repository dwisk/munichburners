import qs from "qs";

export interface FullstackDreamPool {
  id: string;
  slug?: string | null;
}

interface FullstackDreamerAccount {
  id: string;
  name?: string | null;
}

export interface FullstackDreamListItem {
  id: string;
  title?: string | null;
  shortDescription?: string | null;
  dreamer?: string | null;
  dreamerAccount?: (FullstackDreamerAccount | string)[] | null;
  isPublic?: boolean | null;
  budgetNeed?: "MUST" | "NICE" | "NONE" | null;
  grantStatus?: "OPEN" | "CANCELED" | "PLANNED" | "ACCEPTED" | "INVOICES" | "READY" | "PAID" | null;
  requestMin?: number | null;
  requestMax?: number | null;
  grant?: number | null;
}

interface PayloadFindResponse<T> {
  docs?: T[];
}

interface PayloadPoolResponse extends FullstackDreamPool {
  dreams?: {
    docs?: (FullstackDreamListItem | string)[];
  };
}

function getBurnDirectoryURL(path = "") {
  const baseURL = (process.env.BURN_DIRECTORY_URL || "https://the.burn.directory").replace(/\/+$/, "");

  return `${baseURL}${path}`;
}

async function fetchPayloadDocs<T>(
  collection: "dreams" | "pools",
  query: Record<string, unknown>,
): Promise<T[]> {
  const queryString = qs.stringify(query, {
    addQueryPrefix: true,
    encodeValuesOnly: true,
  });
  const response = await fetch(getBurnDirectoryURL(`/api/${collection}${queryString}`), {
    next: {
      revalidate: parseInt(process.env.REVALIDATE || "120"),
      tags: ["root", `burn-directory-${collection}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Fullstack ${collection} request failed with ${response.status}`);
  }

  const result = (await response.json()) as PayloadFindResponse<T>;

  return result.docs || [];
}

async function fetchPoolByID(poolId: string): Promise<PayloadPoolResponse | null> {
  const response = await fetch(getBurnDirectoryURL(`/api/pools/${encodeURIComponent(poolId)}?depth=1`), {
    next: {
      revalidate: parseInt(process.env.REVALIDATE || "120"),
      tags: ["root", "burn-directory-pools", `burn-directory-pool-${poolId}`],
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Fullstack pool request failed with ${response.status}`);
  }

  return (await response.json()) as PayloadPoolResponse;
}

async function findDreamPoolByField(
  field: "id" | "slug",
  value: string,
): Promise<FullstackDreamPool | null> {
  const pools = await fetchPayloadDocs<FullstackDreamPool>("pools", {
    depth: 0,
    limit: 1,
    pagination: false,
    select: {
      id: true,
      slug: true,
    },
    where: {
      [field]: {
        equals: value,
      },
    },
  });

  return pools[0] || null;
}

function getSlugLookupCandidates(value: string): string[] {
  const candidates = [value];
  const [, ...suffixParts] = value.split("-");

  if (suffixParts.length > 0) {
    candidates.push(suffixParts.join("-"));
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

export async function getFullstackDreamPool(poolSlugOrId: string): Promise<FullstackDreamPool | null> {
  const poolIdentifier = poolSlugOrId.trim();

  if (!poolIdentifier) {
    return null;
  }

  const idMatch = await findDreamPoolByField("id", poolIdentifier);
  if (idMatch) {
    return idMatch;
  }

  for (const slugCandidate of getSlugLookupCandidates(poolIdentifier)) {
    const slugMatch = await findDreamPoolByField("slug", slugCandidate);
    if (slugMatch) {
      return slugMatch;
    }
  }

  return null;
}

function joinNames(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0] || "";
  }

  return values.slice(0, -1).join(", ") + " & " + values[values.length - 1];
}

function resolveCurrentDreamerName(dream: FullstackDreamListItem): string | null {
  const fallbackDreamer = typeof dream.dreamer === "string" && dream.dreamer.trim() ? dream.dreamer.trim() : "";

  if (!Array.isArray(dream.dreamerAccount)) {
    return fallbackDreamer || null;
  }

  const names = dream.dreamerAccount.flatMap((account) => {
    if (!account || typeof account === "string") {
      return [];
    }

    const name = typeof account.name === "string" ? account.name.trim() : "";
    if (name) {
      return [name];
    }

    return fallbackDreamer ? [fallbackDreamer] : [];
  });

  return joinNames(names) || fallbackDreamer || null;
}

function getDreamDocsFromPool(pool: PayloadPoolResponse): FullstackDreamListItem[] {
  return (pool.dreams?.docs || [])
    .filter((dream): dream is FullstackDreamListItem => {
      return typeof dream === "object" && dream !== null && dream.isPublic === true;
    })
    .map((dream) => ({
      budgetNeed: dream.budgetNeed,
      dreamer: resolveCurrentDreamerName(dream),
      dreamerAccount: dream.dreamerAccount,
      grant: dream.grant,
      grantStatus: dream.grantStatus,
      id: dream.id,
      isPublic: dream.isPublic,
      requestMax: dream.requestMax,
      requestMin: dream.requestMin,
      shortDescription: dream.shortDescription,
      title: dream.title,
    }));
}

async function getDreamsForPoolID(poolId: string): Promise<FullstackDreamListItem[]> {
  const dreams = await fetchPayloadDocs<FullstackDreamListItem>("dreams", {
    depth: 1,
    limit: 100,
    pagination: false,
    select: {
      budgetNeed: true,
      dreamer: true,
      dreamerAccount: true,
      grant: true,
      grantStatus: true,
      id: true,
      isPublic: true,
      requestMax: true,
      requestMin: true,
      shortDescription: true,
      title: true,
    },
    sort: "title",
    where: {
      form: {
        equals: poolId,
      },
      isPublic: {
        equals: true,
      },
    },
  });

  return dreams.map((dream) => ({
    ...dream,
    dreamer: resolveCurrentDreamerName(dream),
  }));
}

export async function getPublicFullstackDreamsForPool(poolSlugOrId: string): Promise<FullstackDreamListItem[]> {
  const poolIdentifier = poolSlugOrId.trim();

  if (!poolIdentifier) {
    return [];
  }

  const directPool = await fetchPoolByID(poolIdentifier);
  if (directPool) {
    const dreams = await getDreamsForPoolID(directPool.id);

    return dreams.length > 0 ? dreams : getDreamDocsFromPool(directPool);
  }

  const pool = await getFullstackDreamPool(poolIdentifier);
  if (!pool) {
    return [];
  }

  const resolvedPool = await fetchPoolByID(pool.id);

  const dreams = await getDreamsForPoolID(pool.id);

  return dreams.length > 0 ? dreams : resolvedPool ? getDreamDocsFromPool(resolvedPool) : [];
}
