import { computed, ssrRef, useContext } from '@nuxtjs/composition-api';

const GUEST_CHECKOUT_COOKIE = 'vsf-guest-checkout';
interface GuestCheckoutInput {
  email: string;
  firstName: string;
  lastName: string;
}

const useGuestCheckout = () => {
  const { app } = useContext();
  const guestCheckoutState = ssrRef<boolean>(false, 'vsf-guest-checkout-state');

  const normalizeCookieValue = (value: unknown) =>
    value === true || value === 'true' || value === 1 || value === '1';

  const syncFromCookie = () => {
    guestCheckoutState.value = normalizeCookieValue(
      app.$cookies.get(GUEST_CHECKOUT_COOKIE)
    );
  };

  const setGuestCheckout = (value: boolean) => {
    guestCheckoutState.value = value;
    if (value) {
      app.$cookies.set(GUEST_CHECKOUT_COOKIE, true);
      return;
    }
    app.$cookies.remove(GUEST_CHECKOUT_COOKIE);
  };

  syncFromCookie();

  const loginAsGuest = async ({ email, firstName, lastName }: GuestCheckoutInput) => {
    const response = await app.$vsf.$moqui.api.guestCheckout({
      emailAddress: email,
      firstName,
      lastName
    });

    if (response?.data?.customerInfo) {
      setGuestCheckout(true);
      return response.data;
    }

    throw new Error('Failed to initialize guest checkout');
  };

  return {
    isGuestCheckout: computed(() => guestCheckoutState.value),
    loginAsGuest,
    clearGuestCheckout: () => setGuestCheckout(false)
  };
};

export default useGuestCheckout;
