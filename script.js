//Tempos padrões do timer em minutos
let pomodoroTimer = 25;
let shortTimer = 5;
let longTimer = 15;
let interval = 4;

let localConfig = JSON.parse(localStorage.getItem("configPomo"))

if (localConfig) {
    pomodoroTimer = localConfig.pomoTimer;
    shortTimer = localConfig.shortTimer;
    longTimer = localConfig.longTimer;
    interval = localConfig.interval;

} else {
    let configPomo = {
        pomoTimer: pomodoroTimer,
        shortTimer: shortTimer,
        longTimer: longTimer,
        interval: interval
    }
    localStorage.setItem('configPomo', JSON.stringify(configPomo));
}

//Quantidades de vezes em cada fase
let qtdIntervals = 1;

//Tempo inicial em segundos
let tempoSegundos = pomodoroTimer * 60

let intervalo;

//Puxando os elementos HTML
const timer = document.getElementById("timer");
const botaoTimer = document.getElementById("botaoTimer");
const btnPomo = document.getElementById("btnPomo")
const btnShort = document.getElementById("btnShort")
const btnLong = document.getElementById("btnLong")
const interAtual = document.getElementById("inter-atual");
// const voltas= document.getElementById("voltas");
// const body = document.getElementById("body");

//Definindo os valores a ser mostrado no input de configuração do Pomodoro
document.getElementById("pomoInput").value = pomodoroTimer;
document.getElementById("shortInput").value = shortTimer;
document.getElementById("longInput").value = longTimer;
document.getElementById("interval").value = interval;

const alarme = new Audio("audio/alarm.mp3")

let telaAtual = 1;

//Substituindo o texto pela a quantidade de minutos
timer.innerHTML = formatarTempo(pomodoroTimer * 60)

interAtual.innerHTML = "#" + qtdIntervals;

// Função para formatar o tempo em minutos e segundos
function formatarTempo(segundos) {
    let minutos = Math.floor(segundos / 60);
    let secs = segundos % 60;
    return (minutos < 10 ? "0" + minutos : minutos) + ":" + (secs < 10 ? "0" + secs : secs);

}

function voltarCor() {
    btnPomo.style.backgroundColor = "#640D5F";
    btnShort.style.backgroundColor = "#640D5F";
    btnLong.style.backgroundColor = "#640D5F";
    btnPomo.style.color = "white"
    btnShort.style.color = "white"
    btnLong.style.color = "white"
}

//Função para reconhecer que fase estamos, muda o titulo e o tempo na tela de acordo com a fase
function mudarTela(tela) {
    telaAtual = tela;
    switch (tela) {
        case 1:
            tempoSegundos = pomodoroTimer * 60
            // voltas.innerHTML = "#" + qtdPomodoro
            voltarCor();
            btnPomo.style.backgroundColor = "#FFEB55";
            btnPomo.style.color = "black"
            break;
        case 2:
            tempoSegundos = shortTimer * 60
            // voltas.innerHTML = "#" + qtdShort
            voltarCor();
            btnShort.style.backgroundColor = "#FFEB55";
            btnShort.style.color = "black"
            break;
        case 3:
            tempoSegundos = longTimer * 60
            voltarCor();
            btnLong.style.backgroundColor = "#FFEB55";
            btnLong.style.color = "black"
            break;
    }
    timer.innerHTML = formatarTempo(tempoSegundos)
}

function contador() {
    if (botaoTimer.innerHTML === "Iniciar") {
        botaoTimer.innerHTML = "Pausar";
        intervalo = setInterval(passarTempo, 1000);
    } else {
        botaoTimer.innerHTML = "Iniciar";
        clearInterval(intervalo);
    }

    function passarTempo() {
        timer.innerHTML = formatarTempo(tempoSegundos)

        if (tempoSegundos > 0) {
            tempoSegundos--
        }
        else {
            if (telaAtual == 3) {
                telaAtual = 1;
                qtdIntervals = 1;
            }
            else {
                if (qtdIntervals >= interval) {
                    telaAtual = 3;
                }
                else {
                    switch (telaAtual) {
                        case 1:
                            telaAtual++;
                            break
                        case 2:
                            qtdIntervals++;
                            telaAtual = 1;
                            break
                    }
                }
            }
            alarme.play();
            botaoTimer.innerHTML = "Iniciar"
            clearInterval(intervalo);
            mudarTela(telaAtual)
            interAtual.innerHTML = "#" + qtdIntervals;
        }
    }
}

function pular() {
    tempoSegundos = 1;
}

function salvar() {
    // Puxando os inputs e convertendo para números
    const pomoInput = document.getElementById("pomoInput").value;
    const shortInput = document.getElementById("shortInput").value;
    const longInput = document.getElementById("longInput").value;
    const intervalInput = parseInt(document.getElementById("interval").value);

    // Atualizando os timers com os novos valores
    pomodoroTimer = pomoInput;
    shortTimer = shortInput;
    longTimer = longInput;
    interval = intervalInput;

    // Salvando no localStorage
    localStorage.setItem('configPomo', JSON.stringify({
        pomoTimer: pomodoroTimer,
        shortTimer: shortTimer,
        longTimer: longTimer,
        interval: interval
    }));

    // Fecha o modal após salvar
    modal.style.display = "none";

    // Atualiza a tela com os novos tempos
    mudarTela(telaAtual);

    // Se o temporizador estiver rodando, reinicia com os novos valores
    if (botaoTimer.innerHTML === "Pausar") {
        clearInterval(intervalo);  // Para o temporizador atual
        contador();  // Reinicia o temporizador
    }
}

function reiniciarTimer() {
    clearInterval(intervalo);

    switch (telaAtual) {
        case 1:
            tempoSegundos = pomodoroTimer * 60; // Reinicia para o tempo de Pomodoro
            break;
        case 2:
            tempoSegundos = shortTimer * 60; // Reinicia para o tempo de Pausa Curta
            break;
        case 3:
            tempoSegundos = longTimer * 60; // Reinicia para o tempo de Pausa Longa
            break;
    }

    botaoTimer.innerHTML = "Iniciar"
    timer.innerHTML = formatarTempo(tempoSegundos); // Atualiza a interface com o tempo reiniciado
}



// Abrir e fechar o modal de configurações
const modal = document.getElementById("configModal");
const configButton = document.getElementById("configButton");
const closeButton = document.getElementsByClassName("close")[0];

// Quando clicar no botão, abre o modal
configButton.onclick = function () {
    modal.style.display = "flex";
}

// Quando clicar no X, fecha o modal
closeButton.onclick = function () {
    modal.style.display = "none";
}

// Abrir e fechar o modal de música
const modalMusic = document.getElementById("musicModal");
const musicButton = document.getElementById("musicButton");
const closeButtonMusic = document.getElementsByClassName("close-music")[0];

// Quando clicar no botão, abre o modal
musicButton.onclick = function () {
    modalMusic.style.display = "flex";
}

// Quando clicar no X, fecha o modal
closeButtonMusic.onclick = function () {
    modalMusic.style.display = "none";
}

// Quando clicar fora de qualquer modal, fecha
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    } else if (event.target == modalMusic) {
        modalMusic.style.display = "none";
    }
}

// // Salvando configurações
// document.getElementById("saveConfig").onclick = function() {
//     const pomodoro = document.getElementById("pomodoro").value;
//     const shortBreak = document.getElementById("shortBreak").value;
//     const longBreak = document.getElementById("longBreak").value;

//     // Salvando no LocalStorage
//     localStorage.setItem("pomoTimer", pomodoro);
//     localStorage.setItem("shortTimer", shortBreak);
//     localStorage.setItem("longTimer", longBreak);

//     modal.style.display = "none"; // Fecha o modal após salvar
//     alert("Configurações salvas!");
// }

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Carrega as tarefas do localStorage

// Função para renderizar as tarefas na lista
function renderizarTarefas() {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpa a lista existente

    tarefas.forEach((tarefa, index) => {
        const divTarefa = document.createElement('div');
        divTarefa.className = 'tarefa';

        const textoTarefa = document.createElement('span');
        textoTarefa.textContent = tarefa.nome;
        if (tarefa.concluida) {
            textoTarefa.style.textDecoration = 'line-through'; // Risca a tarefa concluída
            textoTarefa.style.color = '#FFEB55'; // Risca a tarefa concluída
        }

        const botaoConcluir = document.createElement('i');
        botaoConcluir.className = tarefa.concluida ? 'fas fa-undo' : 'fas fa-check'; // Ícone de check ou undo
        botaoConcluir.onclick = () => {
            tarefa.concluida = !tarefa.concluida; // Alterna o estado da tarefa
            salvarTarefas(); // Salva as tarefas atualizadas
            renderizarTarefas(); // Atualiza a lista
        };

        const botaoExcluir = document.createElement('i');
        botaoExcluir.className = 'fas fa-trash'; // Ícone de lixeira
        botaoExcluir.onclick = () => {
            tarefas.splice(index, 1); // Remove a tarefa do array
            salvarTarefas(); // Salva as tarefas atualizadas
            renderizarTarefas(); // Atualiza a lista
        };

        divTarefa.appendChild(textoTarefa);
        divTarefa.appendChild(botaoConcluir);
        divTarefa.appendChild(botaoExcluir);
        lista.appendChild(divTarefa);
    });
}

// Função para adicionar uma nova tarefa
function adicionarTarefa() {
    const inputTarefa = document.getElementById('tarefa-input');
    const nomeTarefa = inputTarefa.value.trim();

    if (nomeTarefa) {
        tarefas.push({ nome: nomeTarefa, concluida: false }); // Adiciona a nova tarefa
        inputTarefa.value = ''; // Limpa o input
        salvarTarefas(); // Salva as tarefas atualizadas
        renderizarTarefas(); // Atualiza a lista
    }
}

// Função para salvar as tarefas no localStorage
function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Salva as tarefas no localStorage
}

// Adiciona o evento de clique no botão de salvar
document.getElementById('tarefa-button').onclick = adicionarTarefa;

// Renderiza a lista ao carregar a página
document.addEventListener('DOMContentLoaded', renderizarTarefas);