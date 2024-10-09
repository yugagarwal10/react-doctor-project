import axios from "axios";

function AxiosMiddleware(method, url, data, options) {
    axios.defaults.headers.common['env'] = "test";

    switch (method) {
        case 'get':
            return axios.get(url, data, options);

        case 'post':
            return axios.post(url, data, options);

        case 'patch':
            return axios.patch(url, data, options);

        case 'head':
            return axios.head(url, data, options);

        case 'put':
            return axios.put(url, data, options);

        case 'delete':
            return axios.delete(url, { data: data, headers: options });
        default:
            return "no function found"
    }
}

export function get(url, data = [], options = {}) {
    return AxiosMiddleware('get', url, data, options)
}
export function post(url, data = [], options = {}) {
    return AxiosMiddleware('post', url, data, options)
}
export function patch(url, data = [], options = {}) {
    return AxiosMiddleware('patch', url, data, options)
}
export function Delete(url, data = [], options = {}) {
    return AxiosMiddleware('delete', url, data, options)
}

export default AxiosMiddleware;