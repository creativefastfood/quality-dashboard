// =====================================================
// СИСТЕМА УПРАВЛЕНИЯ КАЧЕСТВОМ - ГЛАВНЫЙ ФАЙЛ
// =====================================================

console.log('🚀 Инициализация системы управления качеством...');

// =====================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ
// =====================================================
let currentPage = 'home';
let charts = {}; // Хранилище для графиков Chart.js

const MONTHS_ORDER = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// =====================================================
// СИСТЕМА ХРАНЕНИЯ ДАННЫХ
// =====================================================
class DataManager {
    static getOPData() {
        try {
            const data = JSON.parse(localStorage.getItem('opDashboardData') || '[]');
            console.log(`📊 Загружено ОП данных: ${data.length}`);
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.error('Ошибка загрузки ОП данных:', e);
            return this.generateTestOPData();
        }
    }

    static getProdData() {
        try {
            const data = JSON.parse(localStorage.getItem('prodDashboardData') || '[]');
            console.log(`📊 Загружено Продакшн данных: ${data.length}`);
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.error('Ошибка загрузки Продакшн данных:', e);
            return this.generateTestProdData();
        }
    }

    static saveOPData(data) {
        localStorage.setItem('opDashboardData', JSON.stringify(data));
        console.log(`💾 Сохранено ОП данных: ${data.length}`);
    }

    static saveProdData(data) {
        localStorage.setItem('prodDashboardData', JSON.stringify(data));
        console.log(`💾 Сохранено Продакшн данных: ${data.length}`);
    }

    static generateTestOPData() {
        console.log('🔄 Генерация тестовых данных ОП');
        return [
            {
                id: this.generateId(),
                date: '25.08.2025',
                manager: 'Иван Петров',
                category: 'Продажи',
                indicator: 'Качество презентации',
                value: 92,
                month: 'Август',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            },
            {
                id: this.generateId(),
                date: '24.08.2025',
                manager: 'Мария Сидорова',
                category: 'Продажи',
                indicator: 'Работа с возражениями',
                value: 88,
                month: 'Август',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            },
            {
                id: this.generateId(),
                date: '23.08.2025',
                manager: 'Алексей Козлов',
                category: 'Продажи',
                indicator: 'Закрытие сделки',
                value: 76,
                month: 'Август',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            },
            {
                id: this.generateId(),
                date: '22.08.2025',
                manager: 'Елена Романова',
                category: 'Продажи',
                indicator: 'Клиентский сервис',
                value: 95,
                month: 'Июль',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            }
        ];
    }

    static generateTestProdData() {
        console.log('🔄 Генерация тестовых данных Продакшн');
        return [
            {
                id: this.generateId(),
                date: '25.08.2025',
                manager: 'Анна Астапенкова',
                category: 'Координация',
                indicator: 'Актуальность стадии проекта по канбану',
                value: 90,
                month: 'Август',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            },
            {
                id: this.generateId(),
                date: '24.08.2025',
                manager: 'Азиза Кадырова',
                category: 'Координация',
                indicator: 'Заполнены все обязательные поля в Битрикс',
                value: 85,
                month: 'Август',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            },
            {
                id: this.generateId(),
                date: '23.08.2025',
                manager: 'Рената Галиулина',
                category: 'Координация',
                indicator: 'ТЗ прикреплено в сделку файлом в Битрикс',
                value: 78,
                month: 'Август',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            },
            {
                id: this.generateId(),
                date: '22.08.2025',
                manager: 'София Кондратьева',
                category: 'Продюсеры',
                indicator: 'В сделке есть предоплата',
                value: 96,
                month: 'Июль',
                source: 'test',
                appeal: { status: 'none', note: '', createdAt: null }
            }
        ];
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static addOPRecord(record) {
        const data = this.getOPData();
        record.id = this.generateId();
        record.appeal = { status: 'none', note: '', createdAt: null };
        data.unshift(record);
        this.saveOPData(data);
        return record;
    }

    static addProdRecord(record) {
        const data = this.getProdData();
        record.id = this.generateId();
        record.appeal = { status: 'none', note: '', createdAt: null };
        data.unshift(record);
        this.saveProdData(data);
        return record;
    }
}

// =====================================================
// НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ
// =====================================================
function showPage(pageId) {
    console.log(`🔄 Переход на страницу: ${pageId}`);
    
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем нужную страницу
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Инициализируем страницу
        switch(pageId) {
            case 'op-admin':
                initOPAdmin();
                break;
            case 'prod-admin':
                initProdAdmin();
                break;
            case 'op-dashboard':
                initOPDashboard();
                break;
            case 'prod-dashboard':
                initProdDashboard();
                break;
            case 'home':
                // Главная страница не требует инициализации
                break;
        }
    } else {
        console.error(`Страница ${pageId} не найдена`);
    }
}

// =====================================================
// АДМИНИСТРАТИВНЫЕ ПАНЕЛИ
// =====================================================
function initOPAdmin() {
    console.log('⚙️ Инициализация админки ОП');
    
    // Инициализация формы ручного ввода
    const form = document.getElementById('op-manual-form');
    if (form) {
        form.addEventListener('submit', handleOPManualSubmit);
    }
    
    // Инициализация загрузки CSV
    setupCSVUpload('op');
    
    // Обновление истории
    updateHistory('op');
}

function initProdAdmin() {
    console.log('🔧 Инициализация админки Продакшн');
    
    // Инициализация формы ручного ввода
    const form = document.getElementById('prod-manual-form');
    if (form) {
        form.addEventListener('submit', handleProdManualSubmit);
    }
    
    // Инициализация загрузки CSV
    setupCSVUpload('prod');
    
    // Обновление истории
    updateHistory('prod');
}

function handleOPManualSubmit(e) {
    e.preventDefault();
    
    const formData = {
        date: new Date().toLocaleDateString('ru-RU'),
        manager: document.getElementById('op-manager').value,
        category: 'Продажи',
        indicator: document.getElementById('op-indicator').value,
        value: parseInt(document.getElementById('op-value').value),
        month: document.getElementById('op-month').value,
        source: 'manual'
    };
    
    console.log('📝 Добавление ОП записи:', formData);
    
    if (validateRecord(formData)) {
        DataManager.addOPRecord(formData);
        showNotification('✅ Запись успешно добавлена');
        e.target.reset();
        updateHistory('op');
    } else {
        showNotification('❌ Заполните все поля', 'error');
    }
}

function handleProdManualSubmit(e) {
    e.preventDefault();
    
    const formData = {
        date: new Date().toLocaleDateString('ru-RU'),
        manager: document.getElementById('prod-manager').value,
        category: document.getElementById('prod-category').value,
        indicator: document.getElementById('prod-indicator').value,
        value: parseInt(document.getElementById('prod-value').value),
        month: document.getElementById('prod-month').value,
        source: 'manual'
    };
    
    console.log('📝 Добавление Продакшн записи:', formData);
    
    if (validateRecord(formData)) {
        DataManager.addProdRecord(formData);
        showNotification('✅ Запись успешно добавлена');
        e.target.reset();
        updateHistory('prod');
    } else {
        showNotification('❌ Заполните все поля', 'error');
    }
}

function validateRecord(record) {
    return record.manager && 
           record.indicator && 
           record.value >= 0 && 
           record.value <= 100 && 
           record.month;
}

// =====================================================
// ЗАГРУЗКА CSV ФАЙЛОВ
// =====================================================
function setupCSVUpload(type) {
    const uploadZone = document.getElementById(`${type}-upload`);
    const fileInput = document.getElementById(`${type}-csv-input`);
    
    if (!uploadZone || !fileInput) return;
    
    // Клик по зоне загрузки
    uploadZone.addEventListener('click', () => fileInput.click());
    
    // Drag & Drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleCSVFile(files[0], type);
        }
    });
    
    // Выбор файла
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleCSVFile(e.target.files[0], type);
        }
    });
}

function handleCSVFile(file, type) {
    console.log(`📁 Обработка CSV файла: ${file.name} для ${type}`);
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showNotification('❌ Выберите CSV файл', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csvData = parseCSV(e.target.result);
            const convertedData = convertCSVData(csvData, type, file.name);
            
            if (convertedData.length > 0) {
                if (type === 'op') {
                    const existingData = DataManager.getOPData();
                    DataManager.saveOPData([...convertedData, ...existingData]);
                } else {
                    const existingData = DataManager.getProdData();
                    DataManager.saveProdData([...convertedData, ...existingData]);
                }
                
                showNotification(`✅ Загружено ${convertedData.length} записей из ${file.name}`);
                updateHistory(type);
                
                // Сохранение информации о файле
                saveFileInfo(file.name, convertedData.length, type);
            } else {
                showNotification('⚠️ Не удалось извлечь данные из файла', 'warning');
            }
        } catch (error) {
            console.error('Ошибка обработки CSV:', error);
            showNotification('❌ Ошибка обработки файла', 'error');
        }
    };
    
    reader.readAsText(file, 'UTF-8');
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    return data;
}

function convertCSVData(csvData, type, fileName) {
    const convertedData = [];
    const month = extractMonthFromFileName(fileName);
    
    csvData.forEach(row => {
        // Пропускаем пустые строки
        if (!row || Object.keys(row).length === 0) return;
        
        if (type === 'op') {
            // Логика для ОП файлов
            if (row['Менеджер'] && row['Показатель'] && row['Значение']) {
                convertedData.push({
                    id: DataManager.generateId(),
                    date: new Date().toLocaleDateString('ru-RU'),
                    manager: row['Менеджер'],
                    category: row['Категория'] || 'Продажи',
                    indicator: row['Показатель'],
                    value: parseFloat(row['Значение']) || 0,
                    month: month,
                    source: 'csv',
                    appeal: { status: 'none', note: '', createdAt: null }
                });
            }
        } else {
            // Логика для Продакшн файлов
            Object.keys(row).forEach(key => {
                if (key.includes('Unnamed') || 
                    key === 'Month' || 
                    key === 'Week' || 
                    key === 'Измеряемые показатели' ||
                    key === 'Координация' ||
                    key === 'Продюсеры') return;
                
                const indicator = row['Измеряемые показатели'];
                const value = row[key];
                
                if (indicator && value !== undefined && value !== '') {
                    let role = 'Координация';
                    const producers = ['София Кондратьева'];
                    if (producers.includes(key)) {
                        role = 'Продюсеры';
                    }
                    
                    const numValue = parseFloat(value) || 0;
                    if (numValue >= 0) {
                        convertedData.push({
                            id: DataManager.generateId(),
                            date: new Date().toLocaleDateString('ru-RU'),
                            manager: key,
                            category: role,
                            indicator: indicator,
                            value: numValue * 100,
                            month: month,
                            source: 'csv',
                            appeal: { status: 'none', note: '', createdAt: null }
                        });
                    }
                }
            });
        }
    });
    
    return convertedData;
}

function extractMonthFromFileName(fileName) {
    const monthMap = {
        'yanvar': 'Январь', 'ianvar': 'Январь',
        'fevral': 'Февраль',
        'mart': 'Март',
        'aprel': 'Апрель',
        'mai': 'Май',
        'iyun': 'Июнь',
        'iyul': 'Июль', 'iiul': 'Июль',
        'avgust': 'Август'
    };
    
    const lowerFileName = fileName.toLowerCase();
    for (const [key, value] of Object.entries(monthMap)) {
        if (lowerFileName.includes(key)) {
            return value;
        }
    }
    
    // Fallback
    const currentMonth = new Date().toLocaleDateString('ru-RU', { month: 'long' });
    return currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
}

function saveFileInfo(fileName, recordCount, type) {
    const key = `${type}History`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    
    history.unshift({
        fileName,
        recordCount,
        uploadDate: new Date().toLocaleString('ru-RU'),
        type: 'file'
    });
    
    // Ограничиваем историю 50 файлами
    if (history.length > 50) {
        history.splice(50);
    }
    
    localStorage.setItem(key, JSON.stringify(history));
}

// =====================================================
// ИСТОРИЯ ОПЕРАЦИЙ
// =====================================================
function updateHistory(type) {
    // Обновляем последние записи
    updateRecentRecords(type);
    
    // Обновляем список файлов
    updateFilesList(type);
}

function updateRecentRecords(type) {
    const data = type === 'op' ? DataManager.getOPData() : DataManager.getProdData();
    const tableBody = document.querySelector(`#${type}-recent-table tbody`);
    
    if (!tableBody) return;
    
    const recentData = data.slice(0, 20); // Последние 20 записей
    
    tableBody.innerHTML = recentData.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${record.manager}</td>
            ${type === 'prod' ? `<td>${record.category}</td>` : ''}
            <td>${record.indicator}</td>
            <td class="${getScoreClass(record.value)}">${record.value}%</td>
            <td>${record.month}</td>
            <td>
                <span class="source-badge ${record.source}">${record.source}</span>
            </td>
        </tr>
    `).join('');
}

function updateFilesList(type) {
    const key = `${type}History`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    const container = document.getElementById(`${type}-files-list`);
    
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '<p class="no-files">Файлы еще не загружались</p>';
        return;
    }
    
    container.innerHTML = history.map(file => `
        <div class="file-item">
            <div class="file-info">
                <h4>${file.fileName}</h4>
                <p>Записей: ${file.recordCount} | Загружен: ${file.uploadDate}</p>
            </div>
        </div>
    `).join('');
}

function showHistoryTab(type, tab) {
    // Переключение вкладок
    document.querySelectorAll(`#${type}-admin-page .tab-btn`).forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Показ контента
    document.querySelectorAll(`#${type}-history-recent, #${type}-history-files`).forEach(content => {
        content.style.display = 'none';
    });
    
    document.getElementById(`${type}-history-${tab}`).style.display = 'block';
}

// =====================================================
// ДАШБОРДЫ
// =====================================================
function initOPDashboard() {
    console.log('📊 Инициализация дашборда ОП');
    
    const data = DataManager.getOPData();
    console.log(`📋 Данных для ОП дашборда: ${data.length}`);
    
    // Инициализация фильтров
    initializeFilters('op', data);
    
    // Рендер дашборда
    renderDashboard('op', data);
}

function initProdDashboard() {
    console.log('📈 Инициализация дашборда Продакшн');
    
    const data = DataManager.getProdData();
    console.log(`📋 Данных для Продакшн дашборда: ${data.length}`);
    
    // Инициализация фильтров
    initializeFilters('prod', data);
    
    // Рендер дашборда
    renderDashboard('prod', data);
}

function initializeFilters(type, data) {
    // Получение уникальных значений
    const months = [...new Set(data.map(r => r.month).filter(Boolean))]
        .sort((a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b));
    
    const managers = [...new Set(data.map(r => r.manager).filter(Boolean))]
        .filter(name => name && name.length > 2)
        .sort();
    
    const categories = [...new Set(data.map(r => r.category).filter(Boolean))].sort();
    
    console.log(`🔍 Фильтры ${type}: месяцы=${months.length}, сотрудники=${managers.length}, категории=${categories.length}`);
    
    // Заполнение селекторов
    const monthSelect = document.getElementById(`${type}-dash-month`);
    const managerSelect = document.getElementById(`${type}-dash-manager`);
    const categorySelect = document.getElementById(`${type}-dash-category`);
    
    if (monthSelect) {
        monthSelect.innerHTML = '<option value="">Все месяцы</option>' +
            months.map(m => `<option value="${m}">${m}</option>`).join('');
    }
    
    if (managerSelect) {
        const label = type === 'op' ? 'сотрудники' : 'специалисты';
        managerSelect.innerHTML = `<option value="">Все ${label}</option>` +
            managers.map(m => `<option value="${m}">${m}</option>`).join('');
    }
    
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Все роли</option>' +
            categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    
    // Добавление обработчиков событий
    [monthSelect, managerSelect, categorySelect].forEach(select => {
        if (select) {
            select.addEventListener('change', () => {
                console.log(`🔄 Фильтр изменен: ${select.id}="${select.value}"`);
                renderDashboard(type, data);
            });
        }
    });
}

function applyFilters(type, data) {
    const monthFilter = document.getElementById(`${type}-dash-month`)?.value || '';
    const managerFilter = document.getElementById(`${type}-dash-manager`)?.value || '';
    const categoryFilter = document.getElementById(`${type}-dash-category`)?.value || '';
    
    const filtered = data.filter(record => {
        const monthMatch = !monthFilter || record.month === monthFilter;
        const managerMatch = !managerFilter || record.manager === managerFilter;
        const categoryMatch = !categoryFilter || record.category === categoryFilter;
        
        return monthMatch && managerMatch && categoryMatch;
    });
    
    console.log(`📊 Отфильтровано ${filtered.length} из ${data.length} записей`);
    return filtered;
}

function renderDashboard(type, data) {
    console.log(`🎨 Рендер дашборда ${type}`);
    
    const filteredData = applyFilters(type, data);
    
    // Обновление KPI
    updateKPI(type, filteredData);
    
    // Обновление графиков
    updateCharts(type, filteredData);
    
    // Обновление рейтинга
    updateRating(type, filteredData);
    
    // Обновление апелляций
    updateAppeals(type, filteredData);
}

// =====================================================
// KPI БЛОКИ
// =====================================================
function updateKPI(type, data) {
    const totalChecks = data.length;
    const avgScore = totalChecks > 0 ? Math.round(data.reduce((sum, r) => sum + r.value, 0) / totalChecks) : 0;
    const activeManagers = new Set(data.map(r => r.manager)).size;
    const premiumCount = data.filter(r => r.value >= 85).length;
    
    // Обновление значений в DOM
    const elements = {
        [`${type}-total-checks`]: totalChecks,
        [`${type}-avg-score`]: `${avgScore}%`,
        [`${type}-active-managers`]: activeManagers,
        [`${type}-premium-count`]: premiumCount
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            element.classList.add('animate-update');
            setTimeout(() => element.classList.remove('animate-update'), 300);
        }
    });
    
    console.log(`📈 KPI обновлен: проверок=${totalChecks}, средний балл=${avgScore}%, активных=${activeManagers}, премии=${premiumCount}`);
}

// =====================================================
// ГРАФИКИ
// =====================================================
function updateCharts(type, data) {
    // Тренд по месяцам
    updateTrendChart(type, data);
    
    // Радар по показателям
    updateRadarChart(type, data);
}

function updateTrendChart(type, data) {
    const canvas = document.getElementById(`${type}-trend-chart`);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Группировка по месяцам
    const monthlyData = {};
    data.forEach(record => {
        if (!monthlyData[record.month]) {
            monthlyData[record.month] = [];
        }
        monthlyData[record.month].push(record.value);
    });
    
    // Вычисление средних значений
    const chartData = MONTHS_ORDER.map(month => {
        const values = monthlyData[month] || [];
        return values.length > 0 ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0;
    }).filter((val, index) => monthlyData[MONTHS_ORDER[index]]);
    
    const labels = MONTHS_ORDER.filter(month => monthlyData[month]);
    
    // Уничтожение старого графика
    if (charts[`${type}-trend`]) {
        charts[`${type}-trend`].destroy();
    }
    
    // Создание нового графика
    charts[`${type}-trend`] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Средний балл по месяцам',
                data: chartData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f1f5f9',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) { return value + '%'; }
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                }
            }
        }
    });
}

function updateRadarChart(type, data) {
    const canvas = document.getElementById(`${type}-radar-chart`);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Группировка по показателям
    const indicatorData = {};
    data.forEach(record => {
        if (!indicatorData[record.indicator]) {
            indicatorData[record.indicator] = [];
        }
        indicatorData[record.indicator].push(record.value);
    });
    
    // Вычисление средних значений по показателям
    const indicators = Object.keys(indicatorData).slice(0, 6); // Максимум 6 показателей
    const averages = indicators.map(indicator => {
        const values = indicatorData[indicator];
        return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
    });
    
    // Уничтожение старого графика
    if (charts[`${type}-radar`]) {
        charts[`${type}-radar`].destroy();
    }
    
    // Создание нового графика
    charts[`${type}-radar`] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: indicators.map(ind => ind.length > 20 ? ind.substring(0, 20) + '...' : ind),
            datasets: [{
                label: 'Показатели качества',
                data: averages,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f1f5f9',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#94a3b8',
                        backdropColor: 'transparent',
                        callback: function(value) { return value + '%'; }
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
                    pointLabels: {
                        color: '#f1f5f9',
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

// =====================================================
// РЕЙТИНГ СОТРУДНИКОВ
// =====================================================
function updateRating(type, data) {
    const tableBody = document.querySelector(`#${type}-rating-table tbody`);
    if (!tableBody) return;
    
    // Группировка по сотрудникам
    const managerStats = {};
    data.forEach(record => {
        if (!managerStats[record.manager]) {
            managerStats[record.manager] = {
                manager: record.manager,
                category: record.category,
                totalScore: 0,
                count: 0,
                values: []
            };
        }
        managerStats[record.manager].totalScore += record.value;
        managerStats[record.manager].count += 1;
        managerStats[record.manager].values.push(record.value);
    });
    
    // Вычисление средних баллов и сортировка
    const ranking = Object.values(managerStats)
        .map(stat => ({
            ...stat,
            avgScore: Math.round(stat.totalScore / stat.count),
            isPremium: (stat.totalScore / stat.count) >= 85
        }))
        .sort((a, b) => b.avgScore - a.avgScore);
    
    // Генерация HTML таблицы
    tableBody.innerHTML = ranking.map((stat, index) => `
        <tr class="ranking-row">
            <td class="rank">${index + 1}</td>
            <td class="manager-name">${stat.manager}</td>
            ${type === 'prod' ? `<td class="category">${stat.category}</td>` : ''}
            <td class="score ${getScoreClass(stat.avgScore)}">${stat.avgScore}%</td>
            <td class="count">${stat.count}</td>
            <td class="premium">
                ${stat.isPremium ? '<span class="premium-indicator"><span class="premium-star">⭐</span> Премия</span>' : ''}
            </td>
        </tr>
    `).join('');
    
    console.log(`🏆 Рейтинг обновлен: ${ranking.length} участников`);
}

function getScoreClass(score) {
    if (score >= 85) return 'score-high';
    if (score >= 75) return 'score-medium';
    return 'score-low';
}

// =====================================================
// СИСТЕМА АПЕЛЛЯЦИЙ
// =====================================================
function updateAppeals(type, data) {
    const appealsData = data.filter(record => record.appeal && record.appeal.status !== 'none');
    const container = document.querySelector(`#${type}-appeals-content .appeals-list`);
    
    if (!container) return;
    
    if (appealsData.length === 0) {
        container.innerHTML = '<p class="no-appeals">Апелляций нет</p>';
        return;
    }
    
    container.innerHTML = appealsData.map(record => `
        <div class="appeal-item">
            <div class="appeal-header">
                <strong>${record.manager}</strong>
                <span class="appeal-status ${record.appeal.status}">${getAppealStatusText(record.appeal.status)}</span>
            </div>
            <div class="appeal-details">
                <p><strong>Показатель:</strong> ${record.indicator}</p>
                <p><strong>Оценка:</strong> <span class="${getScoreClass(record.value)}">${record.value}%</span></p>
                <p><strong>Причина:</strong> ${record.appeal.note}</p>
                <p><strong>Дата:</strong> ${new Date(record.appeal.createdAt).toLocaleString('ru-RU')}</p>
            </div>
        </div>
    `).join('');
}

function getAppealStatusText(status) {
    const statusMap = {
        'new': 'Новая',
        'processing': 'На рассмотрении',
        'resolved': 'Решена'
    };
    return statusMap[status] || status;
}

function showAppeals(type, filter) {
    // Переключение вкладок
    document.querySelectorAll(`#${type}-appeals-content .tab-btn`).forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Здесь можно добавить логику фильтрации апелляций
    const data = type === 'op' ? DataManager.getOPData() : DataManager.getProdData();
    const filteredData = applyFilters(type, data);
    updateAppeals(type, filteredData);
}

// =====================================================
// МОДАЛЬНЫЕ ОКНА И АПЕЛЛЯЦИИ
// =====================================================
function openAppealModal(recordId) {
    const modal = document.getElementById('appeal-modal');
    const recordIdInput = document.getElementById('appeal-record-id');
    
    if (modal && recordIdInput) {
        recordIdInput.value = recordId;
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Обработчик формы апелляции
document.addEventListener('DOMContentLoaded', function() {
    const appealForm = document.getElementById('appeal-form');
    if (appealForm) {
        appealForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const recordId = document.getElementById('appeal-record-id').value;
            const reason = document.getElementById('appeal-reason').value;
            
            if (recordId && reason) {
                submitAppeal(recordId, reason);
                closeModal('appeal-modal');
                document.getElementById('appeal-reason').value = '';
            }
        });
    }
});

function submitAppeal(recordId, reason) {
    // Поиск записи в ОП данных
    let opData = DataManager.getOPData();
    let record = opData.find(r => r.id === recordId);
    let type = 'op';
    
    // Если не найдено в ОП, ищем в Продакшн
    if (!record) {
        let prodData = DataManager.getProdData();
        record = prodData.find(r => r.id === recordId);
        type = 'prod';
    }
    
    if (record) {
        record.appeal = {
            status: 'new',
            note: reason,
            createdAt: Date.now()
        };
        
        // Сохранение данных
        if (type === 'op') {
            DataManager.saveOPData(opData);
        } else {
            DataManager.saveProdData(prodData);
        }
        
        showNotification('✅ Апелляция подана успешно');
        
        // Обновление дашборда если он открыт
        if (currentPage === `${type}-dashboard`) {
            const data = type === 'op' ? DataManager.getOPData() : DataManager.getProdData();
            renderDashboard(type, data);
        }
    }
}

// =====================================================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// =====================================================
function clearFilters(type) {
    const selectors = [
        `${type}-dash-month`,
        `${type}-dash-manager`,
        `${type}-dash-category`
    ];
    
    selectors.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
    
    // Перерендер дашборда
    const data = type === 'op' ? DataManager.getOPData() : DataManager.getProdData();
    renderDashboard(type, data);
    
    showNotification('🔄 Фильтры очищены');
}

function exportData(type) {
    const data = type === 'op' ? DataManager.getOPData() : DataManager.getProdData();
    const filteredData = applyFilters(type, data);
    
    if (filteredData.length === 0) {
        showNotification('❌ Нет данных для экспорта', 'warning');
        return;
    }
    
    // Конвертация в CSV
    const headers = type === 'op' 
        ? ['Дата', 'Сотрудник', 'Показатель', 'Оценка', 'Месяц', 'Источник']
        : ['Дата', 'Специалист', 'Роль', 'Показатель', 'Оценка', 'Месяц', 'Источник'];
    
    const csvContent = [
        headers.join(','),
        ...filteredData.map(record => [
            record.date,
            record.manager,
            ...(type === 'prod' ? [record.category] : []),
            `"${record.indicator}"`,
            record.value,
            record.month,
            record.source
        ].join(','))
    ].join('\n');
    
    // Скачивание файла
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`📁 Экспортировано ${filteredData.length} записей`);
}

// =====================================================
// УВЕДОМЛЕНИЯ
// =====================================================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Скрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
    
    console.log(`📢 Уведомление: ${message}`);
}

// =====================================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM загружен, инициализация приложения');
    
    // Закрытие модальных окон по клику вне них
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Инициализация тестовых данных если их нет
    if (DataManager.getOPData().length === 0) {
        DataManager.saveOPData(DataManager.generateTestOPData());
    }
    
    if (DataManager.getProdData().length === 0) {
        DataManager.saveProdData(DataManager.generateTestProdData());
    }
    
    // Инициализация проверочных панелей
    initQualityPanels();
    
    console.log('🎯 Система управления качеством готова к работе!');
    showNotification('🚀 Система успешно инициализирована!');
});

// =====================================================
// КАЧЕСТВЕННЫЕ ПРОВЕРОЧНЫЕ ПАНЕЛИ
// =====================================================

// Инициализация проверочных панелей
function initQualityPanels() {
    console.log('🔍 Инициализация проверочных панелей...');
    
    // Инициализация ОП панели
    const opForm = document.getElementById('op-quality-form');
    if (opForm) {
        opForm.addEventListener('submit', (e) => handleQualityFormSubmit('op', e));
        initScreenshotUpload('op');
        renderQualityResults('op');
        
        // Установка сегодняшней даты по умолчанию
        const dateInput = document.getElementById('op-check-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Инициализация Продакшн панели
    const prodForm = document.getElementById('prod-quality-form');
    if (prodForm) {
        prodForm.addEventListener('submit', (e) => handleQualityFormSubmit('prod', e));
        initScreenshotUpload('prod');
        renderQualityResults('prod');
        
        // Установка сегодняшней даты по умолчанию
        const dateInput = document.getElementById('prod-check-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    console.log('✅ Проверочные панели инициализированы');
}

// Функции для работы с индикаторами
window.setIndicator = function(department, indicator, value) {
    const input = document.getElementById(`${department}-${indicator}`);
    const buttons = document.querySelectorAll(`[onclick*="setIndicator('${department}', '${indicator}',"]`);
    
    // Сброс всех кнопок для этого индикатора
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Активируем выбранную кнопку
    const activeBtn = Array.from(buttons).find(btn => btn.onclick.toString().includes(`'${value}'`));
    if (activeBtn) activeBtn.classList.add('active');
    
    // Устанавливаем значение
    if (input) input.value = value;
    
    console.log(`Индикатор ${department}.${indicator} = ${value}`);
};

window.clearIndicator = function(department, indicator) {
    const input = document.getElementById(`${department}-${indicator}`);
    const buttons = document.querySelectorAll(`[onclick*="setIndicator('${department}', '${indicator}',"]`);
    
    // Сброс всех кнопок
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Очищаем значение
    if (input) input.value = '';
    
    console.log(`Индикатор ${department}.${indicator} очищен`);
};

window.clearQualityForm = function(department) {
    const form = document.getElementById(`${department}-quality-form`);
    if (!form) return;
    
    // Очищаем все поля формы
    form.reset();
    
    // Очищаем все индикаторы
    const buttons = form.querySelectorAll('.indicator-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Очищаем скриншот
    removeScreenshot(department);
    
    showNotification('🧹 Форма очищена');
};

// Drag & Drop для скриншотов
window.initScreenshotUpload = function(department) {
    const dropZone = document.getElementById(`${department}-screenshot-drop`);
    const fileInput = document.getElementById(`${department}-screenshot-input`);
    const preview = document.getElementById(`${department}-screenshot-preview`);
    const img = document.getElementById(`${department}-screenshot-img`);
    
    if (!dropZone || !fileInput) return;
    
    // Клик по зоне открывает файловый диалог
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag & Drop события
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleScreenshotFile(files[0], department);
        }
    });
    
    // Обработка выбора файла
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleScreenshotFile(e.target.files[0], department);
        }
    });
};

function handleScreenshotFile(file, department) {
    if (!file.type.startsWith('image/')) {
        showNotification('❌ Можно загружать только изображения', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
        showNotification('❌ Размер файла не должен превышать 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById(`${department}-screenshot-preview`);
        const img = document.getElementById(`${department}-screenshot-img`);
        const dropZone = document.querySelector(`#${department}-screenshot-drop .drop-zone`);
        
        if (img && preview) {
            img.src = e.target.result;
            preview.style.display = 'inline-block';
            
            // Скрываем текст загрузки
            const p = dropZone.querySelector('p');
            if (p) p.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
    
    showNotification('📸 Скриншот загружен');
}

window.removeScreenshot = function(department) {
    const preview = document.getElementById(`${department}-screenshot-preview`);
    const img = document.getElementById(`${department}-screenshot-img`);
    const fileInput = document.getElementById(`${department}-screenshot-input`);
    const dropZone = document.querySelector(`#${department}-screenshot-drop .drop-zone`);
    
    if (preview) preview.style.display = 'none';
    if (img) img.src = '';
    if (fileInput) fileInput.value = '';
    
    // Показываем текст загрузки
    const p = dropZone?.querySelector('p');
    if (p) p.style.display = 'block';
    
    showNotification('🗑️ Скриншот удален');
};

// Обработчики форм качественных проверок
function handleQualityFormSubmit(department, e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    
    // Собираем данные формы
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Собираем данные индикаторов
    const indicators = {};
    const indicatorInputs = e.target.querySelectorAll('input[type="hidden"][name]');
    indicatorInputs.forEach(input => {
        if (input.value) {
            indicators[input.name] = input.value;
        }
    });
    
    // Получаем скриншот
    const img = document.getElementById(`${department}-screenshot-img`);
    const screenshot = img && img.src.startsWith('data:') ? img.src : null;
    
    // Создаем запись
    const record = {
        id: Date.now(),
        date: data.date || new Date().toISOString().split('T')[0],
        manager: data.manager,
        department: department.toUpperCase(),
        dealLink: data.dealLink || '',
        dealId: data.dealId || '',
        comment: data.comment || '',
        indicators: indicators,
        screenshot: screenshot,
        created: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    const storageKey = `${department}QualityChecks`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingData.push(record);
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    
    // Обновляем таблицу результатов
    renderQualityResults(department);
    
    // Очищаем форму
    clearQualityForm(department);
    
    showNotification('✅ Проверка сохранена успешно!');
}

// Рендер таблицы результатов
function renderQualityResults(department) {
    const table = document.getElementById(`${department}-quality-results`);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const storageKey = `${department}QualityChecks`;
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    tbody.innerHTML = '';
    
    // Сортируем по дате (новые сначала)
    data.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    data.forEach(record => {
        const row = document.createElement('tr');
        
        if (department === 'op') {
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.manager || '-'}</td>
                <td>${renderIndicatorBadge(record.indicators?.kev)}</td>
                <td>${renderIndicatorBadge(record.indicators?.deadlines)}</td>
                <td>${renderIndicatorBadge(record.indicators?.communication)}</td>
                <td>${renderIndicatorBadge(record.indicators?.crm)}</td>
                <td>${record.comment || '-'}</td>
                <td>
                    ${record.dealLink ? `<a href="${record.dealLink}" target="_blank">🔗</a>` : ''}
                    ${record.screenshot ? `<span onclick="showScreenshot('${record.screenshot}')" style="cursor: pointer;">📸</span>` : ''}
                    <button onclick="deleteQualityRecord('${department}', ${record.id})" class="btn-danger btn-sm">🗑️</button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.manager || '-'}</td>
                <td>${record.department}</td>
                <td>${renderIndicatorBadge(record.indicators?.stage)}</td>
                <td>${renderIndicatorBadge(record.indicators?.tz)}</td>
                <td>${renderIndicatorBadge(record.indicators?.executors)}</td>
                <td>${renderIndicatorBadge(record.indicators?.comments)}</td>
                <td>${renderIndicatorBadge(record.indicators?.inwork)}</td>
                <td>${renderIndicatorBadge(record.indicators?.fields)}</td>
                <td>${renderIndicatorBadge(record.indicators?.prepayment)}</td>
                <td>
                    ${record.dealLink ? `<a href="${record.dealLink}" target="_blank">🔗</a>` : ''}
                    ${record.screenshot ? `<span onclick="showScreenshot('${record.screenshot}')" style="cursor: pointer;">📸</span>` : ''}
                    <button onclick="deleteQualityRecord('${department}', ${record.id})" class="btn-danger btn-sm">🗑️</button>
                </td>
            `;
        }
        
        tbody.appendChild(row);
    });
}

function renderIndicatorBadge(value) {
    if (!value) return '<span class="quality-indicator-badge empty">-</span>';
    if (value === 'good') return '<span class="quality-indicator-badge good">✓</span>';
    if (value === 'bad') return '<span class="quality-indicator-badge bad">✗</span>';
    return '<span class="quality-indicator-badge empty">-</span>';
}

window.deleteQualityRecord = function(department, recordId) {
    if (!confirm('Удалить эту проверку?')) return;
    
    const storageKey = `${department}QualityChecks`;
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const filteredData = data.filter(record => record.id !== recordId);
    localStorage.setItem(storageKey, JSON.stringify(filteredData));
    
    renderQualityResults(department);
    showNotification('🗑️ Проверка удалена');
};

window.showScreenshot = function(dataUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${dataUrl}" style="width: 100%; height: auto; border-radius: 8px;">
        </div>
    `;
    document.body.appendChild(modal);
    
    // Закрытие по клику вне изображения
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
};

// =====================================================
// ЭКСПОРТ ГЛОБАЛЬНЫХ ФУНКЦИЙ
// =====================================================
window.showPage = showPage;
window.showHistoryTab = showHistoryTab;
window.showAppeals = showAppeals;
window.clearFilters = clearFilters;
window.exportData = exportData;
window.closeModal = closeModal;
window.openAppealModal = openAppealModal;