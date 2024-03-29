import { ProductGetParams, ProductGetResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function getProduct(context: Context, params: ProductGetParams) {

  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/products/detail', context.config.api);

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('productSlug', params.productSlug);
  url.searchParams.set('productStoreId', context.config.defaultStoreId);

  // Use axios to send a GET request
  const { data, headers } = await context.client.get<ProductGetResponse>(url.href, {
    headers: getHeaders(context)
  });
  // Return data from the API
  return {
    data, headers
  };
}
