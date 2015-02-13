##Only RSS Web 项目

一个 `RSS` 阅读器的 Web 版本，基于 `Python`、`Django` 和 `MySQL`。

![预览](http://tonghs-cdn-static.qiniudn.com/new_rss_style_20150213-1.png)

**部署**

分 Web 端和后台脚本两部分。

Web 端：可使用 `nginx` + `uWSGI` 部署，`ubuntu 12.10` 测试可正常部署，其他发行版本未试。

后台脚本：用于定时获取订阅内容，可配合任务计划工作。

    crontab -e

添加以下语句：

    */5 * * * * python /home/username/update_service.py

**配置**

1. 修改 `Django` 配置文件，配置数据库，以 `MySQL` 为例。
2. 新建数据库 onlyrss 并同步数据表到 `MySQL`，注意，编码方式请选择 utf8。
3. 新建用户。可执行以下 SQL 脚本添加用户。


            use onlyrss;
            insert into OnlyRSS_user （username, password, name) values ('username', 'password', 'name');

**使用**

首次使用，使用用户名密码登录后可在设置中导入订阅列表或在首页输入订阅地址添加订阅。


**重启**

    uwsgi --reload uwsgi.pid
    sudo nginx -s reload

**To do list**

1. 密码加密
2. 代码进一步优化
6. 订阅管理中可修改 url 和名称
7. 图标使用高清或 svg
8. 有可能加入分类
5. 有可能加入未读条数显示

**已知问题**


