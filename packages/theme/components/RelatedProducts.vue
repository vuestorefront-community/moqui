<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <SfCarouselItem
          class="carousel__item"
          v-for="(product, i) in products"
          :key="i"
        >
          <SfProductCard
            :title="productGetters.getName(product)"
            :image="addBasePath(productGetters.getCoverImage(product))"
            :badgeLabel="product.isDiscounted ? 'DISCOUNT' : ''"
            :badgeColor="product.isDiscounted ? 'color-danger' : ''"
            :regular-price="$n(getProductPrice(product, false), 'currency')"
            :special-price="
              getProductPrice(product, true) &&
              $n(getProductPrice(product, true), 'currency')
            "
            :max-rating="5"
            :score-rating="productGetters.getAverageRating(product)"
            :show-add-to-cart-button="true"
            :show-add-to-wishlist-button="false"
            :is-added-to-cart="isInCart({ product })"
            :link="
              localePath(
                `/p/${productGetters.getId(
                  product
                )}/${productGetters.getDefaultVariantSlug(product)}`
              )
            "
            class="product-card"
            @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
          >
            <template #image>
              <nuxt-img
                :src="addBasePath(productGetters.getCoverImage(product))"
                width="214"
                height="214"
                sizes="sm:100vw md:50vw lg:400px"
              />
            </template>
            <template #wishlist-icon>
              <!-- Remove wishlisht -->
              <div />
            </template>
          </SfProductCard>
          <!-- :is-in-wishlist="isInWishlist({ product })" -->
          <!-- @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)" -->
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { productGetters, useCart } from '@vue-storefront/moqui';
import { addBasePath } from '@vue-storefront/core';

export default {
  name: 'RelatedProducts',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean
  },
  setup() {
    const { addItem: addItemToCart, isInCart } = useCart();
    // Wishlist not supported at the moment. kept for future reference.
    // const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist } = useWishlist();
    // const removeProductFromWishlist = (productItem) => {
    // const productsInWhishlist = computed(() => wishlistGetters.getItems(wishlist.value));
    // const product = productsInWhishlist.value.find(wishlistProduct => wishlistProduct.variant.sku === productItem.sku);
    // removeItemFromWishlist({ product });
    // };

    const getProductPrice = (product, special) => {
      if (product.hasVariants && !special)
        return productGetters.getPriceRange(product)?.min;
      else {
        if (special) return productGetters.getPrice(product)?.special;
        return productGetters.getPrice(product)?.regular;
      }
    };

    return {
      // addItemToWishlist,
      // isInWishlist,
      // removeProductFromWishlist,
      productGetters,
      getProductPrice,
      addItemToCart,
      isInCart,
      addBasePath
    };
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;

  @include for-desktop {
    margin: 0;
  }

  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }
}
</style>
