<template>
    <div class="DetailAddress">
        <div class="inputUnit">
            <div class="inputTitle" @click="changeCity">
                <div class="title">{{city}}</div>
                <div class="icon iconfont" v-bind:class="iconDirection">&#xe801;</div>
            </div>
            <input ref="searchInput" placeholder="请输入关键字" @input="inputHandler" @blur="blurHandler"  v-model="searchValue"/>
            <div ref="inputConfirm" class="inputConfirm" 
                 @click="inputConfirm" >搜索</div>
        </div>
        <div class="mapContainer" id="mapContainer"></div>
        <!--<div class="centerMarker"></div>-->
        <div class="currentPositionUnit">
            <div class="positionIcon1"></div>
            <span class="currentPositionText1">[当前位置] {{pos.street}}{{pos.street_number}}</span>
            <div>
                <div class="currentPositionText2">{{pos.city}}{{pos.district}}</div>
            </div>
        </div>
        <div class="proximitSiteContainer">
            <div v-for="item in proximitSite" @click="pickProximitSite(item)">
                <p class="text1">{{ item.title }}</p>
                <p class="text2">{{ item.address }}</p>
            </div>
        </div>

        <div class="inputSearchResultContainer" ref="inputSearchResultContainer" v-show="showInputSearchResult">
            <div v-for="item in inputSearchResult" v-bind:title="item.realText" @click="pickInputSearchResult(item.realText)">
                <p class="text1" v-html="item.title"></p>
                <p class="text2">{{ item.address }}</p>
            </div>
            <div v-show="noResult" class="noResult" @click="changeCity">没找到？点我切换城市。</div>
        </div>
        <div v-if="test" class="test">
            <p>keys:{{keys}}</p>
            <p>city:{{city}}</p>
            <p>userCity:{{userCity}}</p>
            <p>searchValue:{{searchValue}}</p>
            <p>showInputSearchResult:{{showInputSearchResult}}</p>
            <p>selectingCity:{{selectingCity}}</p>
        </div>

        <div class="cityListBox"  ref="cityListBox" v-show="selectingCity">
            <div class="cityListLong">
                <dl ref="key" class="city-list" v-for="(item,key,i) in cityList.dist" >
                    <dt>{{key}}</dt>
                    <dd v-for="city in item" @click="pickCity(city)">
                        <div>{{city}}</div>
                    </dd>
                </dl>
            </div>
            <div class="num-list">
                <!--<span v-for="(item,key,i) in citylist.dist"  @click="goCity(key)">{{key}}</span>-->
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        data () {
            return {
                test: false,
                proximitSite: [], // 临近POI的查询结果储存在这里
                inputSearchResult: [],//  模糊查询结果存放在这里
                showInputSearchResult: false,// 模糊查询面板的显示信号
                selectingCity: false,// 城市选择面板的显示信号
                pos: { // 当前位置信息
                    city:'',
                    district:'',
                    province:'',
                    street:'',
                    street_number:''
                },
                keys: '大厦', // POI查询字段
                city: '', // 用户选定的城市，初始值为用户当前位置所处的城市（userCity），可以通过城市选择面板更改
                userCity:'',// 用户当前位置所处的城市
                searchValue: '大厦', // 用户输入的查询字段，在确定之后，次字段将转化为POI查询字段（keys）
                cityList: {
                    dist : {"B":["北京市","保定市"],"C":["成都市","长春市","长沙市","赤峰市","重庆市"],"D":["大连市"],"F":["福州市"],"G":["广州市","贵阳市"],"H":["杭州市","哈尔滨市","合肥市","呼和浩特市","海口市"],"J":["济南市"],"K":["昆明市"],"L":["兰州市","拉萨市"],"N":["南宁市","南京市","南昌市"],"Q":["青岛市"],"S":["上海市","深圳市","沈阳市","石家庄市"],"T":["太原市","唐山市","天津市"],"W":["武汉市","乌鲁木齐市"],"X":["西安市","西宁市"],"Y":["运城市","银川市"],"Z":["郑州市","株洲市"]},
                    distTop:{}
                },
                noResult: false
            }
        },
        props: [],
        computed: {
            iconDirection: function () {
                return this.selectingCity? 'pointDown' : 'pointRight';
            }
        },
        watch: {},
        methods: {
            // 百度地图初始化
            BMapInit: function (r) {
                console.log('当前位置:');
                console.log(r);
                this.pos.city = r.address.city;
                this.userCity = r.address.city;
                this.city = r.address.city;
                this.pos.district = r.address.district;
                this.pos.street = r.address.street;
                this.pos.street_number = r.address.street_number;
                let point = new BMap.Point(r.longitude, r.latitude);
                this.map.centerAndZoom(point, 15);
                let c = new BMap.Circle(point, 20, {enableMassClear: false});
                this.map.addOverlay(c);
                this.mapSearch();
            },
            // 拖动地图后触发的周边地区搜索
            mapSearch: function () {
//                console.log('mapSearch');
                try{
                    let center = this.map.getCenter();
//                  console.log("地图中心点变更为："+center.lng + ", " + center.lat);
                    let x = new BMap.LocalSearch(this.map, {
                        pageCapacity: 10,
                        renderOptions:{
                            map: this.map,
                            autoViewport: false,
                            selectFirstResult: false
                        },
                        onSearchComplete: this.proximitSearchComplete
                    });
                    this.map.clearOverlays();// 清空地图上的marker
                    x.searchInBounds(this.keys, this.map.getBounds(),{forceLocal: true});
                }
                catch (e){
                    console.log(e);
                }
            },
            // 输入关键字后触发的周边地区搜索
            mapSearch_S: function () {
                console.log('mapSearch_S');
                console.log('--key: ' + this.keys);
                try{
                    let x = new BMap.LocalSearch(this.map, {
                        pageCapacity: 10,
                        renderOptions:{
                            map: this.map,
                            autoViewport: true,
                            selectFirstResult: false
                        },
                        onSearchComplete: this.proximitSearchComplete
                    });
                    this.map.clearOverlays();// 清空地图上的marker
                    x.search(this.keys, {
                        forceLocal: true
                    });
                }
                catch (e){
                    console.log(e);
                }
            },
            // 周边搜索完成后，整理并呈现搜索结果数据
            proximitSearchComplete: function (LocalResult) {
                try{
                    if (LocalResult) {
//                      console.log('proximitSearchComplete');
                        this.proximitSite = [];// 清空周边POI列表
                        let totalAmount = LocalResult.getNumPois();
                        let n = totalAmount>10? 10 : totalAmount;

                        for (let i = 0; i<n; i++) {
                            let result = LocalResult.getPoi(i);
                            let item = {};
                            item.title = result.title;
                            item.address = result.address;
                            item.lat = result.point.lat;  //纬度
                            item.lng = result.point.lng;  //经度
                            item.province = result.province;  //省
                            item.city = result.city;  //城市
                            this.proximitSite.push(item);
//                          console.log(result);
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            },
            // 搜索输入框input事件
            inputHandler: function (e) {
                console.log('inputHandler');
                let newValue = this.searchValue;
                this.selectingCity = false; //close city selection panel
                if(newValue){
                    let x = new BMap.LocalSearch(this.city, {
                        pageCapacity: 10,
                        onSearchComplete: this.inputSearchComplete
                    });
                    x.search(newValue, {forceLocal: false});
                    this.showInputSearchResult = true;
                }
                else {
                    this.showInputSearchResult = false;
                }
            },
            // 输入框搜索完成后，整理并呈现搜索结果数据
            inputSearchComplete: function (LocalResult) {
                console.log('inputSearchComplete');
                console.log(LocalResult);
                let keyword = LocalResult.keyword;
                this.inputSearchResult = [];
                this.map.clearOverlays();
                let totalAmount = LocalResult.getNumPois();

                if (totalAmount==0) {
                    // 没有搜索结果
                    this.noResult = true;
                }else{
                    // 有搜索结果
                    this.noResult = false;
                    let totalAmount = LocalResult.getNumPois();
                    let n = totalAmount>10? 10 : totalAmount;
                    for (let i = 0; i<n; i++) {
                        //加入搜索红字效果
                        let result = LocalResult.getPoi(i);
                        let item = {};
                        item.realText = result.title;
                        try {
                            let reg = new RegExp(keyword, 'gi');
                            item.title = result.title.replace(reg, '<span class="redText">'+keyword+'</span>');
                        }
                        catch (e) {
                            item.title = result.title;
                        }
                        item.address = result.address;
                        this.inputSearchResult.push(item);
                    }
                }
            },
            // 点击某一个搜索查询结果，其内容将会被放进搜索框，并且设为区域搜索关键字(keys)
            pickInputSearchResult: function (title) {
                try{
                    console.log('pickInputSearchResult');
                    this.searchValue = title;
                    this.keys = this.searchValue;
//                    this.$refs.searchInput.blur();
                  this.keys = this.searchValue;
                  this.mapSearch_S();
                }
                catch (e) {
                    console.log(e);
                }
            },
            // 输入确认按钮按下时触发的方法
            inputConfirm: function (e) {
                console.log('inputConfirm');
                this.showInputSearchResult = false; //关闭模糊输入的选项面板
//                this.$refs.searchInput.blur();
                this.keys = this.searchValue;
                this.mapSearch_S();
            },
            // 搜索输入框的失焦时触发的方法
            blurHandler: function (e) {
                console.log('blurHandler');
                this.showInputSearchResult = false;
//                this.keys = this.searchValue;
//                this.mapSearch_S();
            },
            // 更换城市按钮按下时所触发的方法
            changeCity: function (e) {
                console.log('changeCity');
                this.selectingCity = !this.selectingCity;
            },
            // 选择某一个城市时所触发的方法
            pickCity: function (city) {
                console.log('pickCity');
                console.log('select: ' + city);
                this.changeCity();
                this.city = city;
                this.map.setCenter(city);
                this.map.setZoom(11);
                this.map.addEventListener('moveend', this.toAnotherCity);
            },
            // 转换城市之后触发
            toAnotherCity: function () {
                this.map.removeEventListener('moveend', this.toAnotherCity);
                this.mapSearch();
            },
            // 选择一个临近的位置,并跳转回之前的页面
            pickProximitSite: function (item) {
//                console.log(item);
                window.GLOBAL_DATA.basicInformation.address = item.title;
                window.GLOBAL_DATA.lng = item.lng;
                window.GLOBAL_DATA.lat = item.lat;
                window.GLOBAL_DATA.province = item.province;
                window.GLOBAL_DATA.city = item.city;
                window.GLOBAL_DATA.modified = 'modified';
                this.$router.push({ path: '/ChangeAddress' });
            }
        },
//      beforeRouteEnter (to, from, next) {},
        created: function () {},
        mounted(){
            GLOBAL_DATA.mapPromise.then(
                (BMap)=>{
                    var map = new BMap.Map("mapContainer");
                    this.map = map;
                    this.map.addControl(new BMap.NavigationControl());
                    this.map.addControl(new BMap.GeolocationControl());
                    let point = new BMap.Point(116.404, 39.915);
                    this.map.centerAndZoom(point, 15);
                    var geolocation = new BMap.Geolocation().getCurrentPosition(this.BMapInit, {enableHighAccuracy:true});
                    map.addEventListener("dragend", this.mapSearch);
                    map.addEventListener("zoomend", this.mapSearch);
                },function(e){
                    alert('地图加载失败');
                    console.log(e);
                }
            );
        },
        beforeUpdate(){},
        updated(){}
    }
</script>
<style scoped>
    .hidden{
        display: none;
    }
    .show{
        display: block;
    }
    .DetailAddress{
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .inputUnit{
        flex-basis: 80px;
        flex-shrink: 0;
        flex-grow: 0;
        height: 80px;
        width: 100%;
        position: relative;
        background-color: white;
        color: #666666;
        font-size: 28px;
        display: flex;
        flex-direction: row;
    }

    .inputUnit .inputTitle{
        /*width: 176px;*/
        line-height: 80px;
        color: #5da4fc;
        display: flex;
        font-size: 28px;
    }
    .inputUnit .inputTitle .title{
        margin: 0px 5px 0px 28px;
        line-height: 80px;
    }
    .inputUnit .inputTitle .icon{
        font-size: 28px;
        width: 20px;
        line-height: 80px;
        transition: 0.5s;
        margin: 0px 0px;
        display: block;
    }
    .inputUnit .inputTitle .icon.pointRight{
        transform: rotate(0deg);
    }
    .inputUnit .inputTitle .icon.pointDown{
        transform: rotate(90deg);
    }
    .inputUnit input{
        /*float: left;*/
        /*height: 75px;*/
        margin-left: 20px;
        line-height: 80px;
        outline: none;
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        -o-appearance: none;
        appearance: none;
        background-color: transparent;
        flex: auto;
    }
    input::placeholder{
        color: #CDCDCD;
    }
    .inputConfirm{
        /*float: right;*/
        width: 110px;
        line-height: 80px;
        text-align: center;
        background-color: white;
        color: #5ea3ff;
    }
    .mapContainer{
        flex-basis: 400px;
        flex-shrink: 0;
        flex-grow: 0;
        height: 400px;
        background-color: #CDCDCD;
        position: relative;
    }
    .currentPositionUnit{
        flex-shrink: 0;
        flex-grow: 0;
        min-height: 100px;
        position: relative;
        background-color: white;
        padding: 16px 28px;
    }
    .currentPositionUnit .positionIcon1{
        margin: 0px 10px 0px 0px;
        float: left;
        width: 26px;
        height: 35px;
        background: url(../assets/positionIcon1.png);
        background-size: 26px 35px;
    }
    .currentPositionUnit .currentPositionText1{
        color: #333333;
        font-size: 28px;
        font-weight: bold;
        line-height: 35px;
    }
    .positionIcon1:after{
        clear: both;
    }
    .currentPositionUnit .currentPositionText2{
        margin-top: 1px;/*no*/
        width: 100%;
        color: #999999;
        font-size: 20px;
    }
    .proximitSiteContainer{
        height: auto;
        flex-shrink: 1;
        flex-grow: 1;
        padding: 0px 28px;
        background-color: white;
        overflow: auto;
    }
    .proximitSiteContainer div{
        height: auto;
        min-height: 100px;
        background-color: white;
        padding: 14px 0px;
        border-top: 1px solid #CDCDCD;/*no*/
    }
    .proximitSiteContainer p{
        margin: 0px;
    }
    .proximitSiteContainer .text1{
        color: #333333;
        font-size: 28px;
    }
    .proximitSiteContainer .text2{
        color: #999999;
        font-size: 20px;
    }
    .inputSearchResultContainer{
        width: 100%;
        height: 100%;
        padding: 0px 28px;
        position: absolute;
        top:80px;
        background-color: white;

    }
    .inputSearchResultContainer div{
        height: auto;
        min-height: 100px;
        background-color: white;
        padding: 10px 0px 0px;
        border-top: 1px solid #dcdcdc;/*no*/
    }
    .inputSearchResultContainer .text1{
        color: #333333;
        font-size: 28px;
        margin: 0px;
    }
    .inputSearchResultContainer .text2{
        color: #999999;
        font-size: 16px;
        margin: 0px;
    }
    .test{
        position: absolute;
        top: 100px;
        right: 20px;
        background-color: #3CC51F;
        z-index: 9999;
    }
    .test p{
        margin: 0px;
    }

    .cityListBox{
        text-align: left;
        top: 80px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding: 0px 28px;
        position: absolute;
        background-color: white;
    }
    .cityListBox .cityListLong{
         height: auto;
    }
    .cityListBox .cityListLong dl{
        margin: 0px 0px 0px 0px;
    }
    .cityListBox .cityListLong dt{
        height: 44px;
        line-height: 44px;
        font-size: 28px;
        background: #f6f6f6;
        padding-left: 20px;
    }
    .cityListBox .cityListLong dd{
        font-size: 30px;
        padding:0 46px;
        margin: 0px 0px 0px 0px;
    }
    .cityListBox .cityListLong dd div{
        line-height: 88px;
        height: 88px;
        border-bottom: 1px solid #e6e6e6;/*no*/
    }
    .centerMarker{
        width: 50px;
        height: 50px;
        transform: translateX(-25px);
        background-color: #e63935;
        margin: 0px 0px 0px 50%;
        position: absolute;
        top: 255px;
    }
    .noResult{
      color: #5da4fc;
      font-size: 28px;
    }
</style>
