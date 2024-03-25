---
title: 7、ConcurrentHashMap
---
参考[文章1](https://zhuanlan.zhihu.com/p/268614609)

ConcurrentHashMap的底层实现和HashMap差不多，都是Node节点数组+链表/红黑树

底层区别就是红黑树的实现部分了。

HashMap的红黑树实现是TreeNode，TreeNode负责红黑树的插入、删除、查找等功能

而ConcurrentHashMap为了实现粒度更小的加锁，使用TreeBin来作为一个加锁粒度，它也负责红黑树的插入、删除、查找等操作，而TreeNode只负责红黑树的查找操作。TreeBin不保存实际的数据，而是维护红黑树的根。实际上的数据还是TreeNode存储的。

## 1. ConcurrentHashMap如何保证线程安全的

ConcurrentHashMap主要通过CAS和synchronized来保证线程安全

有关CAS的内容，见[Unsafe类介绍](./unsafe.html)。

其实可以说的主要就是putVal方法和initTable方法。

### 1.1 putVal

- putVal方法首先会判断当前表是否为空，如果为空的话，就CAS调用initTable方法来初始化表
- 如果不为空，先判断当前key的应该在的位置是否为空
  - 如果为空，那么就CAS插入，如果CAS插入成功，就结束了。如果CAS插入失败，那么就自旋等待直到插入成功
  - 如果当前位置不为空，那么就给当前位置首节点上锁，然后如果是链表，就在链表尾部插入，如果是红黑树，那么就调用红黑树的插入方法。当然，插入之前要先判断是否需要把链表转换为红黑树

### 1.2 initTable

对于initTable来说，也是通过CAS完成线程安全的初始化的

- 如果当前表不为空，结束
- 如果当前表为空，
  - 那么要比较一个叫sizeCtl的变量，如果该变量为-1，表示有其他线程正在插入，此时会让出线程
  - 如果sizeCtl为0，那么就通过CAS给该变量赋值为-1，如果成功了，就初始化，如果失败了，就自旋等待

## 2.ConcurrentHashMap和Hashtable

两者都能保证线程安全，但是实现方式不同，底层数据结构也不同

- CHM采用CAS加synchronized来保证线程安全，是对Node节点进行上锁的。而Hashtable是对整张表上锁的
- CHM的底层数据结构和HashMap基本一致，除了TreeBin，也是采用Node节点加链表/红黑树来做底层数据结构的。而Hashtable就是使用节点+链表拉链法来实现的
