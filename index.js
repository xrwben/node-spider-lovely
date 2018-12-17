const request = require("request");
const nodeSchedule = require("node-schedule");
const Honey = require("./honey.js");

// const URL = "http://search.jiayuan.com/v2/search_v2.php";
const URL = "http://search.jiayuan.com/v2/search_v2.php?sex=f&stc=2:18.25,5:50.0&sn=default&sv=1&pt=377&ft=off&f=select&mt=d&p=";
const formdata = {
  "sex":"f",
  "key":"",
  "stc":"1:11,2:18.25,3:160.170,23:1",
  "sn":"default",
  "sv":"1",
  "p": 2,
  "f":"select",
  "listStyle":"bigPhoto",
  "pri_uid":"170633820",
  "jsversion":"v5"
}

let pageNum = 1;

const startRequest = () => {
  request({
    url: `${URL}${pageNum}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }
  }, (err, res, body) => {
    if (err) {
      console.log("err>>>>>", err);
      return false;
    } else {
      // console.log(res.request);
      dataParse(body);
    }
  })
};

const dataParse = async (data) => {

  console.log(`正在爬取第${pageNum}页，请耐心等候....`);


  const dataParse = JSON.parse(data);
  // console.log(dataParse);
  // console.log(dataParse.pageTotal);
  if (pageNum >= dataParse.pageTotal) {
    console.log("数据爬取完毕！！！！！！！！！");
    return false;
  }
  let honeyInfo = [];
  for (let i = 0; i < dataParse.userInfo.length; i++) {

    let uid = dataParse.userInfo[i].realUid;
    const name = dataParse.userInfo[i].nickname;
    const age = dataParse.userInfo[i].age;
    const height = dataParse.userInfo[i].height;
    const workLocation = dataParse.userInfo[i].work_location;
    const marriage = dataParse.userInfo[i].marriage;
    const education = dataParse.userInfo[i].education;
    const income = dataParse.userInfo[i].randTag.replace(/[<span>|<\/span>]/g, '');
    const image = dataParse.userInfo[i].image;
    const shortNote = dataParse.userInfo[i].shortnote;

    // console.info("--------------------------------");
    // console.info("编号：" + uid);
    // console.info("姓名：" + name);
    // console.info("年龄：" + age);
    // console.info("身高：" + height);              
    // console.info("地点：" + workLocation);              
    // console.info("婚姻状况：" + marriage);
    // console.info("学历：" + education);              
    // console.info("收入：" + income);             
    // console.info("照片：" + image);              
    // console.info("爱情宣言：" + shortNote);              
    // console.info("--------------------------------");

    await new Promise((resolve, reject) => {
      Honey.findById(uid, (err, res) => {
        if (err) {
          reject(err);
        } else {
          console.log(res);
          if (!res) {
            honeyInfo.push({
              _id: uid,
              name,
              age,
              height,
              workLocation,
              marriage,
              education,
              income,
              image,
              shortNote,
              updateTime: new Date()
            });
          }
          resolve();
        }
      });
    })
  }
  await saveData(honeyInfo);
  pageNum++;
  startRequest();
}

const saveData = async (honeyInfo) => {
  return new Promise((resolve, reject) => {
    Honey.create(honeyInfo, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
        return false;
      } else {
        console.log(`----------成功爬取第${pageNum}页并存储完毕！！！---------------`)
        resolve();
      }
    });
  });
}

startRequest();

/* 定时任务 */
nodeSchedule.scheduleJob({
  dayOfWeek: 1,
  hour: 10
}, () => {
  console.log("每周一10点整执行一次！！！");
  startRequest();
});