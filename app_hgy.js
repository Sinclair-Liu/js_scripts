/*
脚本不兼容: QuantumultX, Surge, Loon, JSBox, Node.js
注册地址：www.baidu.com
变量： app_hgy:手机号#密码
export app_hgy='手机号#密码'
*/

// [task_local]
//#花果园
// 10 0 * * * https://cdn.jsdelivr.net/gh/byxiaopeng/myscripts@main/hgy.js, tag=花果园APP, enabled=true

const $ = new Env('花果园APP签到');
let status;
status = (status = ($.getval("hgystatus") || "1")) > 1 ? `${status}` : ""; // 账号扩展字符
let app_hgyArr = []
let app_hgy = $.isNode() ? (process.env.app_hgy ? process.env.app_hgy : "") : ($.getdata('app_hgy') ? $.getdata('app_hgy') : "")
let app_hgys = ""
//
!(async() => {
  if (typeof $request != "undefined") {
    // hgyck()
  } else {
    if (!$.isNode()) {
      app_hgyArr.push($.getdata('app_hgy'))
      let hgycount = ($.getval('hgycount') || '1');
      for (let i = 2; i <= hgycount; i++) {
        app_hgyArr.push($.getdata(`app_hgy${i}`))
      }
      console.log(`-------------共${app_hgyArr.length}个账号-------------\n`)
      for (let i = 0; i < app_hgyArr.length; i++) {
        if (app_hgyArr[i]) {
          app_hgy = app_hgyArr[i];
          $.index = i + 1;
          console.log(`\n开始【花果园账户 ${$.index}】`) 
          zhanghu=app_hgy.split('#')
          user=zhanghu[0]
          mima=zhanghu[1]
          await login();//登录获取token
        }
      }
    } else {
      if (process.env.app_hgy && process.env.app_hgy.indexOf('@') > -1) {
        app_hgyArr = process.env.app_hgy.split('@');
        console.log(`您选择的是用"@"隔开\n`)
      } else {
        app_hgys = [process.env.app_hgy]
      };
      Object.keys(app_hgys).forEach((item) => {
        if (app_hgys[item]) {
          app_hgyArr.push(app_hgys[item])
        }
      })
      console.log(`共${app_hgyArr.length}个账号`)
      for (let k = 0; k < app_hgyArr.length; k++) {
        $.message = ""
        app_hgy = app_hgyArr[k]
        $.index = k + 1;
        console.log(`\n开始【花果园账户 ${$.index}】`)
        zhanghu=app_hgy.split('#')
        user=zhanghu[0]
        mima=zhanghu[1]
        await login();//登录获取token
      }
    }
  }
})()
  .catch ((e) => $.logErr(e))
  .finally(() => $.done())

//登录
function login(timeout = 0) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/index/login`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'pplication/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'https://app.hzhuayangsz.com/'
      },
      body: `{"username":"${user}","password":"${mima}","token":null}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          token = result.data.token
          $.log(`\ntoken获取成功 开始执行签到`)
          await $.wait(3000);
          await sign(token);//签到
          await $.wait(3000);
          await qiandaonum(token);//签到天数
          await $.wait(3000);
          await getask(token)//答题
          await $.wait(3000);
          await getAnswer(token)//答题
          await $.wait(3000);
          for (video_id = 51; video_id < 54; video_id++) {
              await getIntegralByVideo(video_id, token)//视频
              await $.wait(5000)
          }
          await scratch(token)//刮刮乐
          await $.wait(3000);
          for (exercise_id = 1; exercise_id < 6; exercise_id++) {
            await takeExercises(exercise_id, token)//全民健身冰雪运动，让我们一起为奥运欢呼，多头体育，为祖国事业工作一百年
            await $.wait(4 * 60001)
            await receiveRewardsExercises(exercise_id, token)
          }
          await getwater(token)//浇水
         } else {
           $.log(`\n请填写正确的手机号和密码`)
         }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, timeout)
  })
}


//签到
function sign(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/user/sign`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n签到成功获得现金` + result.data.reward)
        } else {
          $.log(`\n每天只能签到一次`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

//签到天数
function qiandaonum(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/user/qiandaonum`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'pplication/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n已成功签到` + result.data.qdnum + `天`)
          $.message += `\n已成功签到` + result.data.qdnum + `天`
          } else {
          $.log(`\n没有获取到签到天数`)
          $.message += `\n没有获取到签到天数`
        }
        
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 3000)
  })
}

function getIntegralByVideo(id, token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/tree/getIntegralByVideo`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"id":"${id}","token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n水滴` + result.info)
        } else {
          $.log(`\n${result.info}`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}


function scratch(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/user/scratch`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"pg":0,"cz":0,"cm":1,"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n水滴领取成功` + result.data.reward)
        } else {
          $.log(`\n每天只能刮一次`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function getask(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/index/getask`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"id":67, "key":4, "token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
		  await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))
		  await getask(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}


function getAnswer(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/index/getAnswer`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"type":1, "token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
		  await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))
		  await getAnswerNext(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function getAnswerNext(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/index/getAnswer`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"type":3, "token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))
          await getAnswerNext(token)
        } else {
          $.log(`\n` + result.info)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function takeExercises(sid, token) {   
  return new Promise((resolve) => {
    
    let url = {
      url: `https://www.hzhuayangsz.com/api/index/takeExercises`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"sid":"${sid}","token":"${token}"}`,
    }
    
    $.post(url, async (err, resp, data) => {
        
      try {
        result = JSON.parse(data);
        
        {
        if (result.code == 1) {
          $.log(`\n` + result.info)
        } else {
          $.log('\n1' + result.info)
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function receiveRewardsExercises(sid, token) {
  return new Promise((resolve) => {
    
    let url = {
      url: `https://www.hzhuayangsz.com/api/index/receiveRewardsExercises`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"sid":"${sid}","token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n` + result.info)
        } else {
          $.log('\n2' + result.info) 
          await $.wait(Math.floor(Math.random()*(5000-3000+1000)+3000))}
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function getwater(token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/tree/getSeedTask`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          seed_task_uuid = result.data.seed_task_uuid
          seed_data = result.data
          $.log(`\nseed_task_uuid获取成功`)
          $.message += `\nseed_task_uuid获取成功`
          
          await $.wait(1000);
          await getdrop(seed_data, token);
          await $.wait(2000);
          await water(seed_task_uuid, token);
          
        } else {
          $.log(`\n可能token失效了说不定`)
          $.message += `\n可能token失效了说不定`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function getdrop(seed_data, token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/tree/getDrop`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"seed_task_uuid":"${seed_task_uuid}","seed_id":"${seed_data.seed_id}","seed_status":"${seed_data.seed_status}","seed_phases":"${seed_data.seed_phases}","token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n取水成功`)
          $.message += `\n取水成功`
        } else {
          $.log(`\n没水取了，明年再来吧`)
          $.message += `\n没水取了，明年再来吧`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}

function water(seed_task_uuid, token) {
  return new Promise((resolve) => {
    let url = {
      url: `https://www.hzhuayangsz.com/api/tree/seedAction`,
      headers: {
        'Host': 'www.hzhuayangsz.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Origin': 'http://app.hzhuayangsz.com',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'http://app.hzhuayangsz.com/'
      },
      body: `{"seed_task_uuid":"${seed_task_uuid}","action_type":"drop","token":"${token}"}`,
    }
    $.post(url, async (err, resp, data) => {
      try {
        result = JSON.parse(data);
        if (result.code == 1) {
          $.log(`\n浇水成功`)
          $.message += `\n浇水成功`

          await $.wait(3000);
          await water(seed_task_uuid, token); 
        } else {
          $.log(`\n没水了，明年再来吧`)
          $.message += `\n没水了，明年再来吧`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, 0)
  })
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:h}=t;e(null,{status:i,statusCode:r,headers:o,rawBody:h},s.decode(h,this.encoding))},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:h}=t;e(null,{status:s,statusCode:r,headers:o,rawBody:h},i.decode(h,this.encoding))},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}