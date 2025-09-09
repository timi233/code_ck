#!/bin/bash
# 初始化脚本，用于设置 MySQL 用户权限

# 创建允许从任何主机连接的 root 用户
CREATE USER 'root'@'%' IDENTIFIED BY '1qaz2wsx';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;