import "babel-polyfill";
import 'whatwg-fetch'
import FastClick from 'fastclick'
import Vue from 'vue'
import VueRouter from 'vue-router'
// import {router} from './router/index.js'
import ChangeAddress from 'COMPONENTS/ChangeAddress.vue'
import DetailAddress from 'COMPONENTS/DetailAddress.vue'
import ServiceList from 'COMPONENTS/ServiceList.vue'

window.GLOBAL_DATA = {
  basicInformation: {
    address: '',
    listNumber: '',
    deviceType: '',
    SN: ''
  },
  modified: ''

};



// 引入百度地图插件
let timestamps = new Date().getTime();
let akToken = 'Nst4bQMpUwqleHSNeEVG6gIf2NpqCxlp';
let baiduMapSource = 'http://api.map.baidu.com/getscript?v=2.0&ak='+akToken+'&services=&t='+timestamps;
let head = document.getElementsByTagName('head')[0];
let script = document.createElement('script');
script.type= 'text/javascript';
script.src= baiduMapSource;
head.appendChild(script);



// 创建一个promise，在百度地图装载完毕后执行地图的初始化
window.GLOBAL_DATA.mapPromise = new Promise(function(resolve, reject) {
  script.onload = () => {
    window.BMap = BMap;
    console.log('百度地图已加载');
    resolve(BMap);
  };
  script.onerror = (e) => {
    console.log('百度地图加载失败');
    reject(e);
  }
});



// 设置路由
Vue.use(VueRouter);
const routes = [
  {
    path: '/ChangeAddress',
    component: ChangeAddress,
    name: 'ChangeAddress'
  },
  {
    path: '/DetailAddress',
    component: DetailAddress,
    name: 'DetailAddress'
  },
  {
    path: '/ServiceList',
    component: ServiceList,
    name: 'ServiceList'
  },
  {
    path: '/',
    component: ServiceList,
    name: 'ServiceList'
  }
];

var router = new VueRouter({
  linkActiveClass: 'active',
  routes: routes
});



//
Vue.use(/*vueScrollBehavior,*/ { router: router });

new Vue({
    router: router,
    template: '<router-view></router-view>',
    data: {
        basicInformation: {}
    },
    mounted: function () {}
}).$mount('#app');



// 引入fastclick，解决300ms延迟
FastClick.attach(document.body);




