let indiceEdicao = null;

function loadLogradouro() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.trim();

    if (cep.length !== 8 || !/\d{8}/.test(cep)) {
        alert('CEP digitado é inválido');
        cepInput.value = '';
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado.');
                return;
            }
            document.getElementById('rua').value = data.logradouro || "";
            document.getElementById('bairro').value = data.bairro || "";
            document.getElementById('cidade-uf').value = `${data.localidade || ""} / ${data.uf || ""}`;
        })
        .catch(() => alert("Erro ao buscar o CEP. Tente novamente mais tarde."));
}

function registrarCadastro(event) {
    event.preventDefault();
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    
    let novoCadastro = {
        nome: document.getElementById('nomer').value,
        email: document.getElementById('email').value,
        fone: document.getElementById('fone').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        bairro: document.getElementById('bairro').value,
        cidadeUf: document.getElementById('cidade-uf').value
    };

    if (document.getElementById('btnSalvar').dataset.edicao === "true") {
        cadastros[indiceEdicao] = novoCadastro;
        document.getElementById('btnSalvar').dataset.edicao = "false";
        indiceEdicao = null;
    } else {
        cadastros.push(novoCadastro);
    }

    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    carregarCadastros();
    document.querySelector('#cadastro-edicao-Form').reset();
}

function carregarCadastros() {
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    let tabela = document.getElementById('tabela-cadastros');
    tabela.innerHTML = '';

    if (cadastros.length === 0) {
        tabela.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum cadastro encontrado</td></tr>';
        return;
    }

    cadastros.forEach((cadastro, index) => {
        tabela.innerHTML += `
            <tr>
                <td>${cadastro.nome}</td>
                <td>${cadastro.email}</td>
                <td>${cadastro.fone}</td>
                <td>${cadastro.cep}</td>
                <td>${cadastro.rua}</td>
                <td>${cadastro.bairro}</td>
                <td>${cadastro.cidadeUf}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editarCadastro(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirCadastro(${index})">Excluir</button>
                </td>
            </tr>`;
    });
}

function editarCadastro(index) {
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    let cadastro = cadastros[index];

    document.getElementById('nome-editar').value = cadastro.nome;
    document.getElementById('email-editar').value = cadastro.email;
    document.getElementById('fone-editar').value = cadastro.fone;
    document.getElementById('cep-editar').value = cadastro.cep;
    document.getElementById('rua-editar').value = cadastro.rua;
    document.getElementById('bairro-editar').value = cadastro.bairro;
    document.getElementById('cidade-uf-editar').value = cadastro.cidadeUf;

    indiceEdicao = index;
    document.getElementById('btnSalvar').dataset.edicao = "true";
}

function excluirCadastro(index) {
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    cadastros.splice(index, 1);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    carregarCadastros();
}

document.addEventListener("DOMContentLoaded", carregarCadastros);