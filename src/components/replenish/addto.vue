<template>
  <div class="addto">
    <div class="addtop">
      <div class="top1">
        <img src="../../assets/image/left_icon.png" alt @click="goback">
        <span>房间{{repdata.roomNO}}</span>
      </div>
      <div class="top2">设备：{{repdata.sbh}}</div>
    </div>
    <div class="addcont">
      <!-- <mt-checklist v-model="value" :options="['选项A', '选项B', '选项C']"></mt-checklist> -->
      <ul>
        <li v-for="(item,index) in options" :key="item.id" @click="handitem(item,index)">
          <img class="selectedimg" v-show="item.act" src="../../assets/image/yixz_icon.png" alt>
          <img class="selectedimg" v-show="!item.act" src="../../assets/image/weisz_icon.png" alt>
          <div class="liright">
            <img class="goodsimg" src="../../assets/image/gouwuche.png" alt>
            <p class="goodsname">
              {{item.goodsName}}
              <span>货道{{item.huodao}}</span>
            </p>
            <p class="qhdate">已缺货{{item.qhdate | fiterdate}}</p>
          </div>
        </li>
      </ul>
    </div>

    <mt-tabbar v-model="selected">
      <mt-tab-item id="1">开门补货</mt-tab-item>
      <mt-tab-item id="2">补货完成</mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabbar, TabItem } from "mint-ui";
import { Checklist } from "mint-ui";

Vue.component(Checklist.name, Checklist);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
var timer = null;
export default {
  name: "addto",
  data() {
    return {
      repdata: {},
      selected: "",
      actlist: [],
      msg: "this is addto page",
      options: [
        {
          id: 1,
          imgurl: "#",
          goodsName: "印度神油",
          qhdate: "68",
          huodao: 2,
          act: false
        },
        {
          id: 2,
          imgurl: "#",
          goodsName: "情人套装",
          qhdate: "71",
          huodao: 7,
          act: false
        },
        {
          id: 3,
          imgurl: "#",
          goodsName: "杜蕾斯大胆爱",
          qhdate: "21",
          huodao: 3,
          act: false
        },
        {
          id: 4,
          imgurl: "#",
          goodsName: "冈本 3只装",
          qhdate: "124",
          huodao: 4,
          act: false
        },
        {
          id: 5,
          imgurl: "#",
          goodsName: "跳蛋",
          qhdate: "36",
          huodao: 5,
          act: false
        }
      ]
    };
  },
  filters: {
    fiterdate(value) {
      let _day = parseInt(value / 24);
      let _hour = parseInt(value % 24);
      return _day ? _day + "天" + _hour + "小时" : _hour + "小时";
    }
  },
  watch: {
    selected: function() {
      if (this.selected == 1) {
        this.startadd();
      } else if (this.selected == 2) {
        this.endadd();
      }
    }
  },
  methods: {
    //回退到上一页面
    goback() {
      window.history.back(-1);
    },
    //点击数列某条数据
    handitem(obj, ind) {
      console.log("obj:", obj);
      this.options[ind].act = !this.options[ind].act;
      if (this.options[ind].act) {
        this.actlist.push(obj);
      } else {
        for (let i in this.actlist) {
          if (obj.id == this.actlist[i].id) {
            this.actlist.splice(i, 1);
          }
        }
      }
      console.log("actlist:", this.actlist);
    },
    //点击开门补货 开始补货
    startadd() {
      console.log("startadd");
    },
    //点击补货完成 完成补货
    endadd() {
      console.log("endadd:");
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.repdata = this.$route.query;
      this.repdata.sbh = "43278998741389";
    }
  }
};
</script>
<style lang="less">
.addto {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #eee;
  a{
    text-decoration: none;
  }
  .addtop {
    padding-top: 15px;
    text-align: center;
    background: #f6f6f6;
    .top1 {
      font-size: 36px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      height: 60px;
      color: rgba(21, 21, 21, 1);
      img {
        float: left;
        width: 40px;
        height: 40px;
        padding: 10px;
      }
      span{
        box-shadow:0px -18px  #fea34a inset;
      }
    }
    .top2 {
      padding: 24px 0;
      font-size: 24px;
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: rgba(138, 138, 138, 1);
    }
  }
  .addcont {
    ul > li {
      height: 116px;
      padding: 16px 0;
      display: flex;
      background: #fff;
      border-bottom: 2px solid #eee;
      .selectedimg {
        width: 44px;
        height: 44px;
        margin: 28px 24px;
      }
      .liright {
        flex: 1;
        overflow: auto;
        .goodsimg {
          width: auto;
          width: 100px;
          height: 100px;
          background: #c3c3c3;
          margin-right: 16px;
          float: left;
        }
        p {
          text-align: left;
          width: 95%;
          height: 58px;
          line-height: 58px;
          font-size: 30px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(88, 88, 88, 1);
          span {
            float: right;
            color: #8a8a8a;
            font-size: 26px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(138, 138, 138, 1);
          }
        }
        .qhdate {
          color: #ff1a1a;
        }
      }
    }
  }
  .mint-tabbar {
    height: 100px;
    .mint-tab-item-label {
      height: 100%;
      line-height: 100px;
      font-size: 36px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(67, 67, 67, 1);
    }
    .mint-tab-item:nth-child(1) {
      background: #fff1a1;
    }
    .mint-tab-item:nth-child(2) {
      background: #fdd808;
    }
  }
}
</style>
