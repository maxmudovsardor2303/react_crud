import { create } from "zustand";
import { clients } from "../service";

const useClientsStore = create((set) => ({
  client: [],
  isLoading: false,
  totalCount: 1,
  getClient: async (params) => {
    try {
      set({ isLoading: true });
      const response = await clients.get_clients(params);
      console.log(response);
      if (response.status === 200) {
        set({
          totalCount: Math.ceil(response.data.total / params.limit),
          client: response?.data?.clients_list,
        })
      }
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }
//   postOrder: async (data) => {
//     try {
//       const response = await orders.post_order(data);
//       if (response.status === 201) {
//         set((state) => ({
//           data:
//             state?.data?.length < 10
//               ? [...state.data, response.data]
//               : [...state.data],
//         }));
//       }
//       return response.status;      
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   deleteOrder: async (id) => {
//     try {
//       const response = await orders.delete_order(id);
//       if (response.status === 200) {
//         set((state) => ({
//           data: state.data.filter((item) => item.id!== id),
//         }));
//       }
//       return response;
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   updateOrder: async (data) => {
//     try {
//       const response = await orders.update_oder(data);
//       if (response.status === 200) {
//         set((state) => {
//             const updatedData = state.data.map((item) =>
//               item.id === data.id? {...item,...data } : item
//             );
//             return { data: updatedData };
//           });
//         return response.status;
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
}));
export default useClientsStore;
