// Simulate field data and alerts
function getRandomValue(min, max, decimals = 2) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
}

function updateFieldData() {
    document.getElementById('ndvi-value').textContent = getRandomValue(0.3, 0.9);
    document.getElementById('moisture-value').textContent = getRandomValue(10, 40) + '%';
    document.getElementById('temp-value').textContent = getRandomValue(18, 35) + '°C';
}

const alertMessages = [
    'Low soil moisture detected in Zone 3',
    'High temperature alert in North Field',
    'Drone battery low - return to base',
    'Possible pest infestation detected',
    'NDVI anomaly in South-East quadrant',
    'Drone completed scheduled survey',
];

function updateAlerts() {
    const alertsList = document.getElementById('alerts-list');
    alertsList.innerHTML = '';
    // Show 2-3 random alerts
    const shuffled = alertMessages.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
        const li = document.createElement('li');
        li.textContent = shuffled[i];
        alertsList.appendChild(li);
    }
}

function refreshDashboard() {
    updateFieldData();
    updateAlerts();
}

document.addEventListener('DOMContentLoaded', () => {
    refreshDashboard();
    setInterval(refreshDashboard, 5000);
    setupSidebarNavigation();
});

// --- Drone Dashboard Simulation ---
const flightStatuses = ['Stable', 'Ascending', 'Descending', 'Hovering', 'Landing'];
const drones = [
    { id: 'DR-001', field: 'North Field', status: 'Idle', battery: 100, flightTime: 0, pestAlarm: false, coords: { lat: 28.6139, lng: 77.2090 }, flightStatus: 'Stable' },
    { id: 'DR-002', field: 'East Field', status: 'Scanning', battery: 100, flightTime: 0, pestAlarm: false, coords: { lat: 28.6145, lng: 77.2102 }, flightStatus: 'Hovering' },
    { id: 'DR-003', field: 'South Field', status: 'Returning', battery: 85, flightTime: 12, pestAlarm: false, coords: { lat: 28.6122, lng: 77.2081 }, flightStatus: 'Descending' },
    { id: 'DR-004', field: 'West Field', status: 'Idle', battery: 100, flightTime: 0, pestAlarm: false, coords: { lat: 28.6151, lng: 77.2075 }, flightStatus: 'Stable' },
    { id: 'DR-005', field: 'Central Field', status: 'Scanning', battery: 92, flightTime: 7, pestAlarm: false, coords: { lat: 28.6130, lng: 77.2098 }, flightStatus: 'Ascending' },
];
const droneStatuses = ['Idle', 'Scanning', 'Returning'];
function getDroneStatusIcon(status) {
    if (status === 'Idle') return '<i class="fas fa-circle" style="color:#757575"></i>';
    if (status === 'Scanning') return '<i class="fas fa-spinner fa-spin" style="color:#388e3c"></i>';
    if (status === 'Returning') return '<i class="fas fa-undo" style="color:#ffb300"></i>';
    return '';
}
function updateDroneTable() {
    const tbody = document.getElementById('drone-table-body');
    tbody.innerHTML = '';
    drones.forEach((drone, idx) => {
        const tr = document.createElement('tr');
        // Drone ID
        tr.innerHTML += `<td>${drone.id}</td>`;
        // Field Name
        tr.innerHTML += `<td>${drone.field}</td>`;
        // Status dropdown + icon
        tr.innerHTML += `<td>${getDroneStatusIcon(drone.status)} <select class="drone-status-select" data-idx="${idx}">
            <option value="Idle"${drone.status === 'Idle' ? ' selected' : ''}>Idle</option>
            <option value="Scanning"${drone.status === 'Scanning' ? ' selected' : ''}>Scanning</option>
            <option value="Returning"${drone.status === 'Returning' ? ' selected' : ''}>Returning</option>
        </select></td>`;
        // Battery input
        tr.innerHTML += `<td><input type="number" min="0" max="100" class="drone-battery-input" data-idx="${idx}" value="${drone.battery}" style="width:50px;">%</td>`;
        // Flight Time input
        tr.innerHTML += `<td><input type="number" min="0" max="999" class="drone-flight-input" data-idx="${idx}" value="${drone.flightTime}" style="width:50px;"> min</td>`;
        // Coordinates
        tr.innerHTML += `<td class="drone-coords">${drone.coords.lat.toFixed(4)}, ${drone.coords.lng.toFixed(4)}</td>`;
        // Flight Status
        tr.innerHTML += `<td class="drone-flight-status">${drone.flightStatus}</td>`;
        // Pest Alarm and Simulate
        tr.innerHTML += `<td><button class="pest-alarm-btn${drone.pestAlarm ? ' active' : ''}" data-idx="${idx}">Activate Pest Alarm</button> <button class="simulate-btn simulate-drone-btn" title="Simulate Drone" data-idx="${idx}"><i class="fas fa-random"></i></button></td>`;
        tbody.appendChild(tr);
    });
    // Add event listeners for pest alarm buttons
    document.querySelectorAll('.pest-alarm-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = +btn.getAttribute('data-idx');
            activatePestAlarm(idx);
        };
    });
    // Add event listeners for simulate drone buttons
    document.querySelectorAll('.simulate-drone-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = +btn.getAttribute('data-idx');
            simulateSingleDrone(idx);
        };
    });
    // Add event listeners for status dropdowns
    document.querySelectorAll('.drone-status-select').forEach(sel => {
        sel.onchange = function() {
            const idx = +sel.getAttribute('data-idx');
            drones[idx].status = sel.value;
            updateDroneTable();
        };
    });
    // Add event listeners for battery inputs
    document.querySelectorAll('.drone-battery-input').forEach(input => {
        input.onchange = function() {
            const idx = +input.getAttribute('data-idx');
            let val = parseInt(input.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 100) val = 100;
            drones[idx].battery = val;
            updateDroneTable();
        };
    });
    // Add event listeners for flight time inputs
    document.querySelectorAll('.drone-flight-input').forEach(input => {
        input.onchange = function() {
            const idx = +input.getAttribute('data-idx');
            let val = parseInt(input.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 999) val = 999;
            drones[idx].flightTime = val;
            updateDroneTable();
        };
    });
    renderDroneFieldMap('drone-field-map');
    renderDroneFieldMap('drone-field-map-2');
}
function simulateSingleDrone(idx) {
    drones[idx].status = randomFromArray(droneStatuses);
    drones[idx].battery = Math.floor(Math.random() * 81) + 20;
    drones[idx].flightTime = Math.floor(Math.random() * 30);
    // Simulate coordinates (random walk around base)
    drones[idx].coords.lat += (Math.random() - 0.5) * 0.01;
    drones[idx].coords.lng += (Math.random() - 0.5) * 0.01;
    // Simulate flight status
    drones[idx].flightStatus = randomFromArray(flightStatuses);
    updateDroneTable();
    renderDroneFieldMap('drone-field-map');
    renderDroneFieldMap('drone-field-map-2');
}
function simulateDroneOps() {
    drones.forEach(drone => {
        // Simulate status change
        if (Math.random() < 0.03) {
            drone.status = droneStatuses[Math.floor(Math.random() * droneStatuses.length)];
        }
        // Simulate battery drain if not idle
        if (drone.status !== 'Idle') {
            drone.battery = Math.max(0, drone.battery - Math.floor(Math.random() * 3));
            drone.flightTime += 1;
        } else {
            drone.flightTime = 0;
        }
        // Auto return if battery low
        if (drone.battery < 20 && drone.status !== 'Returning') {
            drone.status = 'Returning';
        }
        // Recharge if idle and battery < 100
        if (drone.status === 'Idle' && drone.battery < 100) {
            drone.battery = Math.min(100, drone.battery + 2);
        }
    });
    updateDroneTable();
    renderDroneFieldMap('drone-field-map');
    renderDroneFieldMap('drone-field-map-2');
}
function activatePestAlarm(idx) {
    drones[idx].pestAlarm = true;
    updateDroneTable();
    // Flash row or button
    const btn = document.querySelectorAll('.pest-alarm-btn')[idx];
    btn.classList.add('pest-alarm-flash');
    // Optional: play sound
    // let audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3');
    // audio.play();
    // Show alarm message
    showAlert(`Pest alarm activated for ${drones[idx].id}!`, 'danger');
    setTimeout(() => {
        drones[idx].pestAlarm = false;
        btn.classList.remove('pest-alarm-flash');
        updateDroneTable();
    }, 3000);
}

// --- Crop Health Monitoring ---
const cropStages = ['Germination', 'Maturation', 'Harvest-ready'];
const cropStageIcons = ['<i class="fas fa-seedling"></i>', '<i class="fas fa-leaf"></i>', '<i class="fas fa-tractor"></i>'];
const cropHealthStates = [
    { status: 'Healthy', icon: '✅', class: 'health-status-healthy' },
    { status: 'Moderate', icon: '🟡', class: 'health-status-moderate' },
    { status: 'At Risk', icon: '❌', class: 'health-status-risk' },
    { status: 'Disease', icon: '⚠️', class: 'health-status-disease' },
];
let cropStageIdx = 0;
let cropHealthIdx = 0;
function updateCropHealth() {
    const el = document.getElementById('crop-health-status');
    if (!el) return;
    el.innerHTML = '';
    // Stage
    const stageDiv = document.createElement('div');
    stageDiv.className = `crop-stage crop-stage-${cropStages[cropStageIdx].toLowerCase().replace(/\s/g, '-')}`;
    stageDiv.innerHTML = `${cropStageIcons[cropStageIdx]} Growth Stage: <b>${cropStages[cropStageIdx]}</b>`;
    el.appendChild(stageDiv);
    // Health
    const health = cropHealthStates[cropHealthIdx];
    const healthDiv = document.createElement('div');
    healthDiv.className = `crop-health-row ${health.class}`;
    healthDiv.innerHTML = `Health Status: <span>${health.icon} ${health.status}</span>`;
    el.appendChild(healthDiv);
}
function progressCropStage() {
    cropStageIdx = (cropStageIdx + 1) % cropStages.length;
    cropHealthIdx = Math.floor(Math.random() * cropHealthStates.length);
    updateCropHealth();
}

// --- Weather Monitoring ---
const weatherIcons = {
    temp: '<i class="fas fa-temperature-high weather-icon"></i>',
    humidity: '<i class="fas fa-tint weather-icon"></i>',
    rain: '<i class="fas fa-cloud-showers-heavy weather-icon"></i>',
    wind: '<i class="fas fa-wind weather-icon"></i>',
};
let weather = { temp: 25, humidity: 60, rain: 10, wind: 8 };
function simulateWeather() {
    weather.temp = (18 + Math.random() * 15).toFixed(1);
    weather.humidity = (40 + Math.random() * 40).toFixed(0);
    weather.rain = (Math.random() * 100).toFixed(0);
    weather.wind = (2 + Math.random() * 18).toFixed(1);
    updateWeatherWidget();
}
function updateWeatherWidget() {
    const el = document.getElementById('weather-widget');
    if (!el) return;
    el.innerHTML = `
        <div class="weather-row">${weatherIcons.temp} <b>Temperature:</b> ${weather.temp}°C</div>
        <div class="weather-row">${weatherIcons.humidity} <b>Humidity:</b> ${weather.humidity}%</div>
        <div class="weather-row">${weatherIcons.rain} <b>Rain %:</b> ${weather.rain}%</div>
        <div class="weather-row">${weatherIcons.wind} <b>Wind Speed:</b> ${weather.wind} km/h</div>
    `;
}

// --- Enhanced Virtual Fencing ---
let fenceBreached = false;
let patrolAnimT = 0; // 0 to 1
let patrolDir = 1;
function updateVirtualFence() {
    const el = document.getElementById('virtual-fence');
    if (!el) return;
    el.innerHTML = '';
    // Fence box
    const box = document.createElement('div');
    box.className = 'virtual-fence-box' + (fenceBreached ? ' virtual-fence-breach' : '');
    // Radar sweep
    const radar = document.createElement('div');
    radar.className = 'radar-sweep';
    radar.innerHTML = '<div class="radar-sweep-arc"></div>';
    box.appendChild(radar);
    // Patrol dot animation (move smoothly along perimeter)
    const w = 180, h = 120, r = 9; // box size and dot radius
    const perim = 2 * (w + h - 2 * r);
    let t = patrolAnimT % 1;
    let x, y;
    if (t < w / perim) { // top edge
        x = t * perim;
        y = 0;
    } else if (t < (w + h - 2 * r) / perim) { // right edge
        x = w - r;
        y = (t * perim - w);
    } else if (t < (w + h + w - 2 * r) / perim) { // bottom edge
        x = w - (t * perim - (w + h - 2 * r));
        y = h - r;
    } else { // left edge
        x = 0;
        y = h - (t * perim - (w + h + w - 2 * r));
    }
    const patrol = document.createElement('div');
    patrol.className = 'patrol-dot';
    patrol.style.left = `${x}px`;
    patrol.style.top = `${y}px`;
    box.appendChild(patrol);
    // Breach icon
    if (fenceBreached) {
        const breachIcon = document.createElement('div');
        breachIcon.className = 'fence-breach-icon';
        breachIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        box.appendChild(breachIcon);
    }
    el.appendChild(box);
    // Breach alert
    if (fenceBreached) {
        const alert = document.createElement('div');
        alert.className = 'fence-alert';
        alert.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Fence Breach Detected!';
        el.appendChild(alert);
    }
}
function animatePatrolDot() {
    // Move dot smoothly
    patrolAnimT += 0.004 * patrolDir; // speed
    if (patrolAnimT > 1) patrolAnimT = 0;
    updateVirtualFence();
    requestAnimationFrame(animatePatrolDot);
}
function simulateFence() {
    // Random breach
    fenceBreached = Math.random() < 0.1;
}
// Start patrol animation
requestAnimationFrame(animatePatrolDot);

// --- Crop Advisor Panel ---
const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Silty'];
const cropOptions = [
    { name: 'Maize', icon: '🌽' },
    { name: 'Tomato', icon: '🍅' },
    { name: 'Potato', icon: '🥔' },
    { name: 'Wheat', icon: '🌾' },
    { name: 'Soybean', icon: '🫘' },
    { name: 'Carrot', icon: '🥕' },
];
function getSimulatedFieldData() {
    return {
        soil: soilTypes[Math.floor(Math.random() * soilTypes.length)],
        pH: (5.5 + Math.random() * 2).toFixed(1),
        moisture: (10 + Math.random() * 30).toFixed(1),
        temp: (18 + Math.random() * 15).toFixed(1),
    };
}
function getCropRecommendations(fieldData) {
    // Simple logic: recommend based on soil and pH
    let recs = [];
    if (fieldData.soil === 'Loamy' && fieldData.pH > 6) recs = [0, 3, 1];
    else if (fieldData.soil === 'Sandy') recs = [1, 5, 2];
    else if (fieldData.soil === 'Clay') recs = [2, 4, 0];
    else recs = [3, 0, 1];
    return recs.map(i => cropOptions[i]);
}
function updateCropAdvisor() {
    const el = document.getElementById('crop-advisor-content');
    if (!el) return;
    const fieldData = getSimulatedFieldData();
    const recs = getCropRecommendations(fieldData);
    el.innerHTML = `
        <div><b>Soil Type:</b> ${fieldData.soil}</div>
        <div><b>pH:</b> ${fieldData.pH}</div>
        <div><b>Moisture:</b> ${fieldData.moisture}%</div>
        <div><b>Temperature:</b> ${fieldData.temp}°C</div>
        <div class="crop-recommendations">
            ${recs.map(crop => `<span class="crop-recommendation">${crop.icon} ${crop.name}</span>`).join('')}
        </div>
    `;
}
document.getElementById('ask-crop-ai').onclick = updateCropAdvisor;

// --- Alert Helper ---
function showAlert(msg, type = 'info') {
    // Simple alert (could be improved)
    alert(msg);
}

// --- Sample Alerts ---
const sampleAlerts = [
    { type: 'danger', message: 'Fence breach detected in North Field!', time: '09:12' },
    { type: 'warning', message: 'Drone DR-002 battery low (18%)', time: '09:10' },
    { type: 'info', message: 'Weather: Rain expected in 30 minutes', time: '09:05' },
    { type: 'danger', message: 'Pest alarm triggered by DR-001', time: '08:59' },
    { type: 'info', message: 'Crop Advisor: Maize recommended for East Field', time: '08:50' },
];
function renderSampleAlerts() {
    let el = document.getElementById('alerts-list');
    if (!el) {
        // Create widget if not present
        const container = document.createElement('div');
        container.className = 'widget alerts';
        container.innerHTML = '<h3><i class="fas fa-bell"></i> Recent Alerts</h3><ul id="alerts-list"></ul>';
        document.querySelector('.dashboard-widgets').appendChild(container);
        el = document.getElementById('alerts-list');
    }
    el.innerHTML = '';
    sampleAlerts.forEach(alert => {
        const li = document.createElement('li');
        li.className = `alert-${alert.type}`;
        li.innerHTML = `<span class="alert-time">${alert.time}</span> <span class="alert-msg">${alert.message}</span>`;
        el.appendChild(li);
    });
}

// --- Sample Fields Overview ---
const fieldsOverview = [
    { name: 'North Field', crop: 'Maize', area: '12 ha', lastScan: '09:10', status: 'Healthy' },
    { name: 'East Field', crop: 'Tomato', area: '8 ha', lastScan: '09:08', status: 'Moderate' },
    { name: 'South Field', crop: 'Potato', area: '10 ha', lastScan: '09:05', status: 'At Risk' },
    { name: 'West Field', crop: 'Wheat', area: '15 ha', lastScan: '08:59', status: 'Healthy' },
    { name: 'Central Field', crop: 'Soybean', area: '9 ha', lastScan: '09:12', status: 'Disease' },
];
function renderFieldsOverview(isFieldSection) {
    let el = document.getElementById(isFieldSection ? 'fields-overview-table-2' : 'fields-overview-table');
    if (!el) return;
    el.innerHTML = '';
    fieldsOverview.forEach((field, idx) => {
        const tr = document.createElement('tr');
        let statusClass = 'status-healthy';
        if (field.status === 'Moderate') statusClass = 'status-moderate';
        if (field.status === 'At Risk') statusClass = 'status-risk';
        if (field.status === 'Disease') statusClass = 'status-disease';
        tr.innerHTML = `<td>${field.name}</td><td>${field.crop}</td><td>${field.area}</td><td>${field.lastScan}</td><td class="${statusClass}">${field.status} <button class="simulate-btn simulate-field-btn" title="Simulate Field" data-idx="${idx}"><i class="fas fa-random"></i></button></td>`;
        el.appendChild(tr);
    });
    // Add event listeners for simulate field buttons
    document.querySelectorAll('.simulate-field-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = +btn.getAttribute('data-idx');
            simulateSingleField(idx);
        };
    });
}
function simulateSingleField(idx) {
    fieldsOverview[idx].crop = randomFromArray(crops);
    fieldsOverview[idx].area = (8 + Math.floor(Math.random() * 8)) + ' ha';
    fieldsOverview[idx].lastScan = (8 + Math.floor(Math.random() * 2)) + ':' + (10 + Math.floor(Math.random() * 50)).toString().padStart(2, '0');
    fieldsOverview[idx].status = randomFromArray(fieldStatuses);
    renderFieldsOverview(false);
}

// --- Main Loop ---
document.addEventListener('DOMContentLoaded', () => {
    updateDroneTable();
    updateCropHealth();
    updateWeatherWidget();
    updateVirtualFence();
    updateCropAdvisor();
    setInterval(simulateDroneOps, 4000);
    setInterval(progressCropStage, 60000);
    setInterval(simulateWeather, 10000);
    setInterval(simulateFence, 4000);
    renderSampleAlerts();
    renderFieldsOverview(false);
    setupSimulateButtons();
    setupStormButtons();
    setupAutoSimToggle();
    setupCustomAlertForm();
    setupSidebarNavigation();
    renderDroneFieldMap('drone-field-map');
    renderDroneFieldMap('drone-field-map-2');
});

function randomFromArray(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Simulate Drones
function simulateDrones() {
    drones.forEach(drone => {
        drone.status = randomFromArray(droneStatuses);
        drone.battery = Math.floor(Math.random() * 81) + 20; // 20-100%
        drone.flightTime = Math.floor(Math.random() * 30);
    });
    updateDroneTable();
    renderDroneFieldMap('drone-field-map');
    renderDroneFieldMap('drone-field-map-2');
}
// Simulate Fields
const crops = ['Maize', 'Tomato', 'Potato', 'Wheat', 'Soybean', 'Carrot'];
const fieldStatuses = ['Healthy', 'Moderate', 'At Risk', 'Disease'];
function simulateFields() {
    fieldsOverview.forEach(field => {
        field.crop = randomFromArray(crops);
        field.area = (8 + Math.floor(Math.random() * 8)) + ' ha';
        field.lastScan = (8 + Math.floor(Math.random() * 2)) + ':' + (10 + Math.floor(Math.random() * 50)).toString().padStart(2, '0');
        field.status = randomFromArray(fieldStatuses);
    });
    renderFieldsOverview(false);
}
// Simulate Alert
const alertTypes = ['info', 'warning', 'danger'];
function simulateAlert() {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    sampleAlerts.unshift({
        type: randomFromArray(alertTypes),
        message: randomFromArray(alertMessages),
        time
    });
    if (sampleAlerts.length > 7) sampleAlerts.pop();
    renderSampleAlerts();
}
// Wire up buttons
function setupSimulateButtons() {
    const btnDrones = document.getElementById('simulate-drones-btn');
    if (btnDrones) btnDrones.onclick = simulateDrones;
    const btnFields = document.getElementById('simulate-fields-btn');
    if (btnFields) btnFields.onclick = simulateFields;
    const btnAlert = document.getElementById('simulate-alert-btn');
    if (btnAlert) btnAlert.onclick = simulateAlert;
}

function setupSidebarNavigation() {
    const sidebarButtons = document.querySelectorAll('.sidebar nav ul li button');
    const sections = document.querySelectorAll('.dashboard-section');
    sidebarButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
            // Add active to parent li
            btn.parentElement.classList.add('active');
            // Hide all sections
            sections.forEach(sec => sec.style.display = 'none');
            // Show selected section
            const sectionId = btn.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) section.style.display = '';
            // Refresh widgets in the section
            if (sectionId === 'drone-section') updateDroneTable();
            if (sectionId === 'field-section') renderFieldsOverview(true);
            if (sectionId === 'alerts-section') renderSampleAlerts();
            if (sectionId === 'overview-section') {
                renderFieldsOverview(false);
                updateCropHealth();
                updateWeatherWidget();
                updateVirtualFence();
                updateCropAdvisor();
            }
        });
    });
}

let autoSimInterval = null;
function simulateStorm() {
    // Set stormy weather
    weather.temp = (12 + Math.random() * 3).toFixed(1);
    weather.humidity = (80 + Math.random() * 20).toFixed(0);
    weather.rain = (80 + Math.random() * 20).toFixed(0);
    weather.wind = (30 + Math.random() * 10).toFixed(1);
    updateWeatherWidget();
    // Set all drones to Returning, low battery, random flight status
    drones.forEach(drone => {
        drone.status = 'Returning';
        drone.battery = Math.floor(Math.random() * 16) + 5; // 5-20%
        drone.flightStatus = 'Descending';
    });
    updateDroneTable();
    // Set all fields to At Risk or Disease
    fieldsOverview.forEach(field => {
        field.status = Math.random() < 0.5 ? 'At Risk' : 'Disease';
    });
    renderFieldsOverview(false);
    // Add storm alert
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    sampleAlerts.unshift({
        type: 'danger',
        message: 'Severe storm detected! All drones returning to base.',
        time
    });
    if (sampleAlerts.length > 7) sampleAlerts.pop();
    renderSampleAlerts();
}
function setupStormButtons() {
    const btnStorm1 = document.getElementById('simulate-storm-btn');
    if (btnStorm1) btnStorm1.onclick = simulateStorm;
    const btnStorm2 = document.getElementById('simulate-storm-btn-alerts');
    if (btnStorm2) btnStorm2.onclick = simulateStorm;
}
// Auto-simulation logic
function startAutoSim() {
    if (autoSimInterval) return;
    autoSimInterval = setInterval(() => {
        simulateDrones();
        simulateFields();
        if (Math.random() < 0.5) simulateAlert();
        simulateWeather();
        simulateFence();
    }, 4000);
    document.getElementById('auto-sim-toggle').innerHTML = '<i class="fas fa-pause"></i>';
}
function stopAutoSim() {
    if (autoSimInterval) clearInterval(autoSimInterval);
    autoSimInterval = null;
    document.getElementById('auto-sim-toggle').innerHTML = '<i class="fas fa-play"></i>';
}
function setupAutoSimToggle() {
    const btn = document.getElementById('auto-sim-toggle');
    if (btn) btn.onclick = function() {
        if (autoSimInterval) stopAutoSim();
        else startAutoSim();
    };
}
// Custom alert form
function setupCustomAlertForm() {
    const form = document.getElementById('custom-alert-form');
    if (!form) return;
    form.onsubmit = function(e) {
        e.preventDefault();
        const type = document.getElementById('custom-alert-type').value;
        const msg = document.getElementById('custom-alert-msg').value.trim();
        if (!msg) return;
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        sampleAlerts.unshift({ type, message: msg, time });
        if (sampleAlerts.length > 7) sampleAlerts.pop();
        renderSampleAlerts();
        form.reset();
    };
}

function renderDroneFieldMap(mapId) {
    const map = document.getElementById(mapId);
    if (!map) return;
    map.innerHTML = '';
    // Define map bounds (mock, based on drone/field coords)
    const minLat = 28.611, maxLat = 28.616, minLng = 77.207, maxLng = 77.211;
    // Place fields
    fieldsOverview.forEach((field, i) => {
        // Place fields in a grid for demo
        const fx = 30 + (i % 3) * 90;
        const fy = 30 + Math.floor(i / 3) * 120;
        const marker = document.createElement('div');
        marker.className = 'field-marker';
        marker.style.left = fx + 'px';
        marker.style.top = fy + 'px';
        marker.innerHTML = '<i class="fas fa-seedling"></i>';
        map.appendChild(marker);
        // Label
        const label = document.createElement('div');
        label.className = 'field-marker-label';
        label.style.left = fx + 18 + 'px';
        label.style.top = fy + 36 + 'px';
        label.textContent = field.name;
        map.appendChild(label);
    });
    // Place drones
    drones.forEach((drone, i) => {
        // Map lat/lng to x/y
        const x = ((drone.coords.lng - minLng) / (maxLng - minLng)) * (map.offsetWidth - 40) + 20;
        const y = ((maxLat - drone.coords.lat) / (maxLat - minLat)) * (map.offsetHeight - 40) + 20;
        const marker = document.createElement('div');
        marker.className = 'drone-marker ' + drone.status.toLowerCase();
        marker.style.left = x + 'px';
        marker.style.top = y + 'px';
        marker.innerHTML = '<i class="fas fa-drone"></i>';
        map.appendChild(marker);
        // Label
        const label = document.createElement('div');
        label.className = 'drone-marker-label';
        label.style.left = x + 14 + 'px';
        label.style.top = y + 28 + 'px';
        label.textContent = drone.id;
        map.appendChild(label);
    });
} 