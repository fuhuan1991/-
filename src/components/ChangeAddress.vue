<template>
    <div class="changeAddress">
        <div class="inputUnit">
            <div class="inputTitle">详细地址</div>
            <div class="positionIcon1"></div>
            <div class="addressText" id="addressText" @click="toDetail" v-bind:class="modified">{{address}}</div>
        </div>
        <div class="inputUnit">
            <div class="inputTitle">门牌号</div>
            <input placeholder="请对上述点选地址进行补充描述" v-model="additionalAddress"/>
        </div>
        <div class="saveButton" @click="saveAddress">保存</div>
        <div class="returnButton" @click="returnToList">返回服务单</div>
    </div>

</template>

<script>
    export default {
        data () {
            return {
                address: '点击此处选择地址',
                additionalAddress: '',
                lng: '',
                lat: '',
                modified: ''
            }
        },
        props: [],
        methods: {
            toDetail: function () {
                this.$router.push({ path: '/DetailAddress' });
            },
            saveAddress: function () {
                // 验证
                if (window.GLOBAL_DATA.basicInformation.address) {
                    let data = {
                        address: this.address,
                        additionalAddress: this.additionalAddress,
                        baidu_y: this.lng,
                        baidu_x: this.lat,
                        provinceid: this.province,
                        cityid: this.city
                    };
                    console.log('提交地址:');
                    console.log(data);
                }
                else {
                    alert('新地址不能为空');
                }

            },
            returnToList: function () {
                this.$router.push({ path: '/ServiceList' });
            }
        },
        created: function () {},
        mounted: function () {
            if (window.GLOBAL_DATA.basicInformation.address) {
                this.address = window.GLOBAL_DATA.basicInformation.address;
                this.lng = window.GLOBAL_DATA.lng;
                this.lat = window.GLOBAL_DATA.lat;
                this.province = window.GLOBAL_DATA.province;
                this.city = window.GLOBAL_DATA.city;
                this.modified = window.GLOBAL_DATA.modified;
            }
        },
        beforeUpdate(){},
        updated(){}
    }
</script>
<style scoped>
    .changeAddress{
        background-color: #f4f4f4;
    }
    .inputUnit{
        height: 80px;
        width: 100%;
        position: relative;
        border-bottom: 1px solid #f4f4f4;/*no*/
        background-color: white;
        color: #666666;
        font-size: 28px;
    }
    .inputUnit .inputTitle{
        float: left;
        margin-left: 28px;
        width: auto;
        height: 100%;
        line-height: 80px;

    }
    .inputUnit .positionIcon1{
        margin:22px 20px 0px 60px;
        float: left;
        width: 26px;
        height: 35px;
        background: url(../assets/positionIcon1.png);
        background-size: 26px 35px;

    }
    .inputUnit .addressText{
        float: left;
        width: 450px;
        height: 100%;
        line-height: 80px;
        color: #CDCDCD;
    }
    .inputUnit .addressText.modified{
        color: black;
    }
    .inputUnit input{
        margin-left: 85px;
        font-size: 28px;
        float: left;
        width: 450px;
        height: 75px;
        line-height: 80px;
        outline: none;
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        -o-appearance: none;
        appearance: none;
        background-color: transparent;
    }
    input::placeholder{
        color: #CDCDCD;
    }
    .saveButton{
        width: 694px;
        height: 80px;
        margin: 40px 0px 0px 50%;
        transform: translateX(-347px);
        color: #e2231a;
        border: 1px solid #e2231a;/*no*/
        line-height: 80px;
        text-align: center;
        border-radius: 40px;
        font-weight: bold;
        background-color: white;
    }
    .returnButton{
        width: 694px;
        height: 80px;
        margin: 40px 0px 0px 50%;
        transform: translateX(-347px);
        color: #5ea3ff;
        border: 1px solid #5ea3ff;/*no*/
        line-height: 80px;
        text-align: center;
        border-radius: 40px;
        font-weight: bold;
        background-color: white;
    }
</style>
