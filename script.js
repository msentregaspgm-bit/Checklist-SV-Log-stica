const URL_API = "https://script.google.com/macros/s/AKfycbzAQaRcltLEa274Da3gN0tX3tI2WWWQ46mJdXtFJ2brk_GGqvuStr_7eXmfTI5g-l-o/exec";
let dbGeral = [];

window.onload = async () => {
    const res = await fetch(URL_API);
    dbGeral = await res.json();
    popularTipos();
};

function popularTipos() {
    const selectTipo = document.getElementById('tipoMaquina');
    const tiposUnicos = [...new Set(dbGeral.map(item => item["Tipo Máquina"]))];
    
    tiposUnicos.forEach(tipo => {
        const opt = document.createElement('option');
        opt.value = tipo;
        opt.textContent = tipo;
        selectTipo.appendChild(opt);
    });
}

function atualizarIDs() {
    const tipoEscolhido = document.getElementById('tipoMaquina').value;
    const selectID = document.getElementById('idMaquina');
    selectID.innerHTML = '<option value="">Selecione o ID...</option>';
    
    const filtrados = dbGeral.filter(item => item["Tipo Máquina"] === tipoEscolhido);
    filtrados.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m["ID Máquina"];
        opt.textContent = m["ID Máquina"];
        selectID.appendChild(opt);
    });
}

function irParaChecklist() {
    const idEscolhido = document.getElementById('idMaquina').value;
    const maq = dbGeral.find(m => m["ID Máquina"] === idEscolhido);
    
    if(!maq) return alert("Selecione a máquina!");

    // Esconde Tela 1, Mostra Tela 2
    document.getElementById('tela1').style.display = 'none';
    document.getElementById('tela2').style.display = 'block';
    
    // Preenche cabeçalho da Tela 2
    document.getElementById('infoCabecalho').innerText = `${maq["Tipo Máquina"]} - ${maq["ID Máquina"]} (${maq["Placa"]})`;
    
    // Gera os itens dinâmicos que estão na planilha (separados por vírgula)
    const container = document.getElementById('containerItens');
    container.innerHTML = "";
    const itens = maq["Itens Checklist"].split(",");
    
    itens.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <span>${item.trim()}</span>
            <select class="respostas-checklist" data-nome="${item.trim()}">
                <option value="OK">OK</option>
                <option value="NOK">NOK</option>
            </select>
        `;
        container.appendChild(div);
    });
}

async function enviarFinal() {
    const btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    
    const respostas = Array.from(document.querySelectorAll('.respostas-checklist'))
        .map(sel => `${sel.dataset.nome}: ${sel.value}`).join(" | ");

    const idEscolhido = document.getElementById('idMaquina').value;
    const maq = dbGeral.find(m => m["ID Máquina"] === idEscolhido);

    const payload = {
        operador: document.getElementById('operador').value,
        tipoMaquina: maq["Tipo Máquina"],
        idMaquina: maq["ID Máquina"],
        placa: maq["Placa"],
        respostas: respostas,
        observacao: document.getElementById('observacao').value
    };

    await fetch(URL_API, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    alert("Checklist Salvo!");
    location.reload();
}
