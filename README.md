# Kinora

**Agentic Ambient Care & Rapid Escalation System for Aging at Home**

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![AWS Bedrock](https://img.shields.io/badge/Amazon-Bedrock-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/bedrock/)
[![Wear OS](https://img.shields.io/badge/Wear_OS-Galaxy_Watch-4285F4?style=for-the-badge&logo=wearos)](https://developer.android.com/wear)
[![Cedar Policy](https://img.shields.io/badge/Cedar-Policy_Guard-232F3E?style=for-the-badge&logo=amazon)](https://www.cedarpolicy.com/)
[![AWS Serverless](https://img.shields.io/badge/AWS-Serverless-red?style=for-the-badge&logo=amazonwebservices)](https://aws.amazon.com/)
[![Author](https://img.shields.io/badge/Author-Lakshay--Deol-blue?style=for-the-badge&logo=github)](https://github.com/Lakshay-Deol)

> Most days, Kinora says nothing at all. That’s the point.

Kinora is an **ambient, hardware-first, agentic companion system** designed for elderly parents aging at home: Samsung Galaxy Watch telemetry (heart rate, SpO2, accelerometer-based fall detection) + parent tablet companion voice + long-term memory + proactive care sweeps + consent-aware family escalation — architected natively for **AWS Serverless**.

Amma (72, Bengaluru) wears the watch and talks to Kinora in Hindi or Hinglish. Rahul and Priya get a calm family view. They are notified only when something is actually wrong — and only the person who can show up is asked first.

---

## The Vision & Problem

Adult children living in separate cities do not want invasive cameras or stressful surveillance feeds that strip away their parents' dignity. Silence, however, leaves families guessing and anxious. Physical panic buttons only help if the parent is conscious, nearby, and willing to press them.

**Kinora sits right in between:**
1. Learns the daily baseline and wake window of the parent.
2. Speaks to **her first** through a comforting tablet voice companion when anomalies are observed.
3. Strictly enforces spoken consent via AWS Cedar policies so that private health details aren't broadcast.
4. Intelligently coordinates the nearest and most available family member or emergency helper only when an escalation is verified.

---

## System Architecture

```text
 Wear OS (Galaxy Watch 4+)       Parent Tablet Voice / Family PWA (Next.js 15)
           │                                          │
           │                                    AWS Amplify
           │                                          │
           ▼                                          ▼
   Amazon API Gateway ──────── JWT Authorizer (Amazon Cognito User Pool)
           │
           ▼
   AWS Lambda Container (FastAPI behind AWS Lambda Web Adapter)
   ├── Companion Agent (Amazon Bedrock — Nova 2 Lite)
   ├── Streaming Audio Bridge (Amazon Transcribe STT + Amazon Polly TTS)
   ├── Privacy Engine (Cedar ConsentGuard — policy checked before every tool)
   └── Single-Table Store (Amazon DynamoDB — PITR & audit trails)
           │
           ├── Amazon EventBridge (1-minute proactive sweeps for wake/reminders)
           └── AWS Step Functions (Standard Workflow with waitForTaskToken callback)
                     │
                     ├── Amazon SNS (SMS dispatch)
                     ├── Amazon Connect (Automated outbound voice call)
                     └── Web Push (VAPID authenticated family notification)
```

---

## Core Capabilities

| Capability | Detail | AWS Services |
| :--- | :--- | :--- |
| **Hardware-First Vitals** | Continuous background tracking of heart rate, daily steps, and SpO2 via Wear OS Health Services. | Wear OS, API Gateway |
| **Fall Detection** | Real-time accelerometer magnitude spike analysis + confirmation dialogue. | Wear OS, Lambda |
| **Agentic Voice Companion** | Natural bilingual voice dialogues (Hindi / English / Hinglish) with persistent memory. | Transcribe, Bedrock, Polly |
| **Spoken Consent Guard** | Spoken privacy boundaries compiled into Cedar policies that strictly fence data access. | Cedar, DynamoDB |
| **Proactive Care Sweeps** | EventBridge-triggered sweeps check morning wake windows without requiring wake words. | EventBridge, Lambda |
| **Tiered Escalation** | Step Functions state machine cycles through primary family, backup contacts, and local help. | Step Functions, SNS, Connect |
| **Command Center Dashboard** | Operator & family visibility with live transcript mirror and event timeline. | Next.js 15, WebSocket |
| **3D Explore Experience** | Three.js interactive wardstone and memory gallery for spatial walkthrough. | Next.js, Three.js, R3F |

---

## Monorepo Layout

```text
Kinora/
├── ally/              # Python FastAPI agent service (Bedrock, Transcribe, Polly, Cedar, DynamoDB)
├── backend/           # Node.js / Express / TypeScript WebSocket & triage orchestrator
├── dashboard/         # Vite + React operator command center and patient simulator
├── docs/              # AWS Architecture and Resilience specifications
├── experience/        # Three.js / React Three Fiber interactive 3D virtual environment
├── infra/             # AWS CDK infrastructure definition (Python)
├── scripts/           # Deployment automation and verification scripts
├── sim-service/       # Python patient vitals simulation telemetry service
├── wear-os/           # Samsung Galaxy Watch Wear OS Kotlin native application
└── web/               # Next.js 15 App Router PWA (Parent Tablet & Family views)
```

---

## AWS Configuration & Placeholders

Kinora is designed to deploy entirely into your own AWS account. All cloud endpoints, Cognito User Pools, and API Gateway instances use clean environment placeholders:

### Root & Service Environment Variables (`.env.example`)

```bash
# AWS Core
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=<YOUR_AWS_ACCOUNT_ID>

# Bedrock Reasoning
BEDROCK_MODEL_ID=us.amazon.nova-2-lite-v1:0
BEDROCK_REGION=us-east-1
BEDROCK_FAILOVER_REGION=us-west-2

# Voice Services
POLLY_VOICE=Kajal
POLLY_ENGINE=generative
DEMO_LANGUAGE=en-IN

# Amplify & API Gateway
NEXT_PUBLIC_KINORA_API_URL=https://<YOUR_API_GATEWAY_ID>.execute-api.us-east-1.amazonaws.com
NEXT_PUBLIC_AMPLIFY_URL=https://<YOUR_AMPLIFY_APP_ID>.amplifyapp.com
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<YOUR_COGNITO_USER_POOL_ID>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<YOUR_COGNITO_CLIENT_ID>

# Wear OS local.properties
orchestrator.ws=wss://<YOUR_API_GATEWAY_ID>.execute-api.us-east-1.amazonaws.com/care
kinora.api=https://<YOUR_API_GATEWAY_ID>.execute-api.us-east-1.amazonaws.com
kinora.deviceKey=<YOUR_DEVICE_SECRET_KEY>
```

---

## Quickstart & Local Development

### 1. Web Companion & Family PWA
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Ally Agent Service (Python FastAPI)
```bash
cd ally
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --port 8002 --reload
```

### 3. Backend Orchestrator & Live WebSocket
```bash
cd backend
npm install
npm run dev
# WebSocket listening on port 3001
```

### 4. Wear OS Galaxy Watch Application
Open `wear-os/` in **Android Studio Ladybug (or newer)**.
Ensure Wear OS 4+ (API Level 33+) target or Samsung Galaxy Watch 4/5/6 is connected via ADB over Wi-Fi.

---

## Deploying to AWS

Deploy all serverless infrastructure with AWS CDK:
```bash
cd infra
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cdk bootstrap aws://<YOUR_AWS_ACCOUNT_ID>/us-east-1
cdk deploy KinoraStack --outputs-file cdk-outputs.json
```

Or deploy using the PowerShell helper:
```powershell
.\scripts\deploy.ps1 -WebOrigin https://<YOUR_AMPLIFY_APP_ID>.amplifyapp.com -Region us-east-1
```

---

## Author & License

Designed, built, and maintained by **[Lakshay Deol](https://github.com/Lakshay-Deol)** ([lakshayld26@gmail.com](mailto:lakshayld26@gmail.com)).

Licensed under the [Apache License 2.0](LICENSE).
