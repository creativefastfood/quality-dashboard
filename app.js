// 1) Конфигурация Firebase (вставьте свои данные)
const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_ПРОЕКТ.firebaseapp.com",
  databaseURL: "https://ВАШ_ПРОЕКТ.firebaseio.com",
  projectId: "ВАШ_ПРОЕКТ",
  storageBucket: "ВАШ_ПРОЕКТ.appspot.com",
  messagingSenderId: "ВАШ_SENDER_ID",
  appId: "ВАШ_APP_ID"
};

// 2) Инициализация
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 3) Управление страницами
function showPage(name) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById(name + '-page').classList.add('active');
}

// 4) Обновление статуса подключения
db.ref('.info/connected').on('value', snap => {
  const ok = snap.val() === true;
  document.getElementById('firebase-status').textContent = ok ? 'Firebase: подключено' : 'Firebase: нет связи';
  document.getElementById('admin-firebase-status').textContent = ok ? 'Firebase: OK' : 'Firebase: OFF';
  document.getElementById('dashboard-firebase-status').textContent = ok ? 'Firebase: OK' : 'Firebase: OFF';
});

// 5) Слушаем данные и рендерим
db.ref('qualityData').on('value', snap => {
  const data = snap.val() || {};
  const arr = Object.values(data);
  renderAdmin(arr);
  renderDashboard(arr);
});

// 6) Рендер админки (пример)
function renderAdmin(data) {
  const container = document.getElementById('manual-panel');
  container.innerHTML = '';
  data.forEach((item, i) => {
    const div = document.createElement('div');
    div.textContent = `${i+1}. ${item.manager} | ${item.category} | ${item.indicator} = ${item.value}`;
    container.append(div);
  });
}

// 7) Рендер дашборда (пример с таблицами и графиками)
function renderDashboard(data) {
  // Таблица слабых показателей
  const tblWeak = document.getElementById('tblWeak');
  tblWeak.innerHTML = '<tr><th>Показатель</th><th>Средний %</th></tr>';
  // Группировка и усреднение по показателям
  const map = {};
  data.forEach(item => {
    map[item.indicator] = map[item.indicator] || { sum: 0, count: 0 };
    map[item.indicator].sum += +item.value;
    map[item.indicator].count++;
  });
  Object.entries(map).forEach(([ind, obj]) => {
    const avg = (obj.sum/obj.count).toFixed(1);
    tblWeak.innerHTML += `<tr><td>${ind}</td><td>${avg}%</td></tr>`;
  });

  // Простой график лидеров
  const ctx = document.getElementById('chartLeaders').getContext('2d');
  const byManager = data.reduce((acc, it) => {
    acc[it.manager] = acc[it.manager]||0;
    acc[it.manager] += +it.value; return acc;
  }, {});
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(byManager),
      datasets: [{ label: 'Баллы', data: Object.values(byManager), backgroundColor: '#6dd3fb' }]
    }
  });
}

// 8) Запуск на первой загрузке
showPage('home');
