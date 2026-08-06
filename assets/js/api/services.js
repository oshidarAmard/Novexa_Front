/* ============================================================
   NOVEXA ERP — API SERVICES (api/services.js)
   One service object per backend controller, matching the
   supplied OpenAPI spec exactly (paths, casing, verbs).
   Depends on: api/http.js
   Exposes: window.NovexaApi.<Entity>
   ============================================================ */
(function (global) {
  'use strict';
  const http = global.NovexaHttp;

  /**
   * Standard master-data CRUD:
   *   list()            GET    /{base}
   *   getById(id)        GET    /{base}/{id}
   *   create(payload)    POST   /{base}
   *   update(id,payload) PUT    /{base}/{id}
   *   activate(id)       PATCH  /{base}/{id}/activate
   *   deactivate(id)     PATCH  /{base}/{id}/deactivate
   */
  function masterDataApi(base) {
    return {
      list: () => http.get(base),
      getById: (id) => http.get(`${base}/${id}`),
      create: (payload) => http.post(base, payload),
      update: (id, payload) => http.put(`${base}/${id}`, Object.assign({ id }, payload)),
      activate: (id) => http.patch(`${base}/${id}/activate`),
      deactivate: (id) => http.patch(`${base}/${id}/deactivate`)
    };
  }

  const Categories = masterDataApi('/api/Categories');
  const ProductBrands = masterDataApi('/api/ProductBrands');
  const DeviceBrands = masterDataApi('/api/DeviceBrands');
  const DeviceModels = masterDataApi('/api/DeviceModels');
  const Units = masterDataApi('/api/Units');
  const Warehouses = masterDataApi('/api/Warehouses');
  const Shelves = masterDataApi('/api/Shelves');
  const BinLocations = masterDataApi('/api/BinLocations');
  const Suppliers = masterDataApi('/api/Suppliers');
  // NOTE: lowercase path per the spec (unlike the other master-data controllers).
  const Customers = masterDataApi('/api/customers');

  /**
   * Products — supports plain paged listing AND the richer /search endpoint
   * with column filters + sorting, matching SearchProductResponsePaginatedList.
   */
  const Products = {
    list: (page, pageSize) => http.get('/api/Products', { Page: page, PageSize: pageSize }),
    // filters: { Code, Name, CategoryId, ProductBrandId, DeviceBrandId, DeviceModelId,
    //            UnitId, Barcode, IsActive, SortBy, IsDescending, Page, PageSize }
    search: (filters) => http.get('/api/Products/search', filters),
    getById: (id) => http.get(`/api/Products/${id}`),
    create: (payload) => http.post('/api/Products', payload),
    update: (id, payload) => http.put(`/api/Products/${id}`, Object.assign({ id }, payload)),
    activate: (id) => http.patch(`/api/Products/${id}/activate`),
    deactivate: (id) => http.patch(`/api/Products/${id}/deactivate`)
  };

  const ProductBarcodes = {
    create: (payload) => http.post('/api/ProductBarcodes', payload),
    getById: (id) => http.get(`/api/ProductBarcodes/${id}`),
    update: (id, payload) => http.put(`/api/ProductBarcodes/${id}`, Object.assign({ id }, payload)),
    delete: (id) => http.delete(`/api/ProductBarcodes/${id}`),
    byProduct: (productId) => http.get(`/api/ProductBarcodes/product/${productId}`)
  };

  const ProductImages = {
    create: (payload) => http.post('/api/ProductImages', payload), // AddProductImageDto
    list: () => http.get('/api/ProductImages'),
    getById: (id) => http.get(`/api/ProductImages/${id}`),
    update: (id, payload) => http.put(`/api/ProductImages/${id}`, payload),
    delete: (id) => http.delete(`/api/ProductImages/${id}`),
    byProduct: (productId) => http.get(`/api/ProductImages/by-product/${productId}`),
    setMain: (id) => http.put(`/api/ProductImages/${id}/set-main`),
    setSortOrder: (id, sortOrder) => http.put(`/api/ProductImages/${id}/sort-order`, sortOrder)
  };

  const ProductDeviceModels = {
    assign: (productId, deviceModelId) => http.post('/api/ProductDeviceModels/assign', { productId, deviceModelId }),
    remove: (productId, deviceModelId) => http.delete(`/api/ProductDeviceModels/remove?productId=${productId}&deviceModelId=${deviceModelId}`),
    modelsByProduct: (productId) => http.get(`/api/ProductDeviceModels/models-by-product/${productId}`),
    productsByModel: (deviceModelId) => http.get(`/api/ProductDeviceModels/products-by-model/${deviceModelId}`)
  };

  const SupplierContacts = {
    list: (supplierId) => http.get(`/api/suppliers/${supplierId}/contacts`),
    getById: (supplierId, id) => http.get(`/api/suppliers/${supplierId}/contacts/${id}`),
    create: (supplierId, payload) => http.post(`/api/suppliers/${supplierId}/contacts`, payload),
    update: (supplierId, id, payload) => http.put(`/api/suppliers/${supplierId}/contacts/${id}`, Object.assign({ id, supplierId }, payload)),
    delete: (supplierId, id) => http.delete(`/api/suppliers/${supplierId}/contacts/${id}`)
  };

  /** Purchase orders — draft/submit/approve/cancel workflow, no activate/deactivate. */
  const PurchaseOrders = {
    list: () => http.get('/api/purchase-orders'),
    getById: (id) => http.get(`/api/purchase-orders/${id}`),
    create: (payload) => http.post('/api/purchase-orders', payload),
    update: (id, payload) => http.put(`/api/purchase-orders/${id}`, Object.assign({ id }, payload)),
    delete: (id) => http.delete(`/api/purchase-orders/${id}`),
    submit: (id) => http.patch(`/api/purchase-orders/${id}/submit`),
    approve: (id) => http.patch(`/api/purchase-orders/${id}/approve`),
    cancel: (id) => http.patch(`/api/purchase-orders/${id}/cancel`)
  };

  /** Purchase receives — confirm/cancel workflow, no activate/deactivate. */
  const PurchaseReceives = {
    list: () => http.get('/api/purchase-receives'),
    getById: (id) => http.get(`/api/purchase-receives/${id}`),
    create: (payload) => http.post('/api/purchase-receives', payload),
    update: (id, payload) => http.put(`/api/purchase-receives/${id}`, payload),
    delete: (id) => http.delete(`/api/purchase-receives/${id}`),
    confirm: (id) => http.patch(`/api/purchase-receives/${id}/confirm`),
    cancel: (id) => http.patch(`/api/purchase-receives/${id}/cancel`)
  };

  /** Inventory transactions — read + create only (audit trail; no update/delete/activate). */
  const InventoryTransactions = {
    list: () => http.get('/api/InventoryTransactions'),
    getById: (id) => http.get(`/api/InventoryTransactions/${id}`),
    create: (payload) => http.post('/api/InventoryTransactions', payload),
    byProduct: (productId) => http.get(`/api/InventoryTransactions/product/${productId}`),
    byWarehouse: (warehouseId) => http.get(`/api/InventoryTransactions/warehouse/${warehouseId}`),
    byReference: (referenceId) => http.get(`/api/InventoryTransactions/reference/${referenceId}`)
  };

  /**
   * TODO — NOT present in the supplied OpenAPI spec yet.
   * These placeholders keep every page functional (per architecture rules:
   * "when an API does not exist, never break the page, create a typed
   * placeholder and leave a TODO"). Replace the body of each method once
   * the backend controller exists — the calling pages won't need to change.
   */
  function notImplemented(name) {
    return () => Promise.reject({
      isSuccess: false,
      message: `سرویس «${name}» هنوز در بک‌اند پیاده‌سازی نشده است.`,
      errors: [`TODO: backend endpoint for ${name} is missing from the OpenAPI spec.`]
    });
  }
  const SalesInvoices = {
    list: notImplemented('SalesInvoices.list'),
    getById: notImplemented('SalesInvoices.getById'),
    create: notImplemented('SalesInvoices.create'),
    update: notImplemented('SalesInvoices.update')
  };
  const SalesReturns = {
    list: notImplemented('SalesReturns.list'),
    create: notImplemented('SalesReturns.create')
  };
  const PurchaseReturns = {
    list: notImplemented('PurchaseReturns.list'),
    create: notImplemented('PurchaseReturns.create')
  };
  const Payments = {
    list: notImplemented('Payments.list'),
    create: notImplemented('Payments.create')
  };
  const StockTransfers = {
    list: notImplemented('StockTransfers.list'),
    create: notImplemented('StockTransfers.create')
  };

  global.NovexaApi = {
    Categories, ProductBrands, DeviceBrands, DeviceModels, Units, Warehouses,
    Shelves, BinLocations, Suppliers, Customers, Products, ProductBarcodes,
    ProductImages, ProductDeviceModels, SupplierContacts, PurchaseOrders,
    PurchaseReceives, InventoryTransactions,
    // TODO placeholders (backend not implemented yet):
    SalesInvoices, SalesReturns, PurchaseReturns, Payments, StockTransfers
  };
})(window);
