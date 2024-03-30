---
title: 1、MySQL索引
---
## 1.索引的介绍

索引就是为了快速查找内容设立的，可以参考新华字典里的目录，如果说直接去后面翻来找字的话，那么时间会非常长，但是如果通过前面的目录进行拼音查找或者部首查找，那么效率就非常高了，实际上这里的拼音和部首，就是两种索引。

## 2.索引的优缺点

优点：

- 可以让查找效率变得很高
- 通过建立唯一索引，可以让行唯一

缺点：

- 建立和修改索引，都需要大量的时间。因为每次对数据内容进行更变，都需要更变索引的内容
- 索引是一个文件，需要存放到磁盘中，所以会占用一定的空间

## 3.索引的底层数据结构

### 3.1 hash

哈希表是一种键值对存储，我们可以把索引放到key中。对于散列函数比较优秀的哈希表来说，基本上不会产生冲突，如果产生了冲突，那就通过链表的方式来解决。正常来说，哈希表可以实现O(1)时间的查找。

缺点：

- 哈希表单查找确实很快，但是进行范围查找，比如a>100 and a<200，那就不太合适了，对于哈希表结构来说，每个值都需要进行一次查找

### 3.2 二叉查找树

二叉查找树是一个二叉树，但是它节点有一些特点：每个节点的左孩子都比自己小，每个节点的右孩子都比自己大

这样的话，如果查找一个值，平均只需要O(logn)的时间就可以完成，但是二叉查找树可能会退化到一条链，这是进行查找和普通链表没什么区别了，会退化成O(n)时间

### 3.3 平衡二叉树

为了解决上面二叉查找树会退化为一条链的情况，平衡二叉树做了一些工作。

平衡二叉树规定，对于每个节点来说，左孩子和右孩子的高度之差不能大于1，如果大于1了，就要进行多次左旋或者右旋，直到高度之差满足条件。

缺点：

平衡二叉树很好地解决了查找退化的问题，但是因为每次插入或者删除，都可能会进行多次的左旋或者右旋，这样消耗的时间比较大

### 3.4 红黑树

接下来就是红黑树，上面说的平衡二叉树每次都可能进行多次的左旋或者右旋，而红黑树每次都只进行一次左旋或者右旋。

一个红黑树有以下5个特点：

- 每个节点不是红色就是黑色的
- 根节点一定是黑色的
- 叶子节点是**黑色**的空节点
- 一个节点是红色的话，那么它的孩子节点一定是黑色的，反过来不一定（不能连着两个红）
- 从根节点到叶子节点，每条路径上的黑色节点数量一定是相同的

红黑树因为每次的左旋或者右旋都只进行一次，所以插入和删除的效率比平衡二叉树来说是有所提升的

但是红黑树并不是完全保证平衡的，也就是对于一个节点来说，它的左孩子和右孩子的高度可能差值会大一些，这样查找效率可能会有所下降，树高可能会高一些，IO操作就会多一些，这也是MySQL没有选择红黑树的原因（B+树是矮胖的）

#### 红黑树是如何保证平衡的？

旋转和染色。

### 3.5 B树/B+树

B树叫做多路平衡查找树，B+树是B树的一个改进

B树和B+树的区别如下：

- B树所有位置都可以存放key和data，B+树只有叶子节点存放key和data，其他位置只存放key
- B树中一个关键字只能出现一次，B+树中可能出现多次
- B树的叶子节点是相互独立的，B+树的叶子节点之间是通过一个链连在一起的
- ~~B树进行查找只需要查到key就可以了，因为节点中既有key又有value；而B+树必须要查到叶子节点~~
- 对于范围查找来说，B树需要查找到左范围，然后通过中序遍历，直到找到右范围；而B+树通过叶子节点的链表即可

这样来说，B+树有很多优势：

- 查找更稳定，每个都需要到达叶子节点
- 范围查找更快捷

所以，MySQL的InnoDB和MyISAM(Maiˈzæm)都使用了B+树。

有关B+树的一些补充

B+树是有阶的概念的，对于一个m阶的B+树，那么它的孩子数量最多就是m个。

对于B+树的一个节点来说，它内部存放的可能是这样：20 30 40...，小于20的会走一个孩子，20-30的会走一个孩子，依次。

对于查询时间复杂度的话，基本上就是logn的。

## 4.主键索引和二级索引

主键索引就是为主键建立的索引，对于InnoDB来说，主键索引中的key是主键，data就是这一行的内容了，对于MyISAM来说，主键索引中的data也是指向数据的一个值

对于InnoDB来说，如果没有指定主键所以，它会去寻找唯一非空索引，如果有，那么就把它当作主键索引，否则就创建一个6bit的主键索引

对于二级索引来说，其data的值不是数据，而是主键的值，这样通过二级索引来检索数据，实际上是需要回表的，再根据主键索引查找到数据

在InnoDB中，除了主键索引都是二级索引，包括

- 普通索引
- 唯一索引

## 5.聚簇索引和非聚簇索引

### 5.1 聚簇索引

所谓聚簇索引，就是指的索引和数据是在一起的，比如InnoDB中的主键索引。而MyISAM主键索引也是非聚簇索引，主键索引中的data也不是这一行的数据，而是指向了数据的位置

下面记一下，忘记了

优点：

- 对于排序查找和范围查找很方便
- ~~聚簇查找不需要进行回表查找，因为data中就是这一行的信息了~~。查找非常快，因为聚簇查找不需要进行回表操作，这样会减少一次IO操作

缺点：

- 依赖于有序数据，如果数据是有序的，那么建立和搜索索引都会非常顺序，如果是无序的，比如UUID什么的，那么索引之间的比较就会很耗时
- 更新代价大。因为聚簇索引数据是放到data中的，这样的话更新索引也需要处理这些数据，耗时较大

### 5.2 非聚簇索引

非聚簇索引就是索引中的data存放的不是真正的数据，而是数据的指针或者主键的值。

优点：

- 更新消耗小，因为非聚簇索引中没有真正的值

缺点：

- 依赖有序数据，同上
- 查找需要进行回表操作，数据查询比较慢

### 非聚簇索引一定会回表查询吗？

不一定，如果查的列恰好是有索引的，那对于InnoDB来说，就不需要进行回表了。

对于MyISAM来说，如果查的列是主键，那么其实也不需要进行回表。

这种情况就是覆盖索引了。

## 6.覆盖索引和联合索引

所谓覆盖索引，就是准备查找的列恰好都是有索引的列，这样查找的时候就不需要进行回表操作。

所谓联合索引，就是把多列合在一起共同作为一个索引。

### 6.1 最左前缀匹配原则

忘了，看看

最左前缀匹配原则，就是在使用联合索引时，根据联合索引中从左到右的顺序，先过滤掉一些不符合的数据再进行下面的匹配，这样效率会高一些。所以在进行联合索引设计时，应该把一些过滤效果好的列放到左边。

过滤什么时候会停止？> <都会，>= <= between like不会

所以对于联合索引 (a, b)来说，如果查询：

select a, b where a=1 and b=2是可以走索引的，但是查询：

select b 就是不走索引的，

select a, b, c where a = 1 and b > 2 and c=1，那么c就是走不了索引的

## 7.索引下推

## 8.正确使用索引的建议，感觉比较重要

### 8.1 选择合适的列作为索引

- 不应该把可空的列作为索引，因为索引很难优化NULL值
- 频繁查找的列作为索引
- 频繁作为条件查询的列作为索引
- 频繁作为连接字段的列作为索引
- 频繁更新的列不要作为索引，因为更新也需要更新索引，所以比较耗时

什么情况可以加索引

- 有唯一性的字段
- order by/group by这种可以加索引，因为索引已经拍好了
- 经常被where/select使用的

什么情况下不应该加索引

- 表中数据较少
- 经常被更新的列
- where/order by/group by用不上的字段
- 重复值较多的列

### 8.2 每张表上的索引不宜过多

每张表上的索引最多不要大于5个，索引虽然能够加快查找，但是也需要消耗时间来维护，并且也需要占用一定的存储空间，如果索引过多，那么可能会适得其反

### 8.3 删除不常用的索引

### 8.4 尽可能地使用联合索引

我们应该尽可能地使用联合索引而不是单列索引，因为索引也是要存储的，我们可以把索引联合起来，这样只需要存一个B+树

### 8.5 对于字符串索引，要使用前缀索引

因为前缀索引占用空间更小，查询速度更快

### 8.6 要避免索引失效

这个另说，见另一篇

### 8.7 要避免索引重复

如果已经建立了联合索引，那么单列索引就不需要了，需要删除

有关索引的使用，可以见下面：

```sql
mysql> create index ai on t (a);
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> create index bi on t (b);
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> insert into t values (1, 1, 'ab', 'cd');
Query OK, 1 row affected (0.01 sec)

mysql> insert into t values (2,2,'abc','def');
Query OK, 1 row affected (0.01 sec)

mysql> select * from t;
+---+------+------+------+
| k | a    | b    | c    |
+---+------+------+------+
| 1 |    1 | ab   | cd   |
| 2 |    2 | abc  | def  |
+---+------+------+------+
2 rows in set (0.00 sec)

mysql> explain select * from t;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | t     | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    2 |   100.00 | NULL  |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> explain select a from t;
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | t     | NULL       | index | NULL          | ai   | 5       | NULL |    2 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> explain select a from t where b like 'a%';
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-----------------------+
| id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | t     | NULL       | range | bi            | bi   | 403     | NULL |    2 |   100.00 | Using index condition |
+----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
```

注意到type从ALL到index到range