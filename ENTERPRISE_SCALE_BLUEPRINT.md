# Smart Kisan (స్మార్ట్ కిసాన్) — Enterprise Scale-Up Blueprint

> [!IMPORTANT]
> **Strategic Objective**: Evolve Smart Kisan from a standalone offline-first mobile app into a scalable, cloud-connected Precision Agriculture & AI Platform supporting hundreds of thousands of concurrent farmers, real-time IoT soil telemetry, multimodal crop disease diagnosis, voice-first vernacular AI, and enterprise data governance.

---

## 1. High-Level Enterprise System Architecture

The target ecosystem transitions to a **Distributed Microservices + Edge-IoT + Cloud Native AI** topology.

```mermaid
graph TD
    subgraph Client_Tier["Client & Edge Tier"]
        AndroidApp["Smart Kisan Android App (Jetpack Compose / Kotlin)"]
        IoTNUX["IoT Field Sensors (Soil Moisture, NPK, Weather Station)"]
        AdminWeb["Admin & FPO Web Portal (React / Next.js)"]
    end

    subgraph Edge_Gateway["Ingestion & Gateway Tier"]
        APIGateway["Kong / Traefik API Gateway (Rate Limiting, JWT Auth)"]
        MQTTBroker["EMQX / VerneMQ (High-Throughput IoT Broker - 1M+ conn)"]
        LoRaGateway["LoRaWAN Gateway (868 MHz / Sub-GHz Rural Range)"]
    end

    subgraph Service_Tier["Microservices (Go / Kotlin Spring Boot / Python)"]
        AuthSvc["Auth & Tenant Service (OIDC, Phone OTP, RBAC)"]
        FarmSvc["Farm & Geo-Parcel Service (PostGIS)"]
        TelemetrySvc["Telemetry Ingestion Worker (Kafka Consumers)"]
        MarketSvc["Mandi Price & Commodity Predictor"]
        SupportSvc["Customer Support & Ticket Hub (WebSockets, Voice Bridge)"]
        AISvc["AI Agronomist Engine (Vision Disease Detection & Telugu LLM)"]
    end

    subgraph Storage_Tier["Distributed Database & Event Mesh (DBMS)"]
        Postgres["PostgreSQL 16 (Relational & PostGIS Geo-Boundaries)"]
        Timescale["TimescaleDB (Time-Series IoT Metrics)"]
        RedisCache["Redis Cluster (Hot Session, Mandi Cache, Queue)"]
        Kafka["Apache Kafka (Distributed Event Bus)"]
        S3Storage["MinIO / AWS S3 (Crop Disease Photos, Leaf Scans)"]
    end

    IoTNUX -->|LoRa / 4G| LoRaGateway
    LoRaGateway --> MQTTBroker
    MQTTBroker --> Kafka
    AndroidApp -->|HTTPS / gRPC| APIGateway
    AdminWeb -->|HTTPS| APIGateway
    APIGateway --> AuthSvc
    APIGateway --> FarmSvc
    APIGateway --> SupportSvc
    APIGateway --> AISvc
    Kafka --> TelemetrySvc
    TelemetrySvc --> Timescale
    FarmSvc --> Postgres
    AuthSvc --> Postgres
    SupportSvc --> Postgres
    AISvc --> S3Storage
    MarketSvc --> RedisCache
```

---

## 2. Advanced DBMS & Real-time Data Architecture

Handling high-velocity sensor telemetry alongside transactional land records requires a hybrid storage engine:

### 2.1 Storage Segregation Table
| Data Category | Selected Database | Primary Use Case | Scaling Strategy |
|---|---|---|---|
| **Transactional Records** | **PostgreSQL 16** | Users, Tenant RLS, Farm records, Plots, Crop cycles, Expenses | Master-Replica with read pooling (PgBouncer) |
| **Geospatial Parcel Polygons** | **PostGIS Extension** | Survey numbers, GPS land boundaries, satellite NDVI overlay | Spatial R-Tree indexes (`GIST(geom)`) |
| **IoT Sensor Telemetry** | **TimescaleDB** | Moisture, temperature, NPK, solar radiation (millions of rows/day) | Automatic time-based hypertables & 90-day chunk compression |
| **Hot Cache & Rate Limiting** | **Redis 7 Cluster** | Active OTPs, market mandi live cache, user JWT invalidation | In-memory with Redis Sentinel high-availability |
| **Unstructured Media** | **AWS S3 / Cloudflare R2** | Pest/leaf damage photos, voice notes, invoice scans | CDN edge caching with presigned upload URLs |
| **Event Bus & Buffering** | **Apache Kafka** | Decoupling IoT ingestion spikes from database writes | Partitioned by `farm_id` hash |

### 2.2 Relational & Geospatial Schema Evolution (PostGIS)

```mermaid
erDiagram
    TENANTS ||--o{ USERS : scopes
    USERS ||--o{ FARMS : owns
    FARMS ||--o{ PLOTS : subdivides
    PLOTS ||--o{ IOT_DEVICES : monitors
    IOT_DEVICES ||--o{ TELEMETRY_READINGS : streams
    PLOTS ||--o{ CROP_DOCTOR_QUERIES : diagnoses

    FARMS {
        uuid id PK
        uuid user_id FK
        string name
        geometry boundary_polygon "PostGIS Polygon (EPSG:4326)"
        double total_acres
        string survey_no
        timestamp created_at
    }

    IOT_DEVICES {
        uuid id PK
        uuid plot_id FK
        string hardware_serial "EUI-64 / MAC"
        string connectivity "LoRaWAN | NB-IoT | BLE"
        string battery_level
        timestamp last_ping
    }

    TELEMETRY_READINGS {
        timestamp recorded_at PK "Timescale Hypertable"
        uuid device_id FK
        float soil_moisture_pct
        float soil_temperature_c
        float nitrogen_ppm
        float phosphorus_ppm
        float potassium_ppm
        float ambient_humidity
    }

    CROP_DOCTOR_QUERIES {
        uuid id PK
        uuid user_id FK
        string photo_s3_url
        string predicted_disease
        float confidence_score
        string treatment_recommendation_te
        string audio_advice_url
        timestamp queried_at
    }
```

---

## 3. Real-Time User Management & Customer Support Engine

### 3.1 Multi-Tier Role-Based Access Control (RBAC)
- **Farmer**: Full ownership of personal land, sensor alerts, and financial records; read access to verified agro-inputs and mandi benchmarks.
- **Village Coordinator (Rythu Bharosa Kendra / Extension Officer)**: Aggregated view of village-level crop health, drought alerts, and collective procurement assistance.
- **Agronomist Consultant**: Access to anonymized diagnostic requests; can review AI disease recommendations and approve prescriptions.
- **FPO (Farmer Producer Organization) Manager**: Bulk yield estimation across registered members, forward contract market negotiations.
- **Platform Admin**: System audit logs, sponsor content approvals, IoT hardware fleet health, billing.

### 3.2 Real-time Customer Support Hub
1. **In-App Vernacular Chat & Voice Notes**:
   - Smallholder farmers frequently prefer speaking over typing. Support tickets allow submitting a 30-second audio voice note in Telugu alongside camera pictures.
   - Speech-to-Text automatically transcribes and categorizes the ticket.
2. **WebSockets Live Bridge**:
   - Low-latency real-time bidirectional messaging between farmers and certified extension officers.
3. **Emergency IVR Callback**:
   - Farmers in low-network zones can dial an automated toll-free number that logs an inquiry and triggers an automated agronomist callback.

---

## 4. AI Smart Farming & Multimodal Agronomy Assistant

### 4.1 "Crop Doctor" — Multimodal Disease & Pest Identification
```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer (Mobile App)
    participant EdgeApp as Smart Kisan Android Client
    participant APIGW as API Gateway
    participant VisionAI as AI Agronomist Microservice
    participant Storage as Cloudflare R2 / S3
    participant DB as Postgres & Audit Log

    Farmer->>EdgeApp: Snaps photo of diseased leaf / fruit
    EdgeApp->>EdgeApp: Local compression (<250 KB) to save 2G/3G data
    EdgeApp->>APIGW: Upload Image (Presigned Multipart POST)
    APIGW->>Storage: Store Image
    APIGW->>VisionAI: Invoke Vision Model with Farmer Context (Crop, Soil, Region)
    VisionAI->>VisionAI: Detect Pathogen (e.g. Cercospora, Blast, Thrips)
    VisionAI->>VisionAI: Synthesize Organic + Chemical Treatment in Telugu
    VisionAI->>DB: Log diagnosis & geographic outbreak location
    VisionAI-->>EdgeApp: Return Disease Name, Confidence, Dosage, Telugu Voice Audio
    EdgeApp-->>Farmer: Displays bilingual treatment card + Plays Telugu audio
```

### 4.2 Voice-First Vernacular AI Chat (Telugu & Regional Dialects)
- **Natural Agricultural Conversational Agent**:
  - Leverages fine-tuned LLMs equipped with regional agronomy context (ICAR, ANGRAU, Professor Jayashankar Telangana State Agricultural University advisories).
  - Handles queries like:
    > *"ఈ వర్షానికి నా మిరప తోటలో ఆకు ముడత వస్తుంది, ఏ మందు కొట్టాలి?"*  
    > *(Leaf curl is appearing in my chilli field after rains, which formulation should I spray?)*
  - Generates immediate dosage per acre with safety withholding periods (PHI).

### 4.3 Satellite NDVI & Precision Analytics
- Automated weekly ingestion of European Space Agency **Sentinel-2** 10-meter resolution multispectral imagery.
- Calculates **NDVI (Normalized Difference Vegetation Index)** over the farmer's registered parcel boundaries.
- Alerts farmer to invisible crop stress or water deficits days before physical discoloration occurs.

---

## 5. IoT Sensor Integration Architecture (Low Power, Rural Resilient)

```mermaid
graph LR
    subgraph Soil_Sensor_Node["Field Sensor Probe"]
        Sensors["NPK Probe + Soil Moisture + Temperature"] --> Micro["Low-Power MCU (ESP32-S3 / STM32)"]
        Solar["0.5W Solar Panel + 18650 LiFePO4"] --> Micro
        Micro --> Transceiver["LoRa Transceiver (SX1262)"]
    end

    subgraph Village_Base["Village Edge Gateway"]
        Transceiver -.->|Up to 8-10 km| LoRaBase["8-Channel LoRaWAN Base Station"]
        LoRaBase --> 4GBackhaul["Cellular 4G / Satellite Uplink"]
    end

    subgraph Cloud_Platform["Smart Kisan Cloud"]
        4GBackhaul --> EMQX["EMQX MQTT Broker"]
        EMQX --> KafkaPipeline["Kafka Ingestion Pipeline"]
        KafkaPipeline --> RuleEngine["Threshold & Alert Rule Engine"]
        RuleEngine --> PushNotif["FCM Push Notification to Mobile App"]
    end
```

### 5.1 Operational Characteristics:
- **Low Duty Cycle**: Sensor wakes up once every 30 minutes, samples soil moisture and temperature, transmits an 18-byte compressed packet, and returns to deep sleep (<15 $\mu$A sleep current).
- **Zero Ongoing SIM Cost per Sensor**: A single solar-powered LoRaWAN gateway mounted on a village water tower or panchayat building covers an 8 km radius, servicing up to 500 individual farm plots.

---

## 6. Phased Enterprise Scale Roadmap

```mermaid
flowchart TD
    Phase1["✅ Phase 1: Android Client Complete<br/>(Bilingual Compose, Room DB, Profit Engine, Tests, RBAC)"]
    
    Phase2["Phase 2: Cloud Sync & PostGIS Backend<br/>(REST/gRPC APIs, PostgreSQL + PostGIS, Auto-Sync Engine)"]
    
    Phase3["Phase 3: AI Crop Doctor & Telugu Voice<br/>(Multimodal Leaf Diagnostics, Audio Advisory, Support Hub)"]
    
    Phase4["Phase 4: IoT Hardware Fleet & LoRaWAN<br/>(MQTT Broker, Sensor Firmware, Auto-Irrigation Triggers)"]
    
    Phase5["Phase 5: FPO Bulk Marketplace & FinTech<br/>(Direct Buyer Procurement, Crop Insurance Telemetry Scoring)"]

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
```

---

## 7. Sustainable Enterprise Monetization Matrix

1. **Free Smallholder Tier**:
   - 100% free offline farm bookkeeping, crop profit calculator, government mandi rates, and general advisory.
2. **Precision Farmer Pro (₹199 / crop season)**:
   - Unlimited AI leaf disease scans, satellite NDVI vegetation health alerts, hyper-local 3-day weather forecasting.
3. **Agri-Input Marketplace Sponsored Placements (B2B)**:
   - Certified seed, bio-fertilizer, and drone spraying companies bid for contextual sponsored recommendations with mandatory disclosure badges.
4. **FPO & Enterprise SaaS (₹5,000 / month)**:
   - Aggregated harvest forecasting, farmer cluster analytics, and supply-chain track-and-trace for export certification.
5. **FinTech & Crop Insurance Underwriting**:
   - Anonymized soil and yield performance metrics provided to rural banks and PMFBY insurance adjusters to fast-track farmer credit approvals.
