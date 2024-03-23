---
title: 1.Redis总结
---
总结于[来源1](https://zhuanlan.zhihu.com/p/93515595)、[来源2](https://developer.aliyun.com/article/852976)、[来源3](https://juejin.cn/post/6844903982066827277)

## 什么是Redis

Redis是基于C语言开发的、一个开源的（BSD）、内存中的数据结构存储系统（是key-value数据库），可用于数据库、缓存和消息中间件

## 为什么要用Redis/Redis的优势/Redis的特点

传统的关系型数据库已经不能胜任所有任务了，比如秒杀的库存扣减、首页的访问高峰，很容易让传统的数据库崩掉，所以引入了缓存中间件

- Redis的性能极高，读写速度都非常快
- Redis支持的数据类型很多（5种）
- 原子性：Redis所有操作都是原子性的，要么成功，要么失败，多个操作也支持原子性，可以通过MULTI和EXEC指令包起来
- Redis支持数据持久化、数据备份
- 特征丰富：比如过期删除等

## 缓存中间件有什么

缓存中间件有Redis和Memcached等。

Redis比Memcached有优势：

- Memcached只有简单的字符串类型，Redis有更加丰富的数据类型
- Redis速度比Memcached更快
- Redis支持持久化存储

## Redis的数据类型

Redis有5种数据类型：

- string
- list
- set
- sorted set
- hash

此外，还有新的一些数据类型

- Stream
- GEO地理位置
- HyperLogLog
- Bitmap位图

这几种的介绍见[Redis数据类型](redis_datatype.html)

## Redis是单进程还是多进程

Redis是单进程单线程的，Redis使用队列技术把并发访问变成了串行访问。

## Redis中一个string类型的最大容量是多少

512M

## Redis的持久化机制有哪些

- RDB(Redis Database)
  使用**数据集快照**的方式半持久化模式记录Redis数据库的所有键值对。会在某个时间点将数据库中的所有键值对写到一个文件中。
  - 优点：
    - 只有一个文件dump.rdb，方便持久化
    - 容灾性好，一个文件可以非常方便地存储到安全的磁盘中
    - 性能好，fork子进程来进行写入操作，主进程会继续处理任务
    - 数据集比较大的时候，比AOF启动更快
  - 缺点：
    - 数据安全性低，因为RDB是隔一段时间进行备份的，如果在这之前Redis崩了，从上次备份后的数据就丢失了
- AOF(Append-only File)
  所有的命令行记录都会以**Redis命令请求协议的格式**完全持久化保存为aof文件
  - 优点：
    - 数据安全，AOF可以设置appendsync属性为always，这样每执行一条命令，都会记录到aof文件中
    - 通过append模式写入文件，如果服务器宕机，也可以通过redis-check-aof工具解决数据一致性问题
    - AOF机制的rewrite模式，在没有进行rewrite之前（文件过大会进行rewrite），可以删除一些误操作的命令
  - 缺点：
    - 文件大，恢复速度慢
    - 文件大时启动比RDB慢

# 双重锁验证

## 如果有大量的key需要设置同一时间过期，需要注意什么

如果大量的key的过期时间过于集中，可能会造成Redis的短暂卡顿甚至缓存雪崩，所以可以给过期时间设置一个随机数，让它不那么集中。

## 介绍一下如何使用Redis实现一个分布式锁

可以使用setnx key value或者set key value nx来争夺锁，得到锁后可以使用expire key seconds来给锁设置一个过期时间（到时key会删除）

- **追问：如果设置完锁服务崩了，此时没有设置expire怎么办？**

可以使用set key value nx px milliseconds来在争夺锁的同时来设置过期时间
