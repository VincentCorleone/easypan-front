import axios from 'axios'

const instance = axios.create({
    baseURL: '/api',
    timeout: 30 * 1000
})


export default instance