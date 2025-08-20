export interface RecursiveItem {
  totalPrice: number;
  items?: RecursiveItem[];
  type: string;
}

export interface RecursiveStructure {
  items: RecursiveItem[];
}

export const getQueryParam = (key: string, url = window.location.search) => {
  const queryParams = new URLSearchParams(url);
  const value = queryParams.get(key);
  return value ?? null;
};

export const calculateTotalSum = (structure: RecursiveStructure): number => {
  if (!structure?.items || structure?.items.length === 0) {
    return 0;
  }

  // Get the sum in cents, then convert to euros only at the end
  const totalCents = sumRecursiveItemsInCents(structure.items);
  return convertToEuros(totalCents);
};

// New function that works entirely in cents
export const sumRecursiveItemsInCents = (items: RecursiveItem[]): number => {
  let sumCents = 0;

  const price = items.find(({type}) => type === 'Price');
  if (price) {
    sumCents += convertToCents(price.totalPrice ?? 0);
  } else {
    for (const item of items) {
      // Convert item.totalPrice to cents if it exists
      if (item.totalPrice !== undefined) {
        sumCents += convertToCents(item.totalPrice);
      }

      // Handle recursive items
      if (
        item.totalPrice === undefined &&
        item.items &&
        item.items.length > 0
      ) {
        sumCents += sumRecursiveItemsInCents(item.items);
      }
    }
  }
  return sumCents;
};

export const convertToCents = (price: number): number => {
  return Math.round(price * 100);
};

export const convertToEuros = (cents: number): number => {
  return Number((cents / 100).toFixed(2));
};
