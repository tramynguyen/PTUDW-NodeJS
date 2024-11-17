'use strict';
require('dotenv').config();
const express = require('express');
const port = process.env.port||3000;
const app = express();
const { createPagination } = require('express-handlebars-paginate');


//cấu hình sử dụng express-handlebars
const expressHandlebars = require('express-handlebars');
const {createStarList} = require('./controllers/handlerbarsHelper.js');

//cấu hình public static folder
const session = require('express-session');
const redisStore = require('connect-redis').default;
const { createClient } = require('redis');
const { default: RedisStore } = require('connect-redis');
const redisClient = createClient({
    //url: 'rediss://red-cssb8ia3esus739kfvf0:ooQcOjz2g0xc2bNuwi7o4ei0i05PANZH@oregon-redis.render.com:6379'
    url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);

app.use(express.static(__dirname + '/public'));

// app.get('/',(req,res) => {
// res.send('Hello to Eshop');
// })

//cấu hình sử dụng express-handlebars
app.engine('hbs',expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions : {
        allowProtoPropertiesByDefault: true
    },
    helpers : {
        createStarList,
        createPagination
    }
}))
app.set('view engine','hbs');

//cấu hình đọc dữ liệu post từ body
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//cấu hinh sử dụng session
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({client:redisClient}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20*60*1000,

    }
}))
//middleware: khởi tạo giỏ hàng
app.use((req,res,next)=>{
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart?req.session.cart:{});
    res.locals.quantity = req.session.cart.quantity;
    next();
})



//routes
//Bất kỳ đường dẫn nào có dấu '/',thì dẫn đến file indexRouter xử lý
app.use('/', require('./routes/indexRouter'));
app.use('/products',require('./routes/productsRouter'));

//Nếu như có error
// app.use((req,res,next)=>{
//     res.status(404).render('error',{message : 'File not Found'})
// })
// app.use((error,req,res,next)=>{
//     console.error('error'); //Để ta có thể thấy bên phía server
//     res.status(500).render('error','Internal Server Error!');
// })

app.get('/createTables',(req,res)=>{
    let models = require('./models');
    models.sequelize.sync().then(()=>{
        res.send("bảng đã dc tạo xong");
    })
})

// app.get('/',(req,res)=>{
//     res.render('index');
// })
// app.get('/:page',(req,res)=>{
//     res.render(req.params.page);
// })
// app.get('/',(req,res)=>{
//     res.render('index');
// })
//ta dùng code để băt 1 sự kiệm để thực hiện đưa bảng bvaof csdl


//Khởi động server
app.listen(port,()=>{
    console.log(`server is run on port ${port}`);
});