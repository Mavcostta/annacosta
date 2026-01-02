// ========================================
// CONFIGURAÇÃO DO GOOGLE CALENDAR API
// ========================================
// As credenciais estão no arquivo calendar-config.js (não versionado no Git)
// Se não existir, define valores padrão

// Verifica se CALENDAR_CONFIG foi carregado do arquivo externo
if (typeof CALENDAR_CONFIG === 'undefined') {
  console.warn('⚠️ calendar-config.js não encontrado. Usando configuração de demonstração.');
  var CALENDAR_CONFIG = {
    apiKey: "SUA_API_KEY_AQUI",
    calendarId: "seu-email@gmail.com",
    timeZone: "America/Sao_Paulo",
  };
}

// Horário de funcionamento do studio (flexível - mostra todos os horários)
const BUSINESS_HOURS = {
  start: 7, // 7h da manhã
  end: 22, // 22h da noite
  interval: 30, // Intervalos de 30 minutos
};

// Todos os dias da semana disponíveis (0 = Domingo, 6 = Sábado)
const WORKING_DAYS = [0, 1, 2, 3, 4, 5, 6]; // Todos os dias

// Duração dos serviços em minutos
const SERVICE_DURATION = {
  "extensao-cilios": 180, // 3 horas
  "design-sobrancelhas": 45, // 45 min
  "lash-lifting": 60, // 1 hora
  "brow-lamination": 45, // 45 min
};

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let selectedService = "extensao-cilios";
let busySlots = [];
let gapiLoaded = false;

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  initCalendar();
  initServiceSelection();
  // initNavigation(); // Removido - script.js já gerencia o menu

  // Carregar biblioteca do Google
  loadGoogleAPI();
});

// ========================================
// CARREGAR GOOGLE CALENDAR API
// ========================================
function loadGoogleAPI() {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = () => {
    gapi.load("client", initGoogleClient);
  };
  document.body.appendChild(script);
}

function initGoogleClient() {
  gapi.client
    .init({
      apiKey: CALENDAR_CONFIG.apiKey,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
    })
    .then(() => {
      console.log("✅ Google Calendar API inicializada com sucesso!");
      console.log("📧 Calendar ID:", CALENDAR_CONFIG.calendarId);
      gapiLoaded = true;
      // Recarregar calendário após inicialização
      renderCalendar();
    })
    .catch((error) => {
      console.error("❌ Erro ao inicializar Google Calendar API:", error);
      console.warn(
        "⚠️ Modo de demonstração ativado - usando horários simulados"
      );
      gapiLoaded = false;
    });
}

// ========================================
// BUSCAR HORÁRIOS OCUPADOS DO GOOGLE CALENDAR
// ========================================
async function fetchBusySlots(date) {
  // Se não configurou a API, retorna array vazio (modo demonstração)
  if (
    !CALENDAR_CONFIG.apiKey ||
    CALENDAR_CONFIG.apiKey === "SUA_API_KEY_AQUI"
  ) {
    console.warn("API Key não configurada - usando modo demonstração");
    return getDemoSlots(date);
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_CONFIG.calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.result.items || [];
    return events.map((event) => {
      // Eventos de dia inteiro (all-day events)
      if (event.start.date) {
        const allDayStart = new Date(event.start.date + "T00:00:00");
        const allDayEnd = new Date(event.end.date + "T23:59:59");
        return { start: allDayStart, end: allDayEnd, allDay: true };
      }
      // Eventos com horário específico
      return {
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        allDay: false,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return getDemoSlots(date);
  }
}

// Horários de demonstração (quando API não está configurada)
function getDemoSlots(date) {
  const day = date.getDay();
  const demoSlots = [];

  // Simula alguns horários ocupados
  if (day === 2) {
    // Terça
    demoSlots.push(
      {
        start: new Date(date.setHours(10, 0)),
        end: new Date(date.setHours(13, 0)),
      },
      {
        start: new Date(date.setHours(15, 0)),
        end: new Date(date.setHours(16, 0)),
      }
    );
  }

  return demoSlots;
}

// ========================================
// RENDERIZAR CALENDÁRIO
// ========================================
function initCalendar() {
  renderCalendar();
  document.getElementById("prev-month").addEventListener("click", prevMonth);
  document.getElementById("next-month").addEventListener("click", nextMonth);
}

async function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Header
  const monthNames = [
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
  document.getElementById(
    "current-month"
  ).textContent = `${monthNames[month]} ${year}`;

  // Grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarHTML = `
    <div class="calendar-weekdays">
      <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div>
      <div>Qui</div><div>Sex</div><div>Sáb</div>
    </div>
    <div class="calendar-days">
      ${await renderDays(firstDay, daysInMonth, year, month)}
    </div>
  `;

  document.getElementById("calendar").innerHTML = calendarHTML;

  // Event listeners nos dias
  document.querySelectorAll(".calendar-day:not(.disabled)").forEach((day) => {
    day.addEventListener("click", () => selectDate(day));
  });
}

async function renderDays(firstDay, daysInMonth, year, month) {
  let html = "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Dias vazios antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }

  // Buscar eventos do mês inteiro de uma vez
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const monthBusyDays = await fetchMonthBusyDays(monthStart, monthEnd);

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isPast = date < today;
    const isWorkingDay = WORKING_DAYS.includes(dayOfWeek);

    // Verificar se o dia está totalmente ocupado
    const dateStr = date.toISOString().split("T")[0];
    const isFullyBooked = monthBusyDays.has(dateStr);

    const isDisabled = isPast || !isWorkingDay || isFullyBooked;

    let dayClass = "calendar-day";
    if (isDisabled) dayClass += " disabled";
    if (isFullyBooked && !isPast) dayClass += " fully-booked";

    html += `<div class="${dayClass}" data-date="${date.toISOString()}">
               ${day}
             </div>`;
  }

  return html;
}

// Função auxiliar para buscar dias ocupados do mês
async function fetchMonthBusyDays(monthStart, monthEnd) {
  const busyDays = new Set();

  // Se a API não foi carregada ainda, retorna vazio
  if (
    !gapiLoaded ||
    !window.gapi ||
    !window.gapi.client ||
    !window.gapi.client.calendar
  ) {
    console.warn("⚠️ API do Google Calendar ainda não está carregada");
    return busyDays;
  }

  // Se não configurou a API, retorna vazio
  if (
    !CALENDAR_CONFIG.apiKey ||
    CALENDAR_CONFIG.apiKey === "SUA_API_KEY_AQUI"
  ) {
    console.warn("⚠️ API Key não configurada");
    return busyDays;
  }

  try {
    console.log(
      `📅 Buscando eventos entre ${monthStart.toLocaleDateString()} e ${monthEnd.toLocaleDateString()}`
    );

    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_CONFIG.calendarId,
      timeMin: monthStart.toISOString(),
      timeMax: monthEnd.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.result.items || [];
    console.log(`📋 Total de eventos encontrados: ${events.length}`);

    events.forEach((event) => {
      // Eventos de dia inteiro (all-day events) - marca o dia como ocupado
      if (event.start.date) {
        const eventDate = new Date(event.start.date);
        const dateStr = eventDate.toISOString().split("T")[0];
        busyDays.add(dateStr);
        console.log(
          `🚫 Dia ocupado: ${dateStr} - ${event.summary || "Sem título"}`
        );
      } else if (event.start.dateTime) {
        console.log(
          `⏰ Evento com horário: ${new Date(
            event.start.dateTime
          ).toLocaleString()} - ${event.summary || "Sem título"}`
        );
      }
    });

    console.log(`📊 Total de dias completamente ocupados: ${busyDays.size}`);
    return busyDays;
  } catch (error) {
    console.error("❌ Erro ao buscar eventos do mês:", error);
    if (error.result && error.result.error) {
      console.error("Detalhes do erro:", error.result.error);
    }
    return busyDays;
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

// ========================================
// SELEÇÃO DE DATA
// ========================================
async function selectDate(dayElement) {
  // Remove seleção anterior
  document
    .querySelectorAll(".calendar-day")
    .forEach((d) => d.classList.remove("selected"));
  dayElement.classList.add("selected");

  selectedDate = new Date(dayElement.dataset.date);

  // Buscar horários ocupados do Google Calendar
  busySlots = await fetchBusySlots(selectedDate);

  // Verificar se o dia está completamente ocupado
  const dayFullyBooked = busySlots.some((slot) => slot.allDay);

  if (dayFullyBooked) {
    // Dia completamente ocupado
    alert(
      "⚠️ Este dia está totalmente ocupado. Por favor, escolha outra data."
    );
    dayElement.classList.remove("selected");
    dayElement.classList.add("disabled");
    selectedDate = null;
    return;
  }

  // Mostrar resumo imediatamente (sem seleção de horário)
  updateSummary();
}

function renderTimeSlots() {
  const slots = generateTimeSlots();
  const slotsHTML = slots
    .map((slot) => {
      const isAvailable = !isSlotBusy(slot);
      return `
      <button class="time-slot ${isAvailable ? "" : "busy"}" 
              data-time="${slot.toISOString()}"
              ${!isAvailable ? "disabled" : ""}>
        ${formatTime(slot)}
      </button>
    `;
    })
    .join("");

  document.getElementById("time-slots").innerHTML = slotsHTML;

  // Event listeners
  document.querySelectorAll(".time-slot:not(.busy)").forEach((slot) => {
    slot.addEventListener("click", () => selectTime(slot));
  });
}

function generateTimeSlots() {
  const slots = [];
  const date = new Date(selectedDate);

  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    for (let min = 0; min < 60; min += BUSINESS_HOURS.interval) {
      const slot = new Date(date);
      slot.setHours(hour, min, 0, 0);

      // Verificar se o horário ainda permite completar o serviço
      const serviceEnd = new Date(slot);
      serviceEnd.setMinutes(
        slot.getMinutes() + SERVICE_DURATION[selectedService]
      );

      if (serviceEnd.getHours() <= BUSINESS_HOURS.end) {
        slots.push(slot);
      }
    }
  }

  return slots;
}

function isSlotBusy(slotStart) {
  const slotEnd = new Date(slotStart);
  slotEnd.setMinutes(slotEnd.getMinutes() + SERVICE_DURATION[selectedService]);

  return busySlots.some((busy) => {
    // Se for evento de dia inteiro, bloqueia o dia todo
    if (busy.allDay) {
      return true;
    }
    // Eventos com horário específico
    return slotStart < busy.end && slotEnd > busy.start;
  });
}

function selectTime(timeElement) {
  document
    .querySelectorAll(".time-slot")
    .forEach((t) => t.classList.remove("selected"));
  timeElement.classList.add("selected");

  selectedTime = new Date(timeElement.dataset.time);
  updateSummary();
}

// ========================================
// SELEÇÃO DE SERVIÇO
// ========================================
function initServiceSelection() {
  document.querySelectorAll('input[name="service"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      selectedService = e.target.value;
      if (selectedDate) {
        renderTimeSlots(); // Recarregar horários com nova duração
      }
    });
  });
}

// ========================================
// RESUMO E CONFIRMAÇÃO
// ========================================
function updateSummary() {
  const serviceNames = {
    "extensao-cilios": "Extensão de Cílios",
    "design-sobrancelhas": "Design de Sobrancelhas",
    "lash-lifting": "Lash Lifting",
    "brow-lamination": "Brow Lamination",
  };

  document.getElementById("summary-service").textContent =
    serviceNames[selectedService];
  document.getElementById("summary-date").textContent =
    formatDate(selectedDate);

  document.getElementById("booking-summary").style.display = "block";

  // Botão de confirmação
  document.getElementById("confirm-booking").onclick = confirmBooking;
}

function confirmBooking() {
  const serviceNames = {
    "extensao-cilios": "Extensão de Cílios",
    "design-sobrancelhas": "Design de Sobrancelhas",
    "lash-lifting": "Lash Lifting",
    "brow-lamination": "Brow Lamination",
  };

  const weekday = selectedDate.toLocaleDateString("pt-BR", { weekday: "long" });
  const dateShort = selectedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  const message =
    `Oi Anna! 💕\n\n` +
    `Gostaria de fazer *${serviceNames[selectedService]}*.\n\n` +
    `Você tem disponibilidade no dia *${dateShort}* (${weekday})?\n\n` +
    `Qual horário funciona melhor para você?\n\n` +
    `Aguardo seu retorno! 😊`;

  const whatsappURL = `https://wa.me/5511987382366?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappURL, "_blank");
}

// ========================================
// UTILITÁRIOS
// ========================================
function formatDate(date) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("pt-BR", options);
}

function formatTime(date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// initNavigation() removida - script.js já gerencia o menu hambúrguer
