import{_ as d}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as l,c as r,b as n,d as e,e as i,a}from"./app-2bc3c870.js";const c="/blog/assets/1710916356046-5c764891.png",u="/blog/assets/1711414854166-554e28a5.svg",p="/blog/assets/1710812752945-89bdd080.png",o="/blog/assets/1710812865847-1188bc3e.png",v="/blog/assets/1710813148985-ec6c2b90.png",m="/blog/assets/1710851784167-5c29a3c6.png",b="/blog/assets/1710853147426-befc0fce.png",h={},k={href:"https://blog.csdn.net/weixin_43246215/article/details/108041739",target:"_blank",rel:"noopener noreferrer"},g={href:"https://zhuanlan.zhihu.com/p/631670359",target:"_blank",rel:"noopener noreferrer"},y=a('<p>Redis中有5中基本类型和4种常见类型（后续更新支持的），它们是：</p><h2 id="五种基本类型" tabindex="-1"><a class="header-anchor" href="#五种基本类型" aria-hidden="true">#</a> 五种基本类型：</h2><ul><li>string</li><li>list</li><li>set</li><li>sorted set</li><li>hash</li></ul><h2 id="四种常见类型" tabindex="-1"><a class="header-anchor" href="#四种常见类型" aria-hidden="true">#</a> 四种常见类型：</h2><ul><li>GEO 地理位置 v3.2支持</li><li>HyperLogLog v2.8支持</li><li>Bitmap 位图 v2.2支持</li><li>Stream v5.0支持</li></ul><p><img src="'+c+'" alt="1710916356046"></p><p><img src="'+u+'" alt="1711414854166"></p><h2 id="_1-string" tabindex="-1"><a class="header-anchor" href="#_1-string" aria-hidden="true">#</a> 1.string</h2><p>string是最基本的key-value结构，key是唯一表示，value不只是字符串，也可以是数字，value最长可容纳的数据长度是512M。</p><h3 id="_1-1-内部实现" tabindex="-1"><a class="header-anchor" href="#_1-1-内部实现" aria-hidden="true">#</a> 1.1 内部实现</h3><h4 id="_1-1-1-数据结构" tabindex="-1"><a class="header-anchor" href="#_1-1-1-数据结构" aria-hidden="true">#</a> 1.1.1 数据结构</h4><p><strong>string底层的数据结构主要是int和SDS（简单动态字符串）。</strong></p><p>下面之所以和C语言来比，是因为Redis的底层实现是C。</p><p>SDS和C标准字符串不太一样，SDS相比C标准字符串，支持：</p><ul><li><strong>SDS不仅可以保存文本数据，还可以保存二进制数据。</strong> 原因：SDS使用一个参数len来保存字符串长度，而不是通过终止符(&#39;\\0&#39;)来判断字符串是否结束。而且，SDS中的所有API都会以处理二进制的方式来处理存储在buf[]数组中的数据。所以，SDS不仅可以存储文本，还可以存储图片、音频、视频、压缩包等二进制数据。</li><li><strong>SDS中获取字符串长度的时间复杂度为O(1)。</strong> 原因：因为SDS使用参数len来保存字符串长度，C字符串通过遍历的方式来获取字符串长度，所以时间复杂度为O(n)。</li><li><strong>SDS的API是安全的</strong>。SDS中拼接字符串不会导致缓冲区的溢出，因为SDS会在拼接之前检查空间是否满足要求，如果不满足就会进行扩容。</li></ul><h4 id="_1-1-2-数据编码" tabindex="-1"><a class="header-anchor" href="#_1-1-2-数据编码" aria-hidden="true">#</a> 1.1.2 数据编码</h4><p><strong>string内部编码有int、raw、embstr，其中int对应数据结构int，raw和embstr对应数据结构SDS。</strong></p><ul><li><p>如果一个字符串对象保存的是整数值，并且这个值可以用long来表示，那么字符串对象会将整数值保存在字符串对象结构的ptr属性里，并将字符串对象的编码设置为int。</p><p><img src="'+p+'" alt="1710812752945"></p></li><li><p>如果一个字符串对象保存的是一个字符串，且字符串长度小于等于某个字节（v2.x是32字节），那么字符串对象会使用SDS来保存这个字符串），并且将对象编码设置为embstr，embstr是专门用于存储短字符串的一种优化编码。</p><p><img src="'+o+'" alt="1710812865847"></p></li><li><p>如果一个字符串对象保存的是一个字符串，且字符串长度大于某个字节，那么字符串对象仍然使用SDS数据结构来保存这个字符串，但是对象编码是raw。此时可以看的ptr是指向SDS的地址的</p><p><img src="'+v+'" alt="1710813148985"></p></li></ul><h5 id="那么-embstr和raw有什么区别" tabindex="-1"><a class="header-anchor" href="#那么-embstr和raw有什么区别" aria-hidden="true">#</a> 那么，embstr和raw有什么区别？</h5><p>embstr会通过一次内存分配函数来分配一块连续的内存空间来保存redisObject和SDS，而raw会通过两次内存分配来分别分配两块内存空间来保存redisObject和SDS。这样做的好处：</p><ul><li>embstr将创建字符串对象所需的内存分配次数从两次降低到了一次</li><li>释放embstr编码的字符串同样也只需要调用一次内存释放函数</li><li>因为embstr编码的字符串对象的所有数据都保存在一块连续的内存里面，可以更好地利用CPU缓存提升性能</li></ul><p>当然，这样做也有缺点：</p><ul><li>如果字符串长度增加需要重新分配内存，redisObject和SDS都需要重新分配，所以，embstr编码的字符串实际上是只读的，Redis没有为embstr编码的字符串对象提供相应的修改程序。当我们对embstr编码的字符串进行append操作的时候，Redis会将embstr编码转换成raw编码，然后再进行修改。</li></ul><h3 id="_1-2-应用场景" tabindex="-1"><a class="header-anchor" href="#_1-2-应用场景" aria-hidden="true">#</a> 1.2 应用场景</h3><ul><li>缓存对象</li><li>计数</li><li>分布式锁 Redis可以实现分布式锁，因为SET命令有个参数NX，可以实现“只有不存在才插入”，这样就可以以插入成功作为加锁成功，插入失败作为加锁失败。同时，SET命令还有一个参数PX，表示这个key多久(ms)后会过期（删掉这个key），可以防止上锁后忘记解锁。</li><li>共享Session 在单服务器中，Session可以存到服务器上，但是分布式部署的就不行了，因为下一次分配到的服务器可能不是上一次的，就没有Session信息了，所以可以把Session存到Redis中。</li></ul><h2 id="_2-list" tabindex="-1"><a class="header-anchor" href="#_2-list" aria-hidden="true">#</a> 2.list</h2><p>list是字符串列表，按插入顺序进行排序，可以进行头插和尾插，列表最大长度位2^32-1。</p><h3 id="_2-1-内部实现-数据结构" tabindex="-1"><a class="header-anchor" href="#_2-1-内部实现-数据结构" aria-hidden="true">#</a> 2.1 内部实现-数据结构</h3><p>在v3.2之前，list底层数据结构为双向链表或压缩列表</p><ul><li>如果列表长度小于512（默认），列表中数据长度均小于64字节（默认），那么就使用压缩列表。</li><li>否则，使用双向链表。</li></ul>',30),S={href:"https://www.cnblogs.com/hunternet/p/12624691.html",target:"_blank",rel:"noopener noreferrer"},_=a(`<h3 id="_2-2-常用命令" tabindex="-1"><a class="header-anchor" href="#_2-2-常用命令" aria-hidden="true">#</a> 2.2 常用命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>lpush key value
lpop key
rpush key value
rpop key
<span class="token comment"># 返回指定区间内的元素</span>
lrange key start stop
<span class="token comment"># 从key列表表头弹出一个元素，没有就阻塞timeout秒，如果timeout=0则一直阻塞</span>
blpop key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span> <span class="token function">timeout</span>
<span class="token comment"># 从key列表表尾弹出一个元素，没有就阻塞timeout秒，如果timeout=0则一直阻塞</span>
brpop key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span> <span class="token function">timeout</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-应用场景" tabindex="-1"><a class="header-anchor" href="#_2-3-应用场景" aria-hidden="true">#</a> 2.3 应用场景</h3><p>消息队列是list的常见应用场景。</p><p><strong>消息队列在存取消息时，需要保证三个需求：消息保序、重复消息的处理、保证消息的可靠性。</strong></p><h4 id="_2-3-1-list如何保证消息的有序性" tabindex="-1"><a class="header-anchor" href="#_2-3-1-list如何保证消息的有序性" aria-hidden="true">#</a> 2.3.1 list如何保证消息的有序性</h4><p>list本身就是一个先进先出的数据类型，只需要通过lpush和rpop的组合就可以保证消息的有序性了。</p><p>但是这样可能会有一个问题，就是如果list中没有数据，那么消费者就需要一直尝试读取，这样效率比较低，所以Redis提供了一个方法brpop/blpop，可以在list中没有数据时进行阻塞，这样效率会好一些。</p><h4 id="_2-3-2-list如何处理重复消息" tabindex="-1"><a class="header-anchor" href="#_2-3-2-list如何处理重复消息" aria-hidden="true">#</a> 2.3.2 list如何处理重复消息</h4><p>这个还挺抽象的，为什么需要处理重复消息？因为重复的消息代表已经被处理过了，不需要再处理了，所以需要进行判断。</p><p>消费者要实现重复消息的判断，需要 2 个方面的要求：</p><ul><li>每个消息都有一个全局的 ID。</li><li>消费者要记录已经处理过的消息的 ID。当收到一条消息后，消费者程序就可以对比收到的消息 ID 和记录的已处理过的消息 ID，来判断当前收到的消息有没有经过处理。如果已经处理过，那么，消费者程序就不再进行处理了。</li></ul><p>但是<strong>List 并不会为每个消息生成 ID 号，所以我们需要自行为每个消息生成一个全局唯一ID</strong>，生成之后，我们在用 LPUSH 命令把消息插入 List 时，需要在消息中包含这个全局唯一 ID。</p><p>例如，我们执行以下命令，就把一条全局 ID 为 111000102、库存量为 99 的消息插入了消息队列：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&gt; LPUSH mq &quot;111000102:stock:99&quot;
(integer) 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-3-3-如何保证消息的可靠性" tabindex="-1"><a class="header-anchor" href="#_2-3-3-如何保证消息的可靠性" aria-hidden="true">#</a> 2.3.3 如何保证消息的可靠性</h4><p>所谓的可靠性，就是一个消息执行了，但是失败了，不能就不执行了，还得回到队列中等待执行，list通过brpoplpush把当前读到的数据存到<strong>另一个list中</strong>进行备份，这样就可以在执行失败后读备份list中的数据执行了。</p><h4 id="_2-3-4-list实现消息队列有什么问题" tabindex="-1"><a class="header-anchor" href="#_2-3-4-list实现消息队列有什么问题" aria-hidden="true">#</a> 2.3.4 list实现消息队列有什么问题</h4><p>list不支持多个消费者消费同一条数据，因为一条数据一旦被处理，就从list中消失了，其他消费者读不到了。Redis的Stream类型可以解决这个问题。</p><h2 id="_3-hash" tabindex="-1"><a class="header-anchor" href="#_3-hash" aria-hidden="true">#</a> 3.hash</h2><p>hash是k-v存储的数据格式，它的value是[{key:value},{key,value}...]这种。hash特别适用于存储对象，要比string方便不少。</p><h3 id="_3-1-内部实现" tabindex="-1"><a class="header-anchor" href="#_3-1-内部实现" aria-hidden="true">#</a> 3.1 内部实现</h3><p>hash类型的底层数据结构是压缩列表或者哈希表</p><ul><li>如果哈希类型的元素个数小于512个，所有值小于64字节，Redis会使用压缩列表</li><li>否则，会使用哈希表。</li></ul><p>v7.0，压缩列表被弃用，使用listpack数据结构了。</p><h3 id="_3-2-常用命令" tabindex="-1"><a class="header-anchor" href="#_3-2-常用命令" aria-hidden="true">#</a> 3.2 常用命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 存储一个哈希表key的键值</span>
HSET key field value   
<span class="token comment"># 获取哈希表key对应的field键值</span>
HGET key field

<span class="token comment"># 在一个哈希表key中存储多个键值对</span>
HMSET key field value <span class="token punctuation">[</span>field value<span class="token punctuation">..</span>.<span class="token punctuation">]</span> 
<span class="token comment"># 批量获取哈希表key中多个field键值</span>
HMGET key field <span class="token punctuation">[</span>field <span class="token punctuation">..</span>.<span class="token punctuation">]</span>   
<span class="token comment"># 删除哈希表key中的field键值</span>
HDEL key field <span class="token punctuation">[</span>field <span class="token punctuation">..</span>.<span class="token punctuation">]</span>  

<span class="token comment"># 返回哈希表key中field的数量</span>
HLEN key   
<span class="token comment"># 返回哈希表key中所有的键值</span>
HGETALL key 

<span class="token comment"># 为哈希表key中field键的值加上增量n</span>
HINCRBY key field n  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-应用场景" tabindex="-1"><a class="header-anchor" href="#_3-3-应用场景" aria-hidden="true">#</a> 3.3 应用场景</h3><ul><li><p>缓存对象</p></li><li><p>购物车，以用户id为key，商品id为field，商品数量为value</p><p><img src="`+m+`" alt="1710851784167"></p></li></ul><h2 id="_4-set" tabindex="-1"><a class="header-anchor" href="#_4-set" aria-hidden="true">#</a> 4.set</h2><p>set是一个<strong>无序且唯一</strong>的键值集合，不会按照插入的先后顺序进行存储。最多可以存储2^32-1个值</p><p>set和list的区别</p><ul><li>list可以存储重复数据，set只能存储非重复数据</li><li>list有序，set无序</li></ul><h3 id="_4-1-内部实现" tabindex="-1"><a class="header-anchor" href="#_4-1-内部实现" aria-hidden="true">#</a> 4.1 内部实现</h3><p>set底层数据结构有两种：哈希表和整数集合</p><ul><li>如果集合中的元素都是整数且长度小于512，那么底层数据结构就是整数集合</li><li>否则，使用哈希表来存储</li></ul><h3 id="_4-2-常用命令" tabindex="-1"><a class="header-anchor" href="#_4-2-常用命令" aria-hidden="true">#</a> 4.2 常用命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 往集合key中存入元素，元素存在则忽略，若key不存在则新建</span>
SADD key member <span class="token punctuation">[</span>member <span class="token punctuation">..</span>.<span class="token punctuation">]</span>
<span class="token comment"># 从集合key中删除元素</span>
SREM key member <span class="token punctuation">[</span>member <span class="token punctuation">..</span>.<span class="token punctuation">]</span> 
<span class="token comment"># 获取集合key中所有元素</span>
SMEMBERS key
<span class="token comment"># 获取集合key中的元素个数</span>
SCARD key

<span class="token comment"># 判断member元素是否存在于集合key中</span>
SISMEMBER key member

<span class="token comment"># 从集合key中随机选出count个元素，元素不从key中删除</span>
SRANDMEMBER key <span class="token punctuation">[</span>count<span class="token punctuation">]</span>
<span class="token comment"># 从集合key中随机选出count个元素，元素从key中删除</span>
SPOP key <span class="token punctuation">[</span>count<span class="token punctuation">]</span>

<span class="token comment"># 交集运算</span>
SINTER key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span>
<span class="token comment"># 将交集结果存入新集合destination中</span>
SINTERSTORE destination key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span>

<span class="token comment"># 并集运算</span>
SUNION key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span>
<span class="token comment"># 将并集结果存入新集合destination中</span>
SUNIONSTORE destination key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span>

<span class="token comment"># 差集运算</span>
SDIFF key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span>
<span class="token comment"># 将差集结果存入新集合destination中</span>
SDIFFSTORE destination key <span class="token punctuation">[</span>key <span class="token punctuation">..</span>.<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-应用场景" tabindex="-1"><a class="header-anchor" href="#_4-3-应用场景" aria-hidden="true">#</a> 4.3 应用场景</h3><p>集合的主要几个特性，无序、不可重复、支持并交差等操作。</p><p>因此 Set 类型比较适合用来数据去重和保障数据的唯一性，还可以用来统计多个集合的交集、错集和并集等，当我们存储的数据是无序并且需要去重的情况下，比较适合使用集合类型进行存储。</p><p>但是要提醒你一下，这里有一个潜在的风险。 <strong>Set 的差集、并集和交集的计算复杂度较高，在数据量较大的情况下，如果直接执行这些计算，会导致 Redis 实例阻塞</strong> 。</p><p>在主从集群中，为了避免主库因为 Set 做聚合计算（交集、差集、并集）时导致主库被阻塞，我们可以选择一个从库完成聚合统计，或者把数据返回给客户端，由客户端来完成聚合统计。</p><h4 id="_4-3-1-点赞" tabindex="-1"><a class="header-anchor" href="#_4-3-1-点赞" aria-hidden="true">#</a> 4.3.1 点赞</h4><p>set可以保证一个id只点赞一次</p><h4 id="_4-3-2-共同关注" tabindex="-1"><a class="header-anchor" href="#_4-3-2-共同关注" aria-hidden="true">#</a> 4.3.2 共同关注</h4><p>可以用set的交集来做共同关注功能</p><h4 id="_4-3-3-抽奖" tabindex="-1"><a class="header-anchor" href="#_4-3-3-抽奖" aria-hidden="true">#</a> 4.3.3 抽奖</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&gt;SADD lucky Tom Jerry John Sean Marry Lindy Sary Mark
(integer) 5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果允许重复中奖，可以使用 SRANDMEMBER 命令。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 抽取 1 个一等奖：
&gt; SRANDMEMBER lucky 1
1) &quot;Tom&quot;
# 抽取 2 个二等奖：
&gt; SRANDMEMBER lucky 2
1) &quot;Mark&quot;
2) &quot;Jerry&quot;
# 抽取 3 个三等奖：
&gt; SRANDMEMBER lucky 3
1) &quot;Sary&quot;
2) &quot;Tom&quot;
3) &quot;Jerry&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果不允许重复中奖，可以使用 SPOP 命令。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 抽取一等奖1个
&gt; SPOP lucky 1
1) &quot;Sary&quot;
# 抽取二等奖2个
&gt; SPOP lucky 2
1) &quot;Jerry&quot;
2) &quot;Mark&quot;
# 抽取三等奖3个
&gt; SPOP lucky 3
1) &quot;John&quot;
2) &quot;Sean&quot;
3) &quot;Lindy&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-zset-sorted-set" tabindex="-1"><a class="header-anchor" href="#_5-zset-sorted-set" aria-hidden="true">#</a> 5. zset (sorted set)</h2><p>zset有序集合，相当于在set的基础上多一个score属性，这样就可以根据score进行排序了，然后也有set的不可重复（score是可以重复）的特点</p><p><img src="`+b+`" alt="1710853147426"></p><h3 id="_5-1-内部实现" tabindex="-1"><a class="header-anchor" href="#_5-1-内部实现" aria-hidden="true">#</a> 5.1 内部实现</h3><p>Zset 类型的底层数据结构是由<strong>压缩列表或跳表</strong>实现的：</p><ul><li>如果有序集合的元素个数小于 128 个，并且每个元素的值小于 64 字节时，Redis 会使用<strong>压缩列表</strong>作为 Zset 类型的底层数据结构；</li><li>如果有序集合的元素不满足上面的条件，Redis 会使用<strong>跳表</strong>作为 Zset 类型的底层数据结构；</li></ul><p><strong>在 Redis 7.0 中，压缩列表数据结构已经废弃了，交由 listpack 数据结构来实现了。</strong></p><h3 id="_5-2-常用命令" tabindex="-1"><a class="header-anchor" href="#_5-2-常用命令" aria-hidden="true">#</a> 5.2 常用命令</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 往有序集合key中加入带分值元素
ZADD key score member [[score member]...]   
# 往有序集合key中删除元素
ZREM key member [member...]       
# 返回有序集合key中元素member的分值
ZSCORE key member
# 返回有序集合key中元素个数
ZCARD key 

# 为有序集合key中元素member的分值加上increment
ZINCRBY key increment member 

# 正序获取有序集合key从start下标到stop下标的元素
ZRANGE key start stop [WITHSCORES]
# 倒序获取有序集合key从start下标到stop下标的元素
ZREVRANGE key start stop [WITHSCORES]

# 返回有序集合中指定分数区间内的成员，分数由低到高排序。
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]

# 返回指定成员区间内的成员，按字典正序排列, 分数必须相同。
ZRANGEBYLEX key min max [LIMIT offset count]
# 返回指定成员区间内的成员，按字典倒序排列, 分数必须相同
ZREVRANGEBYLEX key max min [LIMIT offset count]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Zset 运算操作（相比于 Set 类型，ZSet 类型没有支持差集运算）：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 并集计算(相同元素分值相加)，numberkeys一共多少个key，WEIGHTS每个key对应的分值乘积
ZUNIONSTORE destkey numberkeys key [key...] 
# 交集计算(相同元素分值相加)，numberkeys一共多少个key，WEIGHTS每个key对应的分值乘积
ZINTERSTORE destkey numberkeys key [key...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-应用场景" tabindex="-1"><a class="header-anchor" href="#_5-3-应用场景" aria-hidden="true">#</a> 5.3 应用场景</h3><p>排行榜</p><h2 id="_6-bitmap" tabindex="-1"><a class="header-anchor" href="#_6-bitmap" aria-hidden="true">#</a> 6. bitmap</h2><p>bitmap，位图，是一串连续的二进制数组，可以通过偏移量来定位元素</p><p>bitmap通过计算机中的最小单位bit来进行0 1设置，可以用来表示某个元素的值或者状态</p><p>因为bit占用空间非常小，所以非常适合一些数据量大并且只需要二值统计的场景。</p><h3 id="_6-1-底层实现" tabindex="-1"><a class="header-anchor" href="#_6-1-底层实现" aria-hidden="true">#</a> 6.1 底层实现</h3><p>bitmap底层通过string来实现。</p><p>string类型会保存为二进制的字节数组，所以，Redis就把字节数组的每个bit位利用起来，用来表示一个元素的二值状态。bitmap可以看作是一个bit数组。</p><h3 id="_6-2-常用命令" tabindex="-1"><a class="header-anchor" href="#_6-2-常用命令" aria-hidden="true">#</a> 6.2 常用命令</h3><p>bitmap 基本操作：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 设置值，其中value只能是 0 和 1
SETBIT key offset value

# 获取值
GETBIT key offset

# 获取指定范围内值为 1 的个数
# start 和 end 以字节为单位
BITCOUNT key start end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>bitmap 运算操作：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># BitMap间的运算
# operations 位移操作符，枚举值
  AND 与运算 &amp;
  OR 或运算 |
  XOR 异或 ^
  NOT 取反 ~
# result 计算的结果，会存储在该key中
# key1 … keyn 参与运算的key，可以有多个，空格分割，not运算只能一个key
# 当 BITOP 处理不同长度的字符串时，较短的那个字符串所缺少的部分会被看作 0。返回值是保存到 destkey 的字符串的长度（以字节byte为单位），和输入 key 中最长的字符串长度相等。
BITOP [operations] [result] [key1] [keyn…]

# 返回指定key中第一次出现指定value(0/1)的位置
BITPOS [key] [value]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-应用场景" tabindex="-1"><a class="header-anchor" href="#_6-2-应用场景" aria-hidden="true">#</a> 6.2 应用场景</h3><p>bitmap适合存储一些数据量很大，但是只需要进行二值存储的内容</p><p>比如签到表。可以用0表示未签到，1表示签到，这样一个月也就30多bit，一年也就365bit。</p><h4 id="_6-2-1-签到表" tabindex="-1"><a class="header-anchor" href="#_6-2-1-签到表" aria-hidden="true">#</a> 6.2.1 签到表</h4><p>假设我们要统计 ID 100 的用户在 2022 年 6 月份的签到情况，就可以按照下面的步骤进行操作。</p><p>第一步，执行下面的命令，记录该用户 6 月 3 号已签到。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SETBIT uid:sign:100:202206 2 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第二步，检查该用户 6 月 3 日是否签到。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GETBIT uid:sign:100:202206 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第三步，统计该用户在 6 月份的签到次数。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>BITCOUNT uid:sign:100:202206
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这样，我们就知道该用户在 6 月份的签到情况了。</p><blockquote><p>如何统计这个月首次打卡时间呢？</p></blockquote><p>Redis 提供了 BITPOS key bitValue [start] [end]指令，返回数据表示 Bitmap 中第一个值为 bitValue 的 offset 位置。</p><p>在默认情况下， 命令将检测整个位图， 用户可以通过可选的 start 参数和 end 参数指定要检测的范围。所以我们可以通过执行这条命令来获取 userID = 100 在 2022 年 6 月份<strong>首次打卡</strong>日期：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>BITPOS uid:sign:100:202206 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>需要注意的是，因为 offset 从 0 开始的，所以我们需要将返回的 value + 1 。</p><h4 id="_6-3-2-连续签到用户总数" tabindex="-1"><a class="header-anchor" href="#_6-3-2-连续签到用户总数" aria-hidden="true">#</a> 6.3.2 连续签到用户总数</h4><p>如何统计出这连续 7 天连续打卡用户总数呢？</p><p>我们把每天的日期作为 Bitmap 的 key，userId 作为 offset，若是打卡则将 offset 位置的 bit 设置成 1。</p><p>key 对应的集合的每个 bit 位的数据则是一个用户在该日期的打卡记录。</p><p>一共有 7 个这样的 Bitmap，如果我们能对这 7 个 Bitmap 的对应的 bit 位做 『与』运算。同样的 UserID offset 都是一样的，当一个 userID 在 7 个 Bitmap 对应对应的 offset 位置的 bit = 1 就说明该用户 7 天连续打卡。</p><p>结果保存到一个新 Bitmap 中，我们再通过 BITCOUNT 统计 bit = 1 的个数便得到了连续打卡 7 天的用户总数了。</p><p>Redis 提供了 BITOP operation destkey key [key ...]这个指令用于对一个或者多个 key 的 Bitmap 进行位元操作。</p><ul><li>operation 可以是 and、OR、NOT、XOR。当 BITOP 处理不同长度的字符串时，较短的那个字符串所缺少的部分会被看作 0 。空的 key 也被看作是包含 0 的字符串序列。</li></ul><p>假设要统计 3 天连续打卡的用户数，则是将三个 bitmap 进行 AND 操作，并将结果保存到 destmap 中，接着对 destmap 执行 BITCOUNT 统计，如下命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 与操作
BITOP AND destmap bitmap:01 bitmap:02 bitmap:03
# 统计 bit 位 =  1 的个数
BITCOUNT destmap
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即使一天产生一个亿的数据，Bitmap 占用的内存也不大，大约占 12 MB 的内存（10^8/8/1024/1024），7 天的 Bitmap 的内存开销约为 84 MB。同时我们最好给 Bitmap 设置过期时间，让 Redis 删除过期的打卡数据，节省内存。</p><h2 id="_7-hyperloglog" tabindex="-1"><a class="header-anchor" href="#_7-hyperloglog" aria-hidden="true">#</a> 7.HyperLogLog</h2><p>Redis HyperLogLog 是 Redis 2.8.9 版本新增的数据类型，是一种用于「统计基数」的数据集合类型，基数统计就是指统计一个集合中不重复的元素个数。但要注意，HyperLogLog 是统计规则是基于概率完成的，不是非常准确，标准误算率是 0.81%。</p><p>所以，简单来说 HyperLogLog <strong>提供不精确的去重计数</strong> 。</p><p>HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的内存空间总是固定的、并且是很小的。</p><p>在 Redis 里面，<strong>每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近</strong> <strong>2^64</strong> <strong>个不同元素的基数</strong> ，和元素越多就越耗费内存的 Set 和 Hash 类型相比，HyperLogLog 就非常节省空间。</p><h3 id="_7-1-常见命令" tabindex="-1"><a class="header-anchor" href="#_7-1-常见命令" aria-hidden="true">#</a> 7.1 常见命令</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 添加指定元素到 HyperLogLog 中
PFADD key element [element ...]

# 返回给定 HyperLogLog 的基数估算值。
PFCOUNT key [key ...]

# 将多个 HyperLogLog 合并为一个 HyperLogLog
PFMERGE destkey sourcekey [sourcekey ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-应用场景" tabindex="-1"><a class="header-anchor" href="#_7-2-应用场景" aria-hidden="true">#</a> 7.2 应用场景</h3><p>百万级网页UV计数</p><h2 id="_8-geo-地理位置" tabindex="-1"><a class="header-anchor" href="#_8-geo-地理位置" aria-hidden="true">#</a> 8. GEO 地理位置</h2><p>Redis GEO 是 Redis 3.2 版本新增的数据类型，主要用于存储地理位置信息，并对存储的信息进行操作。</p><p>在日常生活中，我们越来越依赖搜索“附近的餐馆”、在打车软件上叫车，这些都离不开基于位置信息服务（Location-Based Service，LBS）的应用。LBS 应用访问的数据是和人或物关联的一组经纬度信息，而且要能查询相邻的经纬度范围，GEO 就非常适合应用在 LBS 服务的场景中。</p><h3 id="_8-1-内部实现" tabindex="-1"><a class="header-anchor" href="#_8-1-内部实现" aria-hidden="true">#</a> 8.1 内部实现</h3><p>GEO 本身并没有设计新的底层数据结构，而是直接使用了 Sorted Set 集合类型。</p><p>GEO 类型使用 GeoHash 编码方法实现了经纬度到 Sorted Set 中元素权重分数的转换，这其中的两个关键机制就是「对二维地图做区间划分」和「对区间进行编码」。一组经纬度落在某个区间后，就用区间的编码值来表示，并把编码值作为 Sorted Set 元素的权重分数。</p><p>这样一来，我们就可以把经纬度保存到 Sorted Set 中，利用 Sorted Set 提供的“按权重进行有序范围查找”的特性，实现 LBS 服务中频繁使用的“搜索附近”的需求。</p><h3 id="_8-2-常用命令" tabindex="-1"><a class="header-anchor" href="#_8-2-常用命令" aria-hidden="true">#</a> 8.2 常用命令</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 存储指定的地理空间位置，可以将一个或多个经度(longitude)、纬度(latitude)、位置名称(member)添加到指定的 key 中。
GEOADD key longitude latitude member [longitude latitude member ...]

# 从给定的 key 里返回所有指定名称(member)的位置（经度和纬度），不存在的返回 nil。
GEOPOS key member [member ...]

# 返回两个给定位置之间的距离。
GEODIST key member1 member2 [m|km|ft|mi]

# 根据用户给定的经纬度坐标来获取指定范围内的地理位置集合。
GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-应用场景" tabindex="-1"><a class="header-anchor" href="#_8-3-应用场景" aria-hidden="true">#</a> 8.3 应用场景</h3><h4 id="_8-3-1-滴滴叫车" tabindex="-1"><a class="header-anchor" href="#_8-3-1-滴滴叫车" aria-hidden="true">#</a> 8.3.1 滴滴叫车</h4><p>这里以滴滴叫车的场景为例，介绍下具体如何使用 GEO 命令：GEOADD 和 GEORADIUS 这两个命令。</p><p>假设车辆 ID 是 33，经纬度位置是（116.034579，39.030452），我们可以用一个 GEO 集合保存所有车辆的经纬度，集合 key 是 cars:locations。</p><p>执行下面的这个命令，就可以把 ID 号为 33 的车辆的当前经纬度位置存入 GEO 集合中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GEOADD cars:locations 116.034579 39.030452 33
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>当用户想要寻找自己附近的网约车时，LBS 应用就可以使用 GEORADIUS 命令。</p><p>例如，LBS 应用执行下面的命令时，Redis 会根据输入的用户的经纬度信息（116.054579，39.030452 ），查找以这个经纬度为中心的 5 公里内的车辆信息，并返回给 LBS 应用。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GEORADIUS cars:locations 116.054579 39.030452 5 km ASC COUNT 10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,133);function x(f,E){const s=t("ExternalLinkIcon");return l(),r("div",null,[n("p",null,[e("总结于"),n("a",k,[e("来源1"),i(s)]),e(),n("a",g,[e("来源2"),i(s)])]),y,n("p",null,[e("v3.2之后，就只有quicklist了。有关quicklist，可以参考"),n("a",S,[e("这篇文章"),i(s)]),e("。")]),_])}const I=d(h,[["render",x],["__file","redis_datatype.html.vue"]]);export{I as default};
