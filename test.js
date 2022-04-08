const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    logging = webdriver.logging;

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('localhost:3000');

driver.sleep(10000).then(function() {
  driver.wait(until.elementLocated(By.id('pic')), 10000).then(() => {
    driver.findElement(By.id('pic')).click().then(() => {
      getLocalStorageKey('loadtime');
    });
  });
});


function getLocalStorageKey(key){
  driver.sleep(5000).then(() => {
    driver.executeScript("return window.localStorage.getItem('"+key+"');").then((time) => {
      console.log(time);
    }).finally(() => {
      driver.quit();
    });
  })
}