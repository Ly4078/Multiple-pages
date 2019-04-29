<template>
  <div class="addto">
    <div class="addtop">
      <div class="top1">
        <img src="../../assets/image/left_icon.png" alt @click="goback">
        <span>房间{{repdata.roomNo}}</span>
      </div>
      <div class="top2">设备：{{repdata.equipNo}}</div>
    </div>
    <div class="addcont">
      <ul>
        <li v-for="(item,index) in goodslist" :key="item.id" @click="handitem(item,index)">
          <img class="selectedimg" v-show="item.act" src="../../assets/image/yixz_icon.png" alt>
          <img class="selectedimg" v-show="!item.act" src="../../assets/image/weisz_icon.png" alt>
          <div class="liright">
            <img class="goodsimg" :src="$GLOBAL.API+item.thumb" alt>
            <p class="goodsname">
              {{item.name}}
              <span>货道{{item.channelNo}}</span>
            </p>
            <p class="qhdate">已缺货{{item.hour | fiterdate}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="ad_footer">
      <div @click.stop="handbuton(1)">开门补货</div>
      <div @click.stop="handbuton(2)">补货完成</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
export default {
  name: "addto",
  data() {
    return {
      isopen: true,
      frequency: 0,
      roomNo: "",
      repdata: {},
      actlist: [],
      goodslist: [],
      successdoor: []
    };
  },
  filters: {
    fiterdate(value) {
      let _day = parseInt(value / 24);
      let _hour = parseInt(value % 24);
      return _day ? _day + "天" + _hour + "小时" : _hour + "小时";
    }
  },
  methods: {
    //回退到上一页面
    goback() {
      window.history.back(-1);
    },
    //查询列表数据
    getdetails() {
      const _this = this;
      this.$http.get("replenish/details/" + this.roomNo).then(res => {
        if (res.data.length > 0) {
          let _data = res.data;
          for (let i = 0; i < _data.length; i++) {
            _data[i].act = false;
          }
          _data.sort(this.compare("channelNo"));
          setTimeout(() => {
            _this.goodslist = _data;
          }, 200);
        } else {
          _this.goodslist = [];
          MessageBox.alert("此设备补货完成").then(action => {});
        }
      });
    },
    //排序
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    //点击数列某条数据
    handitem(obj, ind) {
      console.log("obj:", obj);
      this.goodslist[ind].act = !this.goodslist[ind].act;
      if (this.goodslist[ind].act) {
        this.actlist.push(obj);
      } else {
        for (let i in this.actlist) {
          if (obj.channelId == this.actlist[i].channelId) {
            this.actlist.splice(i, 1);
          }
        }
      }
      console.log("actlist321312", this.actlist, this.actlist.length);
    },
    //开门前检验
    handbuton(val) {
      this.frequency = 0;
      console.log("actlist", this.actlist, this.actlist.length);
      if (this.actlist.length > 0) {
        if (val == 1) {
          this.opendoor(val);
        } else if (val == 2) {
          if (this.isContained(this.successdoor, this.actlist)) {
            MessageBox({
              message: "请确认商品已放进货道",
              showCancelButton: true,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }).then(action => {
              if (action == "confirm") {
                this.opendoor(val);
              }
            });
          } else {
            Toast("请先开门补货，再完成确认");
          }
        }
      } else {
        Toast("请先选择货道");
      }
    },
    //开门
    opendoor(val) {
      let _url = val == 1 ? "replenish" : "replenish/complete",
        arr = [],
        _this = this,
        _channelNo = "";
      if (this.isopen) {
        Indicator.open({
          text: "加载中...",
          spinnerType: "fading-circle"
        });
        for (let i in this.actlist) {
          let obj = {};
          obj.channelId = this.actlist[i].channelId;
          obj.channelNo = this.actlist[i].channelNo;
          obj.equipNo = this.actlist[i].equipNO;
          arr.push(obj);
        }
        this.isopen = false;
        this.$http.post(_url, arr).then(res => {
          if (res.status == 200) {
            let s = this.actlist.length > 1 ? this.actlist.length * 500 : 1000;
            setTimeout(() => {
              _this.waiting(val, res.data, this.actlist.length);
            }, s);
          }
        });
      }
    },
    //判断一个数组是否是另一数组的子集
    isContained(a, b) {
      console.log(a, b);
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      if (a.length < b.length) return false;
      var aStr = a.toString();
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) return false;
      }
      return true;
    },
    isSubset(arr1, arr2) {
      console.log(arr1, arr2);
      let i = 0,
        j = 0;
      if (arr1.length < arr2.length) return false;
      while (i < arr2.length && j < arr1.length) {
        if (arr1[j].channelNo < arr2[i].channelNo) {
          j++;
        } else if (arr1[j].channelNo == arr2[i].channelNo) {
          j++;
          i++;
        } else if (arr1[j].channelNo > arr2[i].channelNo) {
          return false;
        }
      }

      if (i < arr2.length) {
        return false;
      } else {
        return true;
      }
    },
    waiting(val, data, num) {
      let _this = this,
        _num = num > 1 ? num * 500 : 1000;
      this.frequency++;
      if (this.frequency < 5) {
        this.$http.get("openResult/" + data).then(res => {
          if (res.data) {
            this.result = res.data;
            Indicator.close();
            this.isopen = true;
            if (val == 1 && res.data.result == 1) {
              [...this.successdoor] = this.actlist;
            }
            if (val == 1 && res.data.result == 3) {
              [...this.successdoor] = this.actlist;
            }
            if (val == 2 && res.data.result == 1) {
              for (let i in this.actlist) {
                for (let j in this.successdoor) {
                  if (
                    this.actlist[i].channelNo == this.successdoor[j].channelNo
                  ) {
                    this.successdoor.splice(j, 1);
                  }
                }
                for (let k in this.goodslist) {
                  if (
                    this.actlist[i].channelNo == this.goodslist[k].channelNo
                  ) {
                    this.goodslist.splice(k, 1);
                  }
                }
              }
              this.actlist = [];
            }
            if (val == 2 && res.data.result == 2) {
              if (res.data.remark.indexOf("|") == -1) {
              } else {
                let arr2 = res.data.remark.split("|");
                arr2.sort();
                res.data.remark = arr2.join(",");
                res.data.remark = res.data.remark.replace(/\,/g, "、");
              }
              res.data.remark =
                "货道" + res.data.remark + "，补货失败，请确认货道门是否关好。";
            }
            if (this.goodslist.length < 1) {
              MessageBox.alert("此设备补货完成").then(action => {});
            } else {
              MessageBox.alert(res.data.remark).then(action => {});
            }
          } else {
            setTimeout(() => {
              _this.waiting(val, data, num);
            }, _num);
          }
        });
      } else {
        MessageBox.alert("请求超时，请重启设备再操作").then(action => {
          this.isopen = true;
          Indicator.close();
          // history.go(0);
        });
      }
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.repdata = this.$route.query;
      this.roomNo = this.$route.query.id;
      this.getdetails();
    }
  }
};
</script>
<style lang="less">
.addto {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #eee;
  a {
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
      span {
        box-shadow: 0px -18px #fea34a inset;
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
    margin-bottom: 100px;
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
  .ad_footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    & > div {
      width: 50%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      float: left;
      font-size: 36px;
      font-family: "PingFang-SC-Bold";
      color: #434343;
    }
    div:nth-child(1) {
      background: #fff1a1;
    }
    div:nth-child(2) {
      background: #fdd808;
    }
  }
}
</style>
