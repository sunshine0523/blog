---
title: 在Docker中使用Milvus
---
Milvus是一个优秀的向量数据库，可以方便地存储embedding数据并且可以进行相似度分析。

出于方便的考虑，我们往往需要在Docker中运行Milvus，官方Github中提供了docker-compose.yml文件，见[Milvus Github Release页](https://github.com/milvus-io/milvus/releases)，但是我们可能需要将其进行一些个性化配置并且嵌入到我们的docker-compose.yml中，所以，可以参考Milvus在项目中scripts目录下的[standalone_embed.sh](https://github.com/milvus-io/milvus/blob/master/scripts/standalone_embed.sh)脚本，来进行自定义配置。

我需要将Milvus嵌入到我的LibUpdateTools项目的docker-compose.yml中，如下：

```yaml
  milvus-etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.5
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - ./db/etcd:/etcd
    command: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      test: [ "CMD", "etcdctl", "endpoint", "health" ]
      interval: 30s
      timeout: 20s
      retries: 3

  milvus:
    image: milvusdb/milvus:v2.4.0-rc.1
    environment:
      ETCD_ENDPOINTS: milvus-etcd:2379
      ETCD_USE_EMBED: false
      ETCD_DATA_DIR: /var/lib/milvus/etcd
      #ETCD_CONFIG_PATH: /milvus/configs/embedEtcd.yaml
      COMMON_STORAGETYPE: local
    command:
      [ "milvus", "run", "standalone" ]
    security_opt:
        - seccomp:unconfined
    volumes:
      - ./db/milvus:/var/lib/milvus
    ports:
      - 20009:19530
      - 20010:9091
      - 20011:2379
    depends_on:
      - milvus-etcd

  attu:
    image: zilliz/attu:latest
    environment:
      MILVUS_URL: milvus:19530
    ports:
      - 20012:3000
    depends_on:
      - milvus
```

其中attu为Milvus的可视化工具
