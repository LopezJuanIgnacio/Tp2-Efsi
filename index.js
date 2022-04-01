class Tarea {
    constructor(Titulo, Descripcion, Creacion) {
      this.Titulo = Titulo;
      this.Descripcion = Descripcion;
      this.Creacion = Creacion;
      this.Completacion = undefined
    }
    Completar() {
        this.Completacion = new Date()
        this.Tardanza = this.Completacion - this.Creacion
    }
  }
const btnMayor = document.querySelector("#btn-mayor")
const form = document.querySelector("#task-form")
const btnEnviar = document.querySelector("#btn-task-form")
const cancelar = document.querySelector("#Cancelar")
let status = false;
let id = "";
let fecha;
const taskContainer = document.querySelector("#task-container")
let tareas = []
const deleteTask = id => tareas.splice(id, 1)
const updateTask = (id, task) => {
    tareas.splice(id, 1)
    tareas.splice(id, 0, task)
}
const getTasks = ()=>{
    taskContainer.innerHTML = ""
    let i = 0;
    tareas.sort(function(a, b) {
        return a.Creacion - b.Creacion;
    });
    tareas.forEach(task => {
        let date = task.Creacion
        let options2 = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        let desde = date.toLocaleDateString("es-ES", options2)
        let div
        if(task.Completacion == null || task.Completacion == undefined) div = `
        <div class="card card-body mt-2 border-primary d-flex justify-content-center tarea" data-id="${i}" id="${i}">
            <h3  class="text-center">${task.Titulo}</h3>
            <p  class="wrapper">${task.Descripcion}</p>
            <p  class="text-center"> <span class="badge badge-pill bg-info">Creado en: ${desde}</span> </p>
            <div class="botonera mt-3">
                <div  class="btn-delete">
                    <i data-id="${i}" style="--col:#C70039" class="fa-solid fa-trash "></i>
                </div>
                <div  class="btn-checker">
                    <i class="fa-solid fa-check " data-id="${i}" style="--col:#44ff00"></i>
                </div>
                <div  class="btn-edit">
                    <i data-id="${i}" style="--col:#FFC300" class="fa-solid fa-pen-to-square "></i>
                </div>
            </div>
        </div>`
        else {
            let date2 = task.Completacion
            let hasta = date2.toLocaleDateString("es-ES", options2)
            div = `
            <div class="card text-white card-body mt-2 border-secondary bg-primary d-flex justify-content-center tarea" data-id="${i}" id="${i}">
                <h3  class="text-center">${task.Titulo}</h3>
                <p  class="wrapper">${task.Descripcion}</p>
                <p  class="text-center"> <span class="badge badge-pill bg-info">Creado en: ${desde}</span> </p>
                <p  class="text-center"> <span class="badge badge-pill bg-warning">Completado en: ${hasta}</span> </p>
                <div class="botonera mt-3">
                    <div  class="btn-delete">
                        <i data-id="${i}" style="--col:#C70039" class="fa-solid fa-trash "></i>
                    </div>
                    <div  class="btn-edit">
                        <i data-id="${i}" style="--col:#FFC300" class="fa-solid fa-pen-to-square "></i>
                    </div>
                </div>
            </div>`
        } 
        taskContainer.innerHTML += div
        i += 1
    })
    const btnsDelete = document.querySelectorAll(".btn-delete")
    btnsDelete.forEach(btn => {
        btn.addEventListener("click", (e) => {
            deleteTask(e.target.dataset.id)
            status = false
            id = ""
            form.reset();
            getTasks()
        })
    })
    const btnsCheck = document.querySelectorAll(".btn-checker")
    btnsCheck.forEach(btn=>{
        btn.addEventListener("click",e=>{
            tareas[e.target.dataset.id].Completar()
            status = false
            id = ""
            form.reset();
            getTasks()
        })
    })
    const btnsEdit = document.querySelectorAll(".btn-edit")
    btnsEdit.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const task = tareas[e.target.dataset.id]
            status = true
            id = e.target.dataset.id
            fecha = task.Creacion
            form["task-title"].value = task.Titulo
            form["task-description"].value = task.Descripcion
            form["task-title"].focus()
        })
    })
    
}
const enviador = async(e) => {
    e.preventDefault()
    const title = form["task-title"];
    const description = form["task-description"];
    let ahora = new Date()
    if(title.value.trim() != "" || description.value.trim() != ""){
        if (!status) tareas.push(new Tarea(title.value, description.value, ahora))
        else {
            await updateTask(id, new Tarea(title.value, description.value, fecha))
            status = false
            id = ""
            fecha = undefined
        }
        form.reset();
        title.focus();
        getTasks();
    }else alert("Estas mandando una tarea vacia salamin")
}
btnEnviar.addEventListener("click", enviador)
form.addEventListener("submit", enviador)
cancelar.addEventListener("click", e=>{
    status = false
    id = ""
    fecha= undefined;
    form.reset();
})
btnMayor.addEventListener("click", ()=>{
    let copia = tareas;
    let MayorNota = document.querySelector("#MayorNota")
    copia.sort(function(a, b) {
        return a.Tardanza - b.Tardanza;
    })
    let task= copia[0]
    if(task == null || task == undefined) MayorNota.innerHTML = `
    <div class="card text-white card-body mt-2 border-secondary bg-info d-flex justify-content-center tarea">
        <h1 class="text-center">No hay tareas completadas</h1>
    </div>`;
    if(task.Completacion == null || task.Completacion == undefined)MayorNota.innerHTML = `
    <div class="card text-white card-body mt-2 border-secondary bg-info d-flex justify-content-center tarea">
        <h1 class="text-center">No hay tareas completadas</h1>
    </div>`
    else{
        let date = task.Creacion
        let options2 = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        let desde = date.toLocaleDateString("es-ES", options2)
        let date2 = task.Completacion
        let hasta = date2.toLocaleDateString("es-ES", options2)
        MayorNota.innerHTML = `
        <div class="card text-white card-body mt-2 border-secondary bg-info d-flex justify-content-center tarea">
            <h1 class="text-center">La tarea mas rapida en completarse es:</h1>
            <h3  class="text-center">${task.Titulo}</h3>
            <p  class="wrapper">${task.Descripcion}</p>
            <p  class="text-center"> <span class="badge badge-pill bg-warning">Creado en: ${desde}</span> </p>
            <p  class="text-center"> <span class="badge badge-pill bg-danger">Completado en: ${hasta}</span> </p>
        </div>`
    }
})