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
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    // withCredentials: true
})
instance.interceptors.request.use(function (config) {
    config.headers['username'] = encodeURI(localStorage.getItem("username"))
    config.headers['token'] = localStorage.getItem("token")
    config.headers['companyid'] = localStorage.getItem("company_id")
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
const studentInstance = axios.create({
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
})
const companyId = axios.create({
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
})
studentInstance.interceptors.request.use(function (config) {
    // config.headers['username'] = localStorage.getItem("username")
    config.headers['token'] = localStorage.getItem("token")
    config.headers['studentid'] = localStorage.getItem("student_id")
    NProgress.start()
    return config
}, function (error) {
    return Promise.reject(error);
});
studentInstance.interceptors.response.use(response => {
    if (response.data.code === '404') {
        window.location.replace("http://jiaoxue.yanuojiaoyu.com/#/studentLogin");
    } else {
        NProgress.done()
        return response.data
    }
}, err => {
    message.warning('系统繁忙请稍后重试')
    return Promise.reject(err);
});
companyId.interceptors.request.use(function (config) {
    config.headers['username'] = encodeURI(localStorage.getItem("username"))
    config.headers['token'] = localStorage.getItem("token")
    config.headers['companyid'] = localStorage.getItem("company_id")
    NProgress.start()
    return config
}, function (error) {
    return Promise.reject(error);
});
companyId.interceptors.response.use(response => {
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
const downLoad = axios
export { instance, loginPost, downLoad, studentInstance, companyId } 