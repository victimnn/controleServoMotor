# Controle de Servo Motor com Arduino, Node.js e Interface Web

Este projeto demonstra como controlar um servo motor conectado a um Arduino utilizando um potenciômetro e visualizar os dados em tempo real através de uma interface web. A comunicação entre o Arduino e a interface web é facilitada por um servidor Node.js que utiliza WebSockets (Socket.IO) e comunicação serial.

## Funcionalidades

*   **Controle de Servo Motor:** O ângulo do servo motor é controlado pela leitura de um potenciômetro.
*   **Comunicação Serial:** O Arduino envia os dados do potenciômetro e o ângulo do servo para o servidor Node.js via porta serial.
*   **Servidor Node.js:**
    *   Utiliza Express.js para servir a interface web estática.
    *   Utiliza `serialport` para ler os dados da porta serial do Arduino.
    *   Detecta automaticamente a porta serial do Arduino (configurado para VID_2341, comum em Arduinos originais).
    *   Utiliza Socket.IO para transmitir os dados em tempo real para todos os clientes web conectados.
*   **Interface Web:**
    *   Exibe o ângulo atual do servo motor e o valor do potenciômetro.
    *   Apresenta uma visualização gráfica do servo motor e uma barra de progresso representando o ângulo.
    *   Atualiza os dados em tempo real sem a necessidade de recarregar a página.
*   **Reconexão Automática:** O servidor Node.js tenta reconectar à porta serial caso a conexão seja perdida.

## Estrutura do Projeto

```
.
├── aula-comNode.ino         # Código para o Arduino
├── LICENSE                  # Arquivo de licença do projeto
├── js/
│   ├── package.json         # Define as dependências e scripts do Node.js
│   ├── server.js            # Lógica do servidor Node.js (Express, Socket.IO, SerialPort)
│   └── public/              # Contém os arquivos estáticos da interface web
│       ├── index.html       # Estrutura principal da página web
│       ├── script.js        # Lógica do cliente (Socket.IO, atualização da UI)
│       └── style.css        # Estilos da página web
└── libraries/
    └── readme.txt           # Informações sobre bibliotecas Arduino (se houver)
```

## Pré-requisitos

*   **Hardware:**
    *   Placa Arduino (UNO, Nano, etc.)
    *   Servo Motor
    *   Potenciômetro
    *   Cabos de conexão
*   **Software:**
    *   [Arduino IDE](https://www.arduino.cc/en/software)
    *   [Node.js](https://nodejs.org/) (v14 ou superior recomendado)
    *   NPM (geralmente instalado com o Node.js)

## Configuração e Execução

1.  **Configuração do Hardware:**
    *   Conecte o pino de sinal do servo motor ao pino digital 9 do Arduino.
    *   Conecte o pino de alimentação do servo (VCC) ao 5V do Arduino.
    *   Conecte o pino terra do servo (GND) ao GND do Arduino.
    *   Conecte um dos pinos externos do potenciômetro ao 5V do Arduino.
    *   Conecte o outro pino externo do potenciômetro ao GND do Arduino.
    *   Conecte o pino central (cursor) do potenciômetro ao pino analógico A0 do Arduino.

2.  **Código do Arduino:**
    *   Abra o arquivo `aula-comNode.ino` na Arduino IDE.
    *   Certifique-se de que a biblioteca `Servo.h` está instalada (geralmente vem com a IDE).
    *   Selecione a placa e a porta serial corretas no menu "Ferramentas".
    *   Faça o upload do código para o Arduino.
    *   **Importante:** Feche o Monitor Serial da Arduino IDE após o upload, pois ele pode bloquear a porta serial para o Node.js.

3.  **Servidor Node.js:**
    *   Navegue até a pasta `js` no terminal:
        ```bash
        cd js
        ```
    *   Instale as dependências do projeto:
        ```bash
        npm install
        ```
    *   Inicie o servidor:
        ```bash
        npm start
        ```
        O console deverá indicar que o servidor está rodando e tentando se conectar ao Arduino. Se um Arduino com VID_2341 for detectado, ele se conectará automaticamente.

4.  **Interface Web:**
    *   Abra seu navegador de internet e acesse o seguinte endereço:
        [http://localhost:3000](http://localhost:3000)
    *   Você deverá ver a interface exibindo o ângulo do servo e o valor do potenciômetro, atualizados em tempo real conforme você gira o potenciômetro.

## Observações

*   **Detecção da Porta Serial:** O script `server.js` tenta detectar automaticamente Arduinos com o Vendor ID (VID) `2341`. Se você estiver usando um Arduino clone com um VID diferente, pode ser necessário modificar a função `findArduinoPort` em `server.js` ou especificar a porta manualmente.
*   **Conflito de Porta Serial:** Apenas uma aplicação pode usar a porta serial por vez. Certifique-se de que o Monitor Serial da Arduino IDE ou qualquer outro software que possa estar usando a porta serial do Arduino esteja fechado antes de iniciar o servidor Node.js.
*   **Comunicação:** O Arduino envia dados no formato: `"Potenciometro esta na posicao: XXX, levando o servo no grau: YYY"`. O servidor Node.js parseia essa string para extrair os valores.

## Licença

Este projeto está sob a licença especificada no arquivo `LICENSE`.
(Se o arquivo `LICENSE` não existir, considere adicionar um, como a [Licença MIT](https://opensource.org/licenses/MIT)).
