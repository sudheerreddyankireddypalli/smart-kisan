/**
 * Smart Kisan (స్మార్ట్ కిసాన్) - Single Page Application Core
 * Mobile-first, zero-framework, offline-resilient, Telugu-first farmer companion.
 */

// Application State
const state = {
    user: null,
    currentView: 'dashboard',
    crops: [],
    cycles: [],
    expenses: [],
    sales: [],
    batches: [],
    weather: null,
    mandi: null,
    offers: [],
    services: [],
    serviceFilter: '',
    profitReport: null,
    selectedExpenseCategory: 'fertilizer'
};

// 15 Standard Expense Categories
const EXPENSE_CATEGORIES = [
    { key: 'seed', icon: '🌱' },
    { key: 'fertilizer', icon: '🧪' },
    { key: 'pesticide', icon: '🧴' },
    { key: 'labour', icon: '👷' },
    { key: 'water', icon: '💧' },
    { key: 'electricity', icon: '⚡' },
    { key: 'tractor', icon: '🚜' },
    { key: 'machinery', icon: '⚙️' },
    { key: 'harvest', icon: '🌾' },
    { key: 'transport', icon: '🚚' },
    { key: 'drying', icon: '☀️' },
    { key: 'packing', icon: '📦' },
    { key: 'land_rent', icon: '🏞️' },
    { key: 'interest', icon: '💳' },
    { key: 'other', icon: '📝' }
];

// Helper to escape HTML and prevent XSS injection
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Indian Currency Formatter (₹)
function formatCurrency(num) {
    const val = parseFloat(num) || 0;
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// Format Date to Localized DD/MM/YYYY
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Toast Alert
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Network Online/Offline Detection
window.addEventListener('online', () => {
    showToast(t('network_restored_msg'), 'success');
});
window.addEventListener('offline', () => {
    showToast(t('network_offline_alert'), 'warning');
});

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initLanguage();
    applyTranslations();
    renderExpenseTiles();
    await checkAuth();
    await loadCropCatalog();
    navigateTo('dashboard');
});

// Theme Management
function initTheme() {
    const saved = localStorage.getItem('sk_theme') || 'light';
    setTheme(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sk_theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
}

// Language Toggle
function toggleLanguage() {
    const next = getCurrentLang() === 'te' ? 'en' : 'te';
    setLanguage(next);
    applyTranslations();
    renderExpenseTiles();
    refreshCurrentView();
}

function applyTranslations() {
    const lang = getCurrentLang();
    document.getElementById('langLabel').innerText = lang === 'te' ? 'English' : 'తెలుగు';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = t(key);
    });

    // Update user auth button text if not logged in
    if (!state.user) {
        document.getElementById('userShortName').innerText = t('nav_login');
    }
}

// Navigation Router
function navigateTo(viewId) {
    state.currentView = viewId;

    // Check auth guards for protected screens
    const protectedViews = ['cycles', 'expenses', 'sales', 'profit', 'batches', 'profile'];
    if (protectedViews.includes(viewId) && !state.user) {
        showToast(t('login_subtitle'));
        state.currentView = 'login';
        viewId = 'login';
    }

    // Toggle active screen view
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-nav') === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Load data for selected view
    refreshCurrentView();
}

function refreshCurrentView() {
    const viewId = state.currentView;
    switch (viewId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'cycles':
            loadCycles();
            break;
        case 'expenses':
            loadExpenses();
            break;
        case 'sales':
            loadSales();
            break;
        case 'profit':
            loadProfitCycleDropdown();
            break;
        case 'weather':
            loadWeather();
            break;
        case 'mandi':
            loadMandiRates();
            break;
        case 'offers':
            loadBuyerOffers();
            break;
        case 'reminders':
            loadReminders();
            break;
        case 'services':
            loadServices();
            break;
        case 'batches':
            loadBatches();
            break;
        case 'profile':
            renderProfile();
            break;
    }
}

function handleAuthNav() {
    if (state.user) {
        navigateTo('profile');
    } else {
        navigateTo('login');
    }
}

// Check Authentication Session
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            state.user = data.user;
            document.getElementById('userShortName').innerText = state.user.name.split(' ')[0];
        } else {
            state.user = null;
            document.getElementById('userShortName').innerText = t('nav_login');
        }
    } catch (e) {
        state.user = null;
    }
}

// Load Crop Catalog (40+ Crops)
async function loadCropCatalog() {
    try {
        const res = await fetch('/api/cycles/catalog');
        if (res.ok) {
            const data = await res.json();
            state.crops = data.crops || [];
            populateCropSelectOptions();
        }
    } catch (e) {
        console.error('Failed to load crop catalog', e);
    }
}

function populateCropSelectOptions() {
    const select = document.getElementById('cycleCropSelect');
    if (!select) return;
    const isTe = getCurrentLang() === 'te';

    select.innerHTML = `<option value="">-- ${isTe ? 'పంటను ఎంచుకోండి' : 'Select Crop'} --</option>`;
    state.crops.forEach(crop => {
        const label = isTe ? `${crop.te} (${crop.en})` : `${crop.en} (${crop.te})`;
        select.innerHTML += `<option value="${escapeHtml(crop.en)}" data-te="${escapeHtml(crop.te)}">${escapeHtml(label)}</option>`;
    });
    select.innerHTML += `<option value="CUSTOM">${isTe ? 'ఇతర పంట (టైప్ చేయండి)' : 'Other Crop (Type custom)'}</option>`;
}

function handleCropSelectChange(selectEl) {
    const customDiv = document.getElementById('customCropInputGroup');
    if (selectEl.value === 'CUSTOM') {
        customDiv.style.display = 'block';
        document.getElementById('cycleCustomCropName').setAttribute('required', 'required');
    } else {
        customDiv.style.display = 'none';
        document.getElementById('cycleCustomCropName').removeAttribute('required');
    }
}

// ------------------------------------------------------------------------
// Auth Handlers (Signup, Login, Logout, Delete Account)
// ------------------------------------------------------------------------
async function handleLoginSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });
        const data = await res.json();
        if (res.ok) {
            state.user = data.user;
            document.getElementById('userShortName').innerText = state.user.name.split(' ')[0];
            showToast(t('login_title') + ': ' + data.message, 'success');
            navigateTo('dashboard');
        } else {
            showToast(data.message || 'Login failed', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const stateVal = document.getElementById('signupState').value;
    const district = document.getElementById('signupDistrict').value.trim();
    const village = document.getElementById('signupVillage').value.trim();
    const consent = document.getElementById('signupConsent').checked;

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, password, state: stateVal, district, village, consent })
        });
        const data = await res.json();
        if (res.ok) {
            state.user = data.user;
            document.getElementById('userShortName').innerText = state.user.name.split(' ')[0];
            showToast(data.message, 'success');
            navigateTo('dashboard');
        } else {
            showToast(data.message || 'Signup failed', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

async function logoutUser() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    state.user = null;
    document.getElementById('userShortName').innerText = t('nav_login');
    showToast(t('nav_logout'), 'info');
    navigateTo('login');
}

async function deleteAccountPermanently() {
    const isTe = getCurrentLang() === 'te';
    const confirmMsg = isTe
        ? 'మీరు నిజంగా మీ ఖాతా మరియు మొత్తం డేటాను తొలగించాలనుకుంటున్నారా? మీ పంటలు, ఖర్చులు మరియు అమ్మకాల రికార్డులు మొత్తం శాశ్వతంగా తొలగిపోతాయి.'
        : 'Are you sure you want to permanently delete your account and all data? This cannot be undone.';

    if (!confirm(confirmMsg)) return;

    try {
        const res = await fetch('/api/auth/me', { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            state.user = null;
            document.getElementById('userShortName').innerText = t('nav_login');
            navigateTo('signup');
        } else {
            showToast(data.message || 'Deletion failed', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

function renderProfile() {
    const container = document.getElementById('profileDetailsContainer');
    if (!container || !state.user) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
            <div>
                <div class="stat-label">${isTe ? 'రైతు పేరు' : 'Farmer Name'}:</div>
                <div style="font-weight: 700; font-size: 1.1rem;">${escapeHtml(state.user.name)}</div>
            </div>
            <div>
                <div class="stat-label">${isTe ? 'మొబైల్ నంబర్' : 'Mobile Number'}:</div>
                <div style="font-weight: 700; font-size: 1.1rem;">${escapeHtml(state.user.phone)}</div>
            </div>
            <div>
                <div class="stat-label">${isTe ? 'గ్రామం / మండలం' : 'Village / Mandal'}:</div>
                <div style="font-weight: 600;">${escapeHtml(state.user.village)}, ${escapeHtml(state.user.district)}</div>
            </div>
            <div>
                <div class="stat-label">${isTe ? 'రాష్ట్రం' : 'State'}:</div>
                <div style="font-weight: 600;">${escapeHtml(state.user.state)}</div>
            </div>
            <div>
                <div class="stat-label">${isTe ? 'సమ్మతి సమయం' : 'Consent Timestamp'}:</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${formatDate(state.user.consent_at || new Date().toISOString())}</div>
            </div>
            <div>
                <div class="stat-label">${isTe ? 'డేటా గోప్యత' : 'Data Privacy'}:</div>
                <span class="badge badge-success">✓ Zero Aadhaar / Bank Stored</span>
            </div>
        </div>
    `;
}

// ------------------------------------------------------------------------
// Dashboard Logic
// ------------------------------------------------------------------------
async function loadDashboard() {
    const isTe = getCurrentLang() === 'te';
    if (state.user) {
        document.getElementById('dashGreeting').innerText = isTe
            ? `నమస్కారం, ${state.user.name} గారు!`
            : `Welcome, ${state.user.name}!`;
        document.getElementById('dashLocation').innerText = `${state.user.village}, ${state.user.district} (${state.user.state})`;
    } else {
        document.getElementById('dashGreeting').innerText = isTe ? 'నమస్కారం, రైతు మిత్రమా!' : 'Welcome, Farmer Friend!';
        document.getElementById('dashLocation').innerText = isTe
            ? 'పంట లెక్కలు మరియు మార్కెట్ సమాచారం కోసం లాగిన్ అవ్వండి'
            : 'Login to manage crop finances and market intelligence';
    }

    if (!state.user) {
        document.getElementById('dashTotalCost').innerText = '₹0';
        document.getElementById('dashGrossSales').innerText = '₹0';
        document.getElementById('dashNetProfit').innerText = '₹0';
        document.getElementById('dashActiveCropsCount').innerText = '0';
        document.getElementById('dashCropsList').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: var(--text-muted); margin-bottom: 12px;">${isTe ? 'మీ పంటల లెక్కలను రికార్డ్ చేయడానికి లాగిన్ చేయండి.' : 'Please log in to record and view your crop cycles.'}</p>
                <button class="btn-primary" style="max-width: 200px; margin: 0 auto;" onclick="navigateTo('login')">${t('nav_login')}</button>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch('/api/cycles');
        if (res.ok) {
            const data = await res.json();
            state.cycles = data.cycles || [];

            let totalExp = 0;
            let totalSales = 0;
            let activeCount = 0;

            state.cycles.forEach(c => {
                totalExp += parseFloat(c.total_expenses || 0);
                totalSales += parseFloat(c.gross_sales || 0);
                if (c.status === 'active') activeCount++;
            });

            const netProfit = totalSales - totalExp;
            document.getElementById('dashTotalCost').innerText = formatCurrency(totalExp);
            document.getElementById('dashGrossSales').innerText = formatCurrency(totalSales);
            const netEl = document.getElementById('dashNetProfit');
            netEl.innerText = formatCurrency(netProfit);
            netEl.className = 'stat-value ' + (netProfit >= 0 ? 'profit' : 'loss');
            document.getElementById('dashActiveCropsCount').innerText = activeCount;

            renderDashboardCropsList();
        }
    } catch (e) {
        console.error('Failed to load dashboard cycles', e);
    }
}

function renderDashboardCropsList() {
    const container = document.getElementById('dashCropsList');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    if (state.cycles.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 16px;">${t('empty_records')}</p>`;
        return;
    }

    let html = '';
    state.cycles.slice(0, 3).forEach(c => {
        const displayName = isTe && c.crop_name_te ? `${c.crop_name_te} (${c.crop_name})` : c.crop_name;
        const net = parseFloat(c.net_profit || 0);
        const netClass = net >= 0 ? 'color: var(--success)' : 'color: var(--danger)';

        html += `
            <div class="data-item">
                <div class="data-item-left">
                    <div class="data-item-title">🌱 ${escapeHtml(displayName)}</div>
                    <div class="data-item-meta">${escapeHtml(c.area_acres)} ${t('acre_label')} • ${formatDate(c.start_date)}</div>
                </div>
                <div class="data-item-right">
                    <div class="data-item-value" style="${netClass}">${formatCurrency(net)}</div>
                    <button class="btn-secondary btn-sm" onclick="viewCycleProfitReport(${c.id})">${t('nav_profit')} →</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ------------------------------------------------------------------------
// Crop Cycles CRUD
// ------------------------------------------------------------------------
async function loadCycles() {
    const container = document.getElementById('cyclesListContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    try {
        const res = await fetch('/api/cycles');
        if (res.ok) {
            const data = await res.json();
            state.cycles = data.cycles || [];

            if (state.cycles.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 30px;">
                        <p style="color: var(--text-muted); margin-bottom: 14px;">${isTe ? 'ఇంకా ఎలాంటి పంట రికార్డు నమోదు చేయలేదు.' : 'No crop cycles recorded yet.'}</p>
                        <button class="btn-primary" style="max-width: 250px; margin: 0 auto;" onclick="openCycleModal()">${t('btn_new_cycle')}</button>
                    </div>
                `;
                return;
            }

            let html = '';
            state.cycles.forEach(c => {
                const displayName = isTe && c.crop_name_te ? `${c.crop_name_te} (${c.crop_name})` : c.crop_name;
                const net = parseFloat(c.net_profit || 0);
                const isProfitable = net >= 0;

                html += `
                    <div class="card" style="margin-bottom: 12px;">
                        <div class="card-header">
                            <div>
                                <h3 style="font-size: 1.15rem; font-weight: 700;">🌱 ${escapeHtml(displayName)}</h3>
                                <div style="font-size: 0.85rem; color: var(--text-muted);">
                                    ${escapeHtml(c.area_acres)} ${t('acre_label')} • ${t('field_start_date')}: ${formatDate(c.start_date)}
                                </div>
                            </div>
                            <span class="badge ${c.status === 'active' ? 'badge-success' : 'badge-neutral'}">
                                ${c.status === 'active' ? t('status_active') : t('status_completed')}
                            </span>
                        </div>

                        <div class="stats-grid" style="margin-bottom: 10px;">
                            <div class="stat-card">
                                <div class="stat-label">${t('stat_total_cost')}</div>
                                <div class="stat-value" style="font-size: 1.1rem;">${formatCurrency(c.total_expenses)}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('stat_gross_sales')}</div>
                                <div class="stat-value" style="font-size: 1.1rem;">${formatCurrency(c.gross_sales)}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('stat_net_profit')}</div>
                                <div class="stat-value ${isProfitable ? 'profit' : 'loss'}" style="font-size: 1.1rem;">
                                    ${formatCurrency(net)}
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('stat_per_acre_net')}</div>
                                <div class="stat-value ${isProfitable ? 'profit' : 'loss'}" style="font-size: 1.1rem;">
                                    ${formatCurrency(c.area_acres > 0 ? net / c.area_acres : 0)}
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
                            <button class="btn-secondary btn-sm" onclick="quickAddExpenseToCycle(${c.id})">💸 ${t('btn_add_expense')}</button>
                            <button class="btn-secondary btn-sm" onclick="quickAddSaleToCycle(${c.id})">💰 ${t('btn_add_sale')}</button>
                            <button class="btn-primary btn-sm" onclick="viewCycleProfitReport(${c.id})">📊 ${t('nav_profit')}</button>
                            <button class="btn-danger btn-sm" onclick="deleteCycle(${c.id})">🗑️</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load crop cycles.</p>`;
    }
}

function openCycleModal(cycle = null) {
    document.getElementById('cycleEditId').value = cycle ? cycle.id : '';
    document.getElementById('cycleStartDate').value = cycle ? cycle.start_date.split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('cycleEndDate').value = cycle && cycle.end_date ? cycle.end_date.split('T')[0] : '';
    document.getElementById('cycleAreaAcres').value = cycle ? cycle.area_acres : '2.0';
    document.getElementById('cycleStatus').value = cycle ? cycle.status : 'active';
    document.getElementById('cycleNotes').value = cycle && cycle.notes ? cycle.notes : '';

    const select = document.getElementById('cycleCropSelect');
    if (cycle) {
        select.value = cycle.crop_name;
    } else {
        select.value = 'Turmeric';
    }
    handleCropSelectChange(select);
    openModal('cycleModal');
}

async function handleCycleSubmit(e) {
    e.preventDefault();
    const cycleId = document.getElementById('cycleEditId').value;
    const select = document.getElementById('cycleCropSelect');
    let cropName = select.value;
    let cropNameTe = '';

    if (cropName === 'CUSTOM') {
        cropName = document.getElementById('cycleCustomCropName').value.trim();
        cropNameTe = cropName;
    } else {
        const selectedOpt = select.options[select.selectedIndex];
        cropNameTe = selectedOpt.getAttribute('data-te') || '';
    }

    const startDate = document.getElementById('cycleStartDate').value;
    const endDate = document.getElementById('cycleEndDate').value || null;
    const areaAcres = parseFloat(document.getElementById('cycleAreaAcres').value);
    const status = document.getElementById('cycleStatus').value;
    const notes = document.getElementById('cycleNotes').value;

    const payload = {
        crop_name: cropName,
        crop_name_te: cropNameTe,
        start_date: startDate,
        end_date: endDate,
        area_acres: areaAcres,
        status: status,
        notes: notes
    };

    try {
        const url = cycleId ? `/api/cycles/${cycleId}` : '/api/cycles';
        const method = cycleId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            closeModal('cycleModal');
            showToast(data.message, 'success');
            loadCycles();
            loadDashboard();
        } else {
            showToast(data.message || 'Operation failed', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

async function deleteCycle(cycleId) {
    const isTe = getCurrentLang() === 'te';
    const msg = isTe
        ? 'ఈ పంట రికార్డును తొలగించాలనుకుంటున్నారా? దీనికి సంబంధించిన ఖర్చులు మరియు అమ్మకాలు కూడా తొలగించబడతాయి.'
        : 'Are you sure you want to delete this crop cycle? All associated expenses and sales will also be deleted.';

    if (!confirm(msg)) return;

    try {
        const res = await fetch(`/api/cycles/${cycleId}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message, 'success');
            loadCycles();
            loadDashboard();
        } else {
            showToast(data.message || 'Failed to delete cycle', 'danger');
        }
    } catch (e) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

// ------------------------------------------------------------------------
// Expense Diary CRUD (15 Tap-to-pick tiles)
// ------------------------------------------------------------------------
function renderExpenseTiles() {
    const container = document.getElementById('expenseTilesContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    let html = '';
    EXPENSE_CATEGORIES.forEach(cat => {
        const isSelected = state.selectedExpenseCategory === cat.key;
        const entry = I18N_DICTIONARY[`cat_${cat.key}`] || {};
        const label = isTe ? entry.te || cat.key : entry.en || cat.key;

        html += `
            <div class="expense-tile ${isSelected ? 'selected' : ''}" onclick="selectExpenseCategory('${cat.key}')">
                <span class="tile-icon">${cat.icon}</span>
                <span class="tile-label">${escapeHtml(label)}</span>
            </div>
        `;
    });
    container.innerHTML = html;
    document.getElementById('expenseSelectedCategory').value = state.selectedExpenseCategory;
}

function selectExpenseCategory(key) {
    state.selectedExpenseCategory = key;
    renderExpenseTiles();
    const amtInput = document.getElementById('expenseAmount');
    if (amtInput) amtInput.focus();
}

async function loadExpenses() {
    const container = document.getElementById('expensesListContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';
    const filterCycle = document.getElementById('expenseCycleFilter')?.value || '';

    // Populate filter select options
    populateCycleSelectOptions('expenseCycleFilter', filterCycle);

    try {
        const url = filterCycle ? `/api/expenses?cycle_id=${filterCycle}` : '/api/expenses';
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            state.expenses = data.expenses || [];

            if (state.expenses.length === 0) {
                container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">${t('empty_records')}</p>`;
                return;
            }

            let total = 0;
            let html = '';
            state.expenses.forEach(exp => {
                total += parseFloat(exp.amount || 0);
                const catDef = EXPENSE_CATEGORIES.find(c => c.key === exp.category);
                const icon = catDef ? catDef.icon : '📝';
                const catEntry = I18N_DICTIONARY[`cat_${exp.category}`] || {};
                const catName = isTe ? catEntry.te || exp.category : catEntry.en || exp.category;
                const cropLabel = isTe && exp.crop_name_te ? exp.crop_name_te : exp.crop_name;

                html += `
                    <div class="data-item">
                        <div class="data-item-left">
                            <div class="data-item-title">${icon} ${escapeHtml(catName)}</div>
                            <div class="data-item-meta">
                                🌱 ${escapeHtml(cropLabel)} • 📅 ${formatDate(exp.expense_date)}
                                ${exp.notes ? `• <em>${escapeHtml(exp.notes)}</em>` : ''}
                            </div>
                        </div>
                        <div class="data-item-right">
                            <div class="data-item-value" style="color: var(--danger);">${formatCurrency(exp.amount)}</div>
                            <div style="display: flex; gap: 4px;">
                                <button class="btn-danger btn-sm" onclick="deleteExpense(${exp.id})">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = `
                <div style="background-color: var(--bg-card-subtle); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: 12px; font-weight: 700; display: flex; justify-content: space-between;">
                    <span>${t('stat_total_cost')}:</span>
                    <span style="color: var(--danger);">${formatCurrency(total)}</span>
                </div>
                ${html}
            `;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load expenses.</p>`;
    }
}

function openExpenseModal(defaultCycleId = null) {
    populateCycleSelectOptions('expenseModalCycleSelect', defaultCycleId);
    document.getElementById('expenseEditId').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('expenseNotes').value = '';
    selectExpenseCategory('fertilizer');
    openModal('expenseModal');
}

function quickAddExpenseToCycle(cycleId) {
    openExpenseModal(cycleId);
}

async function handleExpenseSubmit(e) {
    e.preventDefault();
    const cycleId = document.getElementById('expenseModalCycleSelect').value;
    const category = document.getElementById('expenseSelectedCategory').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const notes = document.getElementById('expenseNotes').value;

    if (!cycleId) {
        showToast(t('crop_select_label'), 'warning');
        return;
    }

    const payload = {
        cycle_id: cycleId,
        category: category,
        amount: amount,
        expense_date: date,
        notes: notes
    };

    try {
        const res = await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            closeModal('expenseModal');
            showToast(data.message, 'success');
            loadExpenses();
            loadDashboard();
        } else {
            showToast(data.message || 'Failed to record expense', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

async function deleteExpense(id) {
    if (!confirm('ఈ ఖర్చు రికార్డును తొలగించాలనుకుంటున్నారా? / Delete this expense?')) return;
    try {
        const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message, 'success');
            loadExpenses();
            loadDashboard();
        }
    } catch (e) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

// ------------------------------------------------------------------------
// Sales CRUD
// ------------------------------------------------------------------------
async function loadSales() {
    const container = document.getElementById('salesListContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';
    const filterCycle = document.getElementById('salesCycleFilter')?.value || '';

    populateCycleSelectOptions('salesCycleFilter', filterCycle);

    try {
        const url = filterCycle ? `/api/sales?cycle_id=${filterCycle}` : '/api/sales';
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            state.sales = data.sales || [];

            if (state.sales.length === 0) {
                container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">${t('empty_records')}</p>`;
                return;
            }

            let totalGross = 0;
            let totalNet = 0;
            let html = '';

            state.sales.forEach(sale => {
                const amt = parseFloat(sale.amount || 0);
                const ded = parseFloat(sale.deductions || 0);
                const net = amt - ded;
                totalGross += amt;
                totalNet += net;
                const cropLabel = isTe && sale.crop_name_te ? sale.crop_name_te : sale.crop_name;

                html += `
                    <div class="data-item">
                        <div class="data-item-left">
                            <div class="data-item-title">🌾 ${escapeHtml(cropLabel)}: ${escapeHtml(sale.quantity)} ${escapeHtml(sale.unit)}</div>
                            <div class="data-item-meta">
                                📅 ${formatDate(sale.sale_date)} • 🏪 ${escapeHtml(sale.buyer || 'Direct Mandi')}
                                ${ded > 0 ? `• <span style="color: var(--danger)">తగ్గింపులు: ${formatCurrency(ded)}</span>` : ''}
                            </div>
                        </div>
                        <div class="data-item-right">
                            <div class="data-item-value" style="color: var(--success);">${formatCurrency(net)}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">మొత్తం: ${formatCurrency(amt)}</div>
                            <button class="btn-danger btn-sm" onclick="deleteSale(${sale.id})">🗑️</button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = `
                <div style="background-color: var(--bg-card-subtle); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: 12px; font-weight: 700; display: flex; justify-content: space-between;">
                    <span>${t('label_net_sale_realized')}:</span>
                    <span style="color: var(--success);">${formatCurrency(totalNet)}</span>
                </div>
                ${html}
            `;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load sales.</p>`;
    }
}

function openSaleModal(defaultCycleId = null) {
    populateCycleSelectOptions('saleModalCycleSelect', defaultCycleId);
    document.getElementById('saleEditId').value = '';
    document.getElementById('saleAmount').value = '';
    document.getElementById('saleDeductions').value = '0';
    document.getElementById('saleQuantity').value = '';
    document.getElementById('saleBuyer').value = '';
    document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('saleNotes').value = '';
    openModal('saleModal');
}

function quickAddSaleToCycle(cycleId) {
    openSaleModal(cycleId);
}

async function handleSaleSubmit(e) {
    e.preventDefault();
    const cycleId = document.getElementById('saleModalCycleSelect').value;
    const amount = parseFloat(document.getElementById('saleAmount').value);
    const deductions = parseFloat(document.getElementById('saleDeductions').value) || 0;
    const quantity = parseFloat(document.getElementById('saleQuantity').value);
    const unit = document.getElementById('saleUnit').value;
    const buyer = document.getElementById('saleBuyer').value;
    const date = document.getElementById('saleDate').value;
    const notes = document.getElementById('saleNotes').value;

    if (!cycleId) {
        showToast(t('crop_select_label'), 'warning');
        return;
    }

    const payload = {
        cycle_id: cycleId,
        amount: amount,
        deductions: deductions,
        quantity: quantity,
        unit: unit,
        buyer: buyer,
        sale_date: date,
        notes: notes
    };

    try {
        const res = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            closeModal('saleModal');
            showToast(data.message, 'success');
            loadSales();
            loadDashboard();
        } else {
            showToast(data.message || 'Failed to record sale', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

async function deleteSale(id) {
    if (!confirm('ఈ అమ్మకం రికార్డును తొలగించాలనుకుంటున్నారా? / Delete this sale?')) return;
    try {
        const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message, 'success');
            loadSales();
            loadDashboard();
        }
    } catch (e) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

// ------------------------------------------------------------------------
// Profit Report & Financial Intelligence
// ------------------------------------------------------------------------
async function loadProfitCycleDropdown() {
    const select = document.getElementById('profitCycleSelector');
    if (!select) return;
    const isTe = getCurrentLang() === 'te';

    try {
        const res = await fetch('/api/cycles');
        if (res.ok) {
            const data = await res.json();
            const cycles = data.cycles || [];
            select.innerHTML = `<option value="">-- ${isTe ? 'పంటను ఎంచుకోండి' : 'Select Crop Cycle'} --</option>`;
            cycles.forEach(c => {
                const label = isTe && c.crop_name_te ? `${c.crop_name_te} (${c.crop_name})` : c.crop_name;
                select.innerHTML += `<option value="${c.id}">${escapeHtml(label)} - ${formatDate(c.start_date)} (${c.area_acres} ఎకరాలు)</option>`;
            });

            // If we have cycles and none selected, select first
            if (cycles.length > 0 && !select.value) {
                select.value = cycles[0].id;
                loadProfitReport();
            }
        }
    } catch (e) {
        console.error('Failed to load cycles for profit report', e);
    }
}

function viewCycleProfitReport(cycleId) {
    navigateTo('profit');
    setTimeout(() => {
        const select = document.getElementById('profitCycleSelector');
        if (select) {
            select.value = cycleId;
            loadProfitReport();
        }
    }, 100);
}

async function loadProfitReport() {
    const cycleId = document.getElementById('profitCycleSelector')?.value;
    const container = document.getElementById('profitReportContainer');
    if (!container || !cycleId) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    try {
        const res = await fetch(`/api/profit/${cycleId}`);
        if (!res.ok) {
            container.innerHTML = `<p style="color: var(--danger); padding: 20px;">Failed to generate report.</p>`;
            return;
        }

        const data = await res.json();
        const cycle = data.cycle;
        const farmer = data.farmer;
        const summary = data.summary;
        const breakdown = data.cost_breakdown || [];
        const warnings = data.warnings || [];
        const comp = data.previous_cycle_comparison;

        const isProfit = summary.is_profit;
        const bannerClass = isProfit ? 'is-profit' : 'is-loss';
        const cropDisplay = isTe && cycle.crop_name_te ? `${cycle.crop_name_te} (${cycle.crop_name})` : cycle.crop_name;

        // Warnings HTML
        let warningsHtml = '';
        warnings.forEach(w => {
            warningsHtml += `
                <div class="alert-box alert-warning">
                    <span style="font-size: 20px;">⚠️</span>
                    <div>${escapeHtml(isTe ? w.message_te : w.message_en)}</div>
                </div>
            `;
        });

        // Breakdown HTML
        let breakdownHtml = '';
        if (breakdown.length === 0) {
            breakdownHtml = `<p style="color: var(--text-muted);">${t('empty_records')}</p>`;
        } else {
            breakdown.forEach(item => {
                const catDef = EXPENSE_CATEGORIES.find(c => c.key === item.category);
                const icon = catDef ? catDef.icon : '📝';
                const catEntry = I18N_DICTIONARY[`cat_${item.category}`] || {};
                const name = isTe ? catEntry.te || item.category : catEntry.en || item.category;

                breakdownHtml += `
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 600;">
                            <span>${icon} ${escapeHtml(name)} (${item.count})</span>
                            <span>${formatCurrency(item.total)} (${item.percentage}%)</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${item.percentage}%;"></div>
                        </div>
                    </div>
                `;
            });
        }

        // Previous cycle comparison HTML
        let compHtml = '';
        if (comp) {
            const p = comp.previous_cycle;
            const diff = comp.differences;
            const profitBetter = diff.profit_diff >= 0;

            compHtml += `
                <div class="card" style="background-color: var(--bg-card-subtle); margin-top: 14px;">
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 8px;">
                        🔄 ${t('comparison_heading')}
                    </h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                        గత చక్రం: ${formatDate(p.start_date)} • ${p.area_acres} ఎకరాలు
                    </p>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">గత లాభం / నష్టం</div>
                            <div class="stat-value" style="font-size: 1.1rem;">${formatCurrency(p.net_profit)}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">${t('comp_profit_diff')}</div>
                            <div class="stat-value ${profitBetter ? 'profit' : 'loss'}" style="font-size: 1.1rem;">
                                ${diff.profit_diff >= 0 ? '+' : ''}${formatCurrency(diff.profit_diff)}
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">${t('comp_cost_diff')}</div>
                            <div class="stat-value" style="font-size: 1.1rem;">
                                ${diff.cost_diff >= 0 ? '+' : ''}${formatCurrency(diff.cost_diff)}
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">${t('comp_per_acre_diff')}</div>
                            <div class="stat-value ${diff.per_acre_diff >= 0 ? 'profit' : 'loss'}" style="font-size: 1.1rem;">
                                ${diff.per_acre_diff >= 0 ? '+' : ''}${formatCurrency(diff.per_acre_diff)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            compHtml = `
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">
                    ℹ️ ${t('no_previous_comparison')}
                </p>
            `;
        }

        // Render Comprehensive Statement
        container.innerHTML = `
            <div class="print-statement-view">
                <!-- Printable Statement Header -->
                <div style="border-bottom: 2px solid var(--border); padding-bottom: 12px; margin-bottom: 16px;">
                    <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--primary);">
                        🌾 ${t('statement_print_header')}
                    </h3>
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; font-size: 0.9rem; color: var(--text-secondary); margin-top: 6px;">
                        <div>
                            <strong>${escapeHtml(farmer.name)}</strong> (${escapeHtml(farmer.phone)})<br>
                            ${escapeHtml(farmer.village)}, ${escapeHtml(farmer.district)}, ${escapeHtml(farmer.state)}
                        </div>
                        <div style="text-align: right;">
                            <strong>పంట:</strong> ${escapeHtml(cropDisplay)}<br>
                            <strong>విస్తీర్ణం:</strong> ${escapeHtml(cycle.area_acres)} ${t('acre_label')} | <strong>తేదీ:</strong> ${formatDate(cycle.start_date)}
                        </div>
                    </div>
                </div>

                ${warningsHtml}

                <!-- Big Net Profit Banner -->
                <div class="profit-banner ${bannerClass}">
                    <div>
                        <div class="profit-banner-title">
                            ${isProfit ? '🎉 ' + t('stat_net_profit') : '⚠️ ' + t('stat_net_loss')}
                        </div>
                        <div style="font-size: 0.9rem; opacity: 0.85;">
                            ${t('stat_per_acre_net')}: ${formatCurrency(summary.per_acre_net)} / ఎకరా
                        </div>
                    </div>
                    <div class="profit-banner-amount">
                        ${formatCurrency(summary.net_profit)}
                    </div>
                </div>

                <!-- 4 Core Metrics Grid -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">${t('stat_total_cost')}</div>
                        <div class="stat-value" style="color: var(--danger);">${formatCurrency(summary.total_cost)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">ఎకరాకు: ${formatCurrency(summary.per_acre_cost)}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">${t('stat_gross_sales')}</div>
                        <div class="stat-value">${formatCurrency(summary.gross_sale)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">ఎకరాకు: ${formatCurrency(summary.per_acre_gross)}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">${t('stat_total_deductions')}</div>
                        <div class="stat-value" style="color: var(--warning);">${formatCurrency(summary.total_deductions)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">కోతలు / హమాలీ / కమిషన్</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">${t('stat_net_sales')}</div>
                        <div class="stat-value" style="color: var(--success);">${formatCurrency(summary.net_sale)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">చేతికి వచ్చిన మొత్తం</div>
                    </div>
                </div>

                <!-- Cost Breakdown Section -->
                <div class="card" style="margin-top: 14px;">
                    <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">
                        📊 ${t('breakdown_heading')}
                    </h4>
                    ${breakdownHtml}
                </div>

                <!-- Previous Cycle Comparison -->
                ${compHtml}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to generate profit report.</p>`;
    }
}

// ------------------------------------------------------------------------
// Live Weather (Open-Meteo)
// ------------------------------------------------------------------------
async function loadWeather(force = false) {
    const container = document.getElementById('weatherContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    const village = document.getElementById('weatherVillageInput')?.value || state.user?.village || '';
    const district = document.getElementById('weatherDistrictInput')?.value || state.user?.district || 'Warangal';

    try {
        const url = `/api/weather?village=${encodeURIComponent(village)}&district=${encodeURIComponent(district)}`;
        const res = await fetch(url);
        if (!res.ok) {
            container.innerHTML = `<p style="color: var(--danger); padding: 16px;">${t('network_offline_alert')}</p>`;
            return;
        }

        const data = await res.json();
        const loc = data.location;
        const cur = data.current;
        const forecast = data.forecast || [];

        let fallbackNotice = '';
        if (loc.note_te || loc.note_en) {
            fallbackNotice = `
                <div class="alert-box alert-warning" style="margin-bottom: 12px;">
                    <span>📍</span>
                    <div>${escapeHtml(isTe ? loc.note_te : loc.note_en)}</div>
                </div>
            `;
        }

        let forecastHtml = '';
        forecast.forEach(f => {
            forecastHtml += `
                <div class="stat-card" style="text-align: center; padding: 12px 6px;">
                    <div style="font-weight: 700; font-size: 0.95rem;">${isTe ? f.day_te : f.day_en}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(f.date)}</div>
                    <div style="font-size: 28px; margin: 4px 0;">${f.icon}</div>
                    <div style="font-weight: 700; font-size: 1.05rem;">${Math.round(f.temp_max)}° / ${Math.round(f.temp_min)}°</div>
                    <div style="font-size: 0.8rem; color: var(--primary);">🌧️ ${f.rain_probability}%</div>
                </div>
            `;
        });

        container.innerHTML = `
            ${fallbackNotice}

            <!-- Current Weather Card -->
            <div class="card" style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 700;">📍 ${escapeHtml(loc.resolved)} (${escapeHtml(loc.state)})</div>
                        <div style="font-size: 3rem; font-weight: 800; line-height: 1.1;">
                            ${cur.icon} ${Math.round(cur.temperature)}°C
                        </div>
                        <div style="font-size: 1.05rem; font-weight: 600;">
                            ${escapeHtml(isTe ? cur.condition_te : cur.condition_en)}
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 0.9rem; line-height: 1.6; opacity: 0.95;">
                        <div>🌡️ ${t('weather_feels_like')}: ${Math.round(cur.apparent_temperature)}°C</div>
                        <div>💧 ${t('weather_humidity')}: ${cur.humidity}%</div>
                        <div>💨 ${t('weather_wind')}: ${cur.wind_speed_kmh} km/h</div>
                        <div>🌧️ వర్షం: ${cur.precipitation_mm} mm</div>
                    </div>
                </div>
            </div>

            <!-- 5-Day Forecast -->
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 10px;">
                🗓️ ${t('weather_forecast_5day')}
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 8px;">
                ${forecastHtml}
            </div>

            <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 14px;">
                ${t('weather_source_credit')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load live weather feed.</p>`;
    }
}

function searchWeatherCustom() {
    loadWeather(true);
}

// ------------------------------------------------------------------------
// Live Mandi Rates (data.gov.in)
// ------------------------------------------------------------------------
async function loadMandiRates(force = false) {
    const container = document.getElementById('mandiContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    const commodity = document.getElementById('mandiCommoditySelect')?.value || 'Turmeric';
    const stateVal = document.getElementById('mandiStateSelect')?.value || state.user?.state || 'Telangana';
    const district = state.user?.district || 'Warangal';

    try {
        const url = `/api/mandi?commodity=${encodeURIComponent(commodity)}&state=${encodeURIComponent(stateVal)}&district=${encodeURIComponent(district)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'UNCONFIGURED_KEY') {
            container.innerHTML = `
                <div class="alert-box alert-warning">
                    <span style="font-size: 24px;">🔑</span>
                    <div>
                        <strong>${escapeHtml(isTe ? data.message_te : data.message_en)}</strong>
                        <p style="font-size: 0.85rem; margin-top: 6px; color: var(--text-secondary);">
                            data.gov.in నుండి ఉచిత API కీ పొందడానికి: <a href="https://data.gov.in" target="_blank" rel="noopener" style="color: var(--primary); font-weight: 700;">data.gov.in</a> లో రిజిస్టర్ చేసుకొని 'My Account' లో కీ కాపీ చేయండి.
                        </p>
                    </div>
                </div>
            `;
            return;
        }

        const rates = data.rates || [];
        if (rates.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--text-muted); padding: 20px;">
                    ${isTe ? 'ప్రస్తుతం ఈ కమోడిటీకి మార్కెట్ యార్డుల నుండి ధరలు అందలేదు.' : 'No mandi price arrivals reported today for this commodity.'}
                </p>
            `;
            return;
        }

        let html = '';
        rates.forEach(r => {
            const isFarmerDist = r.is_farmer_district;

            html += `
                <div class="card" style="margin-bottom: 10px; ${isFarmerDist ? 'border: 2px solid var(--primary); background-color: var(--bg-card);' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div>
                            <div style="font-size: 1.1rem; font-weight: 700;">
                                🏪 ${escapeHtml(r.market)}
                                ${isFarmerDist ? `<span class="badge badge-success" style="margin-left: 6px;">📍 ${t('mandi_district_first_badge')}</span>` : ''}
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                                ${escapeHtml(r.district)} (${escapeHtml(r.state)}) • రకం: ${escapeHtml(r.variety)} • 📅 ${formatDate(r.arrival_date)}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary);">
                                ${formatCurrency(r.modal_price)} / క్వింటాల్
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">
                                కనిష్టం: ${formatCurrency(r.min_price)} | గరిష్టం: ${formatCurrency(r.max_price)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load mandi rates.</p>`;
    }
}

// ------------------------------------------------------------------------
// Buyer Offers
// ------------------------------------------------------------------------
async function loadBuyerOffers() {
    const container = document.getElementById('offersContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    try {
        const res = await fetch('/api/offers');
        if (res.ok) {
            const data = await res.json();
            const offers = data.offers || [];

            if (offers.length === 0) {
                container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">${t('empty_records')}</p>`;
                return;
            }

            let html = '';
            offers.forEach(o => {
                const isExpired = o.is_expired;
                const netPrice = parseFloat(o.net_price_per_quintal || 0);

                html += `
                    <div class="card" style="margin-bottom: 12px; ${isExpired ? 'opacity: 0.6;' : ''}">
                        <div class="card-header">
                            <div>
                                <h3 style="font-size: 1.15rem; font-weight: 700;">🤝 ${escapeHtml(o.buyer_name)}</h3>
                                <div style="font-size: 0.85rem; color: var(--text-muted);">
                                    🌱 పంట: <strong>${escapeHtml(o.crop_name)}</strong> • పరిమాణం: <strong>${o.quantity_quintals} క్వింటాలు</strong>
                                </div>
                            </div>
                            <span class="badge ${isExpired ? 'badge-danger' : 'badge-success'}">
                                ${isExpired ? t('offer_expired_badge') : t('offer_active_badge')}
                            </span>
                        </div>

                        <div class="stats-grid" style="margin-bottom: 10px;">
                            <div class="stat-card">
                                <div class="stat-label">${t('offer_net_price')}</div>
                                <div class="stat-value" style="color: var(--primary); font-size: 1.2rem;">
                                    ${formatCurrency(netPrice)}
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('offer_gross_price')}</div>
                                <div class="stat-value" style="font-size: 1.1rem;">
                                    ${formatCurrency(o.price_per_quintal)}
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('offer_deduction')}</div>
                                <div class="stat-value" style="color: var(--danger); font-size: 1.1rem;">
                                    ${formatCurrency(o.deduction_per_quintal)}
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('offer_expiry')}</div>
                                <div class="stat-value" style="font-size: 1.05rem;">
                                    ${formatDate(o.expiry_date)}
                                </div>
                            </div>
                        </div>

                        ${o.terms ? `<div style="font-size: 0.85rem; background-color: var(--bg-card-subtle); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px;">📋 <strong>నిబంధనలు:</strong> ${escapeHtml(o.terms)}</div>` : ''}

                        <div style="display: flex; justify-content: flex-end; gap: 8px;">
                            ${o.buyer_phone ? `<a href="tel:${escapeHtml(o.buyer_phone)}" class="btn-primary btn-sm" style="text-decoration: none; width: auto;">📞 ${t('btn_call')}: ${escapeHtml(o.buyer_phone)}</a>` : ''}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load buyer offers.</p>`;
    }
}

function openOfferModal() {
    if (!state.user) {
        showToast(t('login_subtitle'));
        navigateTo('login');
        return;
    }
    document.getElementById('offerExpiryDate').value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    openModal('offerModal');
}

async function handleOfferSubmit(e) {
    e.preventDefault();
    const payload = {
        buyer_name: document.getElementById('offerBuyerName').value.trim(),
        buyer_phone: document.getElementById('offerBuyerPhone').value.trim(),
        crop_name: document.getElementById('offerCropName').value.trim(),
        price_per_quintal: parseFloat(document.getElementById('offerPricePerQuintal').value),
        deduction_per_quintal: parseFloat(document.getElementById('offerDeductionPerQuintal').value) || 0,
        quantity_quintals: parseFloat(document.getElementById('offerQuantity').value),
        expiry_date: document.getElementById('offerExpiryDate').value,
        terms: document.getElementById('offerTerms').value
    };

    try {
        const res = await fetch('/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            closeModal('offerModal');
            showToast(data.message, 'success');
            loadBuyerOffers();
        } else {
            showToast(data.message || 'Failed to submit offer', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

// ------------------------------------------------------------------------
// Crop Reminders & Agronomic Calendars
// ------------------------------------------------------------------------
async function loadReminders() {
    const container = document.getElementById('remindersContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    try {
        const res = await fetch('/api/reminders');
        if (res.ok) {
            const data = await res.json();
            const activeReminders = data.active_cycles_reminders || [];
            const calendars = data.all_calendars || {};

            let html = '';

            // 1. If farmer has active cycles, show personalized alerts
            if (activeReminders.length > 0) {
                html += `<h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 12px;">🌱 మీ ప్రస్తుత పంటల సాగు దశలు (Your Active Crops):</h3>`;
                activeReminders.forEach(r => {
                    const st = r.current_stage;
                    const stageName = isTe ? st.stage_name_te : st.stage_name_en;
                    const guidance = isTe ? st.guidance_te : st.guidance_en;
                    const cropDisplay = isTe && r.crop_name_te ? `${r.crop_name_te} (${r.crop_name})` : r.crop_name;

                    html += `
                        <div class="card" style="border-left: 4px solid var(--primary); margin-bottom: 14px;">
                            <div class="card-header">
                                <div>
                                    <h4 style="font-size: 1.1rem; font-weight: 700;">🌱 ${escapeHtml(cropDisplay)}</h4>
                                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                                        నాటిన తేదీ: ${formatDate(r.start_date)} • <strong>${r.days_elapsed} రోజులు గడిచాయి</strong>
                                    </div>
                                </div>
                                <span class="badge badge-success">ప్రస్తుత దశ: ${st.min_days}-${st.max_days} రోజులు</span>
                            </div>

                            <div style="background-color: var(--primary-light); padding: 12px 14px; border-radius: var(--radius-md); margin-bottom: 10px;">
                                <div style="font-weight: 700; color: var(--primary-dark); font-size: 1.05rem; margin-bottom: 4px;">
                                    📌 ${escapeHtml(stageName)}
                                </div>
                                <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-primary);">
                                    ${escapeHtml(guidance)}
                                </p>
                            </div>
                        </div>
                    `;
                });
            }

            // 2. Turmeric Master Calendar View (Featured)
            const turmeric = calendars['turmeric'];
            if (turmeric) {
                html += `
                    <div class="card" style="margin-top: 18px;">
                        <div class="card-header">
                            <h3 class="card-title" style="color: #b45309;">
                                🌿 ${t('turmeric_special_badge')} (0 - 240+ రోజులు)
                            </h3>
                        </div>
                        <div>
                `;
                turmeric.stages.forEach(st => {
                    const stName = isTe ? st.stage_name_te : st.stage_name_en;
                    const stGuidance = isTe ? st.guidance_te : st.guidance_en;

                    html += `
                        <div style="border-bottom: 1px solid var(--border); padding: 12px 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <strong style="font-size: 1rem; color: var(--text-primary);">${escapeHtml(stName)}</strong>
                                <span class="badge badge-neutral">${st.min_days} - ${st.max_days} రోజులు</span>
                            </div>
                            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
                                ${escapeHtml(stGuidance)}
                            </p>
                        </div>
                    `;
                });
                html += `</div></div>`;
            }

            container.innerHTML = html;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load reminders.</p>`;
    }
}

// ------------------------------------------------------------------------
// Agri Service Directory
// ------------------------------------------------------------------------
async function loadServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    try {
        const typeParam = state.serviceFilter ? `?type=${state.serviceFilter}` : '';
        const res = await fetch(`/api/services${typeParam}`);
        if (res.ok) {
            const data = await res.json();
            const providers = data.providers || [];

            if (providers.length === 0) {
                container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">${t('empty_records')}</p>`;
                return;
            }

            let html = '';
            providers.forEach(p => {
                let typeIcon = '🚜';
                if (p.service_type === 'drone') typeIcon = '🛸';
                if (p.service_type === 'labour') typeIcon = '👷';
                if (p.service_type === 'transport') typeIcon = '🚚';

                html += `
                    <div class="card" style="margin-bottom: 12px;">
                        <div class="card-header">
                            <div>
                                <h3 style="font-size: 1.15rem; font-weight: 700;">
                                    ${typeIcon} ${escapeHtml(p.name)}
                                    ${p.is_verified ? `<span class="badge badge-success" style="margin-left: 6px;">${t('service_verified_badge')}</span>` : ''}
                                </h3>
                                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                                    📍 ${escapeHtml(p.area)} (${escapeHtml(p.district)}) • ⭐ ${p.rating} / 5.0
                                </div>
                            </div>
                            ${p.quote_rate ? `<span class="badge badge-neutral" style="font-size: 0.85rem;">💰 ${escapeHtml(p.quote_rate)}</span>` : ''}
                        </div>

                        <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
                            <a href="tel:${escapeHtml(p.phone)}" class="btn-primary btn-sm" style="text-decoration: none; width: auto;">
                                📞 ${t('btn_call')}: ${escapeHtml(p.phone)}
                            </a>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load services.</p>`;
    }
}

function filterServices(type, btnEl) {
    state.serviceFilter = type;
    document.querySelectorAll('#view-services .btn-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    loadServices();
}

function openServiceModal() {
    if (!state.user) {
        showToast(t('login_subtitle'));
        navigateTo('login');
        return;
    }
    openModal('serviceModal');
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('serviceName').value.trim(),
        service_type: document.getElementById('serviceType').value,
        phone: document.getElementById('servicePhone').value.trim(),
        area: document.getElementById('serviceArea').value.trim(),
        quote_rate: document.getElementById('serviceQuote').value.trim()
    };

    try {
        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            closeModal('serviceModal');
            showToast(data.message, 'success');
            loadServices();
        } else {
            showToast(data.message || 'Registration failed', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

// ------------------------------------------------------------------------
// Produce Batch Traceability
// ------------------------------------------------------------------------
async function loadBatches() {
    const container = document.getElementById('batchesContainer');
    if (!container) return;
    const isTe = getCurrentLang() === 'te';

    container.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    try {
        const res = await fetch('/api/batches');
        if (res.ok) {
            const data = await res.json();
            const batches = data.batches || [];

            if (batches.length === 0) {
                container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">${t('empty_records')}</p>`;
                return;
            }

            let html = '';
            batches.forEach(b => {
                const statusKey = `batch_status_${b.status}`;
                const statusLabel = t(statusKey, b.status);

                html += `
                    <div class="card" style="margin-bottom: 12px;">
                        <div class="card-header">
                            <div>
                                <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--primary);">
                                    🏷️ ${escapeHtml(b.batch_code)}
                                </h3>
                                <div style="font-size: 0.85rem; color: var(--text-muted);">
                                    🌱 ${escapeHtml(b.crop_name)} • 📅 కోత తేదీ: ${formatDate(b.harvest_date)}
                                </div>
                            </div>
                            <span class="badge badge-success">${escapeHtml(statusLabel)}</span>
                        </div>

                        <div class="stats-grid" style="margin-bottom: 10px;">
                            <div class="stat-card">
                                <div class="stat-label">పరిమాణం (కిలోలు)</div>
                                <div class="stat-value" style="font-size: 1.1rem;">${b.quantity_kg} Kg</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('batch_moisture_label')}</div>
                                <div class="stat-value" style="font-size: 1.1rem;">${b.moisture_percent ? b.moisture_percent + '%' : 'N/A'}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">${t('batch_grade_label')}</div>
                                <div class="stat-value" style="font-size: 1.1rem;">${escapeHtml(b.grade)}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">సర్టిఫికేషన్</div>
                                <div class="stat-value" style="font-size: 0.95rem; color: var(--text-muted);">Standard</div>
                            </div>
                        </div>

                        ${b.certification_notes ? `<div style="font-size: 0.85rem; background-color: var(--bg-card-subtle); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px;">📝 ${escapeHtml(b.certification_notes)}</div>` : ''}

                        <div style="display: flex; justify-content: flex-end; gap: 8px;">
                            <button class="btn-danger btn-sm" onclick="deleteBatch(${b.id})">🗑️ ${t('btn_delete')}</button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: var(--danger); padding: 16px;">Failed to load batches.</p>`;
    }
}

function openBatchModal() {
    document.getElementById('batchEditId').value = '';
    document.getElementById('batchCropName').value = 'Turmeric (పసుపు)';
    document.getElementById('batchKg').value = '';
    document.getElementById('batchMoisture').value = '10.0';
    document.getElementById('batchGrade').value = 'Grade A';
    document.getElementById('batchStatus').value = 'received';
    document.getElementById('batchNotes').value = '';
    openModal('batchModal');
}

async function handleBatchSubmit(e) {
    e.preventDefault();
    const payload = {
        crop_name: document.getElementById('batchCropName').value.trim(),
        quantity_kg: parseFloat(document.getElementById('batchKg').value),
        moisture_percent: parseFloat(document.getElementById('batchMoisture').value) || null,
        grade: document.getElementById('batchGrade').value,
        status: document.getElementById('batchStatus').value,
        certification_notes: document.getElementById('batchNotes').value
    };

    try {
        const res = await fetch('/api/batches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            closeModal('batchModal');
            showToast(data.message, 'success');
            loadBatches();
        } else {
            showToast(data.message || 'Failed to create batch', 'danger');
        }
    } catch (err) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

async function deleteBatch(id) {
    if (!confirm('ఈ బ్యాచ్ రికార్డును తొలగించాలనుకుంటున్నారా? / Delete batch?')) return;
    try {
        const res = await fetch(`/api/batches/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message, 'success');
            loadBatches();
        }
    } catch (e) {
        showToast(t('network_offline_alert'), 'danger');
    }
}

// ------------------------------------------------------------------------
// UI Helpers & Dropdown Populator
// ------------------------------------------------------------------------
function populateCycleSelectOptions(selectId, selectedValue = null) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const isTe = getCurrentLang() === 'te';

    let currentVal = selectedValue || select.value;
    select.innerHTML = `<option value="">${selectId.includes('Filter') ? 'అన్ని పంటలు (All Crops)' : '-- పంటను ఎంచుకోండి --'}</option>`;

    state.cycles.forEach(c => {
        const label = isTe && c.crop_name_te ? `${c.crop_name_te} (${c.crop_name})` : c.crop_name;
        const isSel = String(c.id) === String(currentVal) ? 'selected' : '';
        select.innerHTML += `<option value="${c.id}" ${isSel}>${escapeHtml(label)} - ${formatDate(c.start_date)}</option>`;
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});
