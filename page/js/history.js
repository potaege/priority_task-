import { API_BASE } from './config.js'

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('th-TH', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}


function priorityLabel(p) {
    const map = { high: 'สูง', medium: 'กลาง', low: 'ต่ำ' };
    return map[p] || p;
}

/* ==========================================
   BUILD CARD HTML
   ========================================== */
function buildCard(task) {
    const status   = task.status   || 'done';
    const priority = task.priority || 'low';

    return `
    <div class="history-card status-${status} priority-${priority}"
         data-status="${status}" data-priority="${priority}">

        <div class="card-left">
            <div class="card-top-row">
                <span class="card-title">${task.name_task || task.title || 'ไม่มีชื่อ'}</span>
            </div>
            ${task.details ? `<p class="card-desc">${task.details}</p>` : ''}
            <div class="card-timestamps">
                <span class="timestamp-item">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span class="timestamp-label">สร้าง</span>
                    ${formatDate(task.created_at)}
                </span>
                <span class="timestamp-item">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="timestamp-label">อัปเดต</span>
                    ${formatDate(task.updated_at)}
                </span>
            </div>
        </div>

        <div class="card-right">
            <span class="status-badge ${status}">
                ${status === 'done' ? '✓ เสร็จ' : '✕ ยกเลิก'}
            </span>
            <span class="priority-badge ${priority}">
                ${priorityLabel(priority)}
            </span>
        </div>

    </div>`;
}

/* ==========================================
   RENDER LIST
   ========================================== */
let allTasks     = [];
let activeFilter = 'all';

function render(filter = 'all') {
    const list = document.getElementById('history-list');

    let filtered = allTasks;
    if (filter === 'done')   filtered = allTasks.filter(t => t.status === 'done');
    if (filter === 'cancel') filtered = allTasks.filter(t => t.status === 'cancel');
    if (['high', 'medium', 'low'].includes(filter))
        filtered = allTasks.filter(t => t.priority === filter);

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>ไม่มีรายการในหมวดนี้</p>
            </div>`;
        return;
    }

    const sorted = [...filtered].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    list.innerHTML = sorted
        .map((t, i) =>
            buildCard(t).replace(
                'class="history-card',
                `class="history-card" style="animation-delay:${i * 0.04}s`
            )
        )
        .join('');
}

/* ==========================================
   UPDATE SUMMARY NUMBERS
   ========================================== */
function updateSummary(tasks) {
    document.getElementById('total-count').textContent  = tasks.length;
    document.getElementById('done-count').textContent   = tasks.filter(t => t.status === 'done').length;
    document.getElementById('cancel-count').textContent = tasks.filter(t => t.status === 'cancel').length;
}

/* ==========================================
   FILTER CHIP EVENTS
   ========================================== */
document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        render(activeFilter);
    });
});

/* ==========================================
   LOAD DATA
   ========================================== */
async function loadHistory() {
    try {
        const res = await fetch(`${API_BASE}/tasks/history`);
        const data = await res.json();
        console.log(data)

        allTasks = data || [];
        updateSummary(allTasks);
        render(activeFilter);
    } catch (err) {
        console.error('ดึงข้อมูลไม่ได้:', err);
        document.getElementById('history-list').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p>โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่</p>
            </div>`;
    }
}

loadHistory();