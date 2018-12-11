<template>
    <div class="serviceList">
        <div class="infoContainer">
            <div class="textUnit">
                <span class="title">服务单号:</span>
                <span class="text">{{basicInformation.listNumber}}</span>
            </div>
            <div class="textUnit">
                <span class="title">设备型号:</span>
                <span class="text">{{basicInformation.deviceType}}</span>
            </div>
            <div class="textUnit">
                <span class="title">主机编号:</span>
                <span class="text">{{basicInformation.SN}}</span>
            </div>
            <div class="textUnit pos">
                <span class="title">服务地点:</span>
                <p>{{basicInformation.address}}</p>
            </div>
            <div class="changeAddress" @click="toChangeAddress">
                地址有误，点击修改
            </div>
        </div>
        <div class="processContainer">
            <div class="processUnit" v-show="process_6.show">
                <div class="title">
                    <img src="../assets/p1.png"/>
                    <span class="text1">已点评</span>
                    <span class="text2">{{process_6.date}} {{process_6.time}}</span>
                </div>
                <div class="context comment">
                    <div class="stars">
                        <span>评价星级 : </span>
                        <div v-for="(check, index) in stars">
                            <div class="iconfont star activited" v-if="index < score">&#xe800;</div>
                            <div class="iconfont star" v-else>&#xe800;</div>
                        </div>
                    </div>
                    <div class="text">评论 : 很好，很有责任心的工程师哦，非常喜欢。赞一个，棒棒哒</div>
                    <div class="detail">点评详情</div>
                </div>
            </div>
            <div class="processUnit" v-show="process_5.show">
                <div class="title">
                    <img src="../assets/p2.png"/>
                    <span class="text1">服务完成</span>
                    <span class="text2">{{process_5.date}} {{process_5.time}}</span>
                </div>
                <div class="context"></div>
            </div>
            <div class="processUnit" v-show="process_4.show">
                <div class="title">
                    <img src="../assets/p3.png"/>
                    <span class="text1">开始服务</span>
                    <span class="text2">{{process_4.date}} {{process_4.time}}</span>
                </div>
                <div class="context"></div>
            </div>
            <div class="processUnit" v-show="process_3.show">
                <div class="title">
                    <img src="../assets/p4.png"/>
                    <span class="text1">工程师出发</span>
                    <span class="text2">{{process_3.date}} {{process_3.time}}</span>
                </div>
                <div class="context"></div>
            </div>
            <div class="processUnit" v-show="process_2.show">
                <div class="title">
                    <img src="../assets/p5.png"/>
                    <span class="text1">{{process_2.text}}</span>
                    <span class="text2">{{process_2.date}} {{process_2.time}}</span>
                </div>
                <div class="context"></div>
            </div>
            <div class="processUnit" v-show="process_1.show">
                <div class="title">
                    <img src="../assets/p6.png"/>
                    <span class="text1">报修成功</span>
                    <span class="text2">{{process_1.date}} {{process_1.time}}</span>
                </div>
                <div class="context" style="border: none;">
                    <div class="last">服务网点 : {{process_1.StationName}}</div>
                    <div class="last">联系电话 : {{process_1.StationTell}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                stars: [0,0,0,0,0],
                score: 2,
                basicInformation:{
                    address: '',
                    listNumber: '',
                    deviceType: '',
                    SN: ''
                },
                process_1: {
                    show: false,
                    StationName: '',
                    StationTell: '',
                    date: '',
                    time: ''
                },
                process_2: {
                    show: false,
                    date: '',
                    time: '',
                    text: ''
                },
                process_3: {
                    show: false,
                    date: '',
                    time: ''
                },
                process_4: {
                    show: false,
                    date: '',
                    time: ''
                },
                process_5: {
                    show: false,
                    date: '',
                    time: ''
                },
                process_6: {
                    show: false,
                    date: '',
                    time: '',
                    score: 0,
                    appraise: ''
                }
            }
        },
        props: [],
        methods: {
            toChangeAddress: function () {
                this.$router.push({ path: '/ChangeAddress' });
            }
        },
        watch: {},
        created: function () {},
        mounted(){
            //请求地址的初始值
            //请求上门服务信息
            fetch('x.json').then(
                (response)=>{
//                    console.log(response);
                    if (response.status==200 && response.ok) {
                        return response.json();
                    }
                    else {
                      console.log('获取数据失败');
                    }
                },
                (e)=>{
                  console.log('获取数据失败（网络问题）');
                  alert('获取数据失败（网络问题）');
                  console.log(e);
                },
            ).then(
                (data)=>{
                    this.basicInformation.listNumber = data.listNumber;
                    this.basicInformation.deviceType = data.deviceType;
                    this.basicInformation.SN = data.SN;
                    this.basicInformation.address = data.address;

//                    window.GLOBAL_DATA.basicInformation.listNumber = data.listNumber;
//                    window.GLOBAL_DATA.basicInformation.deviceType = data.deviceType;
//                    window.GLOBAL_DATA.basicInformation.SN = data.SN;
//                    window.GLOBAL_DATA.basicInformation.address = data.address;

                    console.log('------------------------------');
                    console.log('basicInformation: ');
                    console.log(this.basicInformation);
                }
            );
            //请求服务进程信息
            fetch('x2.json').then(
                (response)=>{
//                    console.log(response);
                    if (response.status==200 && response.ok) {
                        return response.json();
                    }
                    else {
                        console.log('获取数据失败');
                    }
                },
                (e)=>{
                    console.log('error');
                    console.log(e);
                }
            ).then(
                (information)=>{
                      console.log('------------------------------');
                      let processesName = Object.keys(information.data.infoList);
                      for (let i=0; i<=processesName.length-1; i++) {

                          let index = processesName[i];
                          let process = information.data.infoList[index];

                          console.log(index);
                          console.log(information.data.infoList[index]);

                          if (index=='process_1') {
                              this['process_1'].show = true;
                              this.process_1.StationName = process.StationName;
                              this.process_1.StationTell = process.StationTell;
                              let temp =  process.SoStatusTime.split(' ');
                              this.process_1.date = temp[0];
                              this.process_1.time = temp[1];
                          }
                          if (index=='process_15') {
                              this['process_2'].show = true;
                              this.process_2.text = '正在为您分配工程师';
                              let temp =  process.SOCreateTime.split('T');
                              this.process_2.date = temp[0];
                              this.process_2.time = temp[1];
                          }
                          if (index=='process_2') {
                              this['process_2'].show = true;
                              this.process_2.text = '已为您分配工程师';
                              let temp =  process.SoStatusTime.split(' ');
                              this.process_2.date = temp[0];
                              this.process_2.time = temp[1];
                          }
                          if (index=='process_3') {
                              this['process_3'].show = true;
                              let temp =  process.SoStatusTime.split(' ');
                              this.process_3.date = temp[0];
                              this.process_3.time = temp[1];
                          }
                          if (index=='process_4') {
                              this['process_4'].show = true;
                              let temp =  process.SoStatusTime.split(' ');
                              this.process_4.date = temp[0];
                              this.process_4.time = temp[1];
                          }
                          if (index=='process_5') {
                              this['process_5'].show = true;
                              let temp =  process.SoStatusTime.split(' ');
                              this.process_5.date = temp[0];
                              this.process_5.time = temp[1];
                          }
                          if (index=='process_6') {
                              this['process_6'].show = true;
                              let temp =  process.SoStatusTime.split(' ');
                              this.process_6.date = temp[0];
                              this.process_6.time = temp[1];
                          }
                      }
                }
            );
        },
        beforeUpdate(){},
        updated(){}
    }
</script>
<style scoped>
    .serviceList{
        background-color: #f4f4f4;
    }
    .infoContainer{
        position: relative;
        padding: 28px;
        background-color: white;
    }
    .infoContainer .textUnit{
        position: relative;
        width: 100%;
        font-size: 28px;
        line-height: 28px;
        margin-bottom: 28px;
    }
    .infoContainer .textUnit span{
        line-height: 28px;
    }
    .textUnit .title{
        color: #999999;
    }
    .textUnit .text{
        margin-left: 25px;
        color: #333333;
    }
    .textUnit.pos{
        margin-bottom: 64px;
    }
    .textUnit.pos .title{
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .textUnit p{
        margin: 0px 0px 0px 152px;
        color: #333333;
    }
    .changeAddress {

        position: absolute;
        right: 28px;
        bottom: 28px;
        color: #5ea3ff;
        text-decoration-line: underline;
        font-size: 28px;
    }
    .processContainer{
        margin-top: 20px;
        background-color: white;
        padding: 28px 0px;
    }
    .processUnit{
        height: auto;

    }
    .processUnit .title{
        height: 60px;
        display: flex;
        flex-direction: row;
    }
    .processUnit .title img{
        height: 60px;
        width: 60px;
        margin-left: 36px;
    }
    .processUnit .title .text1{
        font-size: 28px;
        line-height: 60px;
        margin-left: 20px;

    }
    .processUnit .title .text2{
        font-size: 28px;
        line-height: 60px;
        margin-left: auto;
        margin-right: 24px;
        color: #999999;
    }
    .processUnit .context{
        min-height: 40px;
        color: #666666;
        margin: 10px 28px 10px 64px;
        border-left: 2px solid #e63935;/*no*/
        font-size: 28px;
        padding-bottom: 90px;
        position: relative;
        padding: 0px 0px 0px 52px;
    }
    .processUnit .context.comment{
        padding: 0px 0px 90px 50px;
    }
    .processUnit .context .text{
        margin: 28px 0px 0px 0px;
    }
    .processUnit .context .detail{
        border: 1px solid #e63935;/*no*/
        position: absolute;
        bottom: 28px;
        right: 0px;
        width: 140px;
        height: 40px;
        text-align: center;
        border-radius: 18px;
        font-size: 24px;
        line-height: 40px;
        color: #e63935;
    }
    .stars{
        display: flex;
        height: 28px;
    }
    .stars span{
        line-height: 28px;
        margin-right: 20px;
    }
    .stars .star{
        height: 28px;
        width: 28px;
        margin: 0px 10px 0px 0px;
        color: #cccccc;
        display: block;
        font-size: 28px;
    }
    .stars .star.activited{
        color: #e33a35;
    }
    .processUnit .last{
        font-size: 28px;
        margin-bottom: 28px;
        color: #666666;
    }

</style>

