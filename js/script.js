const addBtn = document.querySelector('.main__add-btn');
const inputTodo = document.querySelector('.main__input');
const todosContainer = document.querySelector('.main__todos');
let todos = JSON.parse(localStorage.getItem('todos')) || [];

document.forms.main__form.onsubmit = () => false;

addBtn.addEventListener('click',(event) => {
    if(inputTodo.value == '') return;

    todos.push({text:inputTodo.value,status:false});
    const todo = createTodo(inputTodo.value, false, todos.length-1);
    
    inputTodo.value = '';
    todosContainer.append(todo);
    localStorage.setItem('todos',JSON.stringify(todos));
})


function createTodo(text, status, index) {
    const todo = document.createElement('div');
    todo.classList.add('main__todo');
    todo.setAttribute('data-index',index);

    if(status)
        todo.classList.add('todo-done');

    const todoText = document.createElement('div');
    todoText.classList.add('main__todo-text')
    todoText.textContent = text;
    todo.append(todoText);

    const isDoneBtn = document.createElement('div')
    isDoneBtn.classList.add('main__done-btn');
    todo.append(isDoneBtn);
    isDoneBtn.addEventListener('click',function() {
        this.parentElement.classList.toggle('todo-done');
        const index = this.closest('div.main__todo').dataset.index;
        todos[index].status = !todos[index].status;
        localStorage.setItem('todos',JSON.stringify(todos));
    });

    const deleteTodoBtn = document.createElement('div')
    deleteTodoBtn.classList.add('main__delete-btn');
    todo.append(deleteTodoBtn);
    deleteTodoBtn.addEventListener('click',function() {
        const el = this.parentElement;
        el.classList.add('disappear');

        el.addEventListener('transitionend',() => {
            el.remove();
            const index = this.closest('div.main__todo').dataset.index;
            todos.splice(index,1);

            let i = 0;

            document.querySelectorAll('.main__todo').forEach((todo,index) => {
                todo.dataset.index = i++;
            })

            localStorage.setItem('todos',JSON.stringify(todos));
        })
    })

    return todo;
}

function displayTodos(items) {

    items.forEach((item,index) => {
        todosContainer.append(createTodo(item.text,item.status,index));  
    }) 
}

displayTodos(todos);

document.querySelector('.main__filter').addEventListener('change',filterTodos);

function filterTodos() {
    const todos = Array.from(document.querySelectorAll('.main__todo'));
    todos.forEach(todo => todo.style.display = 'none');

    if(this.value == 'all'){
        todos.forEach(todo => {
            todo.style.display = 'flex';
        })
    }
    else if(this.value == 'completed'){
        todos.filter(todo => todo.classList.contains('todo-done')).forEach(todo => {
            todo.style.display = 'flex';
        })
    }

    else if(this.value == 'uncompleted'){
        todos.filter(todo => !todo.classList.contains('todo-done')).forEach(todo => {
            todo.style.display = 'flex';
        })
    }
}