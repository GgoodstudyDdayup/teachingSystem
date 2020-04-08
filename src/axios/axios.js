import axios from 'axios'
import { message } from 'antd';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import store from '../store'
// 线上环境域名
// axios.defaults.baseURL = 'https://jiaoxueapi.yanuojiaoyu.com/'
//开发环境域名
axios.defaults.baseURL = 'https://devjiaoxueapi.yanuojiaoyu.com/'
axios.defaults.transformRequest = [
    function (data) {
        let ret = "";
        for (let it in data) {
            ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
    }
]
const instance = axios.create({
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    // withCredentials: true
})
instance.interceptors.request.use(function (config) {
    config.headers['username'] = sessionStorage.getItem("username")
    config.headers['token'] = sessionStorage.getItem("token")
    config.headers['companyid'] = sessionStorage.getItem("company_id")
    NProgress.start()
    return config
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    if (response.data.code === '404') {
        window.location.replace("http://jiaoxue.yanuojiaoyu.com");
    } else {
        NProgress.done()
        return response.data
    }
}, err => {
    message.warning('系统繁忙请稍后重试')
    return Promise.reject(err);
});

const loginPost = axios
export { instance, loginPost } 