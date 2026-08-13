import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) =>( {
    addOrderInfo: builder.mutation({
      query: (orderInfo) => {
        return{
          url: '/order',
          method: 'POST',
          body: orderInfo,
        }},
        invalidatesTags: ['order'],
      }
    ),
    getAllOrder: builder.query({
      query: () => ({
          url: '/order',
          method: 'GET',
        }),
        providesTags: ['order']
      },
    ),
    getAllCustomerOrder: builder.query({
      query: () => ({
          url: '/order/customer',
          method: 'GET',
        }),
        providesTags: ['order']
      },
    ),
    getSingleOrder: builder.query({
      query: (id) => {
        return {
          url: `/order/${id}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),

    updateOrder: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `/order/${orderId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),
  })
})

export const { 
  useAddOrderInfoMutation, 
  useGetAllOrderQuery, 
  useGetAllCustomerOrderQuery,
  useGetSingleOrderQuery, 
  useUpdateOrderMutation,
  useDeleteOrderMutation
} = orderApi; 