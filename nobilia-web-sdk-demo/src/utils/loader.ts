import type {MasterData} from '../model/oc-scripts-domain.model';

// This is where you'd put your URL for your own endpoint that makes authorized requests to the HOMAG APIs and returns them here.
export const HOMAG_INTELLIGENCE_ENDPOINT =
  'https://europe-west3-rml-showcases.cloudfunctions.net/proxy_request?url=';

export interface OrderManagerOptions {
  key?: string;
  importBaseUrl?: string;
}

export interface ApiOptions {
  subscriptionId: string;
  om?: OrderManagerOptions;
  endpointUrl?: string;
  localUrl?: string;
}

export const fetchDataWithAuthorization = async (
  url: string,
  type: 'json' | 'text',
  apiOptions: ApiOptions,
  debug: { property: string } = {property: 'default'},
) => {
  const authorizationHeaders = {
    headers: {
      'Content-Type': type === 'json' ? 'application/json' : 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  };
  try {
    const startTime = performance.now();
    const {subscriptionId, endpointUrl} = apiOptions;
    const key = ''//om.key;
    const response = await fetch(
      HOMAG_INTELLIGENCE_ENDPOINT +
      encodeURIComponent(url) +
      `&subscriptionId=${encodeURIComponent(subscriptionId)}` +
      (key ? `&apiKey=${encodeURIComponent(key)}` : '') +
      (endpointUrl ? `&baseUrl=${encodeURIComponent(endpointUrl)}` : ''),
      authorizationHeaders,
    );
    const endTime = performance.now();
    const fetchTime = endTime - startTime; // Calculate the fetch time

    if (!response.ok) {
      console.warn(`Failed to fetch data from ${debug.property}`);
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`,
      );
    }
    console.info(`Success to fetch data from ${debug.property}`);
    console.info(
      `The data for ${debug.property} was fetched in ${fetchTime} milliseconds`,
    );

    return response;
  } catch (error) {
    console.warn(`Failed to fetch data from ${debug.property}`);
    console.error(error);
    throw error;
  }
};

export const loadArticleCatalog = async (
  libraryId: string,
  apiOptions: ApiOptions,
) => {
  const endpoint =
    `api/pos/libraries/${libraryId}/articles`
  const articlesCatalog = await fetchDataWithAuthorization(
    endpoint,
    'json',
    apiOptions,
    {property: 'articles'},
  );
  return await articlesCatalog.json();
};

export const loadMasterData = async (
  libraryId: string,
  apiOptions: ApiOptions,
) => {
  const endpoint =
    `api/pos/libraries/${libraryId}/masterData`
  const masterData = await fetchDataWithAuthorization(
    endpoint,
    'json',
    apiOptions,
    {property: 'masterData'},
  );
  return (await masterData.json()) as MasterData;
};

export const loadCalcScript = async (
  libraryId: string,
  apiOptions: ApiOptions,
) => {
  const url =
    `api/pos/libraries/${libraryId}/calc.js`
  const response = await fetchDataWithAuthorization(url, 'text', apiOptions, {
    property: 'calc.js',
  });
  let jsCode = await response.text();
  if (!jsCode) {
    throw new Error('Script load error');
  }
  return jsCode;
};
