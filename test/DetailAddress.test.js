/**
 * Created by fuhuan on 2017/12/25.
 */
import { shallow } from 'vue-test-utils'
import "babel-polyfill"
import 'whatwg-fetch'
// import { createRenderer } from 'vue-server-renderer'

import DetailAddress from '../src/components/DetailAddress.vue'

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



describe('DetailAddress.vue', () => {
    test('initial render', () => {
        const wrapper = shallow(DetailAddress, {});
        expect(wrapper.vm.map).toBe('address');


    })
});
