import axios from 'axios'
import config from './config.js'

const instance = axios.create({
    baseURL: config.baseUrl,
    timeout: 30 * 1000
})


export default instance