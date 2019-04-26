require("es6-promise").polyfill();
import axios from "axios";
import { Toast } from 'mint-ui';
import { MessageBox } from "mint-ui";
import { Indicator } from "mint-ui";
var _this = this;
export const Axios = axios.create({
  baseURL:  'http://dev.byn-kj.com/mobile/',//测试
  // BASEURL: window.location.host + "/",//生产
  // baseURL: "/api/", //开发
  // timeout: 10000
});

//POST传参序列化(添加请求拦截器)
// 在发送请求之前做某件事
Axios.interceptors.request.use(
  config => {
    // 设置以 form 表单的形式提交参数，如果以 JSON 的形式提交表单，可忽略

    if (config.method === "post") {
      config.headers = {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded"
      };

      // JSON 转换为 FormData
      // const formData = new FormData();
      // Object.keys(config.data).forEach(key =>
      //   formData.append(key, config.data[key])
      // );
      // config.data = formData;

    } else {
      config.headers = {
        "Content-Type": "application/json;charset=UTF-8"
      };
    }

    if (localStorage.getItem("TOKEN")) {
      config.headers.Authorization = localStorage.getItem("TOKEN");
    }
    return config;
  },
  error => {
    alert("错误的传参", "fail");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    if (res.status == 200) {
      return res;
    }
  },
  error => {
    // alert(error.response.status)
    if (error.response.data) {
      console.log('error.response.data:', error.response.data)
      // alert(error.response.data)
    }
    if (error.response.status === 401 || error.response.status === 403) {

      Toast({
        message: error.response.data,
        position: 'bottom',
        duration: 5000
      });

    } else if (error.response.status === 400) {
      // error.response.data+',<a href="tel:027-83598166">联系客服</a>'
      MessageBox.alert(error.response.data).then(action => {
        // window.location.href = "tel:027-83598166";
        Indicator.close();
      });
    } else if (error.response.status === 500) {
      Toast({
        message: error.response.data,
        position: 'bottom',
        duration: 5000
      });
    } else {
      Toast({
        message: error.response.data,
        position: 'bottom',
        duration: 5000
      });
      return error;
    }
  }
);

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  }
};
