<template>
  <div class="example">
    <div class="parbox">
      <p class="prompt">提示：请输入正确的15位设备编号</p>
      <mt-field label="设备号：" placeholder="请输入15位设备号" v-model="device.equipNo"></mt-field>
      <mt-button type="primary" @click="inquire">设备查询</mt-button>
      <div
        class="equipul"
        v-for="(item,index) in equiplist"
        :key="item.equipNo"
        @click="handli(item)"
        :class="actequip.equipNo==item.equipNo?'actequipul':''"
      >
        <p>酒店名称：{{item.hotelName}}</p>
        <p>设备编号：{{item.equipNo}}</p>
        <p>房间号码：{{item.roomNo}}</p>
        <ul v-show="actequip.equipNo==item.equipNo && item.firstStatus!=0" class="addcont">
          <li
            v-for="(items,indexs) in item.channelList"
            :key="items.channelId"
            @click="handitem(items,index,indexs)"
          >
            <img class="selectedimg" v-show="items.act" src="../../assets/image/yixz_icon.png" alt>
            <img
              class="selectedimg"
              v-show="!items.act"
              src="../../assets/image/weisz_icon.png"
              alt
            >
            <div class="liright">
              <p class="goodsname">
                <span>货道{{items.channelNo}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <mt-tabbar v-model="selected" v-show="equiplist.length>0">
        <mt-tab-item id="1">开门</mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field } from "mint-ui";
import { Button } from "mint-ui";
import { MessageBox } from "mint-ui";
import { Indicator } from "mint-ui";
import { Tabbar, TabItem } from "mint-ui";
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Button.name, Button);
Vue.component(Field.name, Field);
import { Toast } from "mint-ui";
export default {
  name: "goods_list",
  data() {
    return {
      selected: 0,
      frequency: 0,
      status: 3,
      isopen: true,
      actequip: {},
      actequipNo: "",
      device: {
        channelNo: "",
        equipNo: ""
      },
      actobj:{},
      wxback: {},
      actlist: [],
      equiplist: []
    };
  },
  watch: {
    actequipNo: function(curVal, oldVal) {
      if (oldVal) {
        for (let i in this.equiplist) {
          if (oldVal == this.equiplist[i].equipNo) {
            for (let j in this.equiplist[i].channelList) {
              this.equiplist[i].channelList[j].act = false;
            }
          }
        }
      }
      this.actlist = [];
    },
    selected: function() {
      if (this.selected == 1) {
        this.handledoor(this.selected);
      }
    }
  },

  methods: {
    //设备查询
    inquire() {
      if (!this.device.equipNo) {
        Toast("请输入设备号");
      } else {
        if (this.device.equipNo.length == 15) {
          Indicator.open();
          this.$http
            .get("super/openCheck?equipNo=" + this.device.equipNo)
            .then(res => {
              Indicator.close();
              console.log("res:", res);
              if (res.data.length > 0) {
                let _datalist = res.data;
                for (let i in _datalist) {
                  for (let j in _datalist[i].channelList) {
                    _datalist[i].channelList[j].act = false;
                  }
                  _datalist[i].channelList.sort(this.compare("channelNo"));
                }
                if (_datalist.length == 1) {
                  this.actequipNo = _datalist[0].equipNo;
                  this.actequip = _datalist[0];
                }
                this.equiplist = _datalist;
              } else {
                this.equiplist = [];
                this.device.equipNo = "";
                MessageBox.alert("未查询到相关设备").then(action => {});
              }
            });
        } else {
          MessageBox.alert("设备编号应15位，请重新输入").then(action => {});
          this.device.equipNo = "";
          this.equiplist = [];
          this.actequipNo = "";
          this.actequip = "";
        }
      }
    },
    //排序
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    //选中某一个货道
    handitem(obj, val1, val2) {
      this.equiplist[val1].channelList[val2].act = !this.equiplist[val1]
        .channelList[val2].act;
      for (let i in this.equiplist) {
        if (i == val1) {
          for (let j in this.equiplist[i].channelList) {
            if (j == val2) {
              this.equiplist[i].channelList[j].act = true;
              this.actobj=this.equiplist[i].channelList[j];
              this.device.channelNo = obj.channelNo;
            } else {
              this.equiplist[i].channelList[j].act = false;
            }
          }
        }
      }
    },
    //选择某一个设备
    handli(obj) {
      this.actequipNo = obj.equipNo;
      this.actequip = obj;
    },
    handledoor() {
      let _parms = {
        channelNo: this.device.channelNo,
        equipNo: this.device.equipNo
      };
      this.selected = 0;
      Indicator.open("加载中...");
      this.$http.post("super/open", _parms).then(res => {
        if (res.status == 200) {
          Indicator.close();
          this.isopen = true;
          MessageBox.alert(res.data).then(action => {
            this.device.channelNo="";
            this.actobj.act=!this.actobj.act;
          });
        }
      });
    }
  },
  created() {}
};
</script>

<style lang="less">
.example {
  position: absolute;
  .partitle {
    font-size: 30px;
    color: #ff0000;
    text-align: left;
    margin-bottom: 5px;
    margin-left: 40px;
  }
  a {
    text-decoration: none;
    margin: 5px 0;
  }
  .mint-cell-title {
    font-size: 36px;
    width: 200px;
  }
  .mint-field-core {
    font-size: 40px !important;
  }
  .mint-cell-wrapper {
    font-size: 40px !important;
  }
  .mint-button {
    width: 93%;
    height: 88px;
    background: rgba(253, 216, 8, 1);
    border-radius: 44px;
    font-size: 36px !important;
    color: #302f2f;
    margin: 20px 3%;
  }
  .equipul {
    padding: 5px;
    padding-bottom: 100px;
    text-align: left;
    border-top: 1px solid #999;
    p {
      margin: 10px;
    }
    p:nth-child(1) {
      font-size: 30px;
    }
  }
  .actequipul {
    background: #41abe3;
  }
  .prompt {
    color: red;
    font-weight: 800;
    font-size: 30px;
    text-align: left;
    margin-left: 5%;
    width: 95%;
  }
  .addcont {
    li {
      height: 50px;
      padding: 16px 0;
      display: flex;
      background: #fff;
      border-bottom: 2px solid #eee;
      .selectedimg {
        width: 44px;
        height: 44px;
        margin-top: 10px;
      }
      .liright {
        flex: 1;
        overflow: auto;
        p {
          text-align: left;
          width: 95%;
          font-size: 30px;
          font-family: "PingFang-SC-Bold";
          font-weight: bold;
          color: rgba(88, 88, 88, 1);
          span {
            color: #8a8a8a;
            font-size: 26px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(138, 138, 138, 1);
          }
        }
      }
    }
  }
  .mint-tabbar {
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100px;
    .is-selected {
      color: none;
    }
    a {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    & > a:nth-child(1) {
      background: #fff;
      img {
        width: 54px;
        height: 54px;
      }
      span {
        font-size: 32px;
      }
      i {
        font-size: 24px;
      }
      em {
        font-size: 40px;
      }
      .goods_num {
        position: relative;
        font-size: 24px;
        top: -35px;
        left: -20px;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        padding: 3px;
        background: #fdd808;
        border-radius: 50%;
      }
    }
    & > a:nth-child(2) {
      background: #fdd808;
      font-size: 36px;
    }
    & > a:nth-child(1) {
      background: #26a2ff;
      font-size: 36px;
    }
  }
}
</style>
