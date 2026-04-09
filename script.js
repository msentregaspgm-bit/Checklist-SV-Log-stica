const URL_API = "https://script.google.com/macros/s/AKfycbxwVYXo02qtpNkww0rRj2pmcoqS7xZ-aFAWfp2fzuMreYrkBNBH7-HY5ZzeXGQnpmsa/exec";

let dadosMaquinas = [];
const itensInspecao = ["Freios", "Pneus", "Nível de Óleo", "Luzes", "Limpadores", "Cinto de Segurança"];

// Inicialização
window.onload = async () => {
    gerarItens();
    await carregarMaquinas();
};

function gerarItens() {
    const container = document.getElementById('itensChecklist');
    itensInspecao.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <span>${item}</span>
            <select class="status-item" data-item="${item}">
                <option value="OK">OK</option>
                <option value="NOK">NOK</option>
            </select>
        `;
        container.appendChild(div);
    });
}

async function carregarMaquinas() {
    try {
        const res = await fetch(URL_API);
        dadosMaquinas = await res.json();
        const select = document.getElementById('maquina');
        select.innerHTML = '<option value="">Selecione...</option>';
        dadosMaquinas.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.Nome_da_Máquina; 
            opt.textContent = m.Nome_da_Máquina;
            select.appendChild(opt);
        });
    } catch (e) {
        alert("Erro ao carregar lista de máquinas.");
    }
}

document.getElementById('maquina').addEventListener('change', (e) => {
    const maq = dadosMaquinas.find(m => m.Nome_da_Máquina === e.target.value);
    document.getElementById('placa').value = maq ? maq.Placa : "";
});

document.getElementById('formChecklist').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    btn.innerText = "Salvando na Planilha...";

    const statusItens = Array.from(document.querySelectorAll('.status-item'))
                             .map(s => `${s.dataset.item}: ${s.value}`).join(' | ');

    const payload = {
        operador: document.getElementById('operador').value,
        maquina: document.getElementById('maquina').value,
        placa: document.getElementById('placa').value,
        status: statusItens,
        observacao: document.getElementById('observacao').value
    };

    try {
        await fetch(URL_API, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
        alert("Sucesso! Checklist registrado.");
        location.reload();
    } catch (err) {
        alert("Erro ao enviar dados.");
        btn.disabled = false;
    }
});
