## 用户相关

- 登陆
- 用户状态（查询是否已经登录，需要携带用户id名称信息）

## 业务流程相关模块

|所需描述 \ 模块|流程|衍生变量|全局变量|一维细分|多维细分|自定义细分|评分卡|授信卡|
|-|-|-|-|-|-|-|-|-|
|单例详情|YES|YES|YES|YES|YES|YES|YES|YES|
|全量不分页列表|YES|YES|YES|YES|YES|YES|YES|YES|
|增加|YES|YES|YES|YES|YES|YES|YES|YES|
|更新|YES|YES|YES|YES|YES|YES|YES|YES|
|可变动标记|NO|YES|YES|YES|YES|YES|YES|YES|

额外备注： 如果该模块被其他模块所使用，那么不可更改，不可删除

```merimaid
graph LR;  
　　A-->B;    
　　A-->C;  
　　B-->D;  
　　C-->D; 
```

## Nginx配置 
#设置http请求头限制
client_header_buffer_size 10k;
client_max_body_size    32m;

#设置gzip
gzip on;
gzip_min_length  5k;
gzip_buffers     4 16k;
gzip_comp_level 3;
gzip_types       text/plain application/x-javascript text/css application/xml application/javascript text/javascript application/x-httpd-php image/jpeg image/gif image/png;
gzip_vary on;

#设置vhost
server {
    listen       9989;
    server_name  www.scm.com;

    index index.html;
    root /apps/product/platformfe;

    location /enterprise-web-oapi/ {
        #配置api服务的转发
        proxy_pass http://10.20.88.89:8080/enterprise-web-oapi/;
    }

    location /routerserver/ {
        #配置router服务的转发
        proxy_pass http://10.20.88.89:9527/;
    }

    #配置build出来结构的目录问题
    rewrite  ^/dist/(.*)$  /$1 last;
    rewrite  ^/distimg/(.*)$ /img/$1 last;

    location / {
        #设置所有连接默认打到index.html
        rewrite /([^\.&]*)$ /index.html?rewrite_param=$1;
        index index.html;
        root /apps/product/platformfe;
        #防止.html会被自动cache
        add_header Cache-Control no-store;
    }

    location ~ .*\.(js|png|jpg) {
        #设置静态资源缓存;
        expires 30d;
    }
}
