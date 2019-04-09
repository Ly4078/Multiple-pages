<template>
  <div class="Inquire">
    {{status}}
    <ul v-show="status==-1">
      <li>提示：酒店补货员需要申请后才可使用</li>
      <li>
        <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="userName"></mt-field>
      </li>
      <li>
        <mt-field label="姓名" placeholder="请输入姓名" v-model="trueName"></mt-field>
      </li>
    </ul>
    <button class="apply" @click="handleapply" v-show="status==-1">申请补货员</button>
    <div class="load" v-show="status==4">申请审核中...</div>
    <div class="load" v-show="status==0">该帐户已停用</div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "mint-ui";
import { Field } from "mint-ui";
Vue.component(Field.name, Field);
export default {
  name: "Inquire",
  data() {
    return {
      code: "",
      status: "",
      userName: "",
      trueName: ""
    };
  },
  methods: {
    //获取code
    getcode() {
      let str = window.location.href; //取得整个地址栏
      let arr1 = str.split("?");
      let arr2 = arr1[1].split("&");
      let arr3 = arr2[0].split("=");
      this.inquirestatus(arr3[1]);
    },
    //查询当前状态
    inquirestatus(code) {
      this.$http.get("replenish/login/" + code).then(res => {
        //   -1 可申请   0：停用    1：已经申请成功  4：申请中
        this.status = res.data;
      });
    },
    //申请补货员
    handleapply() {
      if (!this.userName) {
        Toast("请输入电话号码");
      } else if (!this.trueName) {
        Toast("请输入姓名");
      } else {
        const reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!reg.test(this.userName)) {
          Toast("手机号码输入错误");
          this.userName = "";
        } else {
          let _parms = {
            trueName: this.trueName,
            username: this.username
          };
          this.$http.post("replenish/apply", _parms).then(res => {
            console.log("apply_res:", res);
          });
        }
      }
    }
  },
  created() {
    this.getcode();
    // let code = "061oeIZD1Jwbd60Tu30E1UTUZD1oeIZp";
    // this.inquirestatus(code);
  }
};
</script>

<style lang="less">
.Inquire {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  .load {
    font-size: 56px;
    text-align: center;
  }
  a {
    text-decoration: none;
  }
  ul {
    li:nth-child(1) {
      color: #ff0000;
      font-size: 30px;
    }
    li {
      padding: 0 24px;
      background: #fff;
      text-align: left;
      height: 100px;
      line-height: 100px;
      .mint-cell-title {
        font-size: 36px;
        font-family: "PingFang-SC-Bold";
        color: #525252;
        width: 135px;
      }
      .mint-cell-value {
        font-size: 30px;
      }
    }
  }
  .apply {
    width: 93%;
    height: 88px;
    border-radius: 88px;
    margin: 60px 3.5% 0 3.5%;
    background: #fdd808;
    text-align: center;
    line-height: 88px;
    font-size: 36px;
    font-family: "PingFang-SC-Medium";
    font-weight: 500;
    color: #302f2f;
    border: none;
  }
}
</style>

