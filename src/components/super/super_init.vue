<template>
  <div class="page_init"></div>
</template>

<script>
export default {
  name: "page_init",
  data() {
    return {
      msg: ""
    };
  },
  methods: {
    getcode() {
      // let code = "071eEH2V0Nxy022Ztw0V0dPL2V0eEH2d";
      // this.getlogin(code);
      // return;

      let astr = window.location.href,
        aobj = {};
      if (astr.indexOf("code") != -1) {
        if (this.$store.state.wxback && this.$store.state.wxback.code) {
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf4c3213fb7c381a0&redirect_uri=http://dev.byn-kj.com/mobile/super.html&response_type=code&scope=snsapi_base&state=state#wechat_redirect";
        } else {
          let anum = astr.indexOf("?");
          astr = astr.substr(anum + 1);
          let aarr = astr.split("&");
          for (let i = 0; i < aarr.length; i++) {
            let barr = aarr[i].split("=");
            aobj[barr[0]] = barr[1];
          }
          this.$store.commit("setwxback", aobj);
          this.getlogin(aobj.code);
        }
      } else {
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf4c3213fb7c381a0&redirect_uri=http://dev.byn-kj.com/mobile/super.html&response_type=code&scope=snsapi_base&state=state#wechat_redirect";
      }
    },
    //登录
    getlogin(code) {
      const _this = this;
      this.$http.get("super/login/" + code).then(res => {
        if (res.status == 200) {
          localStorage.setItem("supTOKEN", res.data);
          this.$router.push({
            path: "/super",
            query: res.data
          });
        }
      });
    },
    resetUrl() {
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf4c3213fb7c381a0&redirect_uri=http://dev.byn-kj.com/mobile/super.html&response_type=code&scope=snsapi_base&state=state#wechat_redirect";
    }
  },
  created() {
    this.getcode();
  }
};
</script>
