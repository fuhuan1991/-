/**
 * Created by fuhuan on 2017/12/25.
 */

import { shallow } from 'vue-test-utils'
import "babel-polyfill"
import 'whatwg-fetch'
// import { createRenderer } from 'vue-server-renderer'

import ChangeAddress from '../src/components/ChangeAddress.vue'

// 模拟全剧变量
window.GLOBAL_DATA = {
  basicInformation: {
    address: 'address',
    listNumber: 'listNumber',
    deviceType: 'deviceType',
    SN: 'SN'
  },
  lng: 'lng',
  lat: 'lat'
};

describe('ChangeAddress.vue', () => {
    test('initial render', () => {
        const wrapper = shallow(ChangeAddress, {});
        expect(wrapper.vm.address).toBe('address');
        expect(wrapper.vm.lng).toBe('lng');
        expect(wrapper.vm.lat).toBe('lat');

    })
});
