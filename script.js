// Variáveis globais
let currentUser = null;
let selectedPlanData = null;

// Navegação entre seções
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0, 0);

    if (sectionId === 'dashboard') {
        loadDashboard();
    }
}

// Selecionar plano e ir para cadastro
function selectPlan(planName, price) {
    selectedPlanData = { name: planName, price: price };
    document.getElementById('selectedPlan').value = planName;
    showSection('register');
}

// Validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.length === 11;
}

// Formatação de CPF
function formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatação automática do CPF enquanto digita
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value.length <= 11) {
                e.target.value = formatCPF(value);
            }
        });
    }
});

// Função de cadastro
function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const plan = document.getElementById('selectedPlan').value;

    // Esconder mensagens de erro
    document.getElementById('cpfError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';

    // Validar CPF
    if (!validateCPF(cpf)) {
        document.getElementById('cpfError').style.display = 'block';
        return;
    }

    // Validar senhas
    if (password !== confirmPassword) {
        document.getElementById('passwordError').style.display = 'block';
        return;
    }

    // Criar objeto do usuário
    const userData = {
        fullName,
        cpf,
        email,
        password,
        plan,
        registrationDate: new Date().toISOString()
    };

    // Salvar no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
        alert('Este email já está cadastrado!');
        return;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    // Mostrar página de pagamento
    document.getElementById('paymentPlan').textContent = plan;
    showSection('payment');

    // Após 2 segundos, fazer login automático
    setTimeout(() => {
        currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateLoginButton();
    }, 2000);
}

// Função de login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Esconder mensagem de erro
    document.getElementById('loginError').style.display = 'none';

    // Buscar usuário no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateLoginButton();
        showSection('dashboard');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

// Carregar dados do dashboard
function loadDashboard() {
    if (!currentUser) return;

    document.getElementById('dashName').textContent = currentUser.fullName;
    document.getElementById('dashEmail').textContent = currentUser.email;
    document.getElementById('dashCpf').textContent = currentUser.cpf;
    document.getElementById('dashPlan').textContent = currentUser.plan;

    // Calcular próxima data de vencimento (1 mês a partir de hoje)
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    document.getElementById('dashDueDate').textContent = dueDate.toLocaleDateString('pt-BR');
}

// Editar perfil
function editProfile() {
    alert('Funcionalidade de edição em desenvolvimento!');
}

// Cancelar plano
function cancelPlan() {
    if (confirm('Tem certeza que deseja cancelar seu plano?')) {
        alert('Plano cancelado com sucesso. Sentiremos sua falta!');
        logout();
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateLoginButton();
    showSection('home');
}

// Atualizar botão de login/área do torcedor
function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.textContent = 'Área do Torcedor';
        loginBtn.onclick = () => showSection('dashboard');
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => showSection('login');
    }
}

// Verificar se há usuário logado ao carregar a página
window.onload = function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateLoginButton();
    }
};