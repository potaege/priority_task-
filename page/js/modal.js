import { API_BASE } from './config.js'
import { openEditModal } from './editModal.js' 

export async function initModal() {
  // โหลด modal.html มาใส่ใน body
  const res = await fetch('/page/components/modal.html');
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  // ผูก event ปุ่ม
  document.getElementById('btn-close-modal')
    .addEventListener('click', closeModal);
  document.getElementById('btn-cancel-task')
    .addEventListener('click', () => confirmStatus('cancel'));
  document.getElementById('btn-done-task')
    .addEventListener('click', () => confirmStatus('done'));
  
  document.getElementById('btn-edit-task')
  .addEventListener('click', () => {
    const id = document.getElementById('modal-overlay').dataset.id;
    const task = {
      id,
      name_task: document.getElementById('modal-name').textContent,
      details: document.getElementById('modal-details').textContent,
      priority: document.getElementById('modal-priority').textContent.toLowerCase()
    };
    closeModal();
    openEditModal(task);
  });
}

export function openModal(task) {
  document.getElementById('modal-id').textContent = task.id;
  document.getElementById('modal-name').textContent = task.name_task;
  document.getElementById('modal-details').textContent = task.details;
  document.getElementById('modal-priority').textContent = task.priority;
  document.getElementById('modal-overlay').dataset.id = task.id;
  document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}


function confirmStatus(status) {
  const label = status === 'cancel' ? 'ยกเลิก task' : 'เสร็จสิ้น';
  const confirmed = confirm(`ยืนยันที่จะ "${label}" รายการนี้ไหม?`);

  if (!confirmed) return;

  const id = document.getElementById('modal-overlay').dataset.id;

  fetch(`${API_BASE}/tasks/status/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: status === 'cancel' ? 'cancel' : 'done' })
  }).then(res => {
    if (res.ok) {
      closeModal();
      window.dispatchEvent(new Event('reloadTasks'));
    }
  });
}
