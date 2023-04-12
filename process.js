const fs = require('fs');

function changeMsg(meal) {
    const msg = '학식이 없는 날이거나 홈페이지에 등록되지 않았습니다.\n';
    return (meal.length < 2) ? msg : meal;
  }

fs.readFile('./meal.json', 'utf8', (err, data) => {
  if (err) throw err;
  mealObj = JSON.parse(data);

  for (let i = 1; i < mealObj.length; i++) {
    mealObj[i].student = '\n*점심식단\n'.concat(changeMsg(mealObj[i].student));
  }

  fs.writeFile('./meal.json', JSON.stringify(mealObj), (err) => {
    if (err) throw err;
    console.log('OK');
  });
});

fs.readFile('./notice.json', 'utf8', (err, data) => {
    if (err) throw err;
    listObj = JSON.parse(data);
  
    for (let i = 1; i < listObj.length; i++) {
      listObj[i].notice = '\n*공지\n'.concat(changeMsg(listObj[i].notice));
    }
  
    fs.writeFile('./.json', JSON.stringify(listObj), (err) => {
      if (err) throw err;
      console.log('OK');
    });
  });