// 1) Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxQ8K7GFzjKl9mNq3YvCp2XrW5_HgT8Ac",
  authDomain: "quality-dashboard-cf.firebaseapp.com",
  databaseURL: "https://quality-dashboard-cf-default-rtdb.firebaseio.com",
  projectId: "quality-dashboard-cf",
  storageBucket: "quality-dashboard-cf.appspot.com",
  messagingSenderId: "456789123456",
  appId: "1:456789123456:web:a1b2c3d4e5f6789012"
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

// 7) Глобальные переменные для фильтрации
let allData = [];
let filteredData = [];
let currentCharts = {};

// 8) Рендер дашборда с фильтрацией
function renderDashboard(data) {
  allData = data;
  populateFilterOptions(data);
  applyFilters();
}

// 9) Заполнение опций фильтров
function populateFilterOptions(data) {
  const managers = [...new Set(data.map(item => item.manager))].sort();
  const categories = [...new Set(data.map(item => item.category))].sort();
  
  const managerFilter = document.getElementById('manager-filter');
  const categoryFilter = document.getElementById('category-filter');
  
  // Очищаем и заполняем менеджеров
  managerFilter.innerHTML = '<option value="all">Все менеджеры</option>';
  managers.forEach(manager => {
    managerFilter.innerHTML += `<option value="${manager}">${manager}</option>`;
  });
  
  // Очищаем и заполняем категории
  categoryFilter.innerHTML = '<option value="all">Все категории</option>';
  categories.forEach(category => {
    categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
  });
}

// 10) Применение фильтров
function applyFilters() {
  const periodFilter = document.getElementById('period-filter').value;
  const managerFilter = document.getElementById('manager-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  
  filteredData = allData.filter(item => {
    // Фильтр по периоду
    if (periodFilter !== 'all') {
      const itemDate = new Date(item.date);
      const now = new Date();
      
      switch (periodFilter) {
        case 'today':
          if (itemDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          if (itemDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
          if (itemDate < monthAgo) return false;
          break;
        case 'quarter':
          const quarterAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
          if (itemDate < quarterAgo) return false;
          break;
        case 'custom':
          const dateFrom = new Date(document.getElementById('date-from').value);
          const dateTo = new Date(document.getElementById('date-to').value);
          if (itemDate < dateFrom || itemDate > dateTo) return false;
          break;
      }
    }
    
    // Фильтр по менеджеру
    if (managerFilter !== 'all' && item.manager !== managerFilter) return false;
    
    // Фильтр по категории
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    
    return true;
  });
  
  updateDashboard();
}

// 11) Обновление дашборда с отфильтрованными данными
function updateDashboard() {
  updateStats();
  updateCharts();
  updateTables();
}

// 12) Обновление статистики
function updateStats() {
  const totalChecks = filteredData.length;
  const avgScore = totalChecks > 0 ? (filteredData.reduce((sum, item) => sum + item.value, 0) / totalChecks).toFixed(1) : 0;
  const bestScore = totalChecks > 0 ? Math.max(...filteredData.map(item => item.value)) : 0;
  const worstScore = totalChecks > 0 ? Math.min(...filteredData.map(item => item.value)) : 0;
  
  document.getElementById('total-checks').textContent = totalChecks;
  document.getElementById('avg-score').textContent = avgScore + '%';
  document.getElementById('best-score').textContent = bestScore + '%';
  document.getElementById('worst-score').textContent = worstScore + '%';
}

// 13) Обновление графиков
function updateCharts() {
  // Уничтожаем старые графики
  Object.values(currentCharts).forEach(chart => chart.destroy());
  currentCharts = {};
  
  // График рейтинга менеджеров
  const managerStats = {};
  filteredData.forEach(item => {
    if (!managerStats[item.manager]) {
      managerStats[item.manager] = { sum: 0, count: 0 };
    }
    managerStats[item.manager].sum += item.value;
    managerStats[item.manager].count++;
  });
  
  const managerLabels = Object.keys(managerStats);
  const managerScores = managerLabels.map(manager => 
    (managerStats[manager].sum / managerStats[manager].count).toFixed(1)
  );
  
  const ctx1 = document.getElementById('chartLeaders').getContext('2d');
  currentCharts.leaders = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: managerLabels,
      datasets: [{
        label: 'Средний балл',
        data: managerScores,
        backgroundColor: '#4CAF50',
        borderColor: '#45a049',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
  
  // График по категориям
  const categoryStats = {};
  filteredData.forEach(item => {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = { sum: 0, count: 0 };
    }
    categoryStats[item.category].sum += item.value;
    categoryStats[item.category].count++;
  });
  
  const categoryLabels = Object.keys(categoryStats);
  const categoryScores = categoryLabels.map(category => 
    (categoryStats[category].sum / categoryStats[category].count).toFixed(1)
  );
  
  const ctx2 = document.getElementById('chartCategories').getContext('2d');
  currentCharts.categories = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: categoryLabels,
      datasets: [{
        data: categoryScores,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    },
    options: { responsive: true }
  });
  
  // График динамики по дням
  const dailyStats = {};
  filteredData.forEach(item => {
    if (!dailyStats[item.date]) {
      dailyStats[item.date] = { sum: 0, count: 0 };
    }
    dailyStats[item.date].sum += item.value;
    dailyStats[item.date].count++;
  });
  
  const sortedDates = Object.keys(dailyStats).sort();
  const dailyScores = sortedDates.map(date => 
    (dailyStats[date].sum / dailyStats[date].count).toFixed(1)
  );
  
  const ctx3 = document.getElementById('chartTrend').getContext('2d');
  currentCharts.trend = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: sortedDates,
      datasets: [{
        label: 'Средний балл по дням',
        data: dailyScores,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// 14) Обновление таблиц
function updateTables() {
  // Таблица слабых показателей
  const indicatorStats = {};
  filteredData.forEach(item => {
    if (!indicatorStats[item.indicator]) {
      indicatorStats[item.indicator] = { sum: 0, count: 0 };
    }
    indicatorStats[item.indicator].sum += item.value;
    indicatorStats[item.indicator].count++;
  });
  
  const tblWeak = document.getElementById('tblWeak');
  tblWeak.innerHTML = '<thead><tr><th>Показатель</th><th>Средний %</th><th>Количество проверок</th></tr></thead><tbody></tbody>';
  
  Object.entries(indicatorStats)
    .map(([indicator, stats]) => ({
      indicator,
      avg: (stats.sum / stats.count).toFixed(1),
      count: stats.count
    }))
    .filter(item => item.avg < 70)
    .sort((a, b) => a.avg - b.avg)
    .forEach(item => {
      tblWeak.querySelector('tbody').innerHTML += 
        `<tr><td>${item.indicator}</td><td class="weak-score">${item.avg}%</td><td>${item.count}</td></tr>`;
    });
  
  // Детальная таблица
  const tblDetail = document.getElementById('tblDetail');
  tblDetail.innerHTML = '<thead><tr><th>Дата</th><th>Менеджер</th><th>Категория</th><th>Показатель</th><th>Балл</th><th>Комментарий</th></tr></thead><tbody></tbody>';
  
  filteredData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 50)
    .forEach(item => {
      const scoreClass = item.value < 70 ? 'weak-score' : item.value > 90 ? 'good-score' : '';
      tblDetail.querySelector('tbody').innerHTML += 
        `<tr>
          <td>${item.date}</td>
          <td>${item.manager}</td>
          <td>${item.category}</td>
          <td>${item.indicator}</td>
          <td class="${scoreClass}">${item.value}%</td>
          <td>${item.comment || ''}</td>
        </tr>`;
    });
}

// 15) Сброс фильтров
function resetFilters() {
  document.getElementById('period-filter').value = 'all';
  document.getElementById('manager-filter').value = 'all';
  document.getElementById('category-filter').value = 'all';
  document.getElementById('custom-dates').style.display = 'none';
  applyFilters();
}

// 16) Обработка изменения периода
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('period-filter').addEventListener('change', function() {
    const customDates = document.getElementById('custom-dates');
    if (this.value === 'custom') {
      customDates.style.display = 'block';
    } else {
      customDates.style.display = 'none';
    }
  });
});

// 8) Обработка формы добавления данных
document.getElementById('quality-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    manager: document.getElementById('manager-select').value,
    category: document.getElementById('category-select').value,
    indicator: document.getElementById('indicator-select').value,
    value: parseFloat(document.getElementById('value-input').value),
    date: document.getElementById('date-input').value,
    comment: document.getElementById('comment-input').value,
    timestamp: Date.now()
  };
  
  // Сохраняем в Firebase
  const newKey = db.ref('qualityData').push().key;
  db.ref('qualityData/' + newKey).set(formData)
    .then(() => {
      alert('Данные успешно добавлены!');
      clearForm();
    })
    .catch(error => {
      alert('Ошибка при сохранении: ' + error.message);
    });
});

// 9) Очистка формы
function clearForm() {
  document.getElementById('quality-form').reset();
  document.getElementById('date-input').value = new Date().toISOString().split('T')[0];
}

// 10) Экспорт данных в Excel
function exportData() {
  db.ref('qualityData').once('value').then(snap => {
    const data = snap.val() || {};
    const arr = Object.values(data);
    
    let csv = 'Дата,Менеджер,Категория,Показатель,Значение,Комментарий\n';
    arr.forEach(item => {
      csv += `${item.date},${item.manager},${item.category},${item.indicator},${item.value},"${item.comment || ''}"\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quality_data_' + new Date().toISOString().split('T')[0] + '.csv';
    link.click();
  });
}

// 11) Очистка всех данных
function clearAllData() {
  if (confirm('Вы уверены, что хотите удалить ВСЕ данные? Это действие необратимо!')) {
    db.ref('qualityData').remove()
      .then(() => {
        alert('Все данные удалены!');
      })
      .catch(error => {
        alert('Ошибка при удалении: ' + error.message);
      });
  }
}

// 12) Улучшенный рендер админки с сортировкой и пагинацией
function renderAdmin(data) {
  const container = document.getElementById('manual-panel');
  
  // Сортировка по дате (новые сверху)
  const sortedData = data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  
  if (sortedData.length === 0) {
    container.innerHTML = '<p class="no-data">Данные отсутствуют. Добавьте первую запись!</p>';
    return;
  }
  
  container.innerHTML = '<div class="records-header">Всего записей: ' + sortedData.length + '</div>';
  
  // Показываем последние 20 записей
  const recentData = sortedData.slice(0, 20);
  
  recentData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'record-item';
    div.innerHTML = `
      <div class="record-info">
        <strong>${item.date}</strong> | ${item.manager} | ${item.category}
        <br>
        <span class="indicator">${item.indicator}: <strong>${item.value}%</strong></span>
        ${item.comment ? '<br><small class="comment">' + item.comment + '</small>' : ''}
      </div>
      <div class="record-actions">
        <button onclick="editRecord('${Object.keys(data)[i]}')" class="btn-edit">✏️</button>
        <button onclick="deleteRecord('${Object.keys(data)[i]}')" class="btn-delete">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
  
  if (sortedData.length > 20) {
    const moreDiv = document.createElement('div');
    moreDiv.className = 'load-more';
    moreDiv.innerHTML = `<button onclick="showAllRecords()">Показать все записи (${sortedData.length})</button>`;
    container.appendChild(moreDiv);
  }
}

// 13) Удаление записи
function deleteRecord(key) {
  if (confirm('Удалить эту запись?')) {
    db.ref('qualityData/' + key).remove()
      .then(() => {
        alert('Запись удалена!');
      })
      .catch(error => {
        alert('Ошибка при удалении: ' + error.message);
      });
  }
}

// 14) Инициализация даты по умолчанию
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('date-input').value = new Date().toISOString().split('T')[0];
});

// 15) Запуск на первой загрузке
showPage('home');
