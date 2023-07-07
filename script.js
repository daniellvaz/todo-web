const form = document.querySelector('form');
const content = document.querySelector('.content');
const input = document.querySelector('input[type="text"]')

const toast = {
  element: (message, type = 'waring') => {
    return `
      <p>${message}</p>
      <img src="assets/alert.svg" alt="alert">
    `
  },
  end: (element) => {
    setTimeout(() => {
      element.style.display = 'none'
    }, 3000)
  },
  success: (message) => {
    const element = document.querySelector('.toast');

    element.classList.add('success');
    element.innerHTML = toast.element(message);
    element.style.display = 'flex';
    toast.end(element)
  },
  info: (message) => {
    const element = document.querySelector('.toast');

    element.classList.add('info');
    element.innerHTML = toast.element(message);
    element.style.display = 'flex';
    toast.end(element)
  },
  waring: (message) => {
    const element = document.querySelector('.toast');

    element.classList.add('waring');
    element.innerHTML = toast.element(message);
    element.style.display = 'flex';
    toast.end(element)
  },
  danger: (message) => {
    const element = document.querySelector('.toast');

    element.classList.add('danger');
    element.innerHTML = toast.element(message);
    element.style.display = 'flex';
    toast.end(element)
  },
}

const getTasks = () => {
  const data = localStorage.getItem('tasks');

  return JSON.parse(data);
}

const handleIncrementItems = (tasks) => {
  const totalOfCreatedTasks = tasks ? tasks.length : 0;
  const totalOfFinishedTasks = tasks ? tasks.filter(task => task.status === true).length : 0
  
  incrementValue('created', totalOfCreatedTasks);
  incrementValue('finished', totalOfFinishedTasks);
}

const incrementValue = (id = "", max) => {
  let value = 0;

  setInterval(() => {
    const element = document.getElementById(id);

    if(value < max) {
      value ++
      element.textContent = value;
      return;
    } 
  }, 50)
}

const createMessageElement = () => {
  return `
    <p class="message">
      Ainda não há tarefas cadastradas.
    </p>
  `;
}

const createTaskElement = (id, title, status = false) => {
  const li = document.createElement('li')
  const content = `
    <div class="item__input-wrapper">
    <input ${status ? 'checked' : ''} type="checkbox" class="input__checkbox">
    <p ${status ? 'class="done"' : ''} id="title">${title}</p>
    </div>
    <button id="delete">
      <img src="/assets/trash.svg" alt="trash">
    </button>
  `

  li.classList.add('item');
  li.dataset.id = id;
  li.innerHTML = content;

  return li
}

const handleDeleteElement = () => {
  const deleteButtons = document.querySelectorAll('#delete');

  deleteButtons.forEach(element => {
    element.addEventListener('click', e => {
      const tasks = getTasks();
      const id = e.currentTarget.parentElement.dataset.id;

      if(tasks.length <= 1 || !tasks) {
        localStorage.clear();
        window.location.reload();
        toast.success('Tarefa deletada com sucesso!');

        return;
      }

      const currentTasks = tasks.filter(item => item.id !== Number(id));


      init(currentTasks)
      toast.success('Tarefa deletada com sucesso!');
      localStorage.setItem('tasks', JSON.stringify(currentTasks));
    });
  })
}

const handleCheckElement = () => {
  const elements = document.querySelectorAll('input[type="checkbox"]');
  const checkboxArray = Array.from(elements);

  checkboxArray.forEach(element => {
    element.addEventListener('change', e => {
      const tasks = getTasks();
      const id = e.target.parentNode.parentNode.dataset.id;
      const title = e.target.parentNode.querySelector('#title');
      const element = tasks.find(task => task.id === Number(id));
      const currentTasks = tasks.filter(task => task.id !== Number(id));
      const updatedTasks = [{...element, status: !element.status }, ...currentTasks]
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      title.classList.toggle('done');

      init(updatedTasks);
    });
  })
}

const handleTasks = (tasks) => {
  if(!tasks) {
    content.innerHTML = createMessageElement();
    return;
  }

  const fragmento = document.createDocumentFragment();

  tasks.map(({ id, title, status }) => {
    const li = createTaskElement(id, title, status);

    fragmento.appendChild(li);
  });

  content.innerHTML = '',
  content.appendChild(fragmento)
}

const createTask = (id, title) => {
  const tasks = getTasks();
  const item = { id, title, status: false }

  if(!tasks) {
    localStorage.setItem('tasks', JSON.stringify([item]));
    init([item]);

    return;
  }

  const currentTasks = [...tasks, item];
  
  localStorage.setItem('tasks', JSON.stringify(currentTasks));
  init(currentTasks)
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const title = input.value;
  const id = Date.now();

  if(!title) {
    toast.danger('Preencha o título da tarefa!');
    return;
  }

  createTask(id, title);
  input.value = ''
});

const init = (tasks) => {
  handleTasks(tasks);
  handleIncrementItems(tasks)
  handleCheckElement();
  handleDeleteElement();
}

init(getTasks());