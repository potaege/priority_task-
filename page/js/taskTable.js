import { API_BASE } from './config.js'
import { initModal, openModal } from './modal.js'
import { initEditModal } from './editModal.js'
import { initAddModal, openAddModal } from './addModal.js'

async function init() {
  await initModal();
  await initEditModal(); // ← เพิ่ม
  await initAddModal(); // ← เพิ่ม
  loadTaskTable();

  document.querySelector('.btn-add')
    .addEventListener('click', openAddModal);
}

window.addEventListener('reloadTasks', loadTaskTable);


async function loadTaskTable() {
  try {
    const res = await fetch(`${API_BASE}/tasks/table`);
    const data = await res.json();

    console.log(data);

    renderColumn('high-list', data.high);
    renderColumn('medium-list', data.medium);
    renderColumn('low-list', data.low);

  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ', err);
  }
}


function renderColumn(containerId, tasks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // ล้างของเดิมออกก่อน
  container.innerHTML = '';

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = task.id;          
    card.dataset.name = task.name_task;
    card.dataset.details = task.details;
    card.dataset.priority = task.priority;
    card.innerHTML = `
      <div class="card-title">${task.name_task}</div>
      <div class="card-desc">${task.details}</div>
    `;
    card.addEventListener('click', () => openModal(task));
    container.appendChild(card);
  });
}



init();