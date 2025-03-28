function loadLogradouro() {
    const cepInput = document.getElementById('cep')
    const cep = cepInput.value.trim()

    if (cep.length !== 8 || !/^\d{8}$/.test(cep)) {
        alert('CEP digitado é inválido')
        
        cepInput.value = ''
        setTimeout(() => cepInput.focus(), 0)
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado.')
                cepInput.value = ''
                setTimeout(() => cepInput.focus(), 0)
                return
            }

            document.getElementById('rua').value = data.logradouro || ""
            document.getElementById('bairro').value = data.bairro || ""
            document.getElementById('cidade-uf').value = `${data.localidade || ""} / ${data.uf || ""}`
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error);
            alert("Erro ao buscar o CEP. Tente novamente mais tarde.")
        })
}

let cadastro = null
function registrarCadastro() {
    event.preventDefault(); 

    var inputNome = document.getElementById('nome').value
    var inputEmail = document.getElementById('email').value
    var inputFone = document.getElementById('fone').value
    var inputCep = document.getElementById('cep').value
    var inputRua = document.getElementById('rua').value
    var inputBairro = document.getElementById('bairro').value
    var inputCidadeUf = document.getElementById('cidade-uf').value
    var inputSenha = document.getElementById('senha').value

    if (inputFone.length !== 11) {
        alert('O número digitado é inválido')
        
        document.getElementById('fone').value = ''
        setTimeout(() => document.getElementById('fone').focus(), 0)
        return;
    }

    cadastro = {
        nome: inputNome,
        email: inputEmail,
        fone: inputFone,
        cep: inputCep,
        rua: inputRua,
        bairro: inputBairro,
        cidadeUf: inputCidadeUf,
        senha: inputSenha
    }

    alert(`
        Nome: ${cadastro.nome}
        Email: ${cadastro.email}
        Fone: ${cadastro.fone}
        CEP: ${cadastro.cep}
        Rua: ${cadastro.rua}
        Bairro: ${cadastro.bairro}
        Cidade - UF: ${cadastro.cidadeUf}
        Senha: ${cadastro.senha}
        `);
}

//Funcionamento geral da página
var clicks = null

function navLinks() {
    clicks = (clicks == true) ? false : true

    const abreListaLinks = document.getElementById('nav-links-lista')
    
    if (clicks) {
        abreListaLinks.style.display = 'block'

    } else {
        abreListaLinks.style.display = 'none'

    }   
}

async function loadHeaderFooter() {
    const headerResponse = await fetch('header.html');
    const footerResponse = await fetch('footer.html');
    const headerHtml = await headerResponse.text();
    const footerHtml = await footerResponse.text();
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
    document.body.insertAdjacentHTML('beforeend', footerHtml);
}
loadHeaderFooter();