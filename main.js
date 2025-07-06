const prompt = require('prompt-sync')();


console.log("=== Calculadora de IMC ===");

// Solicita peso e altura
const peso = parseFloat(prompt("Digite seu peso (kg): "));
const altura = parseFloat(prompt("Digite sua altura (m): "));

// Calcula o IMC
const imc = peso / (altura * altura);

console.log(`\nSeu IMC é: ${imc.toFixed(2)}`);

// Classifica o IMC
if (imc < 18.5) {
    console.log("Classificação: Abaixo do peso");
} else if (imc < 25) {
    console.log("Classificação: Peso normal");
} else if (imc < 30) {
    console.log("Classificação: Sobrepeso");
} else if (imc < 35) {
    console.log("Classificação: Obesidade grau I");
} else if (imc < 40) {
    console.log("Classificação: Obesidade grau II");
} else {
    console.log("Classificação: Obesidade grau III");
}
