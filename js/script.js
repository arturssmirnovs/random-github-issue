var app = new Vue({
    el: '#app',
    data () {
        return {
            language: null,
            error: null,
            loading: true,
            total: null,
            issue: {},
            message: "test",
            hasPrevious: false,
            prev: {}
        }
    },
    mounted () {
        this.search()
    },
    methods: {
        search() {
            if (this.language) {
                var params = {
                    params: {
                        q: 'is:open language:'+this.language,
                    }
                };
            } else {
                var params = {
                    params: {
                        q: 'is:open'
                    }
                };
            }
            axios.get('https://api.github.com/search/issues', params)
            .then(function (response) {
                this.setIssue(response);
            }.bind(this))
            .catch(function (error) {
                this.error = error;
            }.bind(this));
        },
        previous() {
            this.hasPrevious = false;

            this.issue = this.prev;
        },
        setIssue(response) {
            let issues = response.data.items;

            this.prev = this.issue;

            if (Object.keys(this.prev).length !== 0) {
                this.hasPrevious = true;
            }

            this.issue = issues[Math.floor(Math.random() * issues.length)];
            this.issue.repository = this.issue.html_url.split("/")[4];
            this.issue.created_at = new Date(this.issue.created_at).toJSON().slice(0,10);

            if (this.issue.body && this.issue.body.length > 350) {
                this.issue.body = this.issue.body.substring(0, 350)+"..";
            }

            this.total = response.data.total_count;

            this.loading = false;
        }
    }
})