function criarOrderObject(carrinho){
  const user = JSON.parse(localStorage.getItem('user')) || {email: 'convidado@local'};
  const orderId = 'PED' + Date.now();
  const total = carrinho.reduce((s,i)=> s + i.preco * i.quantidade, 0);
  return {
    orderId,
    usuario: user.email,
    itens: carrinho,
    total,
    status: 'Pendente',
    criadoEm: new Date().toISOString()
  };
}

function finalizarPedido(){
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if(carrinho.length === 0){ alert('Carrinho vazio'); return; }
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  const pedido = criarOrderObject(carrinho);
  orders.push(pedido);
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.removeItem('carrinho');
  // Atualizar total na página de pagamento
  const url = `pagamento.html?orderId=${pedido.orderId}&total=${pedido.total}`;
  window.location.href = url;
}

// Exibir/ocultar campos do cartão e Pix conforme forma de pagamento
if(window.location.pathname.includes('pagamento.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const camposCartao = [
            document.getElementById('label-nome-cartao'),
            document.getElementById('nome-cartao'),
            document.getElementById('label-numero-cartao'),
            document.getElementById('numero-cartao'),
            document.getElementById('label-validade-cartao'),
            document.getElementById('validade-cartao'),
            document.getElementById('label-cvv-cartao'),
            document.getElementById('cvv-cartao')
        ];
        let pixDiv = document.getElementById('pix-info');
        if(!pixDiv) {
            pixDiv = document.createElement('div');
            pixDiv.id = 'pix-info';
            pixDiv.style.display = 'none';
            pixDiv.innerHTML = `<p><strong>Chave Pix:</strong> 123.456.789-00<br>Ou escaneie o QR Code abaixo:</p><img src='https://via.placeholder.com/200x200?text=QR+Code+Pix' alt='QR Code Pix' style='margin:12px 0;'>`;
            document.querySelector('.container').appendChild(pixDiv);
        }
        let pixChaves = document.getElementById('pix-chaves');
        document.querySelectorAll('input[name="forma-pagamento"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if(this.value === 'Cartão de Crédito' || this.value === 'Débito') {
                    camposCartao.forEach(c => c.style.display = 'inline-block');
                    pixDiv.style.display = 'none';
                    pixChaves.style.display = 'none';
                } else if(this.value === 'Pix') {
                    camposCartao.forEach(c => c.style.display = 'none');
                    pixDiv.style.display = 'block';
                    pixChaves.style.display = 'block';
                } else {
                    camposCartao.forEach(c => c.style.display = 'none');
                    pixDiv.style.display = 'none';
                    pixChaves.style.display = 'none';
                }
            });
        });
        // Ocultar campos inicialmente
        camposCartao.forEach(c => c.style.display = 'none');
        pixDiv.style.display = 'none';
        pixChaves.style.display = 'none';
    });
}

// Abrir página de preenchimento da chave Pix
function abrirPix(tipo) {
    const chave = prompt('Digite sua chave Pix do tipo ' + tipo + ':');
    if(chave && chave.length > 3) {
        alert('Pagamento via Pix (' + tipo + ') processado! Chave: ' + chave);
        window.location.href = 'acompanhamento.html';
    } else {
        alert('Chave Pix inválida.');
    }
}

// Função para processar pagamento com opções
function processarPagamento() {
    const forma = document.querySelector('input[name="forma-pagamento"]:checked');
    if(!forma) {
        alert('Escolha a forma de pagamento');
        return;
    }
    if(forma.value === 'Cartão de Crédito' || forma.value === 'Débito') {
        const nome = document.getElementById('nome-cartao').value;
        const numero = document.getElementById('numero-cartao').value;
        const validade = document.getElementById('validade-cartao').value;
        const cvv = document.getElementById('cvv-cartao').value;
        if(!nome || !numero || !validade || !cvv) {
            alert('Preencha todos os dados do cartão');
            return;
        }
        if(numero.length < 12 || cvv.length < 3) {
            alert('Dados do cartão inválidos');
            return;
        }
        alert('Pagamento via ' + forma.value + ' processado com sucesso!');
    } else if(forma.value === 'Pix') {
        alert('Pagamento via Pix processado! Aguarde a confirmação.');
    } else {
        alert('Pagamento via ' + forma.value + ' processado!');
    }
    window.location.href = 'acompanhamento.html';
}

// Função para exibir carrinho
function exibirCarrinho() {
    const container = document.getElementById('carrinho-list');
    const totalElem = document.getElementById('total');
    if(!container) return;
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    container.innerHTML = '';
    if(carrinho.length === 0) {
        container.innerHTML = '<p>Carrinho vazio</p>';
        if(totalElem) totalElem.textContent = 'Total: R$ 0,00';
        return;
    }
    carrinho.forEach((item, index) => {
        container.innerHTML += `
            <div class="carrinho-item">
                <p>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade || 1}
                <button onclick="removerDoCarrinho(${index})">Remover</button></p>
            </div>
        `;
    });
    const total = carrinho.reduce((sum, item) => sum + item.preco * (item.quantidade || 1), 0);
    if(totalElem) totalElem.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função para remover item do carrinho
function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirCarrinho();
}

// Inicializar exibição do carrinho quando a página carregar
if(document.getElementById('carrinho-list')) {
    window.onload = exibirCarrinho;
}

// Carregar total na página de pagamento
if(window.location.pathname.includes('pagamento.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const total = urlParams.get('total') || '0';
        document.getElementById('total-pagamento').textContent = parseFloat(total).toFixed(2);
    });
}

// Função para exibir status do pedido de forma profissional
if(window.location.pathname.includes('acompanhamento.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const statusDiv = document.getElementById('status-pedido');
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        let pedido;
        if(orderId) {
            pedido = orders.find(o => o.orderId === orderId);
        } else if (orders.length > 0) {
            pedido = orders[orders.length - 1]; // Mostra o último pedido se não houver orderId
        }
        if(!pedido) {
            statusDiv.innerHTML = '<p>Pedido não encontrado.</p>';
            return;
        }
        // Timeline de status
        const statusList = ['Pendente', 'Em preparo', 'Em entrega', 'Entregue'];
        let statusHtml = `<div class=\"timeline\">`;
        statusList.forEach((status, idx) => {
            const active = pedido.status === status || statusList.indexOf(pedido.status) > idx ? 'active' : '';
            statusHtml += `<div class=\"timeline-step ${active}\">${status}</div>`;
        });
        statusHtml += `</div>`;
        // Detalhes do pedido
        let itensHtml = pedido.itens.map(item => `<li><strong>${item.nome}</strong> x ${item.quantidade || 1} <span style='float:right'>R$ ${item.preco.toFixed(2)}</span></li>`).join('');
        // Botões extras para acompanhamento
        let buttonsHtml = `
            <div style='display:flex; gap:12px; margin-top:24px; justify-content:center;'>
                <button onclick=\"atualizarStatusView()\" style='background:#ff7f50; color:#fff; border:none; border-radius:8px; padding:10px 24px; font-weight:600; cursor:pointer;'>Atualizar Status</button>
                <button onclick=\"window.location.href='cardapio.html'\" style='background:#ececec; color:#222; border:none; border-radius:8px; padding:10px 24px; font-weight:500; cursor:pointer;'>Novo Pedido</button>
                <button onclick=\"window.location.href='pedido.html'\" style='background:#ececec; color:#222; border:none; border-radius:8px; padding:10px 24px; font-weight:500; cursor:pointer;'>Ver Carrinho</button>
            </div>
        `;
        statusDiv.innerHTML = `
            <h3>Pedido: <span style='color:#ff7f50'>${pedido.orderId}</span></h3>
            <p><strong>Usuário:</strong> ${pedido.usuario}</p>
            <ul style='list-style:none; padding:0; margin:16px 0 24px 0; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);'>${itensHtml}</ul>
            <p style='font-size:1.2em;'><strong>Total:</strong> <span style='color:#ff7f50'>R$ ${pedido.total.toFixed(2)}</span></p>
            <h4>Status do Pedido</h4>
            ${statusHtml}
            ${buttonsHtml}
        `;
    });
}

// Função para atualizar status do pedido (simulação)
function atualizarStatusView() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const pedido = orders.find(o => o.orderId === orderId);
    if(!pedido) return;
    const statusList = ['Pendente', 'Em preparo', 'Em entrega', 'Entregue'];
    let idx = statusList.indexOf(pedido.status);
    if(idx < statusList.length - 1) {
        pedido.status = statusList[idx + 1];
        localStorage.setItem('orders', JSON.stringify(orders));
        location.reload();
    } else {
        alert('Pedido já entregue!');
    }
}
