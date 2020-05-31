toast('开始执行')
launchApp('京东')


let btnIndex = 0 //跳过一些无法完成的任务
let commodityViewCount = 0 //浏览商品计数
let cartCount = 0 //加购计数
const interval = 3000 //任务执行间隔，手机性能差的设置大一些
const sleepTime = 10000 //有些场景加载得很慢，建议设置大一些
const version = device.release //安卓版本
let breakTask = true //是否中止任务
const clickInterval = 2000 //精灵点击间隔

const judge = () => {
  if (className('android.view.View').textContains('邀').exists()) {
    btnIndex = 1
  }
  if (className('android.view.View').textContains('战队').exists()) {
    btnIndex ++
  }
}
//随机延时
function rsleep(s) {
  while (s--) {
      sleep(random(900, 1200));
  }
}
//随机划屏
function rslide(i) {
  while (i--) {
      let x1 = random(device.width*0.2, device.width*0.9);
      let y1 = random(device.height*0.6, device.height*0.9);
      let x2 = random(device.width*0.2, device.width*0.9);
      let y2 = random(device.height*0.4, device.height*0.6);
      swipe(x1, y1, x2, y2, 400);
      rsleep(1);
  }
}
//随机划屏，反向
function rslideR(i) {
  while (i--) {
      let x1 = random(device.width*0.2, device.width*0.9);
      let y1 = random(device.height*0.6, device.height*0.9);
      let x2 = random(device.width*0.2, device.width*0.9);
      let y2 = random(device.height*0.4, device.height*0.6);
      swipe(x1, y1, x2, y2, 300);
      rsleep(1);
  }
}
//返回
function advback() {
  for (var i = 0; i < 3; i++) {
      if (!className("android.widget.ImageView").desc("返回").exists()) {
          rslideR(1);
          rsleep(2);
          continue;
      }
      className("android.widget.ImageView").desc("返回").click();
      rsleep(3);
      if (className("android.view.View").textContains("做任务领金币").exists()) {
          return;
      }
  }
  toast("定位不到返回按钮，模拟返回键");
  back();
}
//
const task = () => {
  if (breakTask) {
    return
  }
  //从首页自动进入活动
  if (
    className('android.widget.TextView').text('扫啊扫').exists() &&
    className('android.widget.TextView').text('消息').exists()
  ) {
    toast('自动进入活动中')
    if (parseInt(version.substring(0, 1)) >= 7) {
      const w1 = className('android.widget.ImageView')
        .descContains('浮层活动')
        .findOne()
      click(w1.bounds().centerX(), w1.bounds().centerY())
      sleep(sleepTime)
      idContains('homeSceneBtnTask').findOne().click()
    }
  }
  //跳出组队任务
  else if (
    className('android.view.View').text('继续领红包').depth(12).exists()
  ) {
    //任务列表页返回确认对话框
    className('android.view.View')
      .text('继续领红包')
      .depth(12)
      .findOne()
      .click()
  } else if (
    textContains('战队红包').exists() &&
    textContains('预计分得').exists()
  ) {
    if (idContains('com.jingdong.app.mall:id/fe').exists()) {
      idContains('com.jingdong.app.mall:id/fe').findOne().click()
    } else if (idContains('com.jingdong.app.mall:id/fd').exists()) {
      idContains('com.jingdong.app.mall:id/fd').findOne().click()
    } else if (idContains('fe').exists()) {
      idContains('fe').findOne().click()
    } else if (idContains('fd').exists()) {
      idContains('fd').findOne().click()
    }
    sleep(4000)
    btnIndex = 2
  } else if (textContains('恭喜完成，获得').exists()) {
    //8s任务
    if (idContains('com.jingdong.app.mall:id/fe').exists()) {
      idContains('com.jingdong.app.mall:id/fe').findOne().click()
    } else if (idContains('com.jingdong.app.mall:id/fd').exists()) {
      idContains('com.jingdong.app.mall:id/fd').findOne().click()
    } else {
      back()
    }
  } else if (text('去完成').exists()) {
    //任务页
    click('去完成', btnIndex)
  } else if (text('浏览以下5个商品').exists()) {
      //商品浏览
      toast('开始浏览商品')
        for (let i = 0; i < 5; i++) {
          var prices = className("android.view.View").textMatches("^¥[0-9]+\.[0-9][0-9]").find();
          var good = prices[i].parent().parent(); //找到商品
          //toast('找到'+good.childCount()+'个商品');
          rsleep(2);
          click(good.child(0).bounds().centerX(), good.child(0).bounds().centerY())
          rslide(4)
          rslideR(3)
          rsleep(2);
          back()
          //rslide(2)
          rsleep(2);
          
      }
      advback();
  } else if (text('当前页点击加购以下5个商品').exists()) {
    //加购
    toast('加入购物车中')
    var count = 6;
      for (let i = 0; i < 5; i++) {
        var prices = className("android.view.View").textMatches("^¥[0-9]+\.[0-9][0-9]").find();
        var good = prices[i].parent().parent(); //找到商品
        toast('找到'+good.childCount()+'个商品');
        if (good.childCount() > count) {
            continue;
        }
        rsleep(2);
        good.child(3).click();
        rslide(1)
        rsleep(2);
        
    }
    advback();
  } else if (text('购物车').exists() && text('店铺').exists()) {
    //商品页
    sleep(4000)
    if (idContains('com.jd.lib.productdetail:id/fe').exists()) {
      idContains('com.jd.lib.productdetail:id/fe').findOne().click()
    } else if (idContains('com.jd.lib.productdetail:id/fd').exists()) {
      idContains('com.jd.lib.productdetail:id/fd').findOne().click()
    } else if (idContains('fe').exists()) {
      idContains('fe').findOne().click()
    } else if (idContains('fd').exists()) {
      idContains('fd').findOne().click()
    } else {
      back()
    }
  } else {
    //其他的一些浏览任务
    sleep(sleepTime)
    if (idContains('abb').exists() && textContains('忍痛离开').exists()) {
      //忍痛离开
      idContains('abb').findOne().click()
    } else if (
      idContains('ui-bgm').exists() &&
      idContains('pop-start-btn').exists()
    ) {
      //游戏
      idContains('pop-start-btn').findOne().click()
      idContains('pop-fail2-btn').waitFor()
      idContains('pop-fail2-btn').findOne().click()
    }else if (
      className('android.widget.TextView').text('收取营养液').exists()
    ) {
      //种豆得豆
      back()
    } else if (textContains('玩一玩').exists()) {
      // 玩一玩
      idContains('com.jingdong.app.mall:id/fe').findOne().click()
    } else if (textContains('东东萌宠').exists()) {
      // 萌宠
      if (parseInt(version.substring(0, 1)) >= 7) {
        const w2 = className('android.view.ViewGroup')
          .desc('返回按钮')
          .findOne()
          .bounds()
        click(w2.centerX(), w2.centerY())
      } else {
        back()
      }
    } else if (
      className('android.widget.TextView').textContains('领京豆').exists()
    ) {
      // 领京豆
      if (parseInt(version.substring(0, 1)) >= 7) {
        const w3 = className('android.widget.Button')
          .desc('返回')
          .findOne()
          .bounds()
        click(w3.centerX(), w3.centerY())
        sleep(3000)
        if (
          className('android.widget.TextView').textContains('知道了').exists()
        ) {
          className('android.widget.TextView')
            .textContains('知道了')
            .parent()
            .findOne()
            .click()
          sleep(3000)
          click(w3.centerX(), w3.centerY())
        }
      } else {
        back()
      }
    } else if (className('android.view.ViewGroup').desc('返回按钮').exists()) {
      className('android.view.ViewGroup').desc('返回按钮').findOne().click()
    } else if (idContains('com.jingdong.app.mall:id/fe').exists()) {
      idContains('com.jingdong.app.mall:id/fe').findOne().click()
    } else if (idContains('com.jingdong.app.mall:id/fd').exists()) {
      idContains('com.jingdong.app.mall:id/fd').findOne().click()
    } else if (idContains('com.jd.lib.jshop:id/fd').exists()) {
      idContains('com.jd.lib.jshop:id/fd').findOne().click()
    } else if (idContains('fe').exists()) {
      idContains('fe').findOne().click()
    } else if (idContains('fd').exists()) {
      idContains('fd').findOne().click()
    } else {
      back()
    }
  }
}

const clickCoinElf = () => {
  if (idContains('goldElfin').exists()) {
    idContains('goldElfin').findOne().click()
  }
  setTimeout(() => {
    clickCoinElf()
  }, clickInterval)
}

const getCoins = () => {
  breakTask = true
  if (
    className('android.widget.Image')
      .textContains('x6YonE079h84lBpxnX4CVJaqei7TKx8AAAAASUVORK5CYII=')
      .exists()
  ) {
    className('android.widget.Image')
      .textContains('x6YonE079h84lBpxnX4CVJaqei7TKx8AAAAASUVORK5CYII=')
      .findOne()
      .click()
  }
  clickCoinElf()
}

const taskQueue = () => {
  breakTask = false
  for (;;) {
    if (breakTask) {
      break
    }
    sleep(interval)
    if (btnIndex != 2) {
      judge()
    }
    task()
  }
}

// prettier-ignore
const floatyWin = floaty.window(
  <horizontal>
    <button id="coin" text="点击金币精灵" />
  </horizontal>
)

floatyWin.setPosition(300, 0)

floatyWin.coin.click(() => {
  getCoins()
})

taskQueue()

setInterval(() => {}, 1000)
