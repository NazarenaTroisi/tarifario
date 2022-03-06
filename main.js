'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('Cliente').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
        const client = {
            Fecha_inicio: document.getElementById('Fecha inicio').value,
            Fecha_fin: document.getElementById('Fecha fin').value,
            Cliente: document.getElementById('Cliente').value,
            Origen: document.getElementById('Origen').value,
            Destino: document.getElementById('Destino').value,
            Tarifario: document.getElementById('Tarifario').value,
            KM: document.getElementById('KM').value,
            Precio_KM: document.getElementById('Precio_KM').value,
            Tarifa: document.getElementById('Tarifa').value
        }
        const index = document.getElementById('Cliente').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.Fecha_inicio}</td>
        <td>${client.Fecha_fin}</td>
        <td>${client.Cliente}</td>
        <td>${client.Origen}</td>
        <td>${client.Destino}</td>
        <td>${client.Tarifario}</td>
        <td>${client.KM}</td>
        <td>${client.Precio_KM}</td>
        <td>${client.Tarifa}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('Fecha inicio').value = client.Fecha_inicio
    document.getElementById('Fecha fin').value = client.Fecha_fin
    document.getElementById('Cliente').value = client.Cliente
    document.getElementById('Origen').value = client.Origen
    document.getElementById('Destino').value = client.Destino
    document.getElementById('Tarifario').value = client.Tarifario
    document.getElementById('KM').value = client.KM
    document.getElementById('Precio_KM').value = client.Precio*KM
    document.getElementById('Tarifa').value = client.Tarifa
    document.getElementById('Cliente').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.Cliente}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
