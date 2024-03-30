---
title: 13、CopyOnWriteArrayList
---
**我们知道，ArrayList在进行遍历或者迭代的时候，如果其他线程对内容进行增加/删除/修改了，是会抛出ConcurrentModificationException的，说明ArrayList是不支持多线程同时进行读写操作的。也没办法保证线程安全。**

> 如果本线程内修改，直接修改也会抛出异常，但是可以用Iterator进行remove()，用ListIterator进行添加/删除/修改

如果想要做到读写操作可互不影响、线程安全的进行List操作，可以使用CopyOnWriteArrayList。

CopyOnWriteArrayList的想法和ReentrantReadWriteLock差不多，都是想要进行读写分离。在ReentrantReadWriteLock中，可以实现读读不互斥，但是读写和写写仍然是互斥的。而CopyOnWriteArrayList可以做到读读和读写都不互斥，只有读写是互斥的。它是如何做到的呢？

CopyOnWriteArrayList，顾名思义，写时复制，即在写入数据时，不会在原有的数组上写入，而是会创建一个数组副本，在副本上进行写入，然后把副本在赋给原数组。

CopyOnWriteArrayList只会在写时加锁（JDK1.8是通过ReentrantLock，JDK17看到是通过synchronized了），读时不会加锁。所以它适合读取比较多的场景。
