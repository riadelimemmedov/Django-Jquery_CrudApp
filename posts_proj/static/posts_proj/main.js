//!POST_PROK fayli icinde main.js
//?Yadda saxla bir defelikki,bir js faylinda istediyin qeder isteyin bir url e ayri ayrligda AJAX yaza bilersen

console.log('Main Page');

// const helloWorldBox = document.getElementById('hello-world')
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const endBox = document.getElementById('end-box')
const loadBtn = document.getElementById('load-btn')

const modelFooter = document.getElementById('model-footer')
const crispyTitle = document.getElementById('id_title')
const crispyBody = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const alertBox = document.getElementById('alert-box')
const homeUrl = window.location.href//yeni oldugum seyfedeki url i mene geri donder,window.location.url vasitesile
// console.log(`${homeUrl}2`)

//!Ana Seyfe Ajax

// $.ajax({
//     type: 'GET',
//     url : '/hello-world/',
//     success : function(response) {
//         helloWorldBox.textContent = `${response.text}`
//     },
//     error : function(err){
//         console.log('Error', err)
//     }
// })


//!Ajax csrftoke
const getCookie = (name) => {//js de funksiyalari deyisken kimi tanimlamag mumkundur
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(el=>{//yeni formlari alirig ve forEach ile gezirik icinde bir-bir
        el.addEventListener('submit',e=>{//submit form taginin ozune yazilir ele
            e.preventDefault()
            const clickedId = e.target.getAttribute('data-form-id')//yeni form tagi icinde tiklanan yerlerden data-form-id olan html attributena get,ele bilki her forma ayri bir id verdik
            const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)


            $.ajax({
                type: 'POST',
                url : '/like-unlike/',
                data : {
                    'csrfmiddlewaretoken':csrftoken,
                    'pk':clickedId
                },
                success:function(response){
                    console.log('Ugurlu ', response)
                    clickedBtn.textContent = response.likedBtn ? `Unlike ${response.count}` : `Like : ${response.count}`// Js de ? if,: else bildirir
                },
                error:function(err){
                    console.log('Error',err)
                }
            })
        })
    })
}


//!Postlari Cekmek Ucun Yazilan Ajax
let visible = 3//buna bir buton yazaciyig her butona basanda bunun deyeri deyisecek,yeni baslangicda ilk 3 postu gostermek ucun biz visibleye 3 verdik her butona abasanda bu += 3 artacag ve post un id si kimi viewa gonderilecek

const getData = () =>{
    $.ajax({
        type:'GET',
        url:`/data/${visible}/`,
        success:function(response) {
            //responseden donnen deyer JSON oldugu ucun onu JSON.parse ile cevir ,eger post atirsansa onda json.strintgyden istifade et
            // const data = JSON.parse(response.data)
            // console.log(data)
            
            //?Ikinci Bir Yol
            const data = response.data
            setTimeout(()=>{
            data.forEach(el => {
                postsBox.innerHTML += `
                <div class="card mb-4">
                
                    <div class="card-body">
                        <h5 class="card-title">${el.title}</h5>
                        <p class="card-text">${el.body}</p>
                    </div>
                    
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${homeUrl}${el.id}" class="btn btn-dark">Details</a>
                            </div>

                            <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${el.id}">
                                    <button class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.like_count})` : `Like (${el.like_count})`}</button>
                                </form>
                            </div>
                        
                        </div>
                    </div>
    
                </div>
                `
                likeUnlikePosts()
                spinnerBox.classList.add('d-none')
            })
            },500)
            // console.log(response.size)
            if(response.size === 0){//eger post yoxdursa
                endBox.textContent = 'No Posts Added Yet...'
            }
            else if(response.size <= visible){
                endBox.textContent = 'No More Post To Load...'
            }
        },
        error : function(err){
            console.log(err)
        }
    })
}

loadBtn.addEventListener('click',()=>{
    loadBtn.classList.add('shadow')
    spinnerBox.classList.remove('d-none')//yeni click olanda spinner box gorunen olsun
    visible += 3
    getData()
})

//ve sonra yeniden funksiyani cagirmag lazim olur
getData()


modelFooter.addEventListener('submit',e => {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url : '',//localhost http://127.0.0.1:8000/ bu url di deye '' formadada yazilsa olar
        data : {
            'csrfmiddlewaretoken':csrf[0].value,
            'title':crispyTitle.value,
            'body':crispyBody.value
        },
        success : function(response){
            console.log('Succesee Post Request ', response)
            //yeni postBoxda 2 defe innerHtml in tekrarlanmasinin qarsini qalmag ucun bele yazildi
            postsBox.insertAdjacentHTML('afterbegin',//yeni diger postlarin davami ile elave edecek POST reqeust atilan POST ile GET requestden gelen postlari birlesdidrir
            `
            <div class="card mb-4">
            
                <div class="card-body">
                    <h5 class="card-title">${response.title}</h5>
                    <p class="card-text">${response.body}</p>
                </div>
                
                <div class="card-footer">
                    <div class="row">
                        <div class="col-2">
                            <a href="#" class="btn btn-dark">Details</a>
                        </div>

                        <div class="col-2">
                            <form class="like-unlike-forms" data-form-id="${response.id}">
                                <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            `
            )
            likeUnlikePosts()
            //eger modali gizletmek isteyirnsese boostrap icindeki jquery kodlarini istifade ede bilersen
            $('#addPostModal').modal('hide')
            handleAlerts('success','New Post Added')
            //!formu sifirlamag ucun yazilan formu tapib .reset() funksiyani istifade etmek lazimdir
            modelFooter.reset()//reset() vasitesile formu sifirlayirig ele bil
        },
        error : function(err){
            handleAlerts('danger','Something went wrong')
        }

    })
})