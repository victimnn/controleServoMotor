#include <Servo.h> // Include the Servo library at the top

// --- Definições de Pinos e Constantes ---
const int PIN_SERVO = 9;         // Pino digital onde o servo está conectado
const int PIN_POTENCIOMETRO = A0; // Pino analógico onde o potenciômetro está conectado

// --- Limites do Servo e Potenciômetro ---
const int ANGULO_MINIMO = 0;     // Ângulo mínimo do servo
const int ANGULO_MAXIMO = 179;   // Ângulo máximo do servo (muitos servos vão até 179 ou 180)
const int LEITURA_MIN_POT = 0;   // Leitura mínima do potenciômetro (0 a 1023)
const int LEITURA_MAX_POT = 1023; // Leitura máxima do potenciômetro (0 a 1023)

// --- Variáveis Globais ---
Servo servoMotor; // Cria um objeto Servo para controlar o servo motor
int leituraPotenciometro = 0; // Variável para armazenar a leitura do potenciômetro
int anguloServo = 0;          // Variável para armazenar o ângulo mapeado do servo

// --- Função setup() ---
void setup() {
  // Inicializa a comunicação serial com o computador (Node.js)
  Serial.begin(9600);

  // Anexa o objeto servo ao pino especificado
  servoMotor.attach(PIN_SERVO);

  // Define uma posição inicial para o servo (e.g., centro)
  servoMotor.write(90); // Define o servo para a posição de 90 graus (meio)
  delay(500); // Pequena pausa para o servo alcançar a posição inicial
}

// --- Função loop() ---
void loop() {
  // 1. Lê o valor do potenciômetro
  leituraPotenciometro = analogRead(PIN_POTENCIOMETRO);

  // 2. Mapeia a leitura do potenciômetro para o intervalo de ângulo do servo
  // map(valor, fromLow, fromHigh, toLow, toHigh)
  anguloServo = map(leituraPotenciometro, LEITURA_MIN_POT, LEITURA_MAX_POT, ANGULO_MINIMO, ANGULO_MAXIMO);

  // 3. Escreve o ângulo mapeado para o servo motor
  servoMotor.write(anguloServo);

  // 4. Envia os dados pela porta serial para o Node.js
  // O Node.js espera o formato: "Potenciometro esta na posicao: XXX, levando o servo no grau: YYY"
  Serial.print("Potenciometro esta na posicao: ");
  Serial.print(leituraPotenciometro);
  Serial.print(", levando o servo no grau: ");
  Serial.println(anguloServo); // println adiciona uma nova linha, que o ReadlineParser do Node.js usa como delimitador

  // Pequeno atraso para não inundar a porta serial e dar tempo para o servo se mover
  delay(50); // Ajuste este valor conforme a necessidade de atualização e suavidade do movimento
}
