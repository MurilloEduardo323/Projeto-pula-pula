// --- COLE SUAS CONFIGURAÇÕES DO FIREBASE AQUI ---
// --- CONFIGURAÇÃO DO FIREBASE (Já com seus dados) ---
const firebaseConfig = {
    apiKey: "AIzaSyDeN9rHuLrMFMjyifSVykcQc9Ixd5mSMWg",
    authDomain: "brinquedos-murillo.firebaseapp.com",
    databaseURL: "https://brinquedos-murillo-default-rtdb.firebaseio.com",
    projectId: "brinquedos-murillo",
    storageBucket: "brinquedos-murillo.firebasestorage.app",
    messagingSenderId: "98837784075",
    appId: "1:98837784075:web:922a0dac507d280bd0c90e"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let nomeCliente, telCliente, nascCliente;

function irParaReserva() {
    nomeCliente = document.getElementById('cad-nome').value;
    telCliente = document.getElementById('cad-tel').value;
    nascCliente = document.getElementById('cad-nasc').value;

    if(!nomeCliente || !telCliente || !nascCliente) return alert("Preencha todos os dados!");

    document.getElementById('tela-cadastro').classList.add('hidden');
    document.getElementById('tela-reserva').classList.remove('hidden');
    document.getElementById('saudacao').innerText = `Olá, ${nomeCliente.split(' ')[0]}! 👋`;
}

// --- FUNÇÃO DE VERIFICAÇÃO (CORRIGIDA) ---
function verificarDisponibilidade() {
    const dataEscolhida = document.getElementById('data-festa').value;
    if(!dataEscolhida) return;

    // 1. Limpa bloqueios anteriores
    document.querySelectorAll('.card-brinquedo').forEach(c => c.classList.remove('indisponivel'));
    document.querySelectorAll('.status-msg').forEach(m => m.innerText = "");
    document.querySelectorAll('.brinquedo').forEach(i => {
        i.disabled = false;
        i.checked = false;
    });
    atualizarSoma();

    // 2. Busca no Firebase se já existem reservas para essa data
    database.ref('reservas').orderByChild('data').equalTo(dataEscolhida).once('value', snapshot => {
        snapshot.forEach(child => {
            const reserva = child.val();
            if(reserva.brinquedo === "Pula-Pula") travar("pula");
            if(reserva.brinquedo === "Piscina-Bolinha") travar("piscina");
            if(reserva.brinquedo === "Combo-Duplo") travar("combo");
        });
    });
}

function travar(idCurto) {
    document.getElementById(`card-${idCurto}`).classList.add('indisponivel');
    document.getElementById(`msg-${idCurto}`).innerText = "❌ JÁ RESERVADO";
    document.getElementById(`check-${idCurto}`).disabled = true;
}

function atualizarSoma() {
    let sub = 0;
    document.querySelectorAll('.brinquedo:checked').forEach(b => sub += parseFloat(b.getAttribute('data-preco')));
    const frete = parseFloat(document.getElementById('bairro').options[document.getElementById('bairro').selectedIndex].getAttribute('data-frete')) || 0;

    document.getElementById('res-brinquedos').innerText = `R$ ${sub.toFixed(2)}`;
    document.getElementById('res-frete').innerText = `R$ ${frete.toFixed(2)}`;
    document.getElementById('res-total').innerText = `R$ ${(sub + frete).toFixed(2)}`;
}

function salvarEEnviar() {
    const data = document.getElementById('data-festa').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = document.getElementById('bairro').value;
    const selecionados = document.querySelectorAll('.brinquedo:checked');
    const totalTexto = document.getElementById('res-total').innerText;

    if (!data || selecionados.length === 0 || !endereco || bairro === "") {
        return alert("Preencha a data, o endereço e selecione ao menos um brinquedo!");
    }

    // Pega o valor total e converte para número
    const totalNumerico = parseFloat(totalTexto.replace('R$ ', ''));

    // Pega o valor do frete selecionado (para calcular o lucro depois no painel admin)
    const selectBairro = document.getElementById('bairro');
    const freteNumerico = parseFloat(selectBairro.options[selectBairro.selectedIndex].getAttribute('data-frete')) || 0;

    let itensTxt = "";

    // Salva cada brinquedo no banco de dados
    selecionados.forEach(b => {
        itensTxt += "- " + b.value + "%0A";

        database.ref('reservas').push({
            cliente: nomeCliente,
            telefone: telCliente,
            data: data,
            dataPedido: new Date().toLocaleString('pt-BR'),
            brinquedo: b.value,
            valorTotal: totalNumerico / selecionados.length, // Divide o valor total entre os itens
            frete: freteNumerico / selecionados.length, // Divide o frete entre os itens (mesma lógica do valorTotal)
            endereco: endereco + " (" + bairro + ")",
            pago: false
        });
    });

    const msg = `*NOVA RESERVA*%0A%0A👤 *Cliente:* ${nomeCliente}%0A📞 *Tel:* ${telCliente}%0A📅 *Data:* ${data}%0A🏠 *End:* ${endereco} (${bairro})%0A%0A🎡 *Itens:*%0A${itensTxt}%0A💰 *TOTAL:* ${totalTexto}`;

    // Abre o WhatsApp para enviar a mensagem
    window.open(`https://wa.me/5563984516310?text=${msg}`);
}
