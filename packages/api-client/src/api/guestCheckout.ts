import { UserGuestCheckoutParams, UserGuestCheckoutResponse } from 'src/types/api';
import type { Context } from '../types/context';
import getHeaders from './helpers/getHeaders';

export default async function guestCheckout(
  context: Context,
  params: UserGuestCheckoutParams
) {
  // Create URL object containing full endpoint URL
  const url = new URL(context.config.basePath + '/guestCheckout', context.config.api);

  url.searchParams.set('productStoreId', context.config.defaultStoreId);

  // Use axios to send a POST request
  const { data, headers } = await context.client.post<UserGuestCheckoutResponse>(
    url.href,
    {
      emailAddress: params.emailAddress,
      ...(params.firstName && { firstName: params.firstName }),
      ...(params.lastName && { lastName: params.lastName })
    },
    { headers: getHeaders(context) }
  );

  // Return data from the API
  return {
    data,
    headers
  };
}
