FROM debian:7.8

MAINTAINER tonghs <tonghuashuai@gmail.com>

# 网易源
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./bjt.list /etc/apt/sources.list

# 更新源 && 安装必要软件
# RUN apt-get update && apt-get install -y python mlocate wget vim tmux silversearcher-ag git mercurial  nginx  redis-server openssh-server python-pip uwsgi
RUN apt-get update && apt-get install -y openssh-server nginx python git python-pip uwsgi python-mysqldb python-django supervisor cron


########### 安装 mysql ###########
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get -yq install mysql-server

RUN pip install feedparser

ADD ./mysql.sql /root/mysql.sql
########### 安装 mysql 结束 ###########

# 配置 sshd
RUN mkdir -p /var/run/sshd

# 配置公钥
RUN mkdir -p /root/.ssh
ADD authorized_keys /root/.ssh/authorized_keys

RUN apt-get autoremove && apt-get autoclean && apt-get clean

ADD run.sh /run.sh
RUN chmod 755 /run.sh

# 开放端口
EXPOSE 22 80 8080

CMD ["/run.sh"]
