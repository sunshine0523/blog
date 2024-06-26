---
title: 4、事务隔离级别
---
总结于[文章1](https://blog.csdn.net/qq_42799615/article/details/110942949) [文章2](https://javaguide.cn/database/mysql/transaction-isolation-level.html)

SQL标准制定了四个隔离级别：

- 读未提交
- 读已提交
- 可重复读
- 可串行化

（这个应该如何理解？比如读未提交，就是读可以读到还没有提交的数据。读已提交就是可以读到已经提交的数据）

这四个对应解决三个问题：脏读、幻读、不可重复读

## 1.读未提交

表示读可以读到还没有提交的数据。这会导致**脏读**的问题。

别的事务还没有提交的数据就被读出来了，就是脏读

## 2.读已提交

表示读只能读到别的事务已经提交的数据。

这个级别不会发生脏读的问题，但是会导致**不可重复读**的问题。

因为别的事务提交了，我们的事务就会读出来，也就是同一个事务读取的结果可能不一致。

## 3.可重复读

一个事务中读取到的数据始终是一致的，不管别的事务有没有进行修改/删除（新增不可以）。

这个级别可以保证可重复读，但是可能会产生**幻读**的问题。

### 3.1 什么是幻读？

**简单来说，就是原本不存在的数据，现在出现了，就是幻读。**

幻读和可重复读的区别：可重复读是考虑一行的内容是否更改。幻读是考虑一个表中的内容是否更改。或者说，可重复读考虑的是现有的行， 幻读考虑的是新增的行。

## 4.可串行化

可串行化是把所有事务以串行的形式来执行，这样就不会产生并发问题了。

## 5.MySQL的隔离级别？

MySQL默认是可重复读RR级别，但是它却可以防止幻读。

### 5.1 MySQL如何在RR级别下实现防止幻读的

MySQL使用下面两种方式防止幻读：

- MVCC
- next key lock

※ MVCC

在MySQL的InnoDB引擎下，MVCC多版本并发控制被引入了。MVCC可以让并发多事务保证一致性和隔离性。它使用快照读写方式，对每个数据行都保存多个快照，来解决一些问题。

我们在使用select进行读的时候，会使用MVCC的快照读，这样在RR隔离级别时，只会在第一次select时才会创建ReadView，这样就可以可重复读和防止幻读。

※ next key lock

对于 `select lock in share mode` `select for update` `insert` `update` `delete` 这些，会使用当前读的方式。

- select lock in share mode会加S锁，其他只能加S锁
- 其余情况会加X锁，其他什么锁都不能加

但是，对行加锁只能解决可重复读问题，幻读无法保证，所以还需要给表加next key lock

next key lock是行锁+间隙锁，我们给表的间隙也上锁，这样就没有办法在两次查询之间插入了，就不会产生幻读的问题了。
