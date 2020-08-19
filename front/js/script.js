Vue.use(VueRouter)

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result.split("+").join(" ");
}


function setURLParameter(url, parameter, value) {
    let url1 = new URL(url);
    if (url1.searchParams.get(parameter) === value) {
        return url;
    }
    url1.searchParams.set(parameter, value);
    console.log(url1.href);
    return url1.href;
}

function insertParam(key, value) {
    var newUrl = setURLParameter(window.location, key, value);
    console.log(newUrl);
    window.history.replaceState( null, null, newUrl );
}

var vueExerciser = new Vue({
    el: '#search',
    data: {
        query: '',
        sents: [{
            text: ["Hello ", '___', ' and ', '___',  " world!"],
            words: ['a', 'b'],
        }],
        all_words: ['a', 'b'],
        answers: ['', '']
    },
    methods: {
        load: function(){
            this.query = findGetParameter('q')
            this.submit_query()
        },
        submit_query: function(){
            this.$http.get('/generate', {params:{
                q: this.query.trim()
            }}).then(response => {
                this.all_words = response.body.words
                this.answers = Array(response.body.sents.length).join(".").split(".");
                this.sents = response.body.sents
            }).then(() => insertParam('q', this.query));
            Array.from(document.getElementsByClassName('badge-success')).forEach((el) => el.classList.replace('badge-success', 'badge-secondary') );
            Array.from(document.getElementsByClassName('badge-danger')).forEach((el) => el.classList.replace('badge-danger', 'badge-secondary'));
        },
        check: function(event, correct){
            event.target.classList.toggle('badge-secondary')
            if(correct){
                event.target.classList.toggle('badge-success')
            }else{
                event.target.classList.toggle('badge-danger')
            }
        }
    },
})

vueExerciser.load()