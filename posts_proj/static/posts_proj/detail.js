//!Gonderilen ID li seyfenin detailini gosterir

console.log('Detail Seyfesinden reaksiya verirem')

const postBox = document.getElementById('post-box-detail')
const backBtn = document.getElementById('back-btn')
const alertBox = document.getElementById('alert-box')
const spinnerBox = document.getElementById('spinner-box')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

//*Crispy formdan gelen inputlar
const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')//bunlar crispy formlara aiddir 

//*Update ve Delete formuna aid olanlar
const updateUrl = window.location.href + "update/"
const deleleUrl = window.location.href + "delete/"

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')


//?Js ile ozunden evvelki url getmek isteyirsense onda history.back() den istifade et

backBtn.addEventListener('click',() => {
    history.back()//yeni evvelki seyfeye qayit hansisa girmisense,history.back() vasitesile
})

//ele window.location.href yazsam oldugum hemin id li seyfeni gosterecek
// console.log(window.location.href)

//!Ajax Js GET request yeni data cekirem
console.log(window.location.href)


$.ajax({
    type: 'GET',
    url : `${window.location.href}data/`,
    success : function(response){
        const data = response.data
        spinnerBox.classList.add('d-none')

        if(data.logged_in !== data.author){
            console.log('Different')
        }
        else{//yeni postu yazan insan giris eden istifadeciye beraberdirse eger
            updateBtn.classList.remove('d-none')
            deleteBtn.classList.remove('d-none')
        }

        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class','mt-3')
        titleEl.setAttribute('id','title')
        titleEl.textContent = data.title
        titleInput.value = data.title

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class','mt-1')
        bodyEl.setAttribute('id','body')
        bodyEl.textContent = data.body
        bodyInput.value = data.body

        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)

    },
    error : function(err){
        console.log('Some Error Response ', err)
    }
})


updateForm.addEventListener('submit',e => {
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type:'POST',
        url : updateUrl,
        data:{
            //yeni inputdan giren deyerleri alirig
            'csrfmiddlewaretoken':csrf[0].value,
            'title':titleInput.value,
            'body':bodyInput.value
        },
        success : function(response){
            // console.log('Update Response', response)
            handleAlerts('success','Post Has Been Updated')
            title.textContent = response.title
            body.textContent = response.body
        },
        error : function(err){
            console.log('Error Update',err)
        }
    })
})


deleteForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type:'POST',
        url:deleleUrl,
        data:{
            'csrfmiddlewaretoken':csrf[0].value
        },
        success : function(response){
            window.location.href = window.location.origin
            localStorage.setItem('title',titleInput.value)
        },
        error : function(err){
            console.log(err)
        }
    })
})

const deleted = localStorage.getItem('title')
if(deleted){
    localStorage.clear()
}

