import { createProxyMiddleware } from "http-proxy-middleware"


module.export = app => {
    app.use(
        createProxyMiddleware('/usermaster/authenticate' ,
        {
            target: 'http://localhost:8080',
            changeOrigin: true
        })
    )
}