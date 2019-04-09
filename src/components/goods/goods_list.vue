<template>
  <div class="goods_list">
    <marquee behavior="scroll" v-show="ismarquee" @click="ismarquee = false">
      亲，请务必确认货道有货后再支付哟！
      <img src="../../assets/image/close.png" alt>
    </marquee>
    <div class="goods_ul">
      <span v-show="goodslist.length<1">此设备没有商品或设备异常，请联系管理员</span>
      <ul>
        <li
          v-for="(item,index) in goodslist"
          :key="index"
          :class="item.actInd? 'actclass' : '' "
          @click.stop="selectItem(item,index)"
        >
         <!-- @click.stop="handItem(item)" -->
          <img :src="$GLOBAL.API+item.thumb" alt="商品图片">
          <div :class="item.actInd? 'goodsdateil actclass' : 'goodsdateil' ">
            <div class="title">{{item.name}}</div>
            <div class="suoming">{{item.remark}}</div>
            <div class="more" @click.stop="selectItem(item,index)">
              <span class="moreleft">
                <i>￥</i>
                <em>{{item.salePrice}}</em>
              </span>
              <img class="morerigh" v-show="item.actInd" src="../../assets/image/reducing.png" alt>
              <img class="morerigh" v-show="!item.actInd" src="../../assets/image/add.png" alt>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <mt-tabbar v-model="selected">
      <mt-tab-item id="1">
        <img src="../../assets/image/gouwuche.png">
        <i class="goods_num" v-show="goodsNum>0">{{goodsNum}}</i>
        <span>
          合计：
          <i>￥</i>
          <em>{{amout}}</em>
        </span>
      </mt-tab-item>
      <mt-tab-item id="2" @click.stop="settlement">立即支付</mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
import Vue from "vue";
import { Tabbar, TabItem } from "mint-ui";
import { Indicator } from "mint-ui";
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
export default {
  name: "goods_list",
  data() {
    return {
      amout: 0,
      goodsNum: 0,
      actInd: "",
      selected: "",
      actlist: [],
      goodslist: [],
      playtype:'', //1 微信  2 支付宝 3 其它（微信支付宝都可以）
      ismarquee: true
    };
  },
  watch: {
    selected: function() {
      console.log("selected:", this.selected);
      if (this.selected == 2) {
        this.settlement();
      }
    }
  },

  methods: {
    //查询列表数据
    getlist(para) {
      let _para = para ? para : "865533039233535";
      Indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle"
      });
      this.$http.get("yub/list/" + _para).then(res => {
        let _this = this,
          _data = res.data;
        for (let i in _data) {
          _data[i].actInd = false;
        }
        if (this.$store.state.actgoodslist.length > 0) {
          this.goodsNum = this.$store.state.actgoodslist.length;
          this.actlist = this.$store.state.actgoodslist;
          for (let i in this.actlist) {
            this.amout = this.calculation(
              this.amout,
              this.actlist[i].salePrice,
              1
            );
            for (let j in _data) {
              if (this.actlist[i].goodsId == _data[j].goodsId) {
                _data[j].actInd = true;
              }
            }
          }
        }
        setTimeout(() => {
          Indicator.close();
          _this.goodslist = _data;
        }, 100);
      });
    },
    //点击查看某个数据详情
    handItem(obj) {
      console.log("handItem:", obj);
    },
    //选择某个数据
    selectItem(obj, ind) {
      this.goodslist[ind].actInd = !this.goodslist[ind].actInd;
      let _salePrice = this.goodslist[ind].salePrice;

      if (this.goodslist[ind].actInd) {
        this.amout = this.calculation(this.amout, _salePrice, 1);
        this.actlist.push(obj);
        this.goodsNum++;
        // this.amout = (this.amout * 100 + _salePrice * 100) / 100;
      } else {
        this.amout = this.calculation(this.amout, _salePrice, 2);
        this.goodsNum--;
        for (let i in this.actlist) {
          if (obj.goodsId == this.actlist[i].goodsId) {
            this.actlist.splice(i, 1);
          }
        }
      }
      console.log("actlist:", this.actlist);
    },
    //计算金额
    calculation(arg1, arg2, val) {
      var r1, r2, m;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      if (val == 1) {
        return (arg1 * m + arg2 * m) / m;
      } else if (val == 2) {
        return (arg1 * m - arg2 * m) / m;
      }
    },
    //去结算
    settlement() {
      let _parms={},_list=[];
      const _date=new Date();
      let _md5=this.$md5(this.amout.toFixed(2).toString()+"liaoyibi"+_date.getTime().toString());
      for(let i in this.actlist){
        _list.push(this.actlist[i].channelId)
      }	
      _parms={
        channelIdList:_list,
        signature: _md5,
        timestamp:_date.getTime().toString()
      }
      this.$http.post("yub/ila",_parms).then((res)=>{
        console.log("res:",res)
      })
      // this.$router.push({ path: "/paypage", params: {} });
      //
    },
    //支付环境判断
    getplaytype(){
      if (/MicroMessenger/.test(window.navigator.userAgent)) {
          this.playtype=1;
            // alert('微信客户端');
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
          this.playtype=2;
            // alert('支付宝客户端');
        } else {
          this.playtype=3;
            // alert('其他浏览器');
        }
    }
  },
  created() {
    console.log(this.$md5("holle"));
    this.getplaytype();
    let url = document.location.toString();
    let arrUrl = url.split("?");
    let para = arrUrl[1];
    this.getlist(para);
  }
};
</script>
<style lang="less">
.goods_list {
  marquee {
    position: fixed;
    top: 0;
    left: 0;
    color: red;
    img {
      width: 15px;
      height: 15px;
    }
  }
  .actclass {
    background: #fdd808;
  }
  .goods_ul {
    width: 93.6%;
    height: 100%;
    padding: 3.2%;
    margin-bottom: 100px;
    overflow-y: auto;
    ul {
      li {
        width: 340px;
        height: 480px;
        float: left;
        margin-bottom: 22px;
        img {
          width: 98%;
          margin: 1%;
          height: 340px;
          background: #bebebe;
          border-radius: 4px;
        }
        .goodsdateil {
          background: #fff;
          padding: 12px 8px 10px 13px;
          .title,
          .suoming {
            font-size: 30px;
            color: #2c2c2c;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
          .suoming {
            font-size: 24px;
            color: #a3a3a3;
          }
          .more {
            padding: 0 7px;
            .moreleft {
              float: left;
              i {
                font-size: 30px;
              }
              em {
                font-size: 44px;
              }
            }
            .morerigh {
              width: 40px;
              height: 40px;
              display: block;
              font-size: 26px;
              border-radius: 50%;
              font-weight: 800;
              background: #fff;
              float: right;
            }
          }
        }
        .actclass {
          background: #fdd808;
        }
      }
      li:nth-child(2n) {
        // background: blue;
      }
      li:nth-child(2n-1) {
        // background: red;
        margin-right: 22px;
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
  }
}
</style>
