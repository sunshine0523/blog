import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as l,c,b as s,d as n,e as t,a as u}from"./app-2bc3c870.js";const i={},o=s("p",null,"Milvus是一个优秀的向量数据库，可以方便地存储embedding数据并且可以进行相似度分析。",-1),k={href:"https://github.com/milvus-io/milvus/releases",target:"_blank",rel:"noopener noreferrer"},r={href:"https://github.com/milvus-io/milvus/blob/master/scripts/standalone_embed.sh",target:"_blank",rel:"noopener noreferrer"},d=u(`<p>我需要将Milvus嵌入到我的LibUpdateTools项目的docker-compose.yml中，如下：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>  <span class="token key atrule">milvus-etcd</span><span class="token punctuation">:</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> milvus<span class="token punctuation">-</span>etcd
    <span class="token key atrule">image</span><span class="token punctuation">:</span> quay.io/coreos/etcd<span class="token punctuation">:</span>v3.5.5
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ETCD_AUTO_COMPACTION_MODE=revision
      <span class="token punctuation">-</span> ETCD_AUTO_COMPACTION_RETENTION=1000
      <span class="token punctuation">-</span> ETCD_QUOTA_BACKEND_BYTES=4294967296
      <span class="token punctuation">-</span> ETCD_SNAPSHOT_COUNT=50000
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./db/etcd<span class="token punctuation">:</span>/etcd
    <span class="token key atrule">command</span><span class="token punctuation">:</span> etcd <span class="token punctuation">-</span>advertise<span class="token punctuation">-</span>client<span class="token punctuation">-</span>urls=http<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span>2379 <span class="token punctuation">-</span>listen<span class="token punctuation">-</span>client<span class="token punctuation">-</span>urls http<span class="token punctuation">:</span>//0.0.0.0<span class="token punctuation">:</span>2379 <span class="token punctuation">-</span><span class="token punctuation">-</span>data<span class="token punctuation">-</span>dir /etcd
    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span>
      <span class="token key atrule">test</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;CMD&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;etcdctl&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;endpoint&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;health&quot;</span> <span class="token punctuation">]</span>
      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 30s
      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 20s
      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">3</span>

  <span class="token key atrule">milvus</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> milvusdb/milvus<span class="token punctuation">:</span>v2.4.0<span class="token punctuation">-</span>rc.1
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">ETCD_ENDPOINTS</span><span class="token punctuation">:</span> milvus<span class="token punctuation">-</span>etcd<span class="token punctuation">:</span><span class="token number">2379</span>
      <span class="token key atrule">ETCD_USE_EMBED</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">ETCD_DATA_DIR</span><span class="token punctuation">:</span> /var/lib/milvus/etcd
      <span class="token comment">#ETCD_CONFIG_PATH: /milvus/configs/embedEtcd.yaml</span>
      <span class="token key atrule">COMMON_STORAGETYPE</span><span class="token punctuation">:</span> local
    <span class="token key atrule">command</span><span class="token punctuation">:</span>
      <span class="token punctuation">[</span> <span class="token string">&quot;milvus&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;run&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;standalone&quot;</span> <span class="token punctuation">]</span>
    <span class="token key atrule">security_opt</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> seccomp<span class="token punctuation">:</span>unconfined
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./db/milvus<span class="token punctuation">:</span>/var/lib/milvus
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 20009<span class="token punctuation">:</span><span class="token number">19530</span>
      <span class="token punctuation">-</span> 20010<span class="token punctuation">:</span><span class="token number">9091</span>
      <span class="token punctuation">-</span> 20011<span class="token punctuation">:</span><span class="token number">2379</span>
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> milvus<span class="token punctuation">-</span>etcd

  <span class="token key atrule">attu</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> zilliz/attu<span class="token punctuation">:</span>latest
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">MILVUS_URL</span><span class="token punctuation">:</span> milvus<span class="token punctuation">:</span><span class="token number">19530</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 20012<span class="token punctuation">:</span><span class="token number">3000</span>
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> milvus
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中attu为Milvus的可视化工具</p>`,3);function v(m,b){const a=p("ExternalLinkIcon");return l(),c("div",null,[o,s("p",null,[n("出于方便的考虑，我们往往需要在Docker中运行Milvus，官方Github中提供了docker-compose.yml文件，见"),s("a",k,[n("Milvus Github Release页"),t(a)]),n("，但是我们可能需要将其进行一些个性化配置并且嵌入到我们的docker-compose.yml中，所以，可以参考Milvus在项目中scripts目录下的"),s("a",r,[n("standalone_embed.sh"),t(a)]),n("脚本，来进行自定义配置。")]),d])}const h=e(i,[["render",v],["__file","milvus.html.vue"]]);export{h as default};
