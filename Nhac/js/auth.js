function cadastrar() {
  const email = document.getElementById('reg-email').value;
  const senha = document.getElementById('reg-senha').value;
  if(!email || !senha){ alert('Preencha todos os campos'); return; }
  let users = JSON.parse(localStorage.getItem('users')) || [];
  if(users.find(u => u.email === email)){ alert('Email já cadastrado'); return; }
  users.push({email, senha});
  localStorage.setItem('users', JSON.stringify(users));
  alert('Cadastro realizado!');
}

function login() {
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.senha === senha);
  if(user){
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'cardapio.html';
  } else {
    alert('Email ou senha incorretos');
  }
}
