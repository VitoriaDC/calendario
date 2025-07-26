// Seleção de elementos do DOM
const calendario = document.querySelector(".calendar"),
  data = document.querySelector(".date"),
  containerDias = document.querySelector(".days"),
  anterior = document.querySelector(".prev"),
  proximo = document.querySelector(".next"),
  botaoHoje = document.querySelector(".today-btn"),
  botaoIrPara = document.querySelector(".goto-btn"),
  inputData = document.querySelector(".date-input"),
  diaEvento = document.querySelector(".event-day"),
  dataEvento = document.querySelector(".event-date"),
  containerEventos = document.querySelector(".events"),
  botaoAdicionarEvento = document.querySelector(".add-event"),
  wrapperAdicionarEvento = document.querySelector(".add-event-wrapper"),
  botaoFecharEvento = document.querySelector(".close"),
  tituloAdicionarEvento = document.querySelector(".event-name"),
  horaInicioEvento = document.querySelector(".event-time-from"),
  horaFimEvento = document.querySelector(".event-time-to"),
  botaoEnviarEvento = document.querySelector(".add-event-btn");

// Variáveis de estado do calendário
let hoje = new Date();
let diaAtivo;
let mes = hoje.getMonth();
let ano = hoje.getFullYear();

// Nomes dos meses em português
const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Mapeamento de abreviações de dias da semana (do Date.toString()) para português
const diasDaSemanaPortugues = {
  Sun: "Dom",
  Mon: "Seg",
  Tue: "Ter",
  Wed: "Qua",
  Thu: "Qui",
  Fri: "Sex",
  Sat: "Sáb",
};

// Array para armazenar os eventos
const eventosArr = [];
obterEventos(); // Chamada inicial para carregar eventos do armazenamento local

// Função para inicializar e renderizar o calendário
function inicializarCalendario() {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const ultimoDiaAnterior = new Date(ano, mes, 0);
  const diasDoMesAnterior = ultimoDiaAnterior.getDate();
  const ultimoDiaDoMes = ultimoDia.getDate();
  const diaDaSemanaPrimeiroDia = primeiroDia.getDay(); // 0 para domingo, 1 para segunda, etc.
  const diasDoProximoMes = 7 - ultimoDia.getDay() - 1; // Dias a serem exibidos do próximo mês

  // Atualiza o cabeçalho do mês/ano
  data.innerHTML = meses[mes] + " " + ano;

  let diasHTML = "";

  // Adiciona os dias do mês anterior (para preencher a primeira semana)
  for (let x = diaDaSemanaPrimeiroDia; x > 0; x--) {
    diasHTML += `<div class="day prev-date">${diasDoMesAnterior - x + 1}</div>`;
  }

  // Adiciona os dias do mês atual
  for (let i = 1; i <= ultimoDiaDoMes; i++) {
    let eventoPresente = false;
    // Verifica se há eventos para o dia atual
    eventosArr.forEach((eventoObj) => {
      if (
        eventoObj.day === i &&
        eventoObj.month === mes + 1 &&
        eventoObj.year === ano
      ) {
        eventoPresente = true;
      }
    });

    // Adiciona classes específicas para o dia de hoje e dias com eventos
    if (
      i === new Date().getDate() &&
      ano === new Date().getFullYear() &&
      mes === new Date().getMonth()
    ) {
      diaAtivo = i; // Define o dia de hoje como ativo
      obterDiaAtivo(i); // Atualiza as informações do dia ativo
      atualizarEventos(i); // Carrega os eventos para o dia ativo
      if (eventoPresente) {
        diasHTML += `<div class="day today active event">${i}</div>`;
      } else {
        diasHTML += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (eventoPresente) {
        diasHTML += `<div class="day event">${i}</div>`;
      } else {
        diasHTML += `<div class="day ">${i}</div>`;
      }
    }
  }

  // Adiciona os dias do próximo mês (para preencher a última semana)
  for (let j = 1; j <= diasDoProximoMes; j++) {
    diasHTML += `<div class="day next-date">${j}</div>`;
  }
  containerDias.innerHTML = diasHTML; // Insere os dias no DOM
  adicionarListener(); // Adiciona listeners de clique aos dias
}

// Função para avançar para o mês anterior
function mesAnterior() {
  mes--;
  if (mes < 0) {
    mes = 11;
    ano--;
  }
  inicializarCalendario();
}

// Função para avançar para o próximo mês
function mesProximo() {
  mes++;
  if (mes > 11) {
    mes = 0;
    ano++;
  }
  inicializarCalendario();
}

// Adiciona listeners para os botões de navegação do mês
anterior.addEventListener("click", mesAnterior);
proximo.addEventListener("click", mesProximo);

inicializarCalendario(); // Chamada inicial para renderizar o calendário ao carregar a página

// Função para adicionar listeners de clique a todos os dias do calendário
function adicionarListener() {
  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    dia.addEventListener("click", (e) => {
      obterDiaAtivo(e.target.innerHTML); // Atualiza as informações do dia ativo
      atualizarEventos(Number(e.target.innerHTML)); // Carrega os eventos para o dia clicado
      diaAtivo = Number(e.target.innerHTML); // Define o dia clicado como ativo

      // Remove a classe 'active' de todos os dias
      dias.forEach((d) => {
        d.classList.remove("active");
      });

      // Se clicado em um dia do mês anterior ou próximo, muda para aquele mês
      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
        // Adiciona 'active' ao dia clicado após a mudança de mês (com um pequeno atraso para a transição visual)
        setTimeout(() => {
          const diasAtualizados = document.querySelectorAll(".day");
          diasAtualizados.forEach((dAtualizado) => {
            if (
              !dAtualizado.classList.contains("prev-date") &&
              dAtualizado.innerHTML === e.target.innerHTML
            ) {
              dAtualizado.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        mesProximo();
        // Adiciona 'active' ao dia clicado após a mudança de mês (com um pequeno atraso para a transição visual)
        setTimeout(() => {
          const diasAtualizados = document.querySelectorAll(".day");
          diasAtualizados.forEach((dAtualizado) => {
            if (
              !dAtualizado.classList.contains("next-date") &&
              dAtualizado.innerHTML === e.target.innerHTML
            ) {
              dAtualizado.classList.add("active");
            }
          });
        }, 100);
      } else {
        // Se clicado em um dia do mês atual, apenas adiciona a classe 'active'
        e.target.classList.add("active");
      }
    });
  });
}

// Listener para o botão "Hoje"
botaoHoje.addEventListener("click", () => {
  hoje = new Date();
  mes = hoje.getMonth();
  ano = hoje.getFullYear();
  inicializarCalendario(); // Retorna o calendário para o mês e ano atuais
});

// Listener para o input de data (formato mm/aaaa)
inputData.addEventListener("input", (e) => {
  inputData.value = inputData.value.replace(/[^0-9/]/g, ""); // Permite apenas números e '/'
  if (inputData.value.length === 2) {
    inputData.value += "/";
  }
  if (inputData.value.length > 7) {
    inputData.value = inputData.value.slice(0, 7); // Limita a 7 caracteres (mm/aaaa)
  }
  // Lida com a exclusão de caracteres para manter o formato
  if (e.inputType === "deleteContentBackward") {
    if (inputData.value.length === 3) {
      inputData.value = inputData.value.slice(0, 2);
    }
  }
});

// Listener para o botão "Ir" (para uma data específica)
botaoIrPara.addEventListener("click", irParaData);

// Função para navegar para a data inserida no input
function irParaData() {
  const dataArr = inputData.value.split("/");
  if (dataArr.length === 2) {
    const mesDigitado = parseInt(dataArr[0]);
    const anoDigitado = parseInt(dataArr[1]);
    if (mesDigitado > 0 && mesDigitado < 13 && String(anoDigitado).length === 4) {
      mes = mesDigitado - 1; // Ajusta para o índice do mês (0-11)
      ano = anoDigitado;
      inicializarCalendario();
      return;
    }
  }
  console.error("Erro: Data inválida! Por favor, insira no formato MM/AAAA.");
}

// Função para obter o nome e a data do dia ativo e atualizar diaEvento e dataEvento
function obterDiaAtivo(data) {
  const dia = new Date(ano, mes, data);
  const nomeDia = dia.toString().split(" ")[0]; // Ex: "Sun", "Mon"
  diaEvento.innerHTML = diasDaSemanaPortugues[nomeDia]; // Converte para português (Dom, Seg, etc.)
  dataEvento.innerHTML = data + " " + meses[mes] + " " + ano; // Ex: "17 Abril 2025"
}

// Função para atualizar a lista de eventos para o dia ativo
function atualizarEventos(data) {
  let eventosHTML = "";
  eventosArr.forEach((evento) => {
    if (
      evento.day === data &&
      evento.month === mes + 1 &&
      evento.year === ano
    ) {
      evento.events.forEach((eventoItem) => {
        eventosHTML += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${eventoItem.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${eventoItem.time}</span>
            </div>
        </div>`;
      });
    }
  });
  // Se não houver eventos, exibe uma mensagem
  if (eventosHTML === "") {
    eventosHTML = `<div class="no-event">
            <h3>Sem eventos</h3>
        </div>`;
  }
  containerEventos.innerHTML = eventosHTML; // Insere os eventos no DOM
  salvarEventos(); // Salva os eventos no armazenamento local
}

// Listener para o botão de adicionar evento (abre/fecha o formulário)
botaoAdicionarEvento.addEventListener("click", () => {
  wrapperAdicionarEvento.classList.toggle("active");
});

// Listener para o botão de fechar o formulário de adicionar evento
botaoFecharEvento.addEventListener("click", () => {
  wrapperAdicionarEvento.classList.remove("active");
});

// Fecha o formulário de adicionar evento se clicar fora dele
document.addEventListener("click", (e) => {
  if (e.target !== botaoAdicionarEvento && !wrapperAdicionarEvento.contains(e.target)) {
    wrapperAdicionarEvento.classList.remove("active");
  }
});

// Limita o título do evento a 60 caracteres
tituloAdicionarEvento.addEventListener("input", (e) => {
  tituloAdicionarEvento.value = tituloAdicionarEvento.value.slice(0, 60);
});

// Permite apenas números e dois pontos para entrada de hora de início (HH:MM)
horaInicioEvento.addEventListener("input", (e) => {
  horaInicioEvento.value = horaInicioEvento.value.replace(/[^0-9:]/g, "");
  if (horaInicioEvento.value.length === 2) {
    horaInicioEvento.value += ":";
  }
  if (horaInicioEvento.value.length > 5) {
    horaInicioEvento.value = horaInicioEvento.value.slice(0, 5);
  }
});

// Permite apenas números e dois pontos para entrada de hora de término (HH:MM)
horaFimEvento.addEventListener("input", (e) => {
  horaFimEvento.value = horaFimEvento.value.replace(/[^0-9:]/g, "");
  if (horaFimEvento.value.length === 2) {
    horaFimEvento.value += ":";
  }
  if (horaFimEvento.value.length > 5) {
    horaFimEvento.value = horaFimEvento.value.slice(0, 5);
  }
});

// Função para adicionar um novo evento ao array de eventos (eventsArr)
botaoEnviarEvento.addEventListener("click", () => {
  const tituloEvento = tituloAdicionarEvento.value;
  const horaInicio = horaInicioEvento.value;
  const horaFim = horaFimEvento.value; 

  // Validação básica dos campos
  if (tituloEvento === "" || horaInicio === "" || horaFim === "") {
    console.error("Erro: Por favor, preencha todos os campos.");
    return;
  }

  // Validação do formato de hora (HH:MM e valores válidos)
  const timeFromArr = horaInicio.split(":");
  const timeToArr = horaFim.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    parseInt(timeFromArr[0]) > 23 || 
    parseInt(timeFromArr[1]) > 59 || 
    parseInt(timeToArr[0]) > 23 ||   
    parseInt(timeToArr[1]) > 59      
  ) {
    console.error("Erro: Formato de hora inválido. Use HH:MM e valores válidos (00-23 para horas, 00-59 para minutos).");
    return;
  }

  const timeFrom = converterHora(horaInicio); // Converte para formato AM/PM
  const timeTo = converterHora(horaFim);     // Converte para formato AM/PM

  // Verifica se o evento já existe para o dia ativo
  let eventoJaExiste = false;
  eventosArr.forEach((eventoObj) => {
    if (
      eventoObj.day === diaAtivo &&
      eventoObj.month === mes + 1 &&
      eventoObj.year === ano
    ) {
      eventoObj.events.forEach((item) => {
        if (item.title === tituloEvento) {
          eventoJaExiste = true;
        }
      });
    }
  });
  if (eventoJaExiste) {
    console.error("Erro: Evento com este título já adicionado para este dia.");
    return;
  }
  
  // Cria o novo objeto de evento
  const novoEvento = {
    title: tituloEvento,
    time: timeFrom + " - " + timeTo,
  };
  console.log("Novo evento a ser adicionado:", novoEvento);
  console.log("Dia ativo para o evento:", diaAtivo);

  // Adiciona o novo evento ao array de eventos
  let eventoAdicionado = false;
  if (eventosArr.length > 0) {
    eventosArr.forEach((item) => {
      if (
        item.day === diaAtivo &&
        item.month === mes + 1 &&
        item.year === ano
      ) {
        item.events.push(novoEvento); // Adiciona ao array de eventos do dia existente
        eventoAdicionado = true;
      }
    });
  }

  if (!eventoAdicionado) {
    // Se não houver eventos para o dia, cria uma nova entrada para o dia
    eventosArr.push({
      day: diaAtivo,
      month: mes + 1,
      year: ano,
      events: [novoEvento],
    });
  }

  console.log("Array de eventos atualizado:", eventosArr);
  wrapperAdicionarEvento.classList.remove("active"); // Esconde o formulário
  // Limpa os campos do formulário
  tituloAdicionarEvento.value = "";
  horaInicioEvento.value = "";
  horaFimEvento.value = "";
  atualizarEventos(diaAtivo); // Atualiza a exibição dos eventos
  // Adiciona a classe 'event' ao dia no calendário se ele ainda não a tiver
  const elementoDiaAtivo = document.querySelector(".day.active");
  if (elementoDiaAtivo && !elementoDiaAtivo.classList.contains("event")) {
    elementoDiaAtivo.classList.add("event");
  }
});

// Função para deletar um evento quando clicado na lista de eventos
containerEventos.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    console.warn("Confirmação: Tem certeza que deseja excluir este evento?");
    // Nota: Para uma funcionalidade real de exclusão com confirmação do usuário,
    // você precisaria implementar um modal de confirmação personalizado,
    // pois 'confirm()' pode bloquear o navegador em alguns ambientes.
    
    const tituloEventoParaDeletar = e.target.children[0].children[1].innerHTML;
    eventosArr.forEach((eventoObj, indexArr) => {
      if (
        eventoObj.day === diaAtivo &&
        eventoObj.month === mes + 1 &&
        eventoObj.year === ano
      ) {
        eventoObj.events.forEach((item, indexEvent) => {
          if (item.title === tituloEventoParaDeletar) {
            eventoObj.events.splice(indexEvent, 1); // Remove o evento específico
          }
        });
        // Se não houver mais eventos para este dia, remove a entrada do dia do array principal
        if (eventoObj.events.length === 0) {
          eventosArr.splice(indexArr, 1);
          // Remove a classe 'event' do dia no calendário
          const elementoDiaAtivo = document.querySelector(".day.active");
          if (elementoDiaAtivo && elementoDiaAtivo.classList.contains("event")) {
            elementoDiaAtivo.classList.remove("event");
          }
        }
      }
    });
    atualizarEventos(diaAtivo); // Reatualiza a lista de eventos
  }
});

// Função para salvar o array de eventos no armazenamento local (localStorage)
function salvarEventos() {
  localStorage.setItem("events", JSON.stringify(eventosArr));
}

// Função para obter os eventos do armazenamento local (localStorage)
function obterEventos() {
  // Verifica se há eventos salvos no localStorage e os carrega para 'eventosArr'
  if (localStorage.getItem("events") === null) {
    return; // Não há eventos salvos
  }
  eventosArr.push(...JSON.parse(localStorage.getItem("events")));
}

// Função para converter o tempo de 24h para o formato AM/PM (12 horas)
function converterHora(hora) {
  let partesDaHora = hora.split(":");
  let horaNum = parseInt(partesDaHora[0]);
  let minutoNum = parseInt(partesDaHora[1]); 
  let formatoTempo = horaNum >= 12 ? "PM" : "AM"; // Define AM ou PM
  horaNum = horaNum % 12 || 12; // Converte 0 para 12 para AM/PM, e horas > 12 para formato 12h
  return horaNum + ":" + (minutoNum < 10 ? "0" + minutoNum : minutoNum) + " " + formatoTempo; // Adiciona zero à esquerda se minuto < 10
}
