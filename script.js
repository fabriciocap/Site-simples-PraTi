/* ==========================================================================
   1. BOTÃO DE CHAMADA PARA AÇÃO (CTA)
   Ao clicar no botão do topo, a página rola suavemente até o formulário
   de contato. Como o CSS já tem "scroll-behavior: smooth" no <html>,
   basta mudar o hash da URL que o navegador cuida da animação.
   ========================================================================== */
const botaoCta = document.getElementById('botao-cta');

if (botaoCta) {
    botaoCta.addEventListener('click', () => {
        document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    });
}


/* ==========================================================================
   2. CONSUMO DE API - VIACEP
   Quando o usuário termina de digitar o CEP (evento "blur" = saiu do campo),
   buscamos o endereço na API pública do ViaCEP e preenchemos o campo
   "Endereço" automaticamente.
   ========================================================================== */
const campoCep = document.getElementById('cep');
const campoEndereco = document.getElementById('endereco');
const erroCep = document.getElementById('erro-cep');

async function buscarEnderecoPorCep(cep) {
    // Remove tudo que não for número (ex: traço) antes de consultar a API
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        erroCep.textContent = 'CEP deve conter 8 números.';
        return;
    }

    erroCep.textContent = '';
    campoEndereco.placeholder = 'Buscando endereço...';

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            erroCep.textContent = 'CEP não encontrado.';
            campoEndereco.value = '';
            return;
        }

        // Monta o endereço juntando os campos retornados pela API
        campoEndereco.value = `${dados.logradouro}, ${dados.bairro} - ${dados.localidade}/${dados.uf}`;
    } catch (erro) {
        erroCep.textContent = 'Não foi possível buscar o CEP agora.';
    } finally {
        campoEndereco.placeholder = 'Preenchido automaticamente pelo CEP';
    }
}

if (campoCep) {
    campoCep.addEventListener('blur', () => {
        if (campoCep.value.trim() !== '') {
            buscarEnderecoPorCep(campoCep.value);
        }
    });
}


/* ==========================================================================
   3. ENVIO DO FORMULÁRIO DE CONTATO
   Faz uma validação simples dos campos obrigatórios (nome, email e mensagem)
   e, se estiver tudo certo, esconde o formulário e mostra a mensagem de
   agradecimento. Nenhum dado é enviado a um servidor real aqui - é só
   front-end, então trocamos o formulário pela mensagem de sucesso.
   ========================================================================== */
const formulario = document.getElementById('formulario-contato');
const mensagemSucesso = document.getElementById('mensagem-sucesso');

function validarEmail(email) {
    // Expressão regular simples: texto@texto.texto
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (formulario) {
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // impede o recarregamento padrão da página

        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const mensagem = document.getElementById('mensagem');

        const erroNome = document.getElementById('erro-nome');
        const erroEmail = document.getElementById('erro-email');
        const erroMensagem = document.getElementById('erro-mensagem');

        // Limpa erros antigos antes de validar de novo
        erroNome.textContent = '';
        erroEmail.textContent = '';
        erroMensagem.textContent = '';

        let formularioValido = true;

        if (nome.value.trim() === '') {
            erroNome.textContent = 'Informe seu nome.';
            formularioValido = false;
        }

        if (!validarEmail(email.value.trim())) {
            erroEmail.textContent = 'Informe um e-mail válido.';
            formularioValido = false;
        }

        if (mensagem.value.trim() === '') {
            erroMensagem.textContent = 'Escreva uma mensagem.';
            formularioValido = false;
        }

        if (!formularioValido) {
            return; // interrompe aqui se algum campo estiver errado
        }

        // Tudo certo: esconde o formulário e mostra o agradecimento
        formulario.style.display = 'none';
        mensagemSucesso.classList.add('visivel');
    });
}