const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const mealObj = [];
let listObj = {
    "notice":"",
    "link":""
  };

(async() => {
  try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.kw.ac.kr/ko/life/facility11.jsp');
    const content = await page.content();
    const $ = cheerio.load(content);
      
    const dayList = $("#kw_content_w > div.major-contents-box > div > section > div > table > thead > tr > th");
    dayList.each((index, list) => {
      if ($(list).find('br').length) {
        $(list).find('br').replaceWith('');
      }
      const day = $(list).text().split("\t").join("");
      mealObj.push({ day });
    });
    mealObj.shift();
    
    const mealList = $("#kw_content_w > div.major-contents-box > div > section > div > table > tbody > tr > td");
    mealList.each((index, list) => {
        const meal = $(list).text();
        if (index == 0) {
            mealObj.unshift({ meal });
          } else {
            mealObj[index].student = meal;
          }
    });

    fs.writeFile('./meal.json', JSON.stringify(mealObj), (err) => {
        if (err) throw err;
        console.log('OK');
      });

    await browser.close();
  } catch (err) {
    console.error(err); 
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.kw.ac.kr/ko/index.jsp');
    const content = await page.content();
    const $ = cheerio.load(content);
  
    const lists = $("#jwxe_main_content > div:nth-child(4) > section > section > div > div > div.tab_box.on > div.tab_content > ul");
    lists.each((index, list) => {
      const link = $(list).find("a").attr('href');
      listObj[index] = {
        notice: $(list).find("li").text().trim().split(' ').join('').replace('', ''),
        link: link
      }
    });
  
    fs.writeFile('./notice.json', JSON.stringify(listObj), (err) => {
      if (err) throw err;
      console.log('OK');
    });
  
    await browser.close();
  } catch (err) {
    console.error(err);
  }
  
})();
  


