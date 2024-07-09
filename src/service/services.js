import http from './config'
const services = {
    get_services: (params) => http.get('/service/all', {params: {page: 1, limit: 5}}),
    post_services: (payload) => http.post('/service', payload),
    delete_service: (id) => http.delete(`/service?id=${id}`),
    update_service: (data) => http.put("/service", data),
}
export default services;