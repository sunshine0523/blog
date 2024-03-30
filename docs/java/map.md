---
title: 6、Map比较
---
## 1. HashMap和TreeMap

TreeMap相对HashMap来说，还多实现了两个接口：SortedMap和NavigateMap，即可以对数据进行排序和导航

## 2.HashMap底层实现 ※

HashMap底层实现是数组和链表、红黑树的结合，也就是使用拉链法来解决哈希冲突的。

记住几个数字：

- 默认数组长度：1<<4，16
- 默认转为红黑树的数字：链表长度大于8，且数组长度大于64
- 默认由红黑树转为链表的数字：红黑树节点数量小于6

### 2.1 HashMap中数组长度为什么是2的幂次方

为了加快取余速度。经过数学证明，一个数n是2的幂次方，那么 n % hash == (n - 1) & hash

### 2.2 HashMap线程不安全举例

- 线程A put，没有发现hash冲突，此时线程B得到了CPU进行作业
- 线程B put，hash值和A的一样，并且进行写入
- 线程A重新得到CPU，因为已经判断完哈希冲突所以直接插入，B的就被覆盖掉了

### 2.3 HashMap的相关问题

| HashMap的问题                                                     |
| ----------------------------------------------------------------- |
| 11.HashMap的 put 流程知道吗？                                     |
| 12.HashMap怎么查找元素的呢？                                      |
| 13.HashMap的哈希/扰动函数是怎么设计的?                            |
| 16.如果初始化HashMap，传一个 17 的值new HashMap<>，它会怎么处理？ |
| 20.扩容在什么时候呢？为什么扩容因子是0.75？                       |
| 21.那扩容机制了解吗？                                             |

**table容量变为2倍，但是不需要像之前一样计算下标，只需要将hash值和旧数组长度相与即可确定位置。**

如果 Node 桶的数据结构是链表会生成 low 和 high 两条链表，是红黑树则生成 low 和 high 两颗红黑树
依靠 (hash & oldCap) == 0 判断 Node 中的每个结点归属于 low 还是 high。
把 low 插入到 新数组中 当前数组下标的位置，把 high 链表插入到 新数组中 [当前数组下标 + 旧数组长度] 的位置
如果生成的 low，high 树中元素个数小于等于6退化成链表再插入到新数组的相应下标的位置

## 3. HashSet如何保证不重复插入

现在已经完全交给HashMap，HashSet会调用HashMap的put方法，put方法如果key不存在，会返回null，如果存在会返回那个值

## 4. HashMap和HashTable

- HashMap线程不安全，Hashtable线程安全
- HashMap效率更高
- HashMap默认数组长度为16，并且始终为2的幂次方，Hashtable默认长度为11
- HashMap有转为红黑树操作

## 5. ConcurrentHashMap和Hashtable

区别：

- 底层结构不同。Hashtable使用的是数组+链表的方式来存储数据，没有转换红黑树的操作。ConconrrentHashMap和HashMap类似，底层都是采用Node数组加链表或红黑树的结构来存储数据
- 并发处理不同。Hashtable使用的是synchronized锁来进行并发控制的，这样在插入的时候，也是没有办法读取的，所以效率会低一些。ConcurrentHashMap使用CAS和synchronized来完成并发操作，效率高
