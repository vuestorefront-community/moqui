<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <div v-if="error">
        <SfAlert :message="error.message" type="danger" />
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|nothavenumber"
          class="form__element"
        >
          <SfInput
            v-model="form.firstName"
            name="firstName"
            :label="$t('First Name')"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|nothavenumber"
          class="form__element"
        >
          <SfInput
            v-model="form.lastName"
            name="lastName"
            :label="$t('Last Name')"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|email"
          class="form__element"
        >
          <SfInput
            v-model="form.email"
            type="email"
            name="email"
            :label="$t('Your e-mail')"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <SfButton :disabled="loading" type="submit" class="form__button">
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Checkout as Guest') }}</div>
        </SfLoader>
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfAlert, SfButton, SfLoader } from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default defineComponent({
  name: 'GuestCheckoutForm',
  components: {
    SfInput,
    SfAlert,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    error: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  emits: ['submit'],
  setup(props, context) {
    const emit = context.emit;
    const { send: sendNotification } = useUiNotification();
    const resetForm = () => ({
      firstName: '',
      lastName: '',
      email: ''
    });
    const form = ref(resetForm());

    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        form.value = resetForm();
        resetValidationFn();
      };
      const onError = () => {
        sendNotification({
          id: Symbol('guest_checkout_failed'),
          message: context.root.$t('Guest checkout failed'),
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Guest Checkout'
        });
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      form,
      submitForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }

  &__button {
    display: block;
    width: 100%;

    @include for-desktop {
      width: 17.5rem;
    }
  }

  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
