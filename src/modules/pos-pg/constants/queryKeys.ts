export const POS_QUERY_KEYS = {
  sessions: ['pos-sessions'] as const,
  sessionById: (sessionId: string) => [...POS_QUERY_KEYS.sessions, sessionId] as const,

  orders: ['pos-orders'] as const,
  orderById: (orderId: string) => [...POS_QUERY_KEYS.orders, orderId] as const,
  ordersByPoint: (pointId: string) => [...POS_QUERY_KEYS.orders, 'point', pointId] as const,

  payments: ['pos-payments'] as const,
  paymentsByOrder: (orderId: string) => [...POS_QUERY_KEYS.payments, 'order', orderId] as const,
  paymentMethods: ['pos-payment-methods'] as const,

  products: ['pos-products'] as const,
  productsByCategory: (categoryId: string) =>
    [...POS_QUERY_KEYS.products, 'category', categoryId] as const,
  productsSearch: (searchTerm: string) =>
    [...POS_QUERY_KEYS.products, 'search', searchTerm] as const,

  categories: ['pos-categories'] as const,

  partners: ['pos-partners'] as const,
  partnerById: (partnerId: string) => [...POS_QUERY_KEYS.partners, partnerId] as const,
}
