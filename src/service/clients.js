import request from './config'
const clients = {
    get_clients: (params) => request.get('/client/all', {params}),
    // post_order: (data) => request.post('/order', data),
    // delete_order: (id) => request.delete(`/order?id=${id}`),
    // update_oder: (data) => request.put("/order", data),
}

export default clients;