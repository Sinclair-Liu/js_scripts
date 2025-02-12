/*

软件名称:脑王1+1

项目注册地址:https://gitee.com/soy-tool/app-script/raw/master/picture/nw.jpg

变量抓取:

打开小黄鸟 打开app,首页界面 在请求头会有个authorization 复制他的值就可以
如果找不到就随便抓包app界面,找有http://nw.xuancollege.com/的连接里面的请求头会有个authorization

变量填写:
soy_nw_authorization=''

多个authorization用 @ 或 # 或 换行 隔开

v2p配置如下：

【REWRITE】
匹配链接（正则表达式） http://nw.xuancollege.com/red/getRredlist

对应重写目标   app_nw.js

【MITM】  
nw.xuancollege.com


cron 0 11 18 22 * * *

*/

// @grant require
// @grant nodejs
const $ = new Env('脑王1+1');
const axios = require("axios");
const app_soy_nw_authorization = [],nwcount = ''
let subTitle = ``;
let status;
status = (status = ($.getval("nw_status") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
let soy_nw_authorization = $store.get('soy_nw_authorization', 'string')

!(async () => {

soy_nw_authorization = $store.get('soy_nw_authorization', 'string').split('@');

Object.keys(soy_nw_authorization).forEach((item) => {
        if (soy_nw_authorization[item]) {
            app_soy_nw_authorization.push(soy_nw_authorization[item]);
        };
    });
    
    console.log(
        `=== 脚本执行 - 北京时间：${new Date(
        new Date().getTime() +
        new Date().getTimezoneOffset() * 60 * 1000 +
        8 * 60 * 60 * 1000
      ).toLocaleString()} ===\n`
    );
    console.log(`===【共 ${app_soy_nw_authorization.length} 个账号】===\n`);
      
for (i = 0; i < app_soy_nw_authorization.length; i++) {
    soy_nw_authorization=app_soy_nw_authorization[i]
    
    soy_nw_headers={"Host": "nw.xuancollege.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "authorization": soy_nw_authorization,
    };
    
    $.index = i + 1;
    
    console.log(`\n开始【第 ${$.index} 个账号任务】`);
        
        await soy_nw_sign()
        await soy_nw_everydaylist()
        await soy_nw_red_pack()
        
        
};

})()
.catch((e) => $.logErr(e))
.finally(() => $.done());

async function soy_nw_sign() {
    data = await axios({
        url:'http://nw.xuancollege.com/sign/add_sign',
        headers:soy_nw_headers,
        method:"put",
        data:'',
        }).catch(function (error) {
            //return error
            console.log(error)
        }).then(function (result) {
        //console.log(result.data)
        //{ code: 1, message: '今日已签到', data: { list: 'error' }, sign: '' }
        if(result.data.code=1){
            console.log(`\n【${$.name}---签到】: ${result.data.message}`)
        }else{
            console.log(`\n【${$.name}---签到】: ${result.data.message}`)
        }
        
    })
}

//任务广告
async function soy_nw_adv_id_4() {
    data = await axios({
        url:'http://nw.xuancollege.com/game/add_adv?money=20&adv_id=4',
        headers:soy_nw_headers,
        method:"put",
        data:'',
        }).catch(function (error) {
            //return error
            console.log(error)
        }).then(function (result) {
        //console.log(result.data)
        if(result.data.code=1){
            console.log(`\n【${$.name}---任务广告】: ${result.data.message}`)
        }else{
            console.log(`\n【${$.name}---任务广告】: ${result.data.message}`)
        }
        
    })
}

//来赚钱广告
async function soy_nw_adv_id_5() {
    data = await axios({
        url:'http://nw.xuancollege.com/add_adv_money?money=20&adv_id=5',
        headers:soy_nw_headers,
        method:"put",
        data:'',
        }).catch(function (error) {
            //return error
            console.log(error)
        }).then(function (result) {
        //console.log(result.data)
        if(result.data.code=1){
            console.log(`\n【${$.name}---赚钱广告】: ${result.data.message}`)
        }else{
            console.log(`\n【${$.name}---赚钱广告】: ${result.data.message}`)
        }
        
    })
}

//红包列表
function soy_nw_red_pack() {
    return new Promise((resolve, reject) => {
        $.get({
            url : `http://nw.xuancollege.com/game/red_pack`,
            headers : soy_nw_headers,
            //body : "",
        }, async(error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.code==1){
                if(result.data.list.length==0){
                    console.log(`\n【${$.name}---获取红包列表】: 没有可以领取的红包`)
                }else{
                    
                   for(pack_list of result.data.data.list){
                       packid=pack_list.red_id
                       await soy_nw_up_pack()
                   } 
                }
            }else{
                console.log(`\n【${$.name}---红包列表】: ${result.message}`) 
            }
            
            
             
            resolve()
        })
    })
}

//领取红包
async function soy_nw_up_pack() {
    data = await axios({
        url:`http://nw.xuancollege.com/game/red_pack?red_id=${packid}`,
        headers:soy_nw_headers,
        method:"put",
        data:'',
        }).catch(function (error) {
            //return error
            console.log(error)
        }).then(function (result) {
        //console.log(result.data)
        if(result.data.code=1){
            console.log(`\n【${$.name}---领取红包】: 红包 ${packid} ${result.data.message}`)
            
        }else{
            console.log(`\n【${$.name}---领取红包】: ${result.data.message}`)
        }
        
    })
}

async function soy_nw_everydaylist() {
    return new Promise((resolve, reject) => {
        $.get({
            url : `http://nw.xuancollege.com/task/everydaylist`,
            headers : soy_nw_headers,
            //body : "",
        }, async(error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.code==1){
                if(result.data[0].complete_percent=='100%'){
                    console.log(`\n【${$.name}---任务列表】: ${result.data[0].title} 已完成`)
                }else{
                    for(let cs=0;cs<10;cs++){
                        await soy_nw_adv_id_4()
                        await $.wait(Math.floor(Math.random()*(40000-35000+1000)+35000))
                    }
                }
                
                if(result.data[1].complete_percent=='100%'){
                    console.log(`\n【${$.name}---任务列表】: ${result.data[1].title} 已完成`)
                }else{
                    for(let cs=0;cs<10;cs++){
                        await soy_nw_adv_id_4()
                        await $.wait(Math.floor(Math.random()*(40000-35000+1000)+35000))
                    }
                }
                
                for(let cs=0;cs<20;cs++){
                    await soy_nw_adv_id_5()
                    await $.wait(Math.floor(Math.random()*(40000-35000+1000)+35000))
                }
                
                
            }else{
               console.log(`\n【${$.name}---任务列表】: ${result.message}`)  
            }
            
             
            resolve()
        })
    })
    
    
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}