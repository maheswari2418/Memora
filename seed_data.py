# List of 15 synthetic incident postmortems designed for RecallOps
# Each incident represents a realistic outage pattern with root causes, fix steps, and metadata.
# Deliberately contains shared upstream services and root cause categories to show Cognee's graph traversal.

INCIDENTS = [
    {
        "id": "INC-001",
        "title": "API Gateway 502 Bad Gateway Cascading Failures",
        "severity": "P1",
        "services_affected": ["api-gateway", "auth-service"],
        "symptoms": "Spikes in 502/504 errors on outer API gateway layer. Users unable to load landing or login pages. Healthcheck endpoint returning failures.",
        "root_cause": "Bad deployment on auth-service canary version v1.5.0 caused a memory leak, making it crash loop. API Gateway could not route authentication requests and connection pools became exhausted.",
        "fix_steps": [
            "Roll back auth-service deployment to previous stable version v1.4.2.",
            "Restart API Gateway pods to clear stale TCP sockets.",
            "Monitor gateway error rate back to baseline."
        ],
        "category": "Deployment Failure",
        "upstream_service": "auth-service",
        "duration_minutes": 45,
        "resolved_by": "Alex Chen"
    },
    {
        "id": "INC-002",
        "title": "Database connection pool exhaustion in Payment Processing",
        "severity": "P1",
        "services_affected": ["payment-service", "payment-db"],
        "symptoms": "HTTP 504 Gateway Timeout during checkout. Active DB connection count peaking at 100%. Logs show connection acquisition timeouts.",
        "root_cause": "Unclosed database cursors in new order transaction API release v2.1.0 leaked connections under high traffic, exceeding connection pool limit (max 50 connections).",
        "fix_steps": [
            "Scale down payment-service replica count to 1 temporarily to reduce DB contention.",
            "Terminate hung transaction processes on payment-db using pg_terminate_backend query.",
            "Apply patch release v2.1.1 containing auto-closing resource handlers.",
            "Restore replica scale factor to original count."
        ],
        "category": "Connection Pool Exhaustion",
        "upstream_service": "payment-db",
        "duration_minutes": 32,
        "resolved_by": "Mahesh Kumar"
    },
    {
        "id": "INC-003",
        "title": "Expired TLS Certificate on Auth Cluster",
        "severity": "P1",
        "services_affected": ["auth-service", "load-balancer"],
        "symptoms": "SSL/TLS handshake errors when calling API gateway. Internal microservices reporting trust store validation errors: 'Certificate expired'.",
        "root_cause": "SSL certificate for auth.internal.local expired at midnight. The automated Let's Encrypt renewal script ran but failed to reload the Nginx load balancer configuration.",
        "fix_steps": [
            "Run certbot renew --force-renewal manually on auth load balancer host.",
            "Run Nginx reload command (nginx -s reload) on all auth cluster balancer instances.",
            "Verify SSL expiry dates using openssl s_client -connect auth.internal.local:443."
        ],
        "category": "Expired Certificate",
        "upstream_service": "cert-manager",
        "duration_minutes": 18,
        "resolved_by": "Sarah Jenkins"
    },
    {
        "id": "INC-004",
        "title": "Memory Leak in Recommendation Engine Cache",
        "severity": "P2",
        "services_affected": ["recommendation-service", "redis-cache"],
        "symptoms": "Recommendation service pods experiencing steady growth in memory consumption over 48 hours, eventually getting terminated by Kubernetes kernel (OOMKilled).",
        "root_cause": "Unbounded cache keys (lacking TTL expiration) in recommendation item pre-warming loop, leading to container memory exhaustion.",
        "fix_steps": [
            "Flush recommendation Redis database keys matching pattern 'rec_warm_*'.",
            "Update Redis configuration to set default maxmemory-policy to volatile-lru.",
            "Set cache entry TTL to 7200 seconds in recommendation config map.",
            "Restart recommendation service pods to initialize with empty memory footprint."
        ],
        "category": "Memory Leak",
        "upstream_service": "redis-cache",
        "duration_minutes": 60,
        "resolved_by": "Kenji Sato"
    },
    {
        "id": "INC-005",
        "title": "Kafka Broker Disk Full causing Ordering Lag",
        "severity": "P1",
        "services_affected": ["order-service", "kafka-cluster"],
        "symptoms": "Processing delay in shipping and inventory pipelines. Kafka lag monitor shows 250,000+ unconsumed events. Order processing lag rising.",
        "root_cause": "Kafka broker 3 disk capacity reached 100% due to excessively long log retention configuration (set to 30 days instead of 3 days) on high-throughput order topic.",
        "fix_steps": [
            "Update order topic log retention time to 72 hours via kafka-configs.sh utility.",
            "Force partition log segments deletion to free up broker disk space.",
            "Verify broker 3 returns to active status and partition replication catches up."
        ],
        "category": "Resource Exhaustion",
        "upstream_service": "kafka-cluster",
        "duration_minutes": 55,
        "resolved_by": "Elena Rostova"
    },
    {
        "id": "INC-006",
        "title": "CDN Cache Stampede on Product Metadata",
        "severity": "P2",
        "services_affected": ["catalog-service", "catalog-db"],
        "symptoms": "Spikes in database CPU to 99% and response times from catalog-db jumping from 50ms to 8000ms. Search results loading extremely slowly.",
        "root_cause": "CDN cache TTL expired for top-selling product category page, causing thousands of concurrent backend db queries (Cache Stampede/Thundering Herd).",
        "fix_steps": [
            "Enable cache locking/mutex in catalog cache middleware.",
            "Manually seed CDN cache with hot product IDs.",
            "Scale up database read replicas."
        ],
        "category": "Cache Stampede",
        "upstream_service": "catalog-db",
        "duration_minutes": 25,
        "resolved_by": "David Kim"
    },
    {
        "id": "INC-007",
        "title": "Elasticsearch Heap OOM during Bulk Indexing",
        "severity": "P2",
        "services_affected": ["search-service", "elasticsearch-cluster"],
        "symptoms": "Search autocomplete returning empty results, search engine cluster showing Red status. Bulk indexing cron jobs failing.",
        "root_cause": "Bulk indexing script ran with 50MB payloads without heap sizing optimization. Heap size was locked at default 1GB instead of recommended 4GB.",
        "fix_steps": [
            "Update ES_JAVA_OPTS in statefulset config to '-Xms4g -Xmx4g'.",
            "Restart Elasticsearch pods.",
            "Trigger re-indexing."
        ],
        "category": "Resource Exhaustion",
        "upstream_service": "elasticsearch-cluster",
        "duration_minutes": 40,
        "resolved_by": "Marcus Aurelius"
    },
    {
        "id": "INC-008",
        "title": "Nightly Cron Deadlocks in Inventory DB",
        "severity": "P3",
        "services_affected": ["inventory-service", "inventory-db"],
        "symptoms": "Database transaction deadlocks occurring daily at 02:00 UTC. Order updates failing. Logs show transaction rollback errors.",
        "root_cause": "Overlapping batch sync cron jobs running without distributed lock coordination, running concurrent updates on identical inventory rows.",
        "fix_steps": [
            "Introduce a Redis-based Redlock mechanism to coordinate ETL synchronization jobs.",
            "Verify lock acquisition before batch writes."
        ],
        "category": "Deadlock",
        "upstream_service": "inventory-db",
        "duration_minutes": 15,
        "resolved_by": "Linus Torvalds"
    },
    {
        "id": "INC-009",
        "title": "CoreDNS Pod Evictions causing Internal Resolving Failure",
        "severity": "P1",
        "services_affected": ["dns-resolver", "kubernetes-dns"],
        "symptoms": "Intermittent name resolution errors ('ErrImagePull' or 'dial tcp: lookup on 10.96.0.10:53'). App pods cannot reach other services.",
        "root_cause": "Node pressure evicted CoreDNS instances due to missing CPU limits. System resolver fell back to default ndots:5 configurations.",
        "fix_steps": [
            "Set CPU/Memory resources on CoreDNS deployment.",
            "Deploy node-local DNS cache to offload query pressure from master pods."
        ],
        "category": "Infrastructure Failure",
        "upstream_service": "kubernetes-dns",
        "duration_minutes": 22,
        "resolved_by": "Guido van Rossum"
    },
    {
        "id": "INC-010",
        "title": "Nil Pointer Exception in Shopping Cart Service",
        "severity": "P3",
        "services_affected": ["cart-service"],
        "symptoms": "500 Internal Server Errors in cart page. Logs show null pointer exceptions in discount processing engine.",
        "root_cause": "Misconfigured feature flag 'enable-dynamic-discounts' set to true without initializing the discount processor engine.",
        "fix_steps": [
            "Disable the feature flag 'enable-dynamic-discounts' in LaunchDarkly dashboard.",
            "Deploy hotfix release v1.8.1."
        ],
        "category": "Configuration Error",
        "upstream_service": "cart-service",
        "duration_minutes": 10,
        "resolved_by": "James Gosling"
    },
    {
        "id": "INC-011",
        "title": "Checkout Gateway Handshake Failures",
        "severity": "P1",
        "services_affected": ["checkout-service", "payment-service"],
        "symptoms": "Checkout processing fails with error 'Connect failed: SSL certificate validation failed' when connecting to payment gateway.",
        "root_cause": "The payment processing gateway TLS certificate renewed using a root CA that was missing in the checkout trust store. Root cert expired. Shared infrastructure failure with auth-service cert issues.",
        "fix_steps": [
            "Update CA certs bundle in checkout Docker base image.",
            "Run openssl connection verification manually.",
            "Restart checkout service pods."
        ],
        "category": "Expired Certificate",
        "upstream_service": "cert-manager",
        "duration_minutes": 30,
        "resolved_by": "Sarah Jenkins"
    },
    {
        "id": "INC-012",
        "title": "Database CPU Spike on Catalog Cluster",
        "severity": "P2",
        "services_affected": ["catalog-service", "catalog-db"],
        "symptoms": "High p99 latencies on catalogue, connection timeout error 'Timeout waiting for connection from pool' under load.",
        "root_cause": "New catalog filter query lacking index, exhausting the maximum client connection pool capacity (similar db thread issue as seen in payment-service connection issues).",
        "fix_steps": [
            "Terminate long-running slow queries on catalog-db.",
            "Add database index on product_categories(price, popularity).",
            "Restart app server pods to release connection pools."
        ],
        "category": "Connection Pool Exhaustion",
        "upstream_service": "catalog-db",
        "duration_minutes": 25,
        "resolved_by": "Mahesh Kumar"
    },
    {
        "id": "INC-013",
        "title": "OOM Killed during Startup loop in Order Engine",
        "severity": "P2",
        "services_affected": ["order-service"],
        "symptoms": "Deployment rollback loop. Pods crashing immediately with status OOMKilled upon launch.",
        "root_cause": "The service cache warming logic reads the entire item catalog into memory at boot time without chunking. Cache size grew too large, matching same unbounded memory model as recommendation-service memory leak.",
        "fix_steps": [
            "Update startup script to load catalog in chunks of 500 items.",
            "Increase Kubernetes pod RAM memory limit config from 512Mi to 1Gi."
        ],
        "category": "Memory Leak",
        "upstream_service": "redis-cache",
        "duration_minutes": 20,
        "resolved_by": "Kenji Sato"
    },
    {
        "id": "INC-014",
        "title": "Notification lag on SMS Gateway",
        "severity": "P3",
        "services_affected": ["notification-service", "kafka-cluster"],
        "symptoms": "Users report not receiving verification codes. Kafka consumer lag for topic sms-notifications growing by 50k events per hour.",
        "root_cause": "Kafka topic partition mismatch. Topic was resized to 8 partitions but consumer was hardcoded to listen only to partition 0.",
        "fix_steps": [
            "Update notification consumer configuration to enable group coordinator dynamic partition assignment.",
            "Restart notification-service consumers."
        ],
        "category": "Resource Exhaustion",
        "upstream_service": "kafka-cluster",
        "duration_minutes": 15,
        "resolved_by": "Elena Rostova"
    },
    {
        "id": "INC-015",
        "title": "Staging cluster unavailable due to Ingress SSL expiration",
        "severity": "P2",
        "services_affected": ["staging-ingress", "load-balancer"],
        "symptoms": "Staging UI shows NET::ERR_CERT_DATE_INVALID in browsers. API calls rejected. SSL Handshake failures.",
        "root_cause": "Expired wildcard TLS certificate *.staging.company.com due to Let's Encrypt cron renewal failing. Part of the certificate manager infrastructure issues.",
        "fix_steps": [
            "Run renewal manually using DNS validation challenge.",
            "Update ingress certificate secret in kubernetes staging namespace."
        ],
        "category": "Expired Certificate",
        "upstream_service": "cert-manager",
        "duration_minutes": 25,
        "resolved_by": "Sarah Jenkins"
    }
]

# 5 Mock alerts that will be simulated in the demo
MOCK_ALERTS = [
    {
        "id": "ALERT-101",
        "title": "P1 Checkout service failing: payment handshake timeouts",
        "service": "checkout-service",
        "symptoms": "Spike in checkout payment timeouts. Client connection reports 'SSL handshake failed'. Outgoing connections to external card networks failing.",
        "expected_recalled_ids": ["INC-011", "INC-003", "INC-015"],
        "description": "Checkout service returning HTTP 500/503. Log reports: SSL validation handshake failure while trying to call external provider. System trust store cannot verify domain certificate."
    },
    {
        "id": "ALERT-102",
        "title": "P1 Order catalog timeout cascade: DB connection pools full",
        "service": "catalog-service",
        "symptoms": "All catalog endpoints returning 504. DB connection pool acquisition time exceeding 10000ms. Catalog database CPU usage at 98%.",
        "expected_recalled_ids": ["INC-012", "INC-002"],
        "description": "High transaction latency on catalog cluster. Application logs contain: 'HikariPool-1 - Connection is not available, request timed out after 30000ms'. DB thread count maxed out."
    },
    {
        "id": "ALERT-103",
        "title": "P2 Shipping dispatch service crash loop: OOMKilled",
        "service": "shipping-service",
        "symptoms": "Shipping container pods failing to complete startup check. Kubernetes events show OOMKilled status. Memory usage spikes to limit within 5 seconds of launch.",
        "expected_recalled_ids": ["INC-013", "INC-004"],
        "description": "Shipping service pod restarted 12 times. Pod logs show caching logic loading full inventory dataset on startup, immediately hitting cgroup memory limits."
    },
    {
        "id": "ALERT-104",
        "title": "P2 Notification service consumer lag spiking on Kafka topic",
        "service": "notification-service",
        "symptoms": "Notification email queue delayed. Lag monitor showing 180,000 pending events on transactional-email topic. Partition consumption uneven.",
        "expected_recalled_ids": ["INC-014", "INC-005"],
        "description": "Consumer lag rising by 5000 messages/min. Consumer log shows division errors on kafka fetch metadata. Consumer thread count mismatched with target topic partitions."
    },
    {
        "id": "ALERT-105",
        "title": "P1 API Gateway 502 error spike after staging deployment",
        "service": "api-gateway",
        "symptoms": "API Gateway error rate at 85%. Authed requests returning HTTP 502 Bad Gateway. Inbound connections to user profile services failing.",
        "expected_recalled_ids": ["INC-001"],
        "description": "Deploy pipeline just pushed canary build v2.0.0. Outer API Gateway reports connection refused on internal authentication cluster endpoints."
    }
]
