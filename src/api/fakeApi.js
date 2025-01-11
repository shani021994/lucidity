import { apiSlice } from '../store/apiSlices';



//  https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory

const mockApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query({
      query: () => ({
        url: 'inventory',
        method: "GET"
      })
    }),
  }),

})

export const { useGetRecordsQuery } = mockApi;
