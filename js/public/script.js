// Conecta ao servidor WebSocket
// Por padrão, 'io()' tenta se conectar ao mesmo host e porta que serviu a página HTML
const socket = io();

// --- Eventos de Conexão WebSocket ---
socket.on('connect', () => {
    console.log('Conectado ao servidor WebSocket!');
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor WebSocket!');
});

// --- Ouve o evento 'arduino_data' que o servidor Node.js irá emitir ---
socket.on('arduino_data', (data) => {
    // 'data' conterá um objeto como { potenciometro: XXX, angulo: YYY }
    const { potenciometro, angulo } = data; // Desestruturação para fácil acesso

    // Chama a função para atualizar a tela com os dados recebidos
    atualizarTela(angulo, potenciometro);
});

// --- Função para atualizar a tela com os dados do Arduino ---
function atualizarTela(angulo, valorPot) {
    // Assegura que os elementos existam antes de tentar atualizá-los
    const anguloElement = document.getElementById('angulo');
    if (anguloElement) {
        anguloElement.textContent = `${angulo}°`;
    }

    const potenciometroElement = document.getElementById('potenciometro');
    if (potenciometroElement) {
        potenciometroElement.textContent = valorPot;
    }

    const barraElement = document.getElementById('barra');
    if (barraElement) {
        // Calcula a porcentagem com base no ângulo para a barra
        // O ângulo do servo geralmente varia de 0 a 180.
        // Para uma porcentagem de 0 a 100, use 180 como máximo.
        let porcentagem = Math.round((angulo / 180) * 100); 
        barraElement.style.width = `${porcentagem}%`;
        barraElement.textContent = `${porcentagem}%`;
    }

    const bracoServoElement = document.getElementById('bracoServo');
    if (bracoServoElement) {
        // Centraliza a rotação do braço do servo visualmente.
        // Se 90° é o centro, uma leitura de 0° deve rotacionar -90° e 180° deve rotacionar +90°.
        let rotacao = angulo - 90; 
        bracoServoElement.style.transform = `rotate(${rotacao}deg)`;
    }
}

// --- Inicialização ---
// Chama a função uma vez no início para definir o estado inicial da interface.
// Use valores padrão ou 0, 0 para começar zerado visualmente.
// Para um servo que tipicamente inicia em 90 graus (centro) e um potenciômetro em 512 (metade).
atualizarTela(90, 512);