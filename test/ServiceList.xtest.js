import { shallow } from 'vue-test-utils'
import "babel-polyfill"
import 'whatwg-fetch'
// import { createRenderer } from 'vue-server-renderer'

import ServiceList from '../src/components/ServiceList.vue'

// 模拟全剧变量
window.GLOBAL_DATA = {
  basicInformation: {
    address: '',
    listNumber: '',
    deviceType: '',
    SN: ''
  }

};


// describe('ServiceList.vue', () => {
  // test('initial render', () => {
  //
  //   const wrapper = shallow(ServiceList, {});
  //   console.log('---------------------------------------------');
  //   console.log('wrapper.vm.basicInformation.address');
  //   console.log(wrapper.vm.basicInformation.address);
  //   expect(wrapper.vm).toHaveLength(1);
  // })
// });


