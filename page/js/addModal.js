import { API_BASE } from './config.js'

let selectedPriority = '';

export async function initAddModal() {
  const res = await fetch('/page/components/addModal.html');
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('btn-close-add-modal')
    .addEventListener('click', closeAddModal);

  document.querySelectorAll('#add-priority-selector .priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#add-priority-selector .priority-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPriority = btn.dataset.value;
    });
  });

  document.getElementById('btn-add-task')
    .addEventListener('click', addTask);
}

export function openAddModal() {
  // reset form
  document.getElementById('add-name').value = '';
  document.getElementById('add-details').value = '';
  document.querySelectorAll('#add-priority-selector .priority-btn')
    .forEach(b => b.classList.remove('active'));
  selectedPriority = '';

  document.getElementById('add-modal-overlay').style.display = 'flex';
}

function closeAddModal() {
  document.getElementById('add-modal-overlay').style.display = 'none';
}

function addTask() {
  const name_task = document.getElementById('add-name').value.trim();
  const details = document.getElementById('add-details').value.trim();

  if (!name_task) {
    alert('กรุณากรอกชื่อ task');
    return;
  }
  if (!selectedPriority) {
    alert('กรุณาเลือก Priority');
    return;
  }

  fetch(`${API_BASE}/tasks/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name_task, details, priority: selectedPriority })
  }).then(() => {
    closeAddModal();
    window.dispatchEvent(new Event('reloadTasks'));
  });
}