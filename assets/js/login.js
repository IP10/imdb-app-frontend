$(function () {
    let BASE_URL = 'https://sample-imdb.herokuapp.com/api/';
    function setKey(key, value) {
        localStorage.setItem(key, btoa(value));
    }
    function getKey(key, value) {
        return atob(localStorage.getItem(key));
    }
    $("form[name='login-form']").validate({
        // Specify validation rules
        rules: {
            username: {
                required: true,
                minlength: 5,
                maxlength: 15
            },

            password: {
                required: true,
                minlength: 5,
                maxlength: 15
            }
        },
        // Specify validation error messages
        messages: {
            username: {
                required: "Please enter your username",
                minlength: "Username must be at least 5 characters long",
                maxlength: "Username must be atmost 15 characters long"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long",
                maxlength: "Username must be atmost 15 characters long"
            },
        },
        // submitHandler: function(form){
        //   console.log(form.username.value);
        //   console.log(form.password.value);
        //   console.log(form.validate());
        // }
    });
    function convertArrToObject(arr) {
        var obj = new Object();
        // console.log(arr);
        for (data in arr) {
            obj[arr[data]['name']] = arr[data]['value'];
        }
        return obj;
    }
    $("#login-form").submit(function (e) {

        e.preventDefault();
        var form = $(this);
        if (form.valid()) {
            var form_data = new FormData(this);
            var arr = form.serializeArray();
            var req_data = convertArrToObject(arr);
            // console.log(req_data);
            req_data['password'] = btoa(req_data['password']);
            // console.log(req_data);
            var url = BASE_URL + 'users/login/';
            // console.log(url);
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(req_data),
                processData: false,
                success: function (data, textStatus, jQxhr) {
                    console.log("response", data);
                    form.trigger("reset");
                    loginSuccess(data);
                },
                error: function (data, textStatus, errorThrown) {
                    console.log("error", data.responseJSON.message);
                    alert(data.responseJSON.message);
                }
            });
            // console.log('finally!');
        }

    });
    function loginSuccess(data) {
        // console.log(data.result.token)
        setKey("token", JSON.stringify(data.result.token));
        setKey("user", JSON.stringify(data.result.user));
        setKey("is_admin", data.result.user.is_admin);
        setKey("is_logged", true);
        // console.log(getKey("is_admin"));
        window.open('movies/movies.html', '_top');
    }
});