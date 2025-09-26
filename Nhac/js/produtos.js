let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

fetch('data/produtos.json')
.then(res => res.json())
.then(data => {
    produtos = data;
    exibirProdutos();
});

function exibirProdutos() {
    const grid = document.querySelector('.produtos-grid');
    if(!grid) return;
    grid.innerHTML = '';
    produtos.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${prod.img}" alt="${prod.nome}" onerror="this.src='https://via.placeholder.com/400x300?text=Imagem+Indisponível'">
            <h3>${prod.nome}</h3>
            <p>R$ ${prod.preco.toFixed(2)}</p>
            <button onclick="adicionarCarrinho(${prod.id})">Adicionar</button>
        `;
        grid.appendChild(card);
    });
}

function adicionarCarrinho(id) {
    const prod = produtos.find(p => p.id === id);
    if(prod) {
        // Verifica se o produto já está no carrinho
        const itemExistente = carrinho.find(item => item.id === id);
        if(itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            carrinho.push({...prod, quantidade: 1});
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        alert(`${prod.nome} adicionado ao carrinho!`);
    }
}
