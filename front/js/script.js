Vue.use(VueRouter)

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function insertParam(key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    // kvp looks like ['key1=value1', 'key2=value2', ...]
    var kvp = document.location.search.substr(1).split('&');
    let i=0;

    for(; i<kvp.length; i++){
        if (kvp[i].startsWith(key + '=')) {
            let pair = kvp[i].split('=');
            pair[1] = value;
            kvp[i] = pair.join('=');
            break;
        }
    }

    if(i >= kvp.length){
        kvp[kvp.length] = [key,value].join('=');
    }

    // can return this or...
    let params = kvp.join('&');

    // reload page with new params
    document.location.search = params;
}

var vueExerciser = new Vue({
    el: '#search',
    data: {
        query: '',
        sents: [{
            'text': ["Hello ", '___', ' and ', '___',  " world!"],
            'words': ['a', 'b']
        }],
        all_words: ['a', 'b']
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
                this.sents = response.body.sents
                this.all_words = response.body.words
            })
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