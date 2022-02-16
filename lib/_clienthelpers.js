import useSWR from 'swr';
import cache from "memory-cache";

// api data fetcher
const fetcher = (...args) => {
  return fetch(...args)
  .then(async response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .catch((error) => {
    return { error }
  });
}

// SWR for Page
export function usePage (initialPage, codeword = false) {
  let props = [];  
  if (initialPage?.id) props.push(`id=${initialPage.id}`)
  if (codeword) props.push(`codeword=${codeword}`)

  const url = `/api/page?${props.join("&")}`;
  const res = useSWR(codeword !== false ? url : null, fetcher);
  const { data } = res;

  return {
    page: (data && data.page) || initialPage
  }
}
export function usePageBlocks (initialPage) {
  let props = [];  
  if (initialPage?.id) props.push(`id=${initialPage.id}`)
  props.push(`blocks=true`)

  const url = `/api/page?${props.join("&")}`;
  const cachedResponse = cache.get(url);
  let data, error;
  if (cachedResponse) {
    console.log('cache')
    data = cachedResponse;
  } else {
    console.log('load')
    const res = useSWR(initialPage ? url : null, fetcher);
    data = res.data;
    error = res.error;
    cache.put(url, data, 1000 * 3600); // 1 hour
  }

  return {
    loading: !data,
    error,
    page: (data && data.page) || initialPage,
    blocks: (data && data.blocks) || []
  }
}
