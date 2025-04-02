let indiceEdicao = null;

const validarNumero = numero => /^\d{10,11}$/.test(numero);
const validarCEP = cep => /^\d{8}$/.test(cep);

const getElementValue = id => document.getElementById(id).value.trim();
const setElementValue = (id, value) => document.getElementById(id).value = value;
const toggleDisabled = (ids, state) => ids.forEach(id => document.getElementById(id).disabled = state);

function loadLogradouro() {
    const cep = getElementValue('cep');
    if (!validarCEP(cep)) return alert('CEP inválido. Digite apenas números.');

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) return alert('CEP não encontrado.');
            setElementValue('rua', data.logradouro || "");
            setElementValue('bairro', data.bairro || "");
            setElementValue('cidade-uf', `${data.localidade || ""} / ${data.uf || ""}`);
        })
        .catch(() => alert("Erro ao buscar o CEP."));
}

function registrarCadastro(event) {
    event.preventDefault();
    const cadastro = {
        nome: getElementValue('nome'),
        email: getElementValue('email'),
        fone: getElementValue('fone'),
        cep: getElementValue('cep'),
        rua: getElementValue('rua'),
        bairro: getElementValue('bairro'),
        cidadeUf: getElementValue('cidade-uf'),
        senha: getElementValue('senha')
    };

    if (!validarNumero(cadastro.fone) || !validarCEP(cadastro.cep)) return alert('Dados inválidos.');
    
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    cadastros.push(cadastro);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    alert("Cadastro realizado com sucesso!");
    event.target.reset();
    ['rua', 'bairro', 'cidade-uf'].forEach(id => setElementValue(id, ""));
}

function editarCadastro(event) {
    event.preventDefault();

    if (indiceEdicao === null) {
        alert("Nenhum cadastro selecionado para edição.");
        return;
    }

    const cadastro = {
        nome: getElementValue('nome'),
        email: getElementValue('email'),
        fone: getElementValue('fone'),
        cep: getElementValue('cep'),
        rua: getElementValue('rua'),
        bairro: getElementValue('bairro'),
        cidadeUf: getElementValue('cidade-uf')
    };

    if (!validarNumero(cadastro.fone) || !validarCEP(cadastro.cep)) {
        alert('Dados inválidos.');
        return;
    }

    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    cadastros[indiceEdicao] = cadastro;
    localStorage.setItem('cadastros', JSON.stringify(cadastros));

    alert("Cadastro atualizado com sucesso!");
    carregarCadastros();

    event.target.reset();
    toggleDisabled(['nome', 'email', 'fone', 'cep', 'rua', 'bairro', 'cidade-uf'], true);
    indiceEdicao = null;
}

function carregarCadastros() {
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    let tabela = document.getElementById('tabela-cadastros');
    tabela.innerHTML = cadastros.length ? cadastros.map((c, i) => `
        <tr>
            <td>${c.nome}</td>
            <td>${c.email}</td>
            <td>${c.fone}</td>
            <td>${c.cep}</td>
            <td>${c.rua}</td>
            <td>${c.bairro}</td>
            <td>${c.cidadeUf}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="prepararEdicao(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirCadastro(${i})">Excluir</button>
            </td>
        </tr>`).join('') : '<tr><td colspan="8" class="text-center">Nenhum cadastro encontrado</td></tr>';
}

function prepararEdicao(index) {
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    let cadastro = cadastros[index];

    if (!cadastro) return alert("Cadastro não encontrado!");

    ['nome', 'email', 'fone', 'cep', 'rua', 'bairro', 'cidade-uf'].forEach(id => setElementValue(id, cadastro[id] || ""));
    indiceEdicao = index;

    toggleDisabled(['nome', 'email', 'fone', 'cep', 'rua', 'bairro', 'cidade-uf'], false);
}

function excluirCadastro(index) {
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    cadastros.splice(index, 1);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    carregarCadastros();
}

document.addEventListener("DOMContentLoaded", carregarCadastros);
