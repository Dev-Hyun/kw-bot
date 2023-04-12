const express = require('express');
const fs = require('fs');
const app = express();

let meal;
let notice;
fs.readFile('./meal.json', 'utf8', (err, data) => {
  if (err) throw err;
  meal = JSON.parse(data);
});
fs.readFile('./notice.json', 'utf8', (err, data) => {
    if (err) throw err;
    notice = JSON.parse(data);
 });

//simpleText:String, reply:Array
function getTemplate(simpleText, reply='') {
  const quickReplies = [];
  
  if (reply) {
    reply.forEach(value => {
      quickReplies.push({
        'label': value,
        'action': 'message',
        'messageText': value
      });
    });
  } else {
    quickReplies.push({
      'label': '처음으로',
      'action': 'message',
      'messageText': '처음으로'
    });
  }

  const data = {
    'version': '2.0',
    'template': {
      'outputs': [{
        'simpleText': {
          'text': simpleText
        }
      }],
      'quickReplies': quickReplies
    }
  }
  
  return data;
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/keyboard', (req, res) => {
  const data = { 'type': 'text' }
  res.json(data);
});

app.post('/message', (req, res) => {
  const day = new Date();
  const today = day.getDay();
  const yoil = day.toString().slice(0, 3).toUpperCase();

  const question = req.body.userRequest.utterance;
  const goMain = '처음으로';
  const goBack = '뒤로 가기';
  const selectDay = '요일지정';
  let data;

  if (question === '오늘') {
    if (yoil === 'SUN' || yoil === 'SAT') {
      data = getTemplate('오늘은 주말입니다. :)');
    } else {
      data = getTemplate( `${meal[today].day} ${meal[today].student}`);
    }

  } else if (question === '내일') {
    if (yoil === 'FRI' || yoil === 'SAT') {
      data = getTemplate('내일은 주말입니다. :)');
    } else {
      data = getTemplate(`${meal[today + 1].day} ${meal[today + 1].student}`);
    }

  } else if (question === selectDay || question === goBack) {
    data = getTemplate('요일을 선택하세요.', ['월', '화', '수', '목', '금']);

  } 
    else if (question === '운영시간') {
    data = getTemplate(`${meal[0].meal}`);
  }
    else if (question === goMain) {
    data = getTemplate('요일을 선택하세요.', ['월', '화', '수', '목', '금']);

  } else if (question === '월' || question === '화' || question === '수' ||
            question === '목' || question === '금') {
    const dayObj = { '월': 1, '화': 2, '수': 3, '목': 4, '금': 5};
    data = getTemplate(`${meal[dayObj[question]].day} ${meal[dayObj[question]].student}`,
                        [goBack, goMain]);

  } else if (question === '월요일' || question === '화요일' || question === '수요일' ||
            question === '목요일' || question === '금요일') {
    const dayObj = { '월요일': 1, '화요일': 2, '수요일': 3, '목요일': 4, '금요일': 5};
    data = getTemplate(`${meal[dayObj[question]].day} ${meal[dayObj[question]].student}`,
              [goBack, goMain]);
  } else if (question === '공지') {
    data = getTemplate(`${notice[0].notice}`);
  }
  else {
    data = getTemplate('개발 중이거나 오류입니다.\n' +
                        '개발자에게 문의해 주세요. \n' +
                        '이메일 : keyhyun01234@gmail.com');
  } 
  
  res.json(data);
});

app.listen(3000, () => console.log('node on 3000'));