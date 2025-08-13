document.addEventListener('DOMContentLoaded', function() {
    // To-Do List Functionality
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemsLeft = document.getElementById('itemsLeft');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    
    // Initialize the todo list
    renderTodos();
    updateItemsLeft();
    
    // Add new todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Filter todos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });
    
    // Clear completed todos
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            updateItemsLeft();
            todoInput.value = '';
        }
    }
    
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks found';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#888';
            todoList.appendChild(emptyMessage);
            return;
        }
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = todo.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', toggleTodo);
            
            const span = document.createElement('span');
            span.className = 'todo-text';
            if (todo.completed) span.classList.add('completed');
            span.textContent = todo.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', deleteTodo);
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            
            todoList.appendChild(li);
        });
    }
    
    function toggleTodo(e) {
        const todoId = parseInt(e.target.parentElement.dataset.id);
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            todo.completed = e.target.checked;
            saveTodos();
            renderTodos();
            updateItemsLeft();
        }
    }
    
    function deleteTodo(e) {
        const todoId = parseInt(e.target.parentElement.dataset.id);
        todos = todos.filter(t => t.id !== todoId);
        saveTodos();
        renderTodos();
        updateItemsLeft();
    }
    
    function clearCompleted() {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
        updateItemsLeft();
    }
    
    function updateItemsLeft() {
        const activeTodos = todos.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeTodos} ${activeTodos === 1 ? 'item' : 'items'} left`;
    }
    
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Contact Form Functionality
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Name validation
        if (name === '') {
            document.getElementById('nameError').textContent = 'Name is required';
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }
        
        // Email validation
        if (email === '') {
            document.getElementById('emailError').textContent = 'Email is required';
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }
        
        // Phone validation (optional)
        if (phone && !isValidPhone(phone)) {
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }
        
        // Message validation
        if (message === '') {
            document.getElementById('messageError').textContent = 'Message is required';
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        }
        
        // If form is valid, submit it (in a real app, you would send to server)
        if (isValid) {
            alert('Form submitted successfully!');
            this.reset();
        }
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(phone);
    }

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});