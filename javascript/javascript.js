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

function loadLogradouro() {
    const cep = document.getElementById('cep').value

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(data => data.json())
    .then(data => {
        document.getElementById('rua').value = data.logradouro
        document.getElementById('bairro').value = data.bairro
        document.getElementById('cidade-uf').value = `${data.localidade} / ${data.uf}`
    })
}