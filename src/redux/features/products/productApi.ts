import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    getSingleProduct: builder.query({
      query: (id) => {
        return {
          url: `/products/${id}`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, updatedProduct }) => ({
          url: `/products/${id}`,
          method: "PUT",
          body: updatedProduct,
      }),
      invalidatesTags: ["products"],
    }),
    // addOrderInfo: builder.mutation({
    //   query: (orderInfo) => {
    //     return {
    //       url: "/order",
    //       method: "POST",
    //       body: orderInfo,
    //     };
    //   },
    //   invalidatesTags: ["products"],
    // }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  // useAddOrderInfoMutation
} = productApi;
