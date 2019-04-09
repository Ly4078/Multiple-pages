<template>
  <div class="replenish_list">
    <div class="reptop">
      <div class="reptitle"><span>补货清单</span></div>
      <div class="repnav">
        <span
          v-for="item in nav"
          :key="item.id"
          :class="actnav == item.id?'actspan':''"
          @click="handnav(item)"
        >{{item.label}}</span>
      </div>
      <div class="repcont">
        <ul :class="actnav=='1'?'actleft':'actright'">
          <li v-for="item in datalist" :key="item.id" @click="handitem(item)">
            <div class="lileft" v-show="actnav==1">
              <div class="llt">房号：{{item.roomNO}}</div>
              <div class="llb">{{item.num}}件商品待补货</div>
            </div>
            <div class="lileft" v-show="actnav==2">
              <div class="llt">{{item.goodsName}}</div>
              <div class="llb">缺{{item.qnum}}件</div>
            </div>
            <div class="liright">
              <img src="../../assets/image/right_icon.png" alt>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "replenish",
  data() {
    return {
      nav: [
        {
          id: 1,
          label: "缺货房间"
        },
        {
          id: 2,
          label: "缺货商品"
        }
      ],
      datalist: [
        {
          id: 1,
          roomNO: 114,
          num: 2,
          goodsName: "印度神油",
          qnum: 1
        },
        {
          id: 2,
          roomNO: 115,
          num: 6,
          goodsName: "情人套装",
          qnum: 1
        },
        {
          id: 3,
          roomNO: 116,
          num: 3,
          goodsName: "杜蕾斯大胆爱",
          qnum: 2
        },
        {
          id: 4,
          roomNO: 117,
          num: 1,
          goodsName: "冈本 3只装",
          qnum: 1
        }
      ],
      actnav: 1,
      msg: "Welcome to Your Vue.js App"
    };
  },

  methods: {
      //获取code
    getcode() {
      let str = window.location.href; //取得整个地址栏
      let num = str.indexOf("?");
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
      let arr = str.split("&"); //各个参数放到数组里
      let arr2 = arr[0].split("=");
      this.getreplenish(arr2[1]);
    },/*  */
    //查询数据
    getreplenish(code){
      console.log('code:',code)
      let _code=code?code:"081n03Sh2xxWIA0LX2Uh2MH5Sh2n03Sl";
      let _Url="mobile/replenish/"+_code;
      console.log('_Url:',_Url)
      this.$http.get(_Url).then((res)=>{
          console.log("res:",res)
      })
    },
    //切换nav
    handnav(obj) {
      this.actnav = obj.id;
    },
    //点击某个列表数据
    handitem(obj) {
      console.log(obj);

      if (this.actnav == 1) {
        this.$router.push({
          path: "/addto",
          query: obj
        });
      } else if (this.actnav == 2) {
        this.$router.push({
          path: "/lack",
          query: obj
        });
      }
    }
  },
  created(){
    this.getreplenish();
  }
};
</script>
<style lang="less">
.replenish_list {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #eee;
  .reptop {
    height: 144px;
    background: #fff;
    border-bottom: 1px solid #c4c4c4;
    padding-top: 36px;
    .reptitle {
      text-align: center;
      font-size: 36px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(21, 21, 21, 1);
      margin-bottom: 35px;
      span{
        box-shadow:0px -18px  #fea34a inset;
      }
    }
    .repnav {
      span {
        width: 50%;
        display: block;
        float: left;
        text-align: center;
        padding: 9px 0;
        font-size: 32px;
      }
      .actspan {
        color: #ff7e00;
        border-bottom: 2px solid#fea34a;
      }
    }
  }
  .repcont {
    margin-top: 120px;
    .actleft {
      li {
        width: 44.9%;
        float: left;
        background: #fff;
        .lileft{
          .llt{
            font-size: 36px;
          }
        }
      }
    }
    .actright {
      padding-left: 2%;
      li {
        width: 96%;
        border-bottom: none;
      }
      li:nth-child(1){
        border: none;
      }
    }
    ul {
      width:100%;
       background: #fff;
      li {
        padding: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        border-top: 1px solid #bababa;
        border-bottom: 1px solid #bababa;
        font-size: 30px;
        .lileft {
          width: 90%;
          text-align: left;
          .llb {
            
            color: #ff1a1a;
          }
        }
        .liright {
          img {
            width: 28px;
            height: 39px;
          }
        }
      }
      li:nth-child(2n-1) {
        border-right: 1px solid rgba(163, 163, 163, 1);
      }
    }
  }
}
</style>
