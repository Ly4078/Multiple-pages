<template>
  <div class="exinit"></div>
</template>

<script>
export default {
  name: "Init",
  data() {
    return {
      status: ""
    };
  },
  methods: {
    getcode() {
      // let code = "081tnT7j28qwuD0Gfq7j2VgN7j2tnT7U";
      // this.getlogin(code);
      // return;

      let astr = window.location.href,
        aobj = {};

      if (astr.indexOf("code") != -1) {
        if (this.$store.state.wxback && this.$store.state.wxback.code) {
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf4c3213fb7c381a0&redirect_uri=http://dev.byn-kj.com/mobile/example.html&response_type=code&scope=snsapi_base&state=state#wechat_redirect";
          this.$store.state.wxback = {};
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
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf4c3213fb7c381a0&redirect_uri=http://dev.byn-kj.com/mobile/example.html&response_type=code&scope=snsapi_base&state=state#wechat_redirect";
      }
    },
    //查询当前用户权限
    getlogin(code) {
      this.$http.get("operation/login/" + code).then(res => {
        //   0 未申请  1：已经申请成功
        this.status = res.data.status;
        localStorage.setItem("operTOKEN", res.data.token);
        this.$router.push({
          path: "/example",
          query: res.data
        });
      });
    }
  },
  created() {
    this.getcode();
  }
};
</script>
