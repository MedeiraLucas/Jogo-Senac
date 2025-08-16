// ===============================================
// PASSO 1: CONFIGURAÇÃO INICIAL E ELEMENTOS DO HTML
// ===============================================

const canvas = document.getElementById('telaJogo');
const ctx = canvas.getContext('2d');

const telaLogin = document.getElementById('telaLogin');
const formLogin = document.getElementById('formLogin');
const inputNome = document.getElementById('nome');
const botaoLogout = document.getElementById('botaoLogout');
const sistemaContainer = document.getElementById('sistemaContainer');
const menuLinks = document.querySelectorAll('#menuLateral a');
const secoesConteudo = document.querySelectorAll('.secao-conteudo');

const filtroUsuariosInput = document.getElementById('filtroUsuarios');
const corpoTabelaUsuarios = document.getElementById('corpoTabelaUsuarios');

const toggleMenuBtn = document.getElementById('toggleMenuBtn');
const themeSwitch = document.getElementById('checkbox');

const somDoClique = new Audio('click.mp3');

let pontuacao = 0;
let estadoDoJogo = 'login';
let nomeDoJogador = '';
let nivelAtual = 0;
const PONTUACAO_VITORIA = 3000;

// ===============================================
// PASSO 2: CONFIGURAÇÃO DOS NÍVEIS
// ===============================================

const niveis = [
    { pontuacaoParaPassar: 500,  velocidadeBase: 3, tamanhoAlvo: 50, cor: '#005594' },
    { pontuacaoParaPassar: 1000, velocidadeBase: 5, tamanhoAlvo: 40, cor: '#0073b1' },
    { pontuacaoParaPassar: 2000, velocidadeBase: 7, tamanhoAlvo: 30, cor: '#f7941d' },
    { pontuacaoParaPassar: 3000, velocidadeBase: 9, tamanhoAlvo: 25, cor: '#cc0000' }
];

// ===============================================
// PASSO 3: OBJETO DE JOGO E FUNÇÕES DO JOGO
// ===============================================

const alvo = {
    x: 50, y: 50, largura: 50, altura: 50, cor: '#005594', velocidadeX: 3, velocidadeY: 3
};

function iniciarNivel(indiceNivel) {
    if (indiceNivel >= niveis.length) return;
    const configNivel = niveis[indiceNivel];
    alvo.largura = configNivel.tamanhoAlvo;
    alvo.altura = configNivel.tamanhoAlvo;
    alvo.cor = configNivel.cor;
    const direcaoX = Math.sign(alvo.velocidadeX) || 1;
    const direcaoY = Math.sign(alvo.velocidadeY) || 1;
    alvo.velocidadeX = configNivel.velocidadeBase * direcaoX;
    alvo.velocidadeY = configNivel.velocidadeBase * direcaoY;
}

// ===============================================
// PASSO 4: LÓGICA DE NAVEGAÇÃO E INTERFACE
// ===============================================

function ajustarTamanhoCanvas() {
    const container = document.getElementById('containerJogo');
    if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
}

formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();
    nomeDoJogador = inputNome.value;
    if (nomeDoJogador.trim() === '') {
        alert('Por favor, preencha seu nome para começar!');
        return;
    }
    telaLogin.classList.add('escondido');
    sistemaContainer.classList.remove('escondido');
    
    ajustarTamanhoCanvas();

    mostrarSecao('dashboard');
    estadoDoJogo = 'jogando';
    iniciarNivel(nivelAtual);
    gameLoop(); 
});

botaoLogout.addEventListener('click', function() {
    location.reload();
});

menuLinks.forEach(link => {
    link.addEventListener('click', (evento) => {
        evento.preventDefault();
        const targetId = link.dataset.target;
        mostrarSecao(targetId);
    });
});

function mostrarSecao(id) {
    secoesConteudo.forEach(secao => secao.classList.add('escondido'));
    menuLinks.forEach(link => link.classList.remove('active'));

    const secaoAlvo = document.getElementById(id);
    if (secaoAlvo) secaoAlvo.classList.remove('escondido');

    const linkAtivo = document.querySelector(`a[data-target="${id}"]`);
    if (linkAtivo) linkAtivo.classList.add('active');
}

if (toggleMenuBtn) {
    toggleMenuBtn.addEventListener('click', () => {
        sistemaContainer.classList.toggle('menu-fechado');
        toggleMenuBtn.classList.toggle('ativo');
        setTimeout(() => {
            ajustarTamanhoCanvas();
        }, 300);
    });
}

if (filtroUsuariosInput && corpoTabelaUsuarios) {
    filtroUsuariosInput.addEventListener('keyup', () => {
        const termoBusca = filtroUsuariosInput.value.toLowerCase();
        const linhas = corpoTabelaUsuarios.getElementsByTagName('tr');
        for (let linha of linhas) {
            const celulaNome = linha.getElementsByTagName('td')[0];
            if (celulaNome) {
                const nomeUsuario = celulaNome.textContent.toLowerCase();
                if (nomeUsuario.includes(termoBusca)) {
                    linha.style.display = '';
                } else {
                    linha.style.display = 'none';
                }
            }
        }
    });
}

if (themeSwitch) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
    }
    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
}

// ===============================================
// PASSO 5: LÓGICA DE TOQUE/CLIQUE DO JOGO
// ===============================================

function tratarCliqueOuToque(evento) {
    if (estadoDoJogo !== 'jogando') return;
    evento.preventDefault();
    const rect = canvas.getBoundingClientRect();
    let mouseX, mouseY;
    if (evento.touches) {
        mouseX = evento.touches[0].clientX - rect.left;
        mouseY = evento.touches[0].clientY - rect.top;
    } else {
        mouseX = evento.clientX - rect.left;
        mouseY = evento.clientY - rect.top;
    }
    const padding = 15;
    if (mouseX >= alvo.x - padding && mouseX <= alvo.x + alvo.largura + padding &&
        mouseY >= alvo.y - padding && mouseY <= alvo.y + alvo.altura + padding) {
        
        somDoClique.currentTime = 0;
        somDoClique.play();
        pontuacao += 10;
        
        if (nivelAtual < niveis.length && pontuacao >= niveis[nivelAtual].pontuacaoParaPassar) {
            nivelAtual++;
            if (nivelAtual < niveis.length) {
                iniciarNivel(nivelAtual);
            }
        }
        if (pontuacao >= PONTUACAO_VITORIA) {
            estadoDoJogo = 'vitoria';
        }
    }
}

canvas.addEventListener('click', tratarCliqueOuToque);
canvas.addEventListener('touchstart', tratarCliqueOuToque, { passive: false });

// ===============================================
// PASSO 6: GAME LOOP PRINCIPAL
// ===============================================

function gameLoop() {
    if (estadoDoJogo === 'jogando') {
        alvo.x += alvo.velocidadeX;
        alvo.y += alvo.velocidadeY;
        if (alvo.x + alvo.largura > canvas.width || alvo.x < 0) alvo.velocidadeX *= -1;
        if (alvo.y + alvo.altura > canvas.height || alvo.y < 0) alvo.velocidadeY *= -1;
        
        ctx.fillStyle = '#f0f2f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = alvo.cor;
        ctx.fillRect(alvo.x, alvo.y, alvo.largura, alvo.altura);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, 50);

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        let tamanhoFonte = 22;
        let yPosTexto = 35;
        
        if (canvas.width < 600) {
            tamanhoFonte = 14;
            yPosTexto = 32;
        }
        
        ctx.font = `bold ${tamanhoFonte}px Poppins, sans-serif`;
        
        ctx.textAlign = 'left';
        ctx.fillText('Pontuação: ' + pontuacao, 15, yPosTexto);
        
        ctx.textAlign = 'center';
        ctx.fillText(`Nível: ${nivelAtual + 1}`, canvas.width / 2, yPosTexto);
        
        ctx.textAlign = 'right';
        ctx.fillText(nomeDoJogador, canvas.width - 15, yPosTexto);

        ctx.shadowColor = 'transparent';

    } else if (estadoDoJogo === 'vitoria') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 50px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PARABÉNS!', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '30px Poppins, sans-serif';
        ctx.fillText('Você atingiu ' + PONTUACAO_VITORIA + ' pontos!', canvas.width / 2, canvas.height / 2 + 20);
    }
    
    requestAnimationFrame(gameLoop);
}