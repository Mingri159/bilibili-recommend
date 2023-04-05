// ==UserScript==
// @name         ✨b站首页推荐纯享版 - ✨【修改自用(2023/4/3)  @胡桃的精通沙】
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改自用
// @author       Waflare | @胡桃的精通沙
// @match        https://www.bilibili.com/
// @icon         https://fastly.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @license      GPL
// ==/UserScript==
// @note         ----------------------------------------------------------------
// @note         原版地址：https://greasyfork.org/zh-CN/scripts/436341-b站首页推荐纯享版 
// @note         ----------------------------------------------------------------
// @note         优化记录:
// @note            移除首页 :插件提示横幅、各种频道；
// @note            视频信息：播放量、点赞数、弹幕数、视频时长；
// @note            UP信息：up是否关注、视频推荐原因、发布时间；
// @note            菜单：稍后再看、立马消失、获取视频封面； 



//bilibili首页
GM_addStyle(".home-redesign-base,.adblock-tips,.header-channel ,.bili-header__channel{display: none !important} ");

(function () {
  "use strict";

  // 请求首页推荐数据  ?fresh_type=3
  function getFrontPage() {
    let url =
      "https://api.bilibili.com/x/web-interface/index/top/rcmd";
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: (r) => {
          let result = JSON.parse(r.response).data.item;
          //  console.log('result',result)//  数据<<<<<---------------------------
          resolve(result);
        },
      });
    });
  }

  //  计算时分秒（封装函数）里边包含数字补零
  //把视频时间由【秒】转【时：分：秒】
  function getTimes(t) {
    let h = parseInt(t / 60 / 60 % 24)
    let m = parseInt(t / 60 % 60)
    let s = parseInt(t % 60)
    s = s < 10 ? '0' + s : s// 5:20、6:03

    if (h > 0) {
      m = m < 10 ? '0' + m : m
      return `${h}:${m}:${s}`// 1:20:15
    }
    else {
      return `${m}:${s}` //5:20
    }
  }

  // 格式化视频发布时间
  function form_pubdate(time) {
    let now_year = dayjs().year();//现在年份

    if (dayjs(time * 1000).get('year') == now_year) {
      return dayjs(time * 1000).format('MM-DD HH时');
    } else {
      return dayjs(time * 1000).format('YYYY-MM-DD');
    }
  }

  // 首页视频推荐模板
  function getTemplate(item) {

    //判断是否是已经关注的UP
    function isFollowed_fun() {
      if (item.is_followed) {
        return `<span class="_recommend-reason_e62cr_36" >已关注</span>`
      } else return ``
    }

    // 视频推荐 原因
    function is_rcmd() {
      if (item.rcmd_reason.reason_type == 3) {
        return `<span class="_recommend-reason_e62cr_36" >${item.rcmd_reason.content}</span>`
      } else return ``
    }

    return `
      <div class='w_item' id='${item.bvid}'>
        <div class='w_img_box'>
          <img src='${item.pic}' />

          <div class='w_stat_outer'>
           <div class='w_stat'>
            <div style="display: flex; gap: 10px;">
             <div class="icon_div">
                 <svg class="icon" style="height: 1.5em;fill: currentColor;margin-right: 2px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1095" ><path d="M800 128H224C134.4 128 64 198.4 64 288v448c0 89.6 70.4 160 160 160h576c89.6 0 160-70.4 160-160V288c0-89.6-70.4-160-160-160z m96 608c0 54.4-41.6 96-96 96H224c-54.4 0-96-41.6-96-96V288c0-54.4 41.6-96 96-96h576c54.4 0 96 41.6 96 96v448z" p-id="1096"></path><path d="M684.8 483.2l-256-112c-22.4-9.6-44.8 6.4-44.8 28.8v224c0 22.4 22.4 38.4 44.8 28.8l256-112c25.6-9.6 25.6-48 0-57.6z" p-id="1097"></path></svg>
                 ${formatNum(item.stat.view)}
             </div>

             <div class="icon_div">
              <svg class="icon" style="height: 1.2em;fill: currentColor;margin-right: 2px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6544"><path d="M64 483.04V872c0 37.216 30.144 67.36 67.36 67.36H192V416.32l-60.64-0.64A67.36 67.36 0 0 0 64 483.04zM857.28 344.992l-267.808 1.696c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-68.832-155.488-137.568-145.504-60.608 8.8-67.264 61.184-67.264 126.816v59.264c0 76.064-63.84 140.864-137.856 148L256 416.96v522.4h527.552a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824z" p-id="6575"></path></svg>${formatNum(
      item.stat.like)}
             </div>

             <div class="icon_div">
               <svg  class="icon" style="height: 1.2em;fill: currentColor;margin-right: 2px;" viewBox="0 0 1303 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1065" xmlns:xlink="http://www.w3.org/1999/xlink" ><path d="M110.964364 1023.720727c-60.509091 0-109.847273-48.872727-109.847273-108.916363V109.009455C1.117091 48.965818 50.455273 0 110.964364 0h1081.902545c60.509091 0 109.847273 48.872727 109.847273 108.916364v805.794909c0 60.043636-49.338182 108.916364-109.847273 108.916363H110.964364z m0-927.650909c-6.609455 0-12.101818 5.771636-12.101819 12.939637v805.794909c0 7.168 5.492364 13.032727 12.101819 13.032727h1081.902545c6.609455 0 12.101818-5.864727 12.101818-13.032727V109.009455c0-7.168-5.492364-13.032727-12.101818-13.032728H110.964364z" fill="#ffffff" p-id="1066"></path><path d="M1003.054545 520.098909a51.572364 51.572364 0 0 1-50.26909 52.689455h-80.058182a51.572364 51.572364 0 0 1-50.269091-52.689455c0-29.137455 22.434909-52.782545 50.269091-52.782545h80.058182c27.834182 0 50.269091 23.645091 50.26909 52.782545zM1096.610909 270.149818c0 28.858182-22.341818 52.410182-49.989818 52.410182H232.541091a51.293091 51.293091 0 0 1-50.082909-52.410182c0-29.044364 22.434909-52.503273 50.082909-52.503273h814.08c27.648 0 50.082909 23.458909 50.082909 52.503273zM768.744727 520.098909c0 28.858182-22.341818 52.410182-50.082909 52.410182H232.541091a51.293091 51.293091 0 0 1-50.082909-52.410182c0-29.044364 22.434909-52.503273 50.082909-52.503273H718.661818c27.648 0 50.082909 23.458909 50.082909 52.503273zM1096.610909 735.976727c0 29.044364-22.341818 52.503273-49.989818 52.503273H560.500364a51.293091 51.293091 0 0 1-50.082909-52.503273c0-28.951273 22.341818-52.410182 50.082909-52.410182h486.120727c27.648 0 50.082909 23.458909 50.082909 52.410182z" fill="#ffffff" p-id="1067"></path></svg>
                   ${formatNum(item.stat.danmaku)}
             </div>
          </div>
          <div '>  ${getTimes(item.duration)} </div>
         </div>
       </div>
      </div>

      <div class='w_title'>${item.title}</div>
     <div class='w_footer'>
          <div class="w_face">
            <img src='${item.owner.face}' />
          </div>

          <div class='w_detail'>

            <div class='w_up '>
             <svg class="icon" style="height: 1.2em;fill: currentColor;margin-right: 3px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5084"><path d="M800 128H224C134.4 128 64 198.4 64 288v448c0 89.6 70.4 160 160 160h576c89.6 0 160-70.4 160-160V288c0-89.6-70.4-160-160-160z m96 608c0 54.4-41.6 96-96 96H224c-54.4 0-96-41.6-96-96V288c0-54.4 41.6-96 96-96h576c54.4 0 96 41.6 96 96v448zM419.2 544c0 51.2-3.2 108.8-83.2 108.8S252.8 595.2 252.8 544v-217.6H192v243.2c0 96 51.2 140.8 140.8 140.8 89.6 0 147.2-48 147.2-144v-240h-60.8V544zM710.4 326.4h-156.8V704h60.8v-147.2h96c102.4 0 121.6-67.2 121.6-115.2 0-44.8-19.2-115.2-121.6-115.2z m-3.2 179.2h-92.8V384h92.8c32 0 60.8 12.8 60.8 60.8 0 44.8-32 60.8-60.8 60.8z" p-id="5085"></path></svg>
             <span class='w_up_name'> ${item.owner.name}</span>
            </div>

            <div style="display: flex;align-items: center">
             ${isFollowed_fun() /*up已关注*/}
             ${is_rcmd() /*视频推荐理由*/}
              <div class='w_pubdate'>  ${form_pubdate(item.pubdate) /*发布时间 */} </div>
            </div>

         </div>

           <div class="more" id='more_${item.bvid}' >
               <svg style="fill: currentColor;" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7484 5.49841C13.7484 6.46404 12.9656 7.24683 11.9999 7.24683C11.0343 7.24683 10.2515 6.46404 10.2515 5.49841C10.2515 4.53279 11.0343 3.75 11.9999 3.75C12.9656 3.75 13.7484 4.53279 13.7484 5.49841ZM13.7484 18.4985C13.7484 19.4641 12.9656 20.2469 11.9999 20.2469C11.0343 20.2469 10.2515 19.4641 10.2515 18.4985C10.2515 17.5328 11.0343 16.75 11.9999 16.75C12.9656 16.75 13.7484 17.5328 13.7484 18.4985ZM11.9999 13.7485C12.9656 13.7485 13.7484 12.9656 13.7484 12C13.7484 11.0343 12.9656 10.2515 11.9999 10.2515C11.0343 10.2515 10.2515 11.0343 10.2515 12C10.2515 12.9656 11.0343 13.7485 11.9999 13.7485Z"></path></svg>
           </div>
             
    </div>

     <div class='w_menu' id='menu_${item.bvid}'>
        <div id="w_menu_item_1_${item.bvid}"  class=" w_menu_item">稍后再看</div>
        <div id="w_menu_item_2_${item.bvid}"  class=" w_menu_item" style="display:none">取消稍后再看</div>
        <div id="w_menu_item_6_${item.bvid}"  class=" w_menu_item">立马消失</div>
        <div id="w_menu_item_5_${item.bvid}"  class=" w_menu_item">获取视频封面</div>
    </div>
</div>
    `;
  }

  /*
    <span id="w_menu_item_3_${item.bvid}"  class="w_menu_item">屏蔽UP</span>
    <span id="w_menu_item_4_${item.bvid}"  class="w_menu_item">不感兴趣</span>
  */


  // 点击打开详情页播放
  function gotoPage(url) {
    let _url = url;
    return function () {
      console.log(_url);
      window.open(_url, "_blank");
    };
  }

  // 获取Token
  function getCsrfToken() {
    const csrfToken = document.cookie.match(/bili_jct=([0-9a-fA-F]{32})/)?.[1]
    if (!csrfToken) {
      alert('找不到 csrf token, 请检查是否登录')
    }
    return csrfToken
  }

  /** 添加/删除 "稍后再看" */
  async function watchLaterFactory(action, id) {
    const form = new FormData()
    form.append('aid', id)
    form.append('csrf', getCsrfToken())
    await GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.bilibili.com/x/v2/history/toview/" + action,
      data: form,
      onload: function (response) {
        console.log("请求成功");
        const json = JSON.parse(response.responseText)
        const success = json.code == '0' && json.message == '0'
        if (!success) {
          alert(json.message || '出错了')
        }
        return success
      },
      onerror: function (response) {
        console.log("请求失败");
      }
    });
  }

  /**
   * 不喜欢 / 撤销不喜欢   
   * https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md
   * https://github.com/indefined/UserScripts/tree/master/bilibiliHome?spm_id_from=..0.0#%E6%8E%88%E6%9D%83%E8%AF%B4%E6%98%8E
   * 获取app授权：https://github.com/magicdawn/bilibili-app-recommend/blob/main/src/utility/auth.ts
   */


  // 老版 b站
  async function formatData() {
    let data_1 = await getFrontPage();
    let data_2 = await getFrontPage();
    let data = [...data_1, ...data_2];
    console.log('老版 b站 data', data);
    $("#internationalHeader").after(`
      <div id="w_body">
        <div id="w_content"></div>
      </div>
    `);
    for (let item of data) {
      $("#w_content").append(getTemplate(item));
      //打开菜单
      $(`#more_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        $(".w_menu").css('display', "none")
        setTimeout(() => { $(`#menu_${item.bvid}`).css('display', "flex") }, 50)
      });

      // 鼠标移开 关闭菜单
      $(`.w_menu`).on('mouseleave', function (e) { $(".w_menu").css('display', "none") });

      //1、稍后再看
      $(`#w_menu_item_1_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        setTimeout(() => {
          if (watchLaterFactory("add", item.id)) {
            $(`#w_menu_item_1_${item.bvid}`).css('display', "none");
            $(`#w_menu_item_2_${item.bvid}`).css('display', "flex");
            setTimeout(() => { $(`#menu_${item.bvid}`).css('display', "none"); }, 500)
          }
        }, 50)
      });

      //2、取消稍后再看
      $(`#w_menu_item_2_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        setTimeout(() => {
          if (watchLaterFactory("del", item.id)) {
            $(`#w_menu_item_1_${item.bvid}`).css('display', "flex");
            $(`#w_menu_item_2_${item.bvid}`).css('display', "none");
            setTimeout(() => { $(`#menu_${item.bvid}`).css('display', "none"); }, 500)
          }
        }, 50)
      });

      // 视频 立马消失
      $(`#w_menu_item_6_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        $(`#${item.bvid}`).css('display', "none")
      });

      //获取视频封面
      $(`#w_menu_item_5_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        let url = item.uri
        window.open(url.replace(/bilibili/, "bilibiliq"), "_blank");
      });

      // 打开视频详情页
      $(`#${item.bvid}`).on("click", gotoPage(item.uri));
    }
    $("#w_body").append(`<div class="w_btn_outer"><div id="w_f11"><svg style="width: 25px;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1155" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M170.666667 170.666667v213.333333H85.333333V85.333333h298.666667v85.333334H170.666667z m682.666666 213.333333V170.666667h-213.333333V85.333333h298.666667v298.666667h-85.333334zM170.666667 640v213.333333h213.333333v85.333334H85.333333v-298.666667h85.333334z m682.666666 0h85.333334v298.666667h-298.666667v-85.333334h213.333333v-213.333333z"  p-id="1156"></path></svg></div><div id="w_f5"><svg style = "width: 25px;fill: currentColor;"viewBox = "0 0 1024 1024" version = "1.1" xmlns = "http://www.w3.org/2000/svg" p-id="1155" xmlns: xlink = "http://www.w3.org/1999/xlink"> <path d="M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z" p-id="1186"></path></svg></div ><div id="w_btn">顶</div></div>`);
    $("#w_f11").on("click", fun_f11);
    $("#w_f5").on("click", () => { location.reload() });
    $("#w_btn").on("click", backTop);
  }

  // 新版 b站
  async function formatDataNew() {
    let data_1 = await getFrontPage();
    let data_2 = await getFrontPage();
    let data = [...data_1, ...data_2];
    console.log('新版 b站 data', data);
    $("#i_cecream").after(`
      <div id="w_body">
        <div id="w_content"></div>
      </div>
    `);

    for (let item of data) {
      $("#w_content").append(getTemplate(item));

      //打开菜单
      $(`#more_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        $(".w_menu").css('display', "none")
        setTimeout(() => { $(`#menu_${item.bvid}`).css('display', "flex") }, 50)
      });

      // 鼠标移开 关闭菜单
      $(`.w_menu`).on('mouseleave', function (e) { $(".w_menu").css('display', "none") });

      //1、稍后再看
      $(`#w_menu_item_1_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        setTimeout(() => {
          if (watchLaterFactory("add", item.id)) {
            $(`#w_menu_item_1_${item.bvid}`).css('display', "none");
            $(`#w_menu_item_2_${item.bvid}`).css('display', "flex");
            setTimeout(() => { $(`#menu_${item.bvid}`).css('display', "none"); }, 500)
          }
        }, 50)
      });

      //2、取消稍后再看
      $(`#w_menu_item_2_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        setTimeout(() => {
          if (watchLaterFactory("del", item.id)) {
            $(`#w_menu_item_1_${item.bvid}`).css('display', "flex");
            $(`#w_menu_item_2_${item.bvid}`).css('display', "none");
            setTimeout(() => { $(`#menu_${item.bvid}`).css('display', "none"); }, 500)
          }
        }, 50)
      });

      // 视频 立马消失
      $(`#w_menu_item_6_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        $(`#${item.bvid}`).css('display', "none")
      });

      //获取视频封面
      $(`#w_menu_item_5_${item.bvid}`).on('click', function (e) {
        e.stopPropagation();
        let url = item.uri
        window.open(url.replace(/bilibili/, "bilibiliq"), "_blank");
      });

      // 打开视频详情页
      $(`#${item.bvid}`).on("click", gotoPage(item.uri));

    }
    $("#w_body").append(`<div class="w_btn_outer"><div id="w_f11"><svg style="width: 25px;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1155" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M170.666667 170.666667v213.333333H85.333333V85.333333h298.666667v85.333334H170.666667z m682.666666 213.333333V170.666667h-213.333333V85.333333h298.666667v298.666667h-85.333334zM170.666667 640v213.333333h213.333333v85.333334H85.333333v-298.666667h85.333334z m682.666666 0h85.333334v298.666667h-298.666667v-85.333334h213.333333v-213.333333z"  p-id="1156"></path></svg></div><div id="w_f5"><svg style = "width: 25px;fill: currentColor;"viewBox = "0 0 1024 1024" version = "1.1" xmlns = "http://www.w3.org/2000/svg" p-id="1155" xmlns: xlink = "http://www.w3.org/1999/xlink"> <path d="M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584C308.32 883.232 142.112 717.024 142.112 512S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z" p-id="1186"></path></svg></div ><div id="w_btn">顶</div></div>`);
    $("#w_body").on('click', function (e) { $(".w_menu").css('display', "none") });//点击空白处，关闭菜单
    $("#w_f11").on("click", fun_f11);
    $("#w_f5").on("click", () => { location.reload() });
    $("#w_btn").on("click", backTop);
  }

  let timer = null;

  function backTop() {
    let isSafari = /^(?=.Safari)(?!.Chrome)/.test(navigator.userAgent);
    if (isSafari) {
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        var oTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          scrollTo(0, oTop - oTop / 8);
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    } else {
      scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  }

  async function moreVideo() {
    let data = await getFrontPage();
    for (let item of data) {
      $("#w_content").append(getTemplate(item));
      $(`#${item.bvid}`).on("click", gotoPage(item.uri));
    }
  }

  // 判断是否是新版
  function isNewOrOld() {
    return $("#i_cecream").length > 0;
  }

  if (isNewOrOld()) {
    formatDataNew();
  } else {
    formatData();
  }

  //数字格式化 【播放量】【点赞】【弹幕】
  function formatNum(num) {
    if (!num) {
      return "0";
    }
    if (num < 10000) {
      return num.toString();
    } else {
      return (num / 10000).toFixed(1).toString() + "万";
    }
  }

  let timeout = null;
  window.onscroll = function () {
    //距离顶部的距离
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    //可视区的高度
    var windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    //滚动条的总高度
    var scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    //滚动条到底部的条件
    if (scrollTop + windowHeight >= scrollHeight - 10) {
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        moreVideo();
      }, 300);
    }

    const back_top = document.getElementById("w_btn");
    if (scrollTop > 20) {
      back_top.style.display = "block";
    } else {
      back_top.style.display = "none";
    }
  };

  GM_addStyle(`
    .international-home {
      min-height: 100vh;
    }
    .international-home .storey-box, .international-footer {
      display: none;
    }
    .international-home .first-screen {
      display: none;
    }
    main, .bili-footer {
      display: none !important;
    }

    #w_body {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 40px;
      /*background-color: ${isNewOrOld() ? "#ffffff;" : "#f1f2f3;"};*/
      background-color: #e5e5e5;
    }

    #w_content {
      margin-top: 10px;
      max-width: 1610px;
      display: flex;
      flex-flow: wrap;
      gap: 10px;
    }

    .w_item {
      width: 310px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: white;
      border-radius: 6px;
      padding-bottom: 6px;
      position:relative;
    }

    /*动画*/
    .w_item:hover {
      cursor: pointer;
      transform: scale(1.01);
      border:1px #9499a0 solid;
    }

    .w_item > .w_img_box{
      position: relative;
      overflow: hidden;
      padding-top: 62.5%;
      border-radius: 6px;
      background: #000;
    }

    .w_img_box > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .w_item > .w_detail {
      width: 100%;
    }
    .w_footer {
      display: flex;
      align-items: center;
    }
    .w_footer > .w_face {
      width: 56px;
      padding: 0px 10px 0px 10px;
      box-size: border-sizing;
    }
    .w_footer > .w_detail {
      flex: 1;
    }

    /*菜单*/
    .w_menu{
      display: none; 
      background-color: white;
      color: black;
      border-radius: 6px;
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 85px;
      
      flex-direction: column;
      justify-content: center;
      gap: 5px;    
    }

    .w_menu_item{
      width:100%;
      display:flex;
      justify-content: space-around;
    }
  
    .w_menu_item:hover{
      color: #00aeec;
    }

    /* 已关注 、 1万点赞*/
    .w_detail ._recommend-reason_e62cr_36 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        color: #ff7f24;
        background-color: #fff0e3;
        border-radius: 4px;
        margin-right: 4px;
        font-size: 12px;
        line-height: 17px;
        height:17px;
        padding: 0 4px;
        cursor: default;
    }

    .w_face > img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .w_title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: black;
      line-height: 20px;
      padding: 0 9px;
      margin-top: 3px;
    }

    .w_title:hover ,
     .more:hover{
      color: #ba94f2;
    }
 
   

   .w_up {
      font-size: 15px;
      color: #00aae7;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
    }
    .w_up_name{
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .w_stat_outer{
        background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 100%);
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 5px 5px 0px 5px;
    }

    .w_stat{
      font-size: 10px;
      color:#ffffff;
      line-height: 18px;
      margin: 0 5px 4px 5px;
      display: flex;
      gap:10px;
      justify-content: space-between;
      z-index: 20;
    }

    .w_stat .icon_div{
      display: flex;
      align-items: center;
    }

    .w_pubdate{
      font-size: 10px;
      color: #a1a1a1;
      line-height: 18px;
    }

  

    .w_btn_outer{
      position: fixed;
      bottom: 30px;
      right: 50px;
    }

    #w_f11,
    #w_f5,
    #w_btn {
      cursor: pointer;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      line-height: 50px;
      font-size: 20px;
      text-align: center;
      color: #9999b2;
      font-weight: 600;
      background-color: #f6f9fa;    
    }

    #w_f11,
    #w_f5{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
    }

    #w_f11 svg,
    #w_f5 svg{
     color: #9999b2;
    }

    #w_btn {
      display: none;
    }

    #w_btn:hover {
      cursor: pointer;
    }

    .palette-button-outer div[class="primary-btn"] {
      display: none;
    }


    @media screen and (max-width: 1870px) {
       #w_content {
        width: 1300px !important;
      }
      .w_item {
        width: 250px !important;
      }
    }

    @media screen and (max-width: 1200px) {
     #w_content {
        width: 1050px !important;
      }
      .w_item {
        width: 250px !important;
      }

       #w_btn_outer {
        right: 8px;
       }
    }

  `);

  /********************************【夜间模式 开始】**************************************/

  //夜间模式   【添加样式】
  function bili_add_style_dark() {
    var style = document.createElement("style");
    style.type = "text/css";
    style.id = "bili_dark_mode";
    style.innerHTML = ".w_item,#w_btn,#w_f11,#w_f5{background-color: #323232;} #w_body{background-color: #222;  } .w_title{ color:#aaa;} .w_menu{background-color: #aaa;}"
    document.getElementsByTagName("head").item(0).appendChild(style);
  }
  //夜间模式   【移除样式】
  function bili_remove_dark_style() {
    if (document.getElementById("bili_dark_mode")) {
      document
        .getElementsByTagName("head")
        .item(0)
        .removeChild(document.getElementById("bili_dark_mode"));
    }

  }

  //夜间模式记录
  var dark_mode_tag = 0;

  // 等待【bilibili Evolved】生效，在页面添加夜间模式图标
  setTimeout(() => {
    //共用 【bilibili Evolved】的夜间模式按钮  1、刷新页面后 检测当前模式并记录
    if ($('.navbar-dark-mode')[0].title == "关闭夜间模式") {
      dark_mode_tag = 1;
      bili_add_style_dark();
    } else {
      dark_mode_tag = 0;
      bili_remove_dark_style();
    }

    //共用 【bilibili Evolved】的夜间模式按钮  2、切换模式
    $('.navbar-dark-mode').click(function () {
      console.log('点击了');
      if (dark_mode_tag) {
        dark_mode_tag = 0;
        bili_remove_dark_style();
      } else {
        dark_mode_tag = 1;
        bili_add_style_dark();
      }
    })
  }, 1500)


  /********************************【夜间模式 结束】**************************************/

  /*/********************************【全屏模式 开始】/*********************************/
  let in_f11_svg = "<svg style='width: 25px;fill: currentColor;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1155' xmlns:xlink='http://www.w3.org/1999/xlink'><path d='M170.666667 170.666667v213.333333H85.333333V85.333333h298.666667v85.333334H170.666667z m682.666666 213.333333V170.666667h-213.333333V85.333333h298.666667v298.666667h-85.333334zM170.666667 640v213.333333h213.333333v85.333334H85.333333v-298.666667h85.333334z m682.666666 0h85.333334v298.666667h-298.666667v-85.333334h213.333333v-213.333333z'  p-id='1156'></path></svg>"
  let out_f11_svg = "<svg style='width: 25px;fill: currentColor;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1299' xmlns:xlink='http://www.w3.org/1999/xlink' ><path d='M394.666667 597.333333l3.072 0.149334A32 32 0 0 1 426.666667 629.333333v234.666667l-0.149334 3.072A32 32 0 0 1 394.666667 896l-3.072-0.149333A32 32 0 0 1 362.666667 864V661.333333H160l-3.072-0.149333A32 32 0 0 1 160 597.333333h234.666667z m469.333333 0l3.072 0.149334a32 32 0 0 1 0 63.701333L864 661.333333H661.333333v202.666667l-0.149333 3.072a32 32 0 0 1-28.778667 28.8L629.333333 896a32 32 0 0 1-31.850666-28.928L597.333333 864v-234.666667l0.149334-3.072a32 32 0 0 1 28.778666-28.8L629.333333 597.333333h234.666667z m-469.333333-469.333333a32 32 0 0 1 31.850666 28.928L426.666667 160v234.666667a32 32 0 0 1-28.928 31.850666L394.666667 426.666667h-234.666667a32 32 0 0 1-3.072-63.850667L160 362.666667H362.666667V160a32 32 0 0 1 28.928-31.850667L394.666667 128z m234.666666 0l3.072 0.149333a32 32 0 0 1 28.8 28.778667L661.333333 160V362.666667h202.666667l3.072 0.149333a32 32 0 0 1 0 63.701333L864 426.666667h-234.666667l-3.072-0.149334a32 32 0 0 1-28.8-28.778666L597.333333 394.666667v-234.666667l0.149334-3.072A32 32 0 0 1 629.333333 128z'  p-id='1300'></path></svg>"

  let is_f11_mode = 0;

  function fun_f11() {
    var w_f11_btn = document.getElementById('w_f11')
    // console.log('点击了【全屏】');
    if (is_f11_mode) {
      is_f11_mode = 0;
      exitFullscreen(); //退出全屏
      w_f11_btn.innerHTML = in_f11_svg
    } else {
      is_f11_mode = 1;
      launchFullscreen(document.documentElement); // 整个页面进入全屏
      w_f11_btn.innerHTML = out_f11_svg
    }
  }

  document.addEventListener("fullscreenchange", function (e) {
    if (!document.fullscreenElement) {
      var w_f11_btn = document.getElementById('w_f11')
      w_f11_btn.innerHTML = in_f11_svg
      is_f11_mode = 0;
    }
  });

  function launchFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullScreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  /********************************【全屏模式 结束】*********************************/

})();
