// ===============================================
// PASSO 1: CONFIGURAÇÃO INICIAL (SETUP)
// ===============================================

const canvas = document.getElementById('telaJogo');
// ALTERAÇÃO: Define o tamanho do canvas para preencher a tela inteira do dispositivo
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const telaLogin = document.getElementById('telaLogin');
const containerJogo = document.getElementById('containerJogo');
const formLogin = document.getElementById('formLogin');
const inputNome = document.getElementById('nome');
const botaoLogout = document.getElementById('botaoLogout');

let pontuacao = 0;
let estadoDoJogo = 'login';
let nomeDoJogador = '';

const PONTUACAO_VITORIA = 3000;

// ... (O resto do arquivo continua exatamente igual) ...

const alvo = {
    x: 50, y: 50, largura: 40, altura: 40, cor: '#005594', velocidadeX: 3, velocidadeY: 3
};

formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();
    nomeDoJogador = inputNome.value;
    if (nomeDoJogador.trim() === '') {
        alert('Por favor, preencha seu nome para começar!');
        return;
    }
    telaLogin.classList.add('escondido');
    containerJogo.classList.remove('escondido');
    estadoDoJogo = 'jogando';
    gameLoop(); 
});

botaoLogout.addEventListener('click', function() {
    location.reload();
});

canvas.addEventListener('click', function(evento) {
    if (estadoDoJogo !== 'jogando') return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;
    if (mouseX >= alvo.x && mouseX <= alvo.x + alvo.largura &&
        mouseY >= alvo.y && mouseY <= alvo.y + alvo.altura) {
        pontuacao += 10;
        if (pontuacao % 100 === 0 && pontuacao > 0) {
            alvo.velocidadeX *= 1.1;
            alvo.velocidadeY *= 1.1;
        }
        if (pontuacao >= PONTUACAO_VITORIA) {
            estadoDoJogo = 'vitoria';
        }
    }
});

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
        
        ctx.fillStyle = '#000000';
        ctx.font = '24px Poppins, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Pontuação: ' + pontuacao, 10, 30);
        
        ctx.textAlign = 'right';
        ctx.fillText(nomeDoJogador, canvas.width - 10, 30);

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