const selectOrders = (state) => state.orders.orders


const selectOrdersMeta = (state) => ({
  hasMore: state.orders.hasMore,
})


const selectProducts = (state) => state.products.products


const selectProductsMeta = (state) => ({
  hasMore: state.products.hasMore,
})


const selectStoreCart = (state) => state.storeCart


const selectSkus = (state) => state.skus





export {
  selectOrders,
  selectOrdersMeta,
  selectProducts,
  selectProductsMeta,
  selectStoreCart,
  selectSkus,
}
