<template>
  <div class="lack">
    <div class="locktop">
      <div class="top1">
        <img src="../../assets/image/left_icon.png" alt @click="goback"><span>商品缺货房间</span>
      </div>
      <div class="top2">名称：<span>{{repdata.goodsName}}</span></div>
    </div>
    <div class="lockcont">
      <ul>
        <li v-for="item in datalist" :key="item.id" @click="handitem(item)">
          <div class="lileft">
            <div class="llt">房号：{{item.roomNO}}</div>
            <div class="llb">{{item.num}}件商品待补货</div>
          </div>
          <div class="liright">
            <img src="../../assets/image/right_icon.png" alt>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "lack",
  data() {
    return {
      repdata: {},
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
      msg: "this is lack page"
    };
  },
  methods: {
    //回退到上一页面
    goback() {
      window.history.back(-1);
    },
    //点击某个数据
    handitem(obj) {
      this.$router.push({
        path: "/addto",
        query: obj
      });
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.repdata = this.$route.query;
    }
    console.log("route", this.$route.query);
  }
};
</script>

<style lang="less">
.lack {
  position: fixed;
	width: 100%;
	height: 100%;
  background: #f6f6f6;
  .locktop {
    padding-top: 15px;
    text-align: center;
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
      color:#8A8A8A;
      span{
        color: #707070;
      }
    }
  }
  .lockcont {
    margin-top: 10px;
    ul {
      li {
        width: 44.9%;
        background: rgba(255, 255, 255, 1);
        float: left;
        padding: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        border-top:1px solid #bcbcbc;
        border-bottom:1px solid #bcbcbc;
        .lileft {
          width: 90%;
          text-align: left;
          .llb {
            font-size: 30px;
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
        border-right:1px solid #bfbfbf;
      }
    }
  }
}
</style>



