let produtosAdmin = JSON.parse(localStorage.getItem('produtosAdmin')) || [];

function exibirProdutosAdmin() {
    const container = document.getElementById('produtos-admin');
    if(!container) return;
    container.innerHTML = '';
    produtosAdmin.forEach((p, i) => {
        container.innerHTML += `<p>${p.nome} - R$ ${p.preco.toFixed(2)} <button onclick="removerProduto(${i})">Remover</button></p>`;
    });
}

function cadastrarProduto() {
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const ingredientes = document.getElementById('ingredientes').value.split(',').map(i => i.trim());
    const preco = parseFloat(document.getElementById('preco').value);
    const img = document.getElementById('img').value;

    if(!nome || !categoria || isNaN(preco) || !img) { 
        alert('Preencha todos os campos corretamente'); 
        return; 
    }

    // Gerar ID único
    const id = produtosAdmin.length > 0 ? Math.max(...produtosAdmin.map(p => p.id)) + 1 : 1;
    
    produtosAdmin.push({id, nome, categoria, ingredientes, preco, img});
    localStorage.setItem('produtosAdmin', JSON.stringify(produtosAdmin));
    exibirProdutosAdmin();
    
    // Limpar campos
    document.getElementById('nome').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('ingredientes').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('img').value = '';
}

function removerProduto(index) {
    produtosAdmin.splice(index,1);
    localStorage.setItem('produtosAdmin', JSON.stringify(produtosAdmin));
    exibirProdutosAdmin();
}

window.onload = () => {
    exibirProdutosAdmin();
};
