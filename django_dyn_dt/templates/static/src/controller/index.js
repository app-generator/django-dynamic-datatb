import { modelName, myData } from "../../data/index.js";
import { formConstructor, formTypes } from "../form/index.js";

const toastLive = document.getElementById('liveToast')
const toast = new bootstrap.Toast(toastLive)
function functionSaveentry(entry){
    localStorage.setItem('entries',entry)
}

const ClearModals = (datatablename) => {

    let modaldiv = document.querySelectorAll('.modal.fade.show')
    let backdiv = document.querySelectorAll('.modal-backdrop.fade.show')
    let elements = document.querySelectorAll(`#div_datatb_${datatablename}`)
    console.log(
        $(`#div_datatb_${datatablename}`).unbind('click')
    )
    elements.forEach(Eachelement => { Eachelement.replaceWith(Eachelement.cloneNode(true)); })
    if (backdiv) {
        backdiv.forEach((eachdiv) => { eachdiv.remove() })
        modaldiv.forEach((eachdiv, i) => { eachdiv.remove() })
    }
}

export const GetNewData = async (datatablename) => {
    const search=localStorage.getItem('searchValue') || '';
    const perpage=localStorage.getItem('entries') || 10;
     
    const searchParams = new URLSearchParams({
        search: search,
        entries:perpage
    })

    localStorage.clear()
    ClearModals(datatablename)
    await fetch(`/datatb/${datatablename}?${searchParams}`, {
        method: 'GET'
    }).then(
        (response) => response
    ).then(
        (result) => result.text()
    ).then(
        (data) => {
            // console.log(data)
            $(`#div_datatb_${datatablename}`).html(data)
        }
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
    // window.alert('zarp')
    const myModalEl = document.getElementById('exampleModal');
    const modal = new bootstrap.Modal(myModalEl, {})

    const addContainer = document.createElement('div')

    const addBtn = document.createElement('button')
    addBtn.className = 'btn btn-primary mx-1'
    addBtn.textContent = '+'
    addBtn.id = 'add'

    addBtn.onclick = null;


    addContainer.appendChild(addBtn)
    let datatb = getCurrentDataTable()
    datatb.querySelector('.dropdown').insertBefore(addContainer,
        datatb.querySelector('#dropdownMenuButton1')
    )

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        formType = formTypes.ADD
        formConstructor(formTypes.ADD)
        modal.show()
    })
}

async function search_action(dataTable) {

    let datatb = getCurrentDataTable()
    const searchValue = datatb.querySelector('#search').value
    localStorage.setItem('searchValue', searchValue)
    const Re = /(.*)_/
    let ModelName = dataTable.table.id.replace(Re, '');
    // const urlpath = `/datatb/${ModelName}`
    // const base = window.location.origin
    // const searchParams = new URLSearchParams({
    //     search: searchValue
    // })

    // const url = new URL(`${base}${urlpath}?${searchParams}`)
    // const fecthfun = async () => {
    //     await fetch(url, {
    //         method: 'GET',
    //     }).then(
    //         (response) => response
    //     )
    // }
    // fecthfun()
    // GetNewData(url, ModelName)
    functionSaveentry(dataTable.options.perPage)
    GetNewData(ModelName)
}

// Search Box + Events
export const search = (dataTable, submit) => {
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
        // event.stopPropagation()
        if (event.key === "Enter") {
            search_action(dataTable);
        }
    })

    // Trigger Search on Button Click
    datatb.querySelector('#search-btn').addEventListener('click', () => {
        search_action(dataTable);
    })
    document.removeEventListener('submit', submit);
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
        // e.stopPropagation()
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
export const exportController = (dataTable, submit) => {

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
        // e.stopPropagation();
        if (e.target.nodeName === 'IMG') {
            const Re = /(.*)_/
            let ModelName = dataTable.table.id.replace(Re, '');
            exportData(dataTable, e.target.id, ModelName);
            document.removeEventListener('submit', submit);
        }
    })

    exportContainer.appendChild(pdfImg)
    exportContainer.appendChild(csvImg)

    //exportContainer.appendChild(excelImg)
    let datatb = getCurrentDataTable()
    datatb.querySelector('.dropdown').insertBefore(exportContainer,
        datatb.querySelector('#dropdownMenuButton1')
    )

}

// Action: Export
export const exportData = (dataTable, type, toRequestModelName) => {
    functionSaveentry(dataTable.options.perPage)
    const searchParam = localStorage.getItem('searchValue') || ''
    const hiddenColumns = localStorage.getItem('hideColumns')
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
        localStorage.clear()
}


export const addRow = (dataTable, item, toRequestModelName) => {
    functionSaveentry(dataTable.options.perPage)
    delete item.id
    const fetchfun = async () => {
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
            .catch((err) => {
                const alert = document.querySelector('.alert')
                alert.textContent = JSON.parse(err.toString().replace('Error: ', '')).detail
                alert.className = alert.className.replace('d-none', 'd-block')
            })
    }
    fetchfun()

    GetNewData(toRequestModelName)
}

export const editRow = (dataTable, item, toRequestModelName) => {
    functionSaveentry(dataTable.options.perPage)
    // console.log(dataTable.data)

    const id = item.id

    const fetchfun = async () => {
        await fetch(`/datatb/${toRequestModelName}/${id}/`, {
            method: "PUT",
            body: JSON.stringify(item),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) })
                } else {

                    return response.json()
                }
            })
            .catch((err) => {
                const alert = document.querySelector('.alert')
                alert.textContent = JSON.parse(err.toString().replace('Error: ', '')).detail
                alert.className = alert.className.replace('d-none', 'd-block')
            })
    }
    fetchfun()

    // GetNewData(`/datatb/${toRequestModelName}`, toRequestModelName)
    GetNewData(toRequestModelName)
}


export const removeRow = (dataTable, item, toRequestModelName) => {
    functionSaveentry(dataTable.options.perPage)
    const id = dataTable.data[item].cells[0].data
    const fetchfun = async () => {
        await fetch(`/datatb/${toRequestModelName}/${id}/`, {
            method: "DELETE",
        }).then((response) => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) })
            } else {
                return response.json()
            }
        })
            .then((result) => {

                if (result.success == true) {
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
    fetchfun()
    // GetNewData(`/datatb/${toRequestModelName}`, toRequestModelName)
    GetNewData(toRequestModelName)
}

export const getCurrentDataTable = () => {
    return document.querySelector('#div_datatb_' + modelName)
}