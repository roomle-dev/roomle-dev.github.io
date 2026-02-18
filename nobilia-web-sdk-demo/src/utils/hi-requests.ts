import { type HiApiOptions, type HomagIntelligenceInitData } from '@roomle/web-sdk';

const fetchDataWithAuthorization = async (
  url: string,
  type: 'json' | 'text',
  hiInitData: HomagIntelligenceInitData,
  debug: { property: string } = { property: 'default' },
) => {
  const hiApiOptions: HiApiOptions = hiInitData.serverOptions ?? {};
  const authorizationHeaders = {
    headers: {
      'Content-Type': type === 'json' ? 'application/json' : 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  };
  if (hiApiOptions.language) {
    (authorizationHeaders.headers as any)['Accept-Language'] =
      hiApiOptions.language;
  }
  if (hiApiOptions.authData) {
    (authorizationHeaders.headers as any)['Authorization'] =
      hiApiOptions.authData;
  }
  try {
    const startTime = performance.now();
    const { baseUrl, subscriptionId, key, endpointUrl } = hiApiOptions;
    const response = await fetch(
      (baseUrl) +
        encodeURIComponent(url) +
        (subscriptionId
          ? `&subscriptionId=${encodeURIComponent(subscriptionId || '')}`
          : '') +
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

const createUrl = (hiInitData: HomagIntelligenceInitData, type: string) => {
  const { libraryId } = hiInitData;
  return `api/pos/libraries/${libraryId}/${type}`;
};

export const libLoadArticleCatalog = async (
  hiInitData: HomagIntelligenceInitData,
) => {
  const articlesCatalog = await fetchDataWithAuthorization(
    createUrl(hiInitData, 'articles'),
    'json',
    hiInitData,
    { property: 'articles' },
  );
  return await articlesCatalog.json();
};

export const libLoadMasterData = async (
  hiInitData: HomagIntelligenceInitData,
) => {
  const masterData = await fetchDataWithAuthorization(
    createUrl(hiInitData, 'masterData'),
    'json',
    hiInitData,
    { property: 'masterData' },
  );
  return (await masterData.json()) as any;
};

export const libLoadCalcScript = async (
  hiInitData: HomagIntelligenceInitData,
) => {
  const response = await fetchDataWithAuthorization(
    createUrl(hiInitData, 'calc.js'),
    'text',
    hiInitData,
    {
      property: 'calc.js',
    },
  );
  let jsCode = await response.text();
  if (!jsCode) {
    throw new Error('Script load error');
  }
  return jsCode;
};

export const omPostRequest = async (
  hiInitData: HomagIntelligenceInitData,
  body: any,
  url: string,
  extraHeaders: Record<string, string> = {},
) => {
  const { baseUrl, om } = hiInitData.serverOptions ?? {};
  const endpointUrl = encodeURIComponent(om?.endpointUrl || '');
  const subscriptionId = encodeURIComponent(om?.subscriptionId || '');
  const key = om?.key || '';
  const response = await fetch(
    (baseUrl) +
    `${encodeURIComponent(url)}&subscriptionId=${subscriptionId}&apiKey=${key}&baseUrl=${endpointUrl}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
    },
  );
  const json = await response.json();
  return json;
};

export const omGetRequest = async (
  hiInitData: HomagIntelligenceInitData,
  url: string,
  extraHeaders: Record<string, string> = {},
) => {
  const { baseUrl, om } = hiInitData.serverOptions ?? {};
  const endpointUrl = encodeURIComponent(om?.endpointUrl || '');
  const subscriptionId = encodeURIComponent(om?.subscriptionId || '');
  const key = om?.key || '';
  const response = await fetch(
    (baseUrl) +
    `${encodeURIComponent(url)}&subscriptionId=${subscriptionId}&apiKey=${key}&baseUrl=${endpointUrl}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
    },
  );
  const json = await response.json();
  return json;
};
