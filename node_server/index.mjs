import express from 'express'
import getYoutubeInfo from './youtube.mjs'
import cors from 'cors'
const app = express();
app.use(cors())


//服务器配置
app.configure(function () {
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler());
    app.set("port","5719");
    app.listen(app.get("port"), function () {
        console.log("服务器开启")
    });
});
app.get('/youtube',getYoutubeInfo);



