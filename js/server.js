const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport'); // Importa SerialPort e ReadlineParser
const { autoDetect } = require('@serialport/bindings-cpp'); // Para detecção automática de porta

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Define a porta onde o servidor web irá escutar
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static('public'));


let arduinoPort = null; // Variável para armazenar a porta do Arduino
let serialPortInstance = null; // Instância da SerialPort

// Função para tentar encontrar a porta serial do Arduino
async function findArduinoPort() {
    try {
        const ports = await autoDetect().list();
        for (const port of ports) {
            // No Windows, o pnpId geralmente contém o VID (Vendor ID) e o PID (Product ID).
            // Arduinos originais geralmente têm VID_2341.
            console.log(`Porta detectada: ${port.path} - Manufacturer: ${port.manufacturer || 'N/A'} - PnPId: ${port.pnpId || 'N/A'}`);

            if (port.pnpId && port.pnpId.includes('VID_2341')) {
                console.log(`Arduino original encontrado na porta: ${port.path}`);
                return port.path;
            }
        }
    } catch (err) {
        console.error('Erro ao listar portas seriais:', err);
    }
    return null;
}

// Função para iniciar a conexão serial
async function startSerialConnection() {
    arduinoPort = await findArduinoPort();

    if (arduinoPort) {
        serialPortInstance = new SerialPort({ path: arduinoPort, baudRate: 9600 });
        const parser = serialPortInstance.pipe(new ReadlineParser({ delimiter: '\r\n' })); // Lê linha por linha

        serialPortInstance.on('open', () => {
            console.log(`Conexão serial com Arduino aberta na porta ${arduinoPort}`);
        });

        serialPortInstance.on('error', (err) => {
            console.error('Erro na porta serial:', err.message);
            // Tenta reconectar em caso de erro
            serialPortInstance = null;
            setTimeout(startSerialConnection, 2000); // Tenta novamente em 2 segundos
        });

        serialPortInstance.on('close', () => {
            console.log('Porta serial fechada. Tentando reconectar...');
            serialPortInstance = null;
            setTimeout(startSerialConnection, 2000); // Tenta novamente em 2 segundos
        });

        // Quando o parser lê uma linha completa do Arduino
        parser.on('data', data => {
            console.log('Dados recebidos do Arduino:', data);
            // Formato esperado do Arduino: "Potenciometro esta na posicao: XXX, levando o servo no grau: YYY"
            try {
                const parts = data.split(',');
                if (parts.length === 2) {
                    const potStr = parts[0].split(':')[1].trim();
                    const angleStr = parts[1].split(':')[1].trim();
                    const potenciometro = parseInt(potStr);
                    const angulo = parseInt(angleStr);

                    if (!isNaN(potenciometro) && !isNaN(angulo)) {
                        // Envia os dados para todos os clientes conectados via Socket.IO
                        io.emit('arduino_data', { potenciometro, angulo });
                    } else {
                        console.warn('Não foi possível parsear os dados do Arduino:', data);
                    }
                } else {
                    console.warn('Formato de dados inesperado do Arduino:', data);
                }
            } catch (e) {
                console.error('Erro ao processar dados do Arduino:', e);
            }
        });
    } else {
        console.warn('Arduino não encontrado. Verifique a conexão e o Monitor Serial (deve estar fechado). Tentando novamente em 5 segundos...');
        setTimeout(startSerialConnection, 5000); // Tenta novamente após 5 segundos
    }
}

// Inicia a tentativa de conexão serial quando o servidor inicia
startSerialConnection();

io.on('connection', (socket) => {
    console.log('Um cliente conectado ao WebSocket');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado do WebSocket');
    });

    // Você pode adicionar um evento para receber comandos da web para o Arduino, se quiser
    // socket.on('set_servo_angle', (angle) => {
    //     if (serialPortInstance && serialPortInstance.isOpen) {
    //         serialPortInstance.write(`A${angle}\n`); // Exemplo: envia 'A' seguido do ângulo e nova linha
    //     }
    // });
});

// Inicia o servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Aguardando conexão do Arduino...');
});