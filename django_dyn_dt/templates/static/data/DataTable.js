export class DataTable {
    Perpage;
    Title;
    Data;
    element
    page;
    Modal;
    headings;

    // constructor of the DataTalbe 
    // Perpage => indicate how many items which Page should contain
    // entry => Number of Items in a page
    // Data => the Data of the table
    // headings => Columns Headers
    // current_page => a number to indicate the number of page
    //  total_pages => this is a range of the pages : String 
    // has_next => a string value that should convert to Boolean : for pagination
    // has_prev => a string value that should convert to Boolean : for pagination
    constructor(
        Perpage
        , entry
        , name
        , Data
        , headings
        , current_page
        , total_pages
        , has_next
        , has_prev
        ,isDate
    ) {
        this.Perpage = Perpage
        this.Title = name
        this.Data = Data
        this.element = document.getElementById(`data_table_${name}`);
        this.headings = headings
        this.ParentElement = `#div_data_table_${this.Title}`
        this.isDate=isDate

        localStorage.setItem(`page_${this.Title}`, current_page)

        // 
        let body = document.createElement('tbody');
        body = this.#setBody(body, Data)
        let head = document.createElement('thead');
        head = this.#setHeader(head, headings)
        let footer = document.createElement('div');
        // 
        this.#createModal()
        this.#setModelName(name, Perpage, entry, headings)
        this.element.appendChild(head)
        this.element.appendChild(body)
        this.#setFooter(footer);
        this.#setNavigation(total_pages, current_page, has_next, has_prev)

    }

    // this method creates a Modal for Add & Edit Actions
    #createModal() {
        this.Modal = document.createElement('div')
        this.Modal.id = `myModal_${this.Title}`
        this.Modal.className = 'modal'
        //  div
        const divContent = document.createElement('div')
        divContent.className = `modal-content ${this.Title}`;

        this.headings.forEach((Head,index) => {
            let Label = document.createElement('p');
            Label.id = `Modal_${this.Title}_${Head}_Label`
            Label.innerText = `${Head}`
            Label.style.fontWeight = 'bold'
            Label.style.marginBottom = 5
            divContent.appendChild(Label)
            if (Head.toLowerCase() !== 'id') {
                const NameContent = document.createElement('input');
                NameContent.type = 'text';
                NameContent.id = `Modal_${this.Title}_${Head}_Input`
                // NameContent.onkeydown = (e) => { e.key == 'Enter' ? this.addHandler() : {} }
                divContent.appendChild(NameContent)
            }
        }
        )
        // div
        const buttonsDiv = document.createElement('div')
        buttonsDiv.id = 'ButtonsDiv'
        //button
        const closeButton = document.createElement('button')
        closeButton.innerText = 'Close'
        closeButton.className = 'modal-buttons'
        closeButton.style.backgroundColor = 'crimson'
        closeButton.onclick = (e) => { this.Modal.style.display = 'None'; this.ResetModal() }

        buttonsDiv.appendChild(closeButton)

        //button
        const SendButton = document.createElement('button')
        SendButton.id = `SendButton_${this.Title}`
        SendButton.innerText = 'Add'
        SendButton.className = 'modal-buttons'
        SendButton.onclick = (e) => this.addHandler(); // Send Button handler
        buttonsDiv.appendChild(SendButton)

        divContent.appendChild(buttonsDiv)

        this.Modal.appendChild(divContent)
        this.element.appendChild(this.Modal)
    }

    #setModelName(name, PerpageItems, selected, headings) {
        // Title
        let div = document.createElement('div')
        let h3 = document.createElement('h3')
        h3.innerText = name
        div.appendChild(h3)
        // Filter Columns
        const DropDownDiv = document.createElement('div');
        DropDownDiv.className = 'dropdown'

        const Button = document.createElement('button');
        Button.innerText = 'Filter'
        Button.className = `dropbtn ${this.Title}`
        Button.onclick = (e) => document.getElementById(`dropDownList_${this.Title}`).classList.toggle('show')

        DropDownDiv.appendChild(Button)
        const Columns = document.createElement('ul')
        Columns.id = `dropDownList_${this.Title}`
        Columns.onchange = (e) => {
            this.FilterHandler(e.target.id);
        }
        Columns.className = 'dropdown-content'
        headings.forEach(eachColumn => {
            const DropLi = document.createElement('li')
            const inputCheckBox = document.createElement('input')
            inputCheckBox.type = 'checkbox'
            inputCheckBox.style.marginRight = 5
            DropLi.appendChild(inputCheckBox)
            inputCheckBox.id = `input_${eachColumn}`
            const Label = document.createElement('label')
            Label.innerText = eachColumn
            Label.style.marginLeft = 5
            DropLi.appendChild(Label)
            Columns.append(DropLi)
        })
        DropDownDiv.appendChild(Columns)

        div.appendChild(DropDownDiv)
        let Label = document.createElement('label')
        let select = document.createElement('select');
        select.onchange = (e) => { this.EntryHandler(e.target.value) }
        PerpageItems.forEach(eachItem => {
            let option = document.createElement('option')
            option.innerText = eachItem
            select.appendChild(option)
            if (eachItem == selected)
                option.selected = true
        })

        select.style.padding = 3

        Label.appendChild(select)

        let span = document.createElement('span')
        span.innerText = ' Items/Page'
        Label.appendChild(span)

        // Label.style.direction='rtl'
        div.appendChild(Label)
        div.style.display = 'flex'
        div.style.justifyContent = 'space-between'
        div.style.alignItems = 'center'
        $(this.ParentElement).prepend(div)

    }
    // set the name of columns and header of table  
    #setHeader(head, params) {
        const tr = document.createElement('tr');
        params.forEach(element => {
            const th = document.createElement('th');
            th.innerText = element
            tr.appendChild(th)
        });

        tr.style.textAlign = 'justify'
        // additional column for edit and remove 
        const th = document.createElement('th');
        tr.appendChild(th)

        head.appendChild(tr)
        head.style.borderBottom = '0.5px solid lightgrey';
        return head
    }
    // set the body of Table
    #setBody(body, Data) {

        Data.forEach((eachRow) => {
            const tr = document.createElement('tr');
            let values = []
            eachRow.forEach((eachItem) => {
                const td = document.createElement('td');
                td.innerText = eachItem
                tr.appendChild(td)
                values.push(eachItem)
            })
            const EditRemoveDiv = document.createElement('div')
            const td = document.createElement('td');
            // Edit            
            const EditButton = document.createElement('button');
            EditButton.className = 'littlebutton'
            EditButton.onclick = (e) => { this.EditHandler(values) }
            const EditIcon = document.createElement('img');
            EditIcon.className = 'littleicons'
            EditIcon.src = '/static/src/images/edit.png';

            EditButton.appendChild(EditIcon)
            EditRemoveDiv.appendChild(EditButton);

            const RemoveButton = document.createElement('button');
            RemoveButton.className = 'littlebutton'
            RemoveButton.onclick = (e) => this.RemoveHnadler(values[0])

            const RemoveIcon = document.createElement('img');
            RemoveIcon.className = 'littleicons'
            RemoveIcon.src = '/static/src/images/remove.png';

            RemoveButton.appendChild(RemoveIcon);
            EditRemoveDiv.appendChild(RemoveButton);
            EditRemoveDiv.style.display = 'flex';
            EditRemoveDiv.style.gap = '5px';
            EditRemoveDiv.style.cssText += 'justify-content: flex-end;';

            td.appendChild(EditRemoveDiv)
            tr.appendChild(td);
            body.appendChild(tr);
        })
        body.style.borderBottom = '0.5px solid lightgrey';
        return body
    }
    // create a footer for Add , Export Buttons and Search Textfield
    #setFooter(footer) {
        // add button
        const AddButton = document.createElement('button');
        AddButton.innerText = '+';
        AddButton.id = `add_button_${this.Title}`
        AddButton.className = `add-button ${this.Title}`
        AddButton.onclick = () => this.Modal.style.display = 'Block';
        footer.appendChild(AddButton);
        footer.style.display = 'flex'

        // CSV & PDF & Excel 
        const div = document.createElement('div');
        // pdf image 
        const PDFimg = document.createElement('img');
        PDFimg.src = '/static/src/images/pdf.svg';
        PDFimg.onclick = (e) => { this.ExportHandler('pdf') }

        div.appendChild(PDFimg)
        // csv image
        const CSVimg = document.createElement('img');
        CSVimg.src = '/static/src/images/csv.svg';
        CSVimg.onclick = (e) => { this.ExportHandler('csv') }

        div.appendChild(CSVimg)
        //  excel image
        const Excelimg = document.createElement('img');
        Excelimg.src = '/static/src/images/excel.svg';
        Excelimg.onclick = (e) => { this.ExportHandler('xlsx') };

        div.appendChild(Excelimg)
        div.style.display = 'flex'
        div.style.gap = '10px'
        div.style.marginLeft = 135
        footer.appendChild(div);
        // search 
        const SearchDiv = document.createElement('div')
        const input = document.createElement('input');
        input.id = 'SearchInput'
        input.style.height = 35
        input.placeholder = 'search...'
        SearchDiv.appendChild(input);

        const Searchbutton = document.createElement('button');
        Searchbutton.onclick = (e) => { this.SearchHandler() }
        const Searimg = document.createElement('img');
        Searimg.style.width = 30
        Searimg.style.height = 30
        Searimg.src = 'static/src/images/search.svg'
        Searchbutton.appendChild(Searimg)
        Searchbutton.id = 'search_button'
        Searchbutton.style.display = 'flex'
        SearchDiv.appendChild(Searchbutton)
        SearchDiv.style.display = 'flex'
        SearchDiv.style.alignItems = 'center'
        footer.appendChild(SearchDiv);

        footer.style.margin = 10;
        footer.style.justifyContent = 'space-between';
        $(this.ParentElement).append(footer)
    }

    // Creat NavBar under the footer and attach it to teh DIV container
    #setNavigation(total_pages, current_page, has_next, has_prev) {
        
        let has_pr = has_prev.toLowerCase() === 'true'
        let has_nex = has_next.toLowerCase() === 'false'

        const nav = document.createElement('nav');
        const PreviousPage = document.createElement('li');
        let button = document.createElement('button')
        button.innerText = ' « '
        button.className = 'page-link'
        if (!has_pr) {
            button.classList.toggle('disable')
        }
        else {
            button.onclick = (e) => { this.Navigatior(1) }
        }
        PreviousPage.appendChild(button)
        nav.appendChild(PreviousPage)
        // 
        let NumberOfPages = total_pages.match(/\d/g)[1]

        for (let i = 1; i < NumberOfPages; i++) {
            const Page = document.createElement('li');
            let button = document.createElement('button')
            button.innerText = i

            if (i == current_page) {
                button.className = 'page-link current'
            }
            else {
                button.className = 'page-link'
                button.onclick = (e) => { this.Navigatior(i) }
            }
            Page.appendChild(button)
            nav.appendChild(Page)

        }
        const PriorPage = document.createElement('li');
        button = document.createElement('button')
        button.innerText = ' » '
        button.className = 'page-link'
        if (!has_nex) {
            button.classList.toggle('disable')
        }
        else {
            button.onclick = (e) => { this.Navigatior(NumberOfPages - 1) }
        }
        PriorPage.appendChild(button)
        nav.appendChild(PriorPage)
        nav.className = 'Pagination-Nav'
        $(this.ParentElement).append(nav)
    }
    // this method fetch the data by using fetch method 
    async  #fetcher(url, request) {
        await fetch(url, request)
            .then(
                response => response.json()
            ).then(
                (result) => {
                    if (!result.success) {
                        console.log(result.text)
                    }
                }
            ).catch(err => console.log(err))

        this.GetNewTable()

    }
    // Navigation Handler
    Navigatior(page) {
        localStorage.setItem(`page_${this.Title}`, page);
        this.GetNewTable()
    }
    // Filter the Hide Columns for EXPORT
    FilterHandler(id) {
        let column = id.split('_')[1]
        let hideColumns = JSON.parse(localStorage.getItem(`hideColumns_${this.Title}`)) || []
        const ToggleColumn = (array, val) => array.includes(val) ? array.filter(el => el !== val) : [...array, val]
        hideColumns = ToggleColumn(hideColumns, column)
        localStorage.setItem(`hideColumns_${this.Title}`, JSON.stringify(hideColumns))
    }
    // Handler for Add Action 
    addHandler() {
        console.log(this.headings)
        const Request_body = {}
        document.querySelector(`.modal-content.${this.Title}`).childNodes.forEach(element => {
            console.log(element,element.value)
            // console.log()
            if (element.value!=undefined && element.id.toLowerCase().includes('input')) {
                let value = element.value
                let headname = element.id.split('_')[2]
                Request_body[headname] = value
            }
        })
        console.log(Request_body)
        let url = `/datatb/${this.Title}/`
        // console.log(Request_body)
        let request = {
            method: "POST",
            body: JSON.stringify(Request_body),        
        }
        this.#fetcher(url, request)
        this.Modal.style.display = 'None';
    }
    // Handler for Edit Action 
    EditHandler(values) {
        // console.log(values)
        // console.log(`SendButton_${this.Title}`)

        document.getElementById(`SendButton_${this.Title}`).innerText = 'Edit';

        document.getElementById(`SendButton_${this.Title}`).onclick = (e) => { this.SendEdit() };
        let values_heading = values.map((e, i) => [e, this.headings[i]])
        values_heading.forEach((valHea) => {
            if (valHea[1] == 'id') {
                document.getElementById(`Modal_${this.Title}_id_Label`).innerText = `ID : ${valHea[0]}`
            }
            else {
                document.getElementById(`Modal_${this.Title}_${valHea[1]}_Input`).value = valHea[0]
            }
        })

        this.Modal.style.display = 'Block';
    }
    ResetModal() {
        // let values_heading = values.map((e, i) => [e, this.headings[i]])
        this.headings.forEach((valHea) => {

            if (valHea == 'id') {
                document.getElementById(`Modal_${this.Title}_id_Label`).innerText = `ID`
            }
            else {
                document.getElementById(`Modal_${this.Title}_${valHea}_Input`).value = ''
            }
            document.getElementById(`SendButton_${this.Title}`).innerText = 'Add';
            document.getElementById(`SendButton_${this.Title}`).onclick = (e) => this.addHandler();
            this.Modal.style.display = 'None';

        })
    }
    SendEdit() {
        const Request_body = {}
        let id
        document.querySelector(`.modal-content.${this.Title}`).childNodes.forEach(element => {
            if (element.id.includes('id')) {
                id = element.innerText.split(':')[1].replace(' ', '')
                Request_body['id'] = id
            }

            if (element.value) {
                let value = element.value
                let headname = element.id.split('_')[2]
                Request_body[headname] = value
            }
        })
        // console.log(Request_body)
        let url = `/datatb/${this.Title}/${id}/`
        let request = {
            method: "PUT",
            body: JSON.stringify(Request_body),
        }
        this.ResetModal();
        this.#fetcher(url, request)
        // this.GetNewTable()
    }
    // Export the Table with the given Type Format
    ExportHandler(type) {
        const searchParam = sessionStorage.getItem(`searchValue_${this.Title}`) || ''
        const hiddenColumns = localStorage.getItem(`hideColumns_${this.Title}`)
        let url = `/datatb/${this.Title}/export/`
        let request = {
            method: 'POST',
            body: JSON.stringify({
                search: searchParam,
                hidden_cols: hiddenColumns,
                type: type === 'excel' ? 'xlsx' : type

            })

        }
        fetch(url, request)
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
            });

        localStorage.clear()
    }

    //  Remove a row
    RemoveHnadler(id) {
        let url = `/datatb/${this.Title}/${id}/`
        let request = {
            method: "DELETE",
        }
        this.#fetcher(url, request);
        // this.GetNewTable()
    }

    ClearStorage() {
        let re = new RegExp(`${this.Title}$.*`)
        let arr = []; // Array to hold the keys
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).match(re)) {
                arr.push(localStorage.key(i));
            }

        }
        // Iterate over arr and remove the items by key
        for (let i = 0; i < arr.length; i++) {
            localStorage.removeItem(arr[i]);
        }
    }
    // this method Get the new Table from Server and replace it with old one
    async GetNewTable() {
        const search = localStorage.getItem(`searchValue_${this.Title}`) || '';
        const perpage = sessionStorage.getItem(`entries_${this.Title}`) || 10;
        const page = localStorage.getItem(`page_${this.Title}`) || 1;
        const searchParams = new URLSearchParams({
            search: search,
            entries: perpage,
            page: page
        })

        this.ClearStorage()
        await fetch(`/datatb/${this.Title}?${searchParams}`, {
            method: 'GET'
        }).then(
            (response) => response
        ).then(
            (result) => result.text()
        ).then(
            (data) => {
                $(this.ParentElement).html(data)
            }
        )
    }

    //  save the Search value 
    SearchHandler() {
        const searchValue = document.getElementById('SearchInput').value
        sessionStorage.setItem(`searchValue_${this.Title}`, searchValue)
        localStorage.setItem(`searchValue_${this.Title}`, searchValue)
        this.GetNewTable()
    }

    //  save the choosen Entry value 
    EntryHandler(entry) {
        localStorage.setItem(`entries_${this.Title}`, entry)
        sessionStorage.setItem(`entries_${this.Title}`, entry)
        // localStorage.setItem(`entries`, entry)
        // sessionStorage.setItem(`entries`, entry)
        this.GetNewTable()

    }

}
