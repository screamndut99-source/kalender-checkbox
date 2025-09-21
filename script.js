const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
let current = new Date();

function renderCalendar(date) {
  calendar.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni",
                      "Juli","Agustus","September","Oktober","November","Desember"];
  monthYear.innerText = `${monthNames[month]} ${year}`;

  const dayNames = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
  dayNames.forEach((d) => {
    const div = document.createElement("div");
    div.classList.add("day-name");
    div.innerText = d;
    calendar.appendChild(div);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  for(let i=firstDay-1; i>=0; i--){
    const div = document.createElement("div");
    div.classList.add("day","prev-month");
    const span = document.createElement("span");
    span.classList.add("date-number");
    span.innerText = prevLastDate - i;
    div.appendChild(span);
    calendar.appendChild(div);
  }

  for(let day=1; day<=lastDate; day++){
    const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const div = document.createElement("div");
    div.classList.add("day");

    const span = document.createElement("span");
    span.classList.add("date-number");
    span.innerText = day;

    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked = localStorage.getItem(dateKey) === "true";
    checkbox.title = checkbox.checked ? "Sudah dicentang ✅" : "Belum dicentang";
    checkbox.addEventListener("change", ()=>{
      localStorage.setItem(dateKey, checkbox.checked);
      checkbox.title = checkbox.checked ? "Sudah dicentang ✅" : "Belum dicentang";
    });

    const note = document.createElement("textarea");
    note.classList.add("note");
    note.placeholder = "Catatan...";
    note.value = localStorage.getItem(dateKey+"_note") || "";
    note.addEventListener("input", ()=>{
      localStorage.setItem(dateKey+"_note", note.value);
      const oldInd = div.querySelector(".note-indicator");
      if(oldInd) oldInd.remove();
      if(note.value.trim() !== ""){
        const newInd = document.createElement("div");
        newInd.classList.add("note-indicator");
        div.appendChild(newInd);
      }
    });

    if(note.value.trim() !== ""){
      const indicator = document.createElement("div");
      indicator.classList.add("note-indicator");
      div.appendChild(indicator);
    }

    const today = new Date();
    if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
      div.classList.add("today");
    }

    const dayOfWeek = new Date(year, month, day).getDay();
    if(dayOfWeek === 0){ div.classList.add("sunday"); }

    div.appendChild(span);
    div.appendChild(checkbox);
    div.appendChild(note);
    calendar.appendChild(div);
  }

  const totalBoxes = firstDay + lastDate;
  const nextDays = (7 - (totalBoxes % 7)) % 7;
  for(let i=1;i<=nextDays;i++){
    const div = document.createElement("div");
    div.classList.add("day","next-month");
    const span = document.createElement("span");
    span.classList.add("date-number");
    span.innerText = i;
    div.appendChild(span);
    calendar.appendChild(div);
  }
}

function prevMonth(){ current.setMonth(current.getMonth()-1); renderCalendar(current); }
function nextMonth(){ current.setMonth(current.getMonth()+1); renderCalendar(current); }
function goToToday(){ current = new Date(); renderCalendar(current); }

function resetMonth(){
  if(confirm("Yakin ingin menghapus semua checklist dan catatan bulan ini?")){
    const year = current.getFullYear();
    const month = current.getMonth();
    const lastDate = new Date(year, month + 1, 0).getDate();
    for(let day=1; day<=lastDate; day++){
      const key = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      localStorage.removeItem(key);
      localStorage.removeItem(key+"_note");
    }
    renderCalendar(current);
  }
}

renderCalendar(current);
