const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    logging = webdriver.logging;
const chrome = require('selenium-webdriver/chrome');
const config = require('../config.json');

function testSite(name, url){
  return new Promise( async (resolve, reject) => {
    promiseTimeout(10000).then(() => {
      if (timedOut)
        testSite(name, url).then(res => resolve(res)).catch(err => reject(err))
    });
    const driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments(['headless', '--no-sandbox', '--disable-dev-shm-usage']))
        .build();

    timedOut = false;
    await driver.get(url).catch(err => reject(err));
    
    driver.sleep(5000).then(() => {
      driver.wait(() => driver.executeScript('return document.readyState').then((readyState) => readyState === 'complete' )).then(() => {
        driver.executeScript("return window.performance.timing.loadEventStart - window.performance.timing.navigationStart;").then(async (time) => {
          console.log(`${name} took ${time}ms to load`);
          await driver.quit().catch(err => reject(err));
          resolve(time);
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    })
  });
}

let timedOut = true;
function promiseTimeout(ms) {
  // Create a promise that rejects in <ms> milliseconds
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

module.exports = testSite;