
export class DataTable {
    Perpage;
    Title;
    Data;
    element
    constructor(Perpage, selected, name, Data, headings) {
        this.Perpage = Perpage
        this.Title = name
        this.Data = Data
        this.element = document.getElementById('my_data_table');
        // 
        let body = document.createElement('tbody');
        body = this.#setBody(body, Data)
        let head = document.createElement('thead');
        head = this.#setHeader(head, headings)
        let footer = document.createElement('div');
        // 
        this.#setModelName(name, Perpage, selected)
        this.element.appendChild(head)
        this.element.appendChild(body)
        this.#setFooter(footer);
        // this.element.appendChild(footer)
    }
    // set the Table Title & the Per Page selector
    #setModelName(name, PerpageItems, selected) {
        let div = document.createElement('div')
        let h3 = document.createElement('h3')
        h3.innerText = name
        div.appendChild(h3)
        let Label = document.createElement('label')

        let select = document.createElement('select');
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
        $('#my_div_data_table').prepend(div)

    }
    // set the name of columns and header of table  
    #setHeader(head, params) {
        const tr = document.createElement('tr');
        params.forEach(element => {
            const th = document.createElement('th');
            th.innerText = element
            tr.appendChild(th)
        });
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
            eachRow.forEach((eachItem) => {
                const td = document.createElement('td');
                td.innerText = eachItem
                tr.appendChild(td)
            })
            // edit & remove buttons div
            const EditRemoveDiv = document.createElement('div')
            const td = document.createElement('td');
           // Edit            
            const EditButton = document.createElement('button');
            EditButton.className='littlebutton'
            
            const EditIcon = document.createElement('img'); 
            EditIcon.className='littleicons'
            EditIcon.src ='/static/src/images/edit.png'; 

            EditButton.appendChild(EditIcon)
            EditRemoveDiv.appendChild(EditButton);

            const RemoveButton = document.createElement('button');
            RemoveButton.className='littlebutton'
            
            const RemoveIcon = document.createElement('img'); 
            RemoveIcon.className='littleicons'
            RemoveIcon.src ='/static/src/images/remove.png'; 

            RemoveButton.appendChild(RemoveIcon)
            EditRemoveDiv.appendChild(RemoveButton);
            
            td.appendChild(EditRemoveDiv)
            tr.appendChild(td);
            body.appendChild(tr);
        })
        body.style.borderBottom = '0.5px solid lightgrey';
        return body
    }
    #setFooter(footer) {
        // add button
        const AddButton = document.createElement('button');
        AddButton.innerText = '+';
        AddButton.id = 'add_button'
        footer.appendChild(AddButton);
        footer.style.display = 'flex'

        // CSV & PDF & Excel 
        const div = document.createElement('div');
        // pdf image 
        const PDFimg = document.createElement('img');
        PDFimg.src = '/static/src/images/pdf.svg';
        div.appendChild(PDFimg)
        // csv image
        const CSVimg = document.createElement('img');
        CSVimg.src = '/static/src/images/csv.svg';
        div.appendChild(CSVimg)
        //  excel image
        const Excelimg = document.createElement('img');
        Excelimg.src = '/static/src/images/excel.svg';
        div.appendChild(Excelimg)
        div.style.display = 'flex'
        div.style.gap = '10px'
        footer.appendChild(div);
        // search 
        const SearchDiv = document.createElement('div')
        const input = document.createElement('input');
        input.style.height = 35
        input.placeholder = 'search...'
        SearchDiv.appendChild(input);

        const Searchbutton = document.createElement('button');
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
        $('#my_div_data_table').append(footer)
    }


}