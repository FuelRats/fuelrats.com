import { createSelector } from 'reselect'





const selectOrders = (state) => state.orders.orders


const selectOrdersMeta = (state) => ({
  hasMore: state.orders.hasMore,
})





const selectProducts = (state) => state.products.products


const selectProductById = (state, { productId }) => state.products.products[productId]


const selectProductsMeta = (state) => ({
  hasMore: state.products.hasMore,
})





const selectSkus = (state) => state.skus


const selectSkusByProductId = createSelector(
  [selectSkus, selectProductById],
  (skus, product) => {
    if (skus && product && product.relationships.skus.data && product.relationships.skus.data.length) {
      return product.relationships.skus.data.map((skuRef) => skus[skuRef.id])
    }
    return null
  },
)





const selectStoreCart = (state) => state.storeCart





export {
  selectOrders,
  selectOrdersMeta,
  selectProducts,
  selectProductById,
  selectProductsMeta,
  selectSkus,
  selectSkusByProductId,
  selectStoreCart,
}
