<template>
  <div class="super">
    <div class="example">
      <div class="parbox">
        <p class="partitle">客服远程开门</p>
        <mt-field label="货柜编号：" placeholder="请输入15位货柜编号" v-model="apply.equipNo"></mt-field>
        <mt-field label="货道号：" placeholder="货道号" type="number" v-model="apply.channelNo"></mt-field>
        <mt-button type="primary" @click="handapply">芝麻开门</mt-button>
      </div>
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
  name: "super",
  data() {
    return {
      apply: {
        equipNo: "",
        channelNo: ""
      }
    };
  },
  methods: {
    handapply() {
      if (!this.apply.equipNo) {
        Toast("请输入用户名");
      } else if (this.apply.equipNo.length != 15) {
        this.apply.equipNo = "";
        Toast("请输入15位设备号");
      } else if (!this.apply.channelNo) {
        Toast("请输入货道号");
      } else {
        Indicator.open("加载中...");
        this.$http.post("super/open", this.apply).then(res => {
          Indicator.close();
          if(res.status == 200){
              MessageBox(res.data);
          }
          console.log(res);
        });
      }
    }
  }
};
</script>

<style lang="less">
.super {
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
}
</style>


