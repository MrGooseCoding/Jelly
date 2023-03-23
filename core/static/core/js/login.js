$(document).ready(()=>{
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    $('#LoginForm').submit(function(e) {
        e.preventDefault()
        $.post('/api/account/login/', {username: e.target.username.value, password: e.target.password.value, csrfmiddlewaretoken:csrftoken,}, 
            (data)=>{
                document.cookie = `userToken=${data['token']}; domain=${window.location.host};path=/;`
                document.getElementById('LoginForm').submit()
            }
            )
    })
})