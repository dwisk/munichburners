import useSWR from 'swr';

// api data fetcher
const fetcher = (...args) => {
  return fetch(...args)
  .then(response => {
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
  props.push(`id=${initialPage.id}`)
  if (codeword) props.push(`codeword=${codeword}`)

  const url = `/api/page?${props.join("&")}`;
  const res = useSWR(codeword !== false ? url : null, fetcher);
  const { data } = res;

  return {
    page: (data && data.page) || initialPage
  }
}
