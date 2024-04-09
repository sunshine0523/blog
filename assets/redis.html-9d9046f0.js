import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as n,c as h,b as i,d as e,e as r,w as o,a as d}from"./app-2bc3c870.js";const c={},p={href:"https://zhuanlan.zhihu.com/p/93515595",target:"_blank",rel:"noopener noreferrer"},u={href:"https://developer.aliyun.com/article/852976",target:"_blank",rel:"noopener noreferrer"},R={href:"https://juejin.cn/post/6844903982066827277",target:"_blank",rel:"noopener noreferrer"},_=d('<h2 id="什么是redis" tabindex="-1"><a class="header-anchor" href="#什么是redis" aria-hidden="true">#</a> 什么是Redis</h2><p>Redis是基于C语言开发的、一个开源的（BSD）、内存中的数据结构存储系统（是key-value数据库），可用于数据库、缓存和消息中间件</p><p>因为是内存中的数据结构管理系统，所以Redis的速度非常快，而且提供了多种数据结构，并且还支持持久化存储。</p><h2 id="为什么要用redis-redis的优势-redis的特点" tabindex="-1"><a class="header-anchor" href="#为什么要用redis-redis的优势-redis的特点" aria-hidden="true">#</a> 为什么要用Redis/Redis的优势/Redis的特点</h2><p>传统的关系型数据库已经不能胜任所有任务了，比如秒杀的库存扣减、首页的访问高峰，很容易让传统的数据库崩掉，所以引入了缓存中间件</p><ul><li>Redis的性能极高，读写速度都非常快</li><li>Redis支持的数据类型很多（5种）</li><li>原子性：Redis所有操作都是原子性的，要么成功，要么失败，多个操作也支持原子性，可以通过MULTI和EXEC指令包起来</li><li>Redis支持数据持久化、数据备份</li><li>特征丰富：比如过期删除等</li></ul><h2 id="缓存中间件有什么" tabindex="-1"><a class="header-anchor" href="#缓存中间件有什么" aria-hidden="true">#</a> 缓存中间件有什么</h2><p>缓存中间件有Redis和Memcached等。</p><p>Redis比Memcached有优势：</p><ul><li>Memcached只有简单的字符串类型，Redis有更加丰富的数据类型</li><li>Redis速度比Memcached更快</li><li>Redis支持持久化存储</li></ul><h2 id="redis的数据类型" tabindex="-1"><a class="header-anchor" href="#redis的数据类型" aria-hidden="true">#</a> Redis的数据类型</h2><p>Redis有5种数据类型：</p><ul><li>string</li><li>list</li><li>set</li><li>sorted set</li><li>hash</li></ul><p>此外，还有新的一些数据类型</p><ul><li>Stream</li><li>GEO地理位置</li><li>HyperLogLog</li><li>Bitmap位图</li></ul>',15),f=d('<h2 id="redis是单进程还是多进程" tabindex="-1"><a class="header-anchor" href="#redis是单进程还是多进程" aria-hidden="true">#</a> Redis是单进程还是多进程</h2><p>Redis是单进程单线程的，Redis使用队列技术把并发访问变成了串行访问。</p><h2 id="redis中一个string类型的最大容量是多少" tabindex="-1"><a class="header-anchor" href="#redis中一个string类型的最大容量是多少" aria-hidden="true">#</a> Redis中一个string类型的最大容量是多少</h2><p>512M</p><h2 id="redis的持久化机制有哪些" tabindex="-1"><a class="header-anchor" href="#redis的持久化机制有哪些" aria-hidden="true">#</a> Redis的持久化机制有哪些</h2><ul><li>RDB(Redis Database) 使用<strong>数据集快照</strong>的方式半持久化模式记录Redis数据库的所有键值对。会在某个时间点将数据库中的所有键值对写到一个文件中。 <ul><li>优点： <ul><li>只有一个文件dump.rdb，方便持久化</li><li>容灾性好，一个文件可以非常方便地存储到安全的磁盘中</li><li>性能好，fork子进程来进行写入操作，主进程会继续处理任务</li><li>数据集比较大的时候，比AOF启动更快</li></ul></li><li>缺点： <ul><li>数据安全性低，因为RDB是隔一段时间进行备份的，如果在这之前Redis崩了，从上次备份后的数据就丢失了</li></ul></li></ul></li><li>AOF(Append-only File) 所有的命令行记录都会以<strong>Redis命令请求协议的格式</strong>完全持久化保存为aof文件 <ul><li>优点： <ul><li>数据安全，AOF可以设置appendsync属性为always，这样每执行一条命令，都会记录到aof文件中</li><li>通过append模式写入文件，如果服务器宕机，也可以通过redis-check-aof工具解决数据一致性问题</li><li>AOF机制的rewrite模式，在没有进行rewrite之前（文件过大会进行rewrite），可以删除一些误操作的命令</li></ul></li><li>缺点： <ul><li>文件大，恢复速度慢</li><li>文件大时启动比RDB慢</li></ul></li></ul></li></ul><h1 id="双重锁验证" tabindex="-1"><a class="header-anchor" href="#双重锁验证" aria-hidden="true">#</a> 双重锁验证</h1><h2 id="如果有大量的key需要设置同一时间过期-需要注意什么" tabindex="-1"><a class="header-anchor" href="#如果有大量的key需要设置同一时间过期-需要注意什么" aria-hidden="true">#</a> 如果有大量的key需要设置同一时间过期，需要注意什么</h2><p>如果大量的key的过期时间过于集中，可能会造成Redis的短暂卡顿甚至缓存雪崩，所以可以给过期时间设置一个随机数，让它不那么集中。</p><h2 id="介绍一下如何使用redis实现一个分布式锁" tabindex="-1"><a class="header-anchor" href="#介绍一下如何使用redis实现一个分布式锁" aria-hidden="true">#</a> 介绍一下如何使用Redis实现一个分布式锁</h2><p>可以使用setnx key value或者set key value nx来争夺锁，得到锁后可以使用expire key seconds来给锁设置一个过期时间（到时key会删除）</p><ul><li><strong>追问：如果设置完锁服务崩了，此时没有设置expire怎么办？</strong></li></ul><p>可以使用set key value nx px milliseconds来在争夺锁的同时来设置过期时间</p>',13);function x(m,k){const a=l("ExternalLinkIcon"),s=l("RouterLink");return n(),h("div",null,[i("p",null,[e("总结于"),i("a",p,[e("来源1"),r(a)]),e("、"),i("a",u,[e("来源2"),r(a)]),e("、"),i("a",R,[e("来源3"),r(a)])]),_,i("p",null,[e("这几种的介绍见"),r(s,{to:"/redis/redis_datatype.html"},{default:o(()=>[e("Redis数据类型")]),_:1})]),f])}const g=t(c,[["render",x],["__file","redis.html.vue"]]);export{g as default};