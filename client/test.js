const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    logging = webdriver.logging;
const chrome = require('selenium-webdriver/chrome');
const config = require('../config.json');

function runTest(){
  /*await testSite(config.hyper[0].name, config.hyper[0].url);
  await testSite(config.hyper[1].name, config.hyper[1].url);
  await testSite(config.ipfs[0].name, config.ipfs[0].url);
  await testSite(config.ipfs[1].name, config.ipfs[1].url);*/
  return new Promise(async (resolve, reject) => {
    let times = {};
    for(let protocol in config) {
      console.log("Testing " + protocol);
      let protocolTimes = {};

        // Run tests and put times in protocolTimes
      let protocolJson = config[protocol];
      for(let key in config[protocol]) {
        let url = protocolJson[key];
        await testSite(key, url).then(time => protocolTimes = {... protocolTimes, [key]: time});
      }

        // Add protocolTimes to times
      times = {... times, [protocol]: protocolTimes};
      console.log("");
    }
    resolve(times);
  })
  
}

function testSite(name, url){
return new Promise( async (resolve, reject) => {
    const driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments(['--headless','--no-sandbox', '--disable-dev-shm-usage']))
        .build();

    driver.get(url);
    
    driver.sleep(5000).then(() => {
      driver.wait(() => driver.executeScript('return document.readyState').then((readyState) => readyState === 'complete' )).then(() => {
        driver.executeScript("return window.performance.timing.loadEventStart - window.performance.timing.navigationStart;").then((time) => {
          console.log(`${name} took ${time}ms to load`);
          driver.quit();
          resolve(time);
        });
      });
    })
  });
}

module.exports = runTest;