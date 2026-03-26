import { API_BASE } from './config.js'

let selectedPriority = '';

export async function initEditModal() {
  const res = await fetch('/page/components/editModal.html');
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('btn-close-edit-modal')
    .addEventListener('click', closeEditModal);

  // priority selector
  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.priority-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPriority = btn.dataset.value;
    });
  });

  document.getElementById('btn-save-task')
    .addEventListener('click', saveTask);
}

export function openEditModal(task) {
  document.getElementById('edit-name').value = task.name_task;
  document.getElementById('edit-details').value = task.details || '';

  // set priority
  selectedPriority = task.priority;
  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === task.priority);
  });

  document.getElementById('edit-modal-overlay').dataset.id = task.id;
  document.getElementById('edit-modal-overlay').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-modal-overlay').style.display = 'none';
}

function saveTask() {
  const id = document.getElementById('edit-modal-overlay').dataset.id;
  const name_task = document.getElementById('edit-name').value.trim();
  const details = document.getElementById('edit-details').value.trim();

  if (!name_task) {
    alert('กรุณากรอกชื่อ task');
    return;
  }

  fetch(`${API_BASE}/tasks/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name_task, details, priority: selectedPriority })
  }).then(() => {
    closeEditModal();
    window.dispatchEvent(new Event('reloadTasks'));
  });
}