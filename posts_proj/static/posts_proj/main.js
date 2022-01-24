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
const homeUrl = window.location.href


//!Ajax csrftoken
const getCookie = (name) => {
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

//!Like and Unlike with Ajax
const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(el=>{
        el.addEventListener('submit',e=>{
            e.preventDefault()
            const clickedId = e.target.getAttribute('data-form-id')
            const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)


            $.ajax({
                type: 'POST',
                url : '/like-unlike/',
                data : {
                    'csrfmiddlewaretoken':csrftoken,
                    'pk':clickedId
                },
                success:function(response){
                    console.log('Success ', response)
                    clickedBtn.textContent = response.likedBtn ? `Unlike ${response.count}` : `Like : ${response.count}`
                },
                error:function(err){
                    console.log('Error',err)
                }
            })
        })
    })
}


//!Post GET with Ajax
let visible = 3

const getData = () =>{
    $.ajax({
        type:'GET',
        url:`/data/${visible}/`,
        success:function(response) {            
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
            if(response.size === 0){
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
    spinnerBox.classList.remove('d-none')
    visible += 3
    getData()
})
getData()


modelFooter.addEventListener('submit',e => {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url : '',
        data : {
            'csrfmiddlewaretoken':csrf[0].value,
            'title':crispyTitle.value,
            'body':crispyBody.value
        },
        success : function(response){
            console.log('Succesee Post Request ', response)
            postsBox.insertAdjacentHTML('afterbegin',
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
            $('#addPostModal').modal('hide')
            handleAlerts('success','New Post Added')
            modelFooter.reset()
        },
        error : function(err){
            handleAlerts('danger','Something went wrong')
        }

    })
})