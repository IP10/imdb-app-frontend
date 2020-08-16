$(function () {
    let BASE_URL = 'https://sample-imdb.herokuapp.com/api/';
    function getKey(key) {
        var value = localStorage.getItem(key);
        if (value != null) {
            return atob(value)
        }
        return "";
    }
    var logged_in = getKey("is_logged");
    // console.log(logged_in);
    if (logged_in == false || logged_in == undefined) {
        window.open('../index.html', '_top');
    }
    else {
        var is_admin = getKey('is_admin');
        console.log(is_admin);
        if (is_admin == undefined || is_admin == false) {
            // console.log('Normal user');
            $('#admin-list').hide();
        }
        else {
            // console.log('Admin user');
            $('#common-list').hide();
        }
    }
    var url = BASE_URL + 'movies/'
    var token = getKey("token");
    // console.log(token);
    if (token != null) {
        token = JSON.parse(token);
        auth_token = token.access_token;
    }
    else {
        auth_token = '';
    }
    var sort_clicked = false;
    var myTable = $('#example').DataTable({

        "pagingType": "numbers",
        "bInfo": false,
        "bPaginate": false,
        "bSort": false,
        "searching": false,
        "data": [],
        "columns": [
            { "data": "id", "orderable": false },
            { "data": "name", "orderable": false },
            { "data": "director", "orderable": false },
            { "data": "genres", "orderable": false },
            { "data": "popularity", "orderable": false },
            { "data": "imdb_score", "orderable": false }
        ],
        "ajax": {
            url: url,
            type: 'get',
            headers: {
                "Authorization": 'Bearer ' + auth_token
            },
            success: function (req_data, textStatus, jQxhr) {
                moviesdata(req_data);
            },
            error: function (data, textStatus, errorThrown) {
                // console.log("error", data.responseJSON.message);
                alert(data.responseJSON.message);
            }
        }
    });
    function getSortValues(value){
        var sort_key = 'Name(A-Z)';
        var sort_by = 'asc';
        if (value == "Name(A-Z)") {
            sort_key = "name";
            sort_by = "desc";
        }
        else if (value == "Popularity(Ascending)") {
            sort_key = "POPULARITY";
            sort_by = "asc";
        }
        else if (value == "Popularity(Descending)") {
            sort_key = "POPULARITY";
            sort_by = "desc";
        }
        else if (value == "IMDB Score(Ascending)") {
            sort_key = "IMDB_SCORE";
            sort_by = "asc"
        }
        else {
            sort_key = "IMDB_SCORE";
            sort_by = "desc";
        }
        var sort_arr = [sort_key, sort_by];
        return sort_arr;
    }
    function moviesdata(data) {
        $('#example').dataTable().fnAddData(data.result.movies);
        $('#page-selection').bootpag({
            total: data.result.page.total,
            page: data.result.page.current,
            maxVisible: 5,
            leaps: true,
            wrapClass: 'pagination',
        }).on('page', function (event, num) {
            var sort_value = $("#sort-dropdown").val();
            var sort_params = getSortValues(sort_value);
            var sort_key = sort_params[0], sort_by = sort_params[1];
            // console.log("1",sort_clicked);
            var page = num;
            if (sort_clicked){
                page = 1;
            }
            var query_params = {
                'sort_key': sort_key,
                'sort_by': sort_by,
                'page': page
            }
            
            $.ajax({
                url: url,
                type: 'get',
                data: query_params,
                headers: {
                    "Authorization": 'Bearer ' + auth_token
                },
                success: function (data, textStatus, jQxhr) {
                    $('#example').dataTable().fnClearTable();
                    $('#example').dataTable().fnAddData(data.result.movies);
                    sort_clicked = false;
                },
                error: function (data, textStatus, errorThrown) {
                    // console.log("error", data.responseJSON.message);
                    alert(data.responseJSON.message);
                }
            });
        });;
        $('.bootpag').addClass('pagination');
        $('.bootpag li').addClass('page-item');
        $('.bootpag li a').addClass('page-link');
    }

    $("#sort-dropdown").on("changed.bs.select",
        function (e, clickedIndex, newValue, oldValue) {
            // console.log(this.value, clickedIndex, newValue, oldValue);
            var sort_params = getSortValues(this.value);
            sort_clicked = true;
            // console.log("sort", sort_clicked);
            // console.log(sort_key, sort_by);
            $.ajax({
                url: url,
                type: 'get',
                data: {
                    sort_key: sort_params[0],
                    sort_by: sort_params[1]
                },
                headers: {
                    "Authorization": 'Bearer ' + auth_token
                },
                success: function (data, textStatus, jQxhr) {
                    moviesdata(data);
                },
                error: function (data, textStatus, errorThrown) {
                    console.log("error", data.responseJSON.message);
                    alert(data.responseJSON.message);
                }
            });
        });

    $('#logout').on('click', function (e) {
        e.preventDefault();
        // console.log("logout");
        var url = BASE_URL + 'users/logout/';
        // console.log(url, auth_token);
        $.ajax({
            url: url,
            type: 'DELETE',
            headers: {
                "Authorization": 'Bearer ' + auth_token
            },
            success: function (response) {
                console.log("logged out");
                logout(response);
            },
            error: function (data, textStatus, errorThrown) {
                console.log("error", data.responseJSON.message);
                alert(data.responseJSON.message);
            }
        });
    });
    function logout(data) {
        // console.log("response", data);
        localStorage.clear();
        window.open("../index.html", '_top');
    }
});