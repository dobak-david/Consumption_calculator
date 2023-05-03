const Machines = new Map([
  ["alapjarat", 5],
  ["Mosogatógép", 1.2],
  ["Sütő 185 fokon", 1.3],
  ["Sütő 190 fokon", 1.4],
  ["Közepes főzőlap", 0.9],
  ["Mosógép", 7],
  ["Lenti Tv", 0.1],
  ["Fenti Tv", 7],
  ["Laptoptöltés", 7],
  ["Telefontöltés", 7],
  ["Páraelszívó", 7],
  ["Klíma", 7]
]);

function createSelectMachines() {
  var select = document.getElementById("selectMachine");
  var option = document.createElement("option");
  option.text = "Válassz gépet";
  select.add(option);
  for(const [key, value] of Machines) {
    var select = document.getElementById("selectMachine");
    var option = document.createElement("option");
    option.text=key;
    option.value=key;
    select.add(option);
  }
  select.selected="Válassz gépet";
  AddedMachines.push(new AddedMachine("Alapjárat",5/24,24));
  writeAddedMachines();

  sumHours+=24;
  sumCons+=5;
}

let sumCons = 0;
let sumHours = 0;

class AddedMachine {
  constructor(Machine, consumption, time) {
    this.Machine=Machine;
    this.consumption=consumption;
    this.time=time;
  }

  equal(machine) {
    return this.Machine==machine;
  }

  equalTime(time) {
    return this.time==time;
  }
}

let AddedMachines = []

function Update() {
  let machine = document.getElementById("selectMachine").value;
  let time = +document.getElementById("hour").value;

  if(machine=='Válassz gépet' && time == '') alert("Add meg a gépet és a használati időt")
  else if (machine=='Válassz gépet') alert("Add meg a gépet")
  else if (time == '') alert("Add meg mennyi ideig használtad")
  else {
    let i=0;
    while(i<AddedMachines.length && !AddedMachines[i].equal(machine) && !AddedMachines[i].equalTime(time)) {
      i++;
    }
  
    if (i<AddedMachines.length) {
      AddedMachines[i].time+=time;
    } else {
      AddedMachines.push(new AddedMachine(machine,Machines.get(machine),time));
    }
    
    removeAllChildNodes(document.getElementById("AddedMachines"));
    writeAddedMachines();
    noConsuptionWarning();
    sumUp();
    sumCons+=(AddedMachines[i].consumption*AddedMachines[i].time);
    sumHours+=AddedMachines[i].time;
    document.getElementById("sumHours").innerHTML=sumHours;
    document.getElementById("sumCons").innerHTML=sumCons;
    
    document.getElementById("selectMachine").value='Válassz gépet';
    document.getElementById("hour").value=0;
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function removeMachine(element) {
  let i = 0;
  while(!AddedMachines[i].equal(element.id)) {
    i++;
  }
  sumCons-=(AddedMachines[i].consumption*AddedMachines[i].time);
  sumHours-=AddedMachines[i].time;
  document.getElementById("sumHours").innerHTML=sumHours;
  document.getElementById("sumCons").innerHTML=sumCons;

  element.remove();
  AddedMachines[i]=AddedMachines[AddedMachines.length-1];
  AddedMachines.pop();
  noConsuptionWarning();

  if(AddedMachines.length==0) {
    document.getElementById("header").remove();
    document.getElementById("sumUp").remove();
  }
}

function noConsuptionWarning() {
  if(AddedMachines.length==0) {
    const warn = document.createElement("p");
    warn.id="noConsuption";
    warn.innerHTML="Még nincs hozzáadva tevékenység";
    document.getElementById("AddedMachines").appendChild(warn);
    document.getElementById("AddedMachines").style.border = 0;
  } else if(document.getElementById("header") == undefined) {
    const table = document.getElementById("AddedMachines");
    const header = table.createTHead();
    const row = header.insertRow(0);
    header.id="header";
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell4 = row.insertCell(2);
    const cell5 = row.insertCell(3);
    cell1.innerHTML="Gép";
    cell2.innerHTML="Használati idő órában";
    cell4.innerHTML="Teljes fogyasztás(kw/h)";
  }
}

function writeAddedMachines() {
  for(let i=0;i<AddedMachines.length;i++) {

    const table = document.getElementById("AddedMachines");
    const row = table.insertRow(0);
    row.id=AddedMachines[i].Machine;
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    
    cell1.innerHTML=AddedMachines[i].Machine;
    cell2.innerHTML=AddedMachines[i].time;
    cell2.id="timeHour-"+AddedMachines[i].Machine;
    cell2.ondblclick = function() {
      MinuteOnChange(AddedMachines[i]);
    }

    cell3.innerHTML=AddedMachines[i].consumption*AddedMachines[i].time;
    cell3.id="consumption-"+AddedMachines[i].Machine;

    const newButton = document.createElement("button");
    newButton.innerHTML="Eltávolítás";
    newButton.onclick = function() {
      removeMachine(row);
    };
    cell4.appendChild(newButton);
  }
}

function MinuteOnChange(AddedMachine) {
  var hour = parseFloat(document.getElementById("timeHour-"+AddedMachine.Machine).innerText);
  document.getElementById("timeHour-"+AddedMachine.Machine).innerText='';
  var consumption = parseFloat(document.getElementById("consumption-"+AddedMachine.Machine).innerText);
  
  var unit = consumption/hour;

  var inputField = document.createElement("input");
  inputField.type="number";
  inputField.value=hour;
  inputField.id="inputChangeHour";

  var newBtn = document.createElement("button");
  newBtn.innerHTML="Módosít";
  newBtn.onclick = function() {
    sumHours+=(inputField.value-hour);
    document.getElementById("sumHours").innerHTML=sumHours;
    sumCons+=((inputField.value*AddedMachine.consumption)-consumption);
    document.getElementById("sumCons").innerHTML=sumCons;
    document.getElementById("timeHour-"+AddedMachine.Machine).innerHTML=inputField.value;
    AddedMachine.consumption=(unit);
    AddedMachine.time = inputField.value;
    inputField.remove();
    newBtn.remove();

    removeAllChildNodes(document.getElementById("AddedMachines"));
    writeAddedMachines();
    noConsuptionWarning();
    sumUp();
  }

  document.getElementById("timeHour-"+AddedMachine.Machine).appendChild(inputField);
  document.getElementById("timeHour-"+AddedMachine.Machine).appendChild(newBtn);
}

function sumUp() {
  if(document.getElementById("sumUp") == undefined) {
    const table = document.getElementById("AddedMachines");
    const row = table.insertRow(AddedMachines.length+1);
    row.id="sumUp";
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell1.innerHTML="Összesen"
    cell2.innerHTML=sumHours;
    cell2.id="sumHours";
    cell2.ondblclick = function() {
      
    }

    cell3.innerHTML=sumCons;
    cell3.id="sumCons";
  }
}