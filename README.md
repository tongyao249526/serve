# serve（node项目）

## 开发环境（起服务时注意用debug模式）:



mongod -f /usr/local/etc/mongod.conf  //启动数据库

killall mongod  //关闭所有

## 生产环境（尽量使用pm2）:

pm2 start ./bin/www --> 启动项目

pm2 stop ./bin/www --> 关闭项目

pm2 stop all  --> 关闭所有项目

pm2 log  --> 开启日志