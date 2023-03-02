import { modelName, myData } from "../../data/index.js";
import { formConstructor, formTypes } from "../form/index.js";

const editBtn = `<i class="btn-outline-primary edit bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>`
const removeBtn = `<i class="btn-outline-danger remove bi bi-eraser"></i>`

const toastLive = document.getElementById('liveToast')
const toast = new bootstrap.Toast(toastLive)
// div_datatb_{{ model_name }}
const GetNewData = async (urlpath, datatablename) => {
    // TRY to get the new HTML
    fetch(urlpath, {
        method: 'GET'
    }).then(
        (response) => response
    ).then(
        (result) => result.text()
    ).then(
        (data) => $(`#data_table`).html(data)
    )
}


const setToastBody = (text, type) => {
    document.querySelector('.toast-body').innerHTML = text

    toastLive.className = type === 'success'
        ?
        toastLive.className.replace(/bg-.+/, 'bg-success')
        :
        toastLive.className.replace(/bg-.+/, 'bg-danger')

}

// Add Button + Events
export const addController = (formType) => {

    const myModalEl = document.getElementById('exampleModal');
    const modal = new bootstrap.Modal(myModalEl, {})

    const addContainer = document.createElement('div')

    const addBtn = document.createElement('button')
    addBtn.className = 'btn btn-primary mx-1'
    addBtn.textContent = '+'
    addBtn.id = 'add'

    addContainer.appendChild(addBtn)
    let datatb = getCurrentDataTable()
    datatb.querySelector('.dropdown').insertBefore(addContainer,
        datatb.querySelector('#dropdownMenuButton1')
    )

    addBtn.addEventListener('click', (e) => {
        formType = formTypes.ADD
        formConstructor(formTypes.ADD)
        modal.show()
    })
}

async function search_action(dataTable) {
    let datatb = getCurrentDataTable()
    const searchValue = datatb.querySelector('#search').value

    const Re = /(.*)_/
    let ModelName = dataTable.table.id.replace(Re, '');
    const urlpath = `/datatb/${ModelName}`
    const base = window.location.origin
    const searchParams = new URLSearchParams({
        search: searchValue
    })

    const url = new URL(`${base}${urlpath}?${searchParams}`)
    // console.log(url.href)
    await fetch(url, {
        method: 'GET',
    }).then(
        (response) => response
    ).then(
        (result) => {
            if (result.status == 200) {
                GetNewData(url, ModelName)
            }
            else {
                console.log(result.text())
            }

        }
    )
}

// Search Box + Events
export const search = (dataTable) => {

    const searchContainer = document.createElement('div')
    searchContainer.className = 'd-flex'
    searchContainer.id = 'search-container'
    const searchInput = document.createElement('input')
    searchInput.className = 'form-control mx-1'
    searchInput.setAttribute('placeholder', 'search...')
    searchInput.setAttribute('id', 'search')
    searchInput.setAttribute('type', 'text')
    searchInput.setAttribute('style', 'width:auto;')

    const searchBtn = document.createElement('button')
    searchBtn.className = 'btn btn-primary'
    searchBtn.setAttribute('id', 'search-btn')
    searchBtn.innerHTML = '<i class="bi bi-search"></i>'

    searchContainer.appendChild(searchInput)
    searchContainer.appendChild(searchBtn)

    let datatb = getCurrentDataTable()
    datatb.querySelector('.dataTable-top').appendChild(searchContainer)

    // Trigger Search on ENTER
    datatb.querySelector('#search').addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            search_action(dataTable);
        }
    })

    // Trigger Search on Button Click
    datatb.querySelector('#search-btn').addEventListener('click', () => {
        search_action(dataTable);
    })
}

// Unused 
export const middleContainer = (dataTable) => {

    const middleContainer = document.createElement('div')
    middleContainer.className = 'd-flex'
    middleContainer.id = 'middle-container'

    const span = document.createElement('span')
    span.className = 'mx-1'
    span.id = 'span1'
    span.textContent = 'Dummy'

    middleContainer.appendChild(span)

    let datatb = getCurrentDataTable()
    datatb.querySelector('.dataTable-top').insertBefore(middleContainer, datatb.querySelector('#search-container'));
}

// Filter Combo (layout + Events)
export const columnsManage = (dataTable) => {

    const dropDown = document.createElement('div')
    dropDown.className = 'dropdown d-flex'
    dropDown.id = 'filter-container'

    const button = document.createElement('button')
    button.className = 'btn dropdown-toggle'
    button.id = 'dropdownMenuButton1' + '_' + modelName
    button.setAttribute('data-bs-toggle', 'dropdown')
    button.textContent = 'Filter'

    dropDown.appendChild(button)

    const ul = document.createElement('ul')
    ul.className = 'dropdown-menu'

    myData.headings.forEach((d, i) => {

        const li = document.createElement('li')
        li.className = 'dropdown-item'

        const check = document.createElement('input')
        check.className = 'form-check-input'
        check.id = d
        check.setAttribute('type', 'checkbox')

        const label = document.createElement('label')
        label.className = 'form-check-label mx-1'
        label.textContent = d

        li.appendChild(check)
        li.appendChild(label)

        ul.appendChild(li)
    })

    dropDown.appendChild(ul)
    let datatb = getCurrentDataTable()
    datatb.querySelector('.dataTable-top').insertBefore(dropDown, datatb.querySelector('#search-container'));

    dropDown.addEventListener('change', (e) => {
        if (e.target.nodeName === 'INPUT') {

            const id = myData.headings.indexOf(e.target.closest('input').id)
            if (e.target.closest('input').checked) {
                dataTable.columns().hide([parseInt(id)])
                const hideColumns = JSON.parse(localStorage.getItem('hideColumns')) || []
                localStorage.setItem('hideColumns', JSON.stringify([...hideColumns, e.target.closest('input').id]))
            } else {
                dataTable.columns().show([parseInt(id)])
                const hideColumns = JSON.parse(localStorage.getItem('hideColumns')) || []
                localStorage.setItem('hideColumns', JSON.stringify(hideColumns.filter(d => d !== e.target.closest('input').id)))
            }

        }
    })
}

// Export layout
export const exportController = (dataTable) => {

    const exportContainer = document.createElement('div')
    exportContainer.id = 'export-container'
    exportContainer.className = 'mx-1'

    const pdfImg = document.createElement('img')
    pdfImg.setAttribute('src', "/static/src/images/pdf.svg")
    pdfImg.id = 'pdf'

    const csvImg = document.createElement('img')
    csvImg.setAttribute('src', "/static/src/images/csv.svg")
    csvImg.id = 'csv'

    /*
    const excelImg = document.createElement('img')
    excelImg.setAttribute('src',"/static/src/images/excel.svg")
    excelImg.id = 'excel'
    */

    exportContainer.addEventListener('click', (e) => {
        // console.log(e)
        if (e.target.nodeName === 'IMG') {
            const Re = /(.*)_/
            let ModelName = dataTable.table.id.replace(Re, '');
            exportData(dataTable, e.target.id, ModelName)
        }
    })

    exportContainer.appendChild(pdfImg)
    exportContainer.appendChild(csvImg)

    //exportContainer.appendChild(excelImg)
    let datatb = getCurrentDataTable()
    datatb.querySelector('.dropdown').insertBefore(exportContainer,
        datatb.querySelector('#dropdownMenuButton1')
    )

    //document.querySelector('.dropdown').appendChild(exportContainer);
}

// Action: Export
export const exportData = (dataTable, type, toRequestModelName) => {
    const searchParam = new URLSearchParams(window.location.search).get('search') || ''
    // const hiddenColumns = myData.headings.filter((d, i) => {
    //     !dataTable.columns.visible(i)
    // })
    const hiddenColumns = []
    fetch(`/datatb/${toRequestModelName}/export/`, {
        method: 'POST',
        body: JSON.stringify({
            search: searchParam,
            hidden_cols: hiddenColumns,
            type: type === 'excel' ? 'xlsx' : type
        })
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) })
            } else {
                return response.json()
            }
        })
        .then((result) => {
            let a = document.createElement("a");
            a.href = `data:application/${result.file_format};base64,${result.content}`
            a.download = `data-table.${result.file_format === 'excel' ? 'xlsx' : result.file_format}`
            a.click();
        })
        .catch((err) => {
            console.log(err.toString())
        })
}

export const addRow = async (dataTable, item, toRequestModelName) => {
    const myModalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(myModalEl)
    delete item.id

    // server
    await fetch(`/datatb/${toRequestModelName}/`, {
        method: "POST",
        body: JSON.stringify(item),
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) })
            } else {
                return response.json()
            }
        })
        .then((result) => {
            if (result.success == true) {
                const alert = document.querySelector('.alert')
                alert.className = alert.className.replace('d-block', 'd-none')

                // let divs = document.querySelectorAll('.modal-backdrop.fade.show')
                // divs.forEach((div) => div.remove())

                setTimeout(GetNewData(`/datatb/${toRequestModelName}`, toRequestModelName), 2000)
            }
            else {
                console.log(result.text())
            }
            modal.hide();
        }).then(
    )
        .catch((err) => {
            const alert = document.querySelector('.alert')
            alert.textContent = JSON.parse(err.toString().replace('Error: ', '')).detail
            alert.className = alert.className.replace('d-none', 'd-block')
        })


}

export const editRow = (dataTable, item, toRequestModelName) => {

    const id = item.id
    // delete item.id

    // server
    fetch(`/datatb/${toRequestModelName}/${id}/`, {
        method: "PUT",
        body: JSON.stringify(item),
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) })
            } else {
                // const myModalEl = document.getElementById('exampleModal');
                // const modal = new bootstrap.Modal(myModalEl, {})
                // modal.close()
                return response.json()
            }
        })
        .then((result) => {
            if (result.success == true) {
                const alert = document.querySelector('.alert')
                alert.className = alert.className.replace('d-block', 'd-none')

                // let divs = document.querySelectorAll('.modal.fade')
                // divs.forEach((div) => div.remove())

                // divs = document.querySelectorAll('.modal-backdrop.fade.show')
                // divs.forEach((div) => div.remove())

                setTimeout(GetNewData(`/datatb/${toRequestModelName}`, toRequestModelName), 2000)
            }
            else {
                console.log(result.text)
            }


        }).then(

    )
        .catch((err) => {
            const alert = document.querySelector('.alert')
            alert.textContent = JSON.parse(err.toString().replace('Error: ', '')).detail
            alert.className = alert.className.replace('d-none', 'd-block')
        })
}

export const removeRow = (dataTable, item, toRequestModelName) => {

    const id = dataTable.data[item].cells[0].data
    // console.log(document.getElementById(`div_datatb_${toRequestModelName}`))
    // server
    fetch(`/datatb/${toRequestModelName}/${id}/`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) })
            } else {
                return response.json()
            }
        })
        .then((result) => {

            if (result.success == true) {
                GetNewData(`/datatb/${toRequestModelName}`, toRequestModelName)
                setToastBody(result.message, 'success')
                toast.show()
            }
            else {
                console.log(result.text())
            }

        })
        .catch((err) => {
            setToastBody(JSON.parse(err.toString().replace('Error: ', '')).detail, 'fail')
            toast.show()
        })

}

export const getCurrentDataTable = () => {
    return document.querySelector('#div_datatb_' + modelName)
}