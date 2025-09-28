const http = require('http')
const server = http.createServer(function(req, res) {
    console.log('req is incoming.... ');
    // console.log(req.method);  //     GET
    // console.log(req.url);     //    /
    switch (req.method) {
        case 'GET':
            {
                if (req.url === '/') return res.end('homepage');
                if (req.url === '/contact-us') return res.end('contact page'); 
                if (req.url === '/about-us') return res.end('about page');
            }
            break;
        case 'POST':
            {

            }
            break
        default:
            break;
    }

    res.end('this is responses')
    
})


server.listen(8000, function(){
    console.log(`server started`);
    
})