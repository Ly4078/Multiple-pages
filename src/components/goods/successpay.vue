<template>
  <div class="successpay"></div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
  name: "replenish",
  data() {
    return {
      deviceNo: "",
      playtype: ""
    };
  },
  methods: {
    //支付环境判断
    getplaytype(_para) {
      if (/MicroMessenger/.test(window.navigator.userAgent)) {
        this.playtype = 1;
        // alert("微信客户端");
      } else if (/AlipayClient/.test(window.navigator.userAgent)) {
        this.playtype = 2;
        // alert("支付宝客户端");
      } else {
        this.playtype = 3;
        // alert("其他浏览器");
      }
    },
    goback() {
      let msg = "支付成功，如果3分钟内货道门未打开，请联系客服：";
      msg+='<a href="tel:027-83598166">027-83598166</a>';
      MessageBox.alert(msg).then(action => {
        if (this.playtype == 1) {
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf4c3213fb7c381a0&redirect_uri=http%3a%2f%2fdev.byn-kj.com%2fmobile%2findex.html&response_type=code&scope=snsapi_base&state=" +
            localStorage.getItem("setpara") +
            "#wechat_redirect";
        } else {
          this.$router.push({
            path: "/",
            query: { deviceNo:  localStorage.getItem("setpara") }
          });
        }
      });
    }
  },
  created() {
    this.getplaytype();
    if (this.$route.query.deviceNo) {
      this.deviceNo = this.$route.query.deviceNo;
    }
    this.goback();
  }
};
</script>



