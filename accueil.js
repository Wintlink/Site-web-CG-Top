class ajax{

    constructor (url, method, options) {
        this.url = url;
        this.method = method;
        this.options = options;


    }
    send(callback) {
        const http=new XMLHttpRequest(
            
        );
        http.onload=function(){
            callback(JSON.parse(http.response))
        }
        http.open(this.method,this.url,this.options)
        http.send()

    }

}