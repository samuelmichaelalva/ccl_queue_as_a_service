# ⚡ QueuePulse — CCL Queue-as-a-Service (QaaS) & Cloud Architecture

> **A high-performance, real-time Queue-as-a-Service platform powered by Express, WebSocket, React, and an AI-driven dynamic wait-time estimation engine, designed for multi-stage cloud evolution on AWS.**

---

## 📌 Table of Contents
1. [Platform Overview](#-platform-overview)
2. [Key Features & User Roles](#-key-features--user-roles)
3. [Technology Stack](#-technology-stack)
4. [Getting Started (Local Development)](#-getting-started-local-development)
5. [Cloud Evolution Architecture](#-cloud-evolution-architecture)
6. [Cloud & Virtualization Lab Series](#-cloud--virtualization-lab-series)
   - [Task 1: Basic Virtualization (VirtualBox & KVM)](#task-1-basic-virtualization-virtualbox--kvm)
   - [Task 2: Bare-Metal Virtualization (Hyper-V)](#task-2-bare-metal-virtualization-hyper-v)
   - [Task 3: AWS IAM — Identity & Access Management](#task-3-aws-iam--identity--access-management)
   - [Tasks 4–8: In Progress / Upcoming](#tasks-48-upcoming)

---

## 🌟 Platform Overview

**QueuePulse** transforms traditional customer waiting into a streamlined, real-time digital experience. It eliminates physical waiting lines by distributing live digital tickets, predicting wait times using historical velocity and AI load curves, and synchronizing state across customer devices, staff counters, and administrative dashboards via WebSockets.

---

## 🎯 Key Features & User Roles

| Role / View | Description | Key Capabilities |
| :--- | :--- | :--- |
| **📱 Customer Wallet View** | Mobile-first live queue pass | Real-time position tracking, dynamic AI ETA, QR pass generation, live audio/visual alerts. |
| **🖥️ Staff Counter View** | Operational dashboard for counter operators | One-click `Next Ticket`, `Recall`, `Transfer`, and `Complete` actions with real-time sync. |
| **📊 Admin Analytics View** | Executive telemetry and throughput monitoring | SLA tracking, counter utilization, peak arrival charts, queue depth heatmaps. |
| **☁️ Cloud Architecture View** | Interactive AWS multi-tier architecture visualizer | Step-by-step cloud topology simulation from S3 static hosting to auto-scaled multi-AZ VPC deployments. |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, TailwindCSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express 4, Socket.IO (WebSocket)
- **AI & Analytics**: In-engine throughput rate calculations, exponential moving average (EMA) wait predictions
- **Cloud Readiness**: Amazon S3, CloudFront, Amazon EC2, Amazon RDS PostgreSQL, AWS IAM, Auto Scaling & Elastic Load Balancing

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/samuelmichaelalva/ccl_queue_as_a_service.git
cd ccl_queue_as_a_service

# Install dependencies
npm install
```

### 3. Run Frontend & Backend Simultaneously
```bash
npm run dev
```
- **Backend API & WebSockets**: Runs on `http://localhost:5050`
- **Frontend App**: Runs on `http://localhost:3000` (automatically proxies `/api` and `/socket.io` to port 5050)

---

## ☁️ Cloud & Virtualization Lab Series

This repository tracks the progressive cloud infrastructure and virtualization lab milestones:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LAB MILESTONES & PROGRESS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✅ Task 1: Type-2 Virtualization (VirtualBox & KVM)                         │
│  ✅ Task 2: Type-1 Bare-Metal Virtualization (Hyper-V)                       │
│  ✅ Task 3: AWS IAM (Identity & Access Management - Users, Groups & RBAC)   │
│  ⏳ Task 4: In Progress                                                     │
│  ⏳ Task 5: Upcoming                                                        │
│  ⏳ Task 6: Upcoming                                                        │
│  ⏳ Task 7: Upcoming                                                        │
│  ⏳ Task 8: Upcoming                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Task 1: Basic Virtualization (VirtualBox & KVM)
- **Objective**: Create and configure virtual machines using Type-2 hypervisors (Oracle VM VirtualBox) and Linux Kernel-based Virtual Machine (KVM).
- **Core Concepts**: Host OS vs. Guest OS, Virtual Hardware Allocation (vCPU, RAM, vDisk), NAT vs. Bridged Networking, Hypervisor abstractions.

---

### Task 2: Bare-Metal Virtualization (Hyper-V)
- **Objective**: Enable Windows Hyper-V and deploy bare-metal Type-1 virtualization.
- **Core Concepts**: Microkernelized hypervisor architecture, Direct hardware execution rings, Virtual Switch Manager (External, Internal, Private vSwitches), Dynamic Memory optimization.

---

### Task 3: AWS IAM — Identity & Access Management

#### 🎯 Overview & Objectives
Inspect, enforce, and validate the **Principle of Least Privilege (PoLP)** and Role-Based Access Control (RBAC) across AWS services (EC2 & S3) using IAM Users, Groups, Managed Policies, and Inline Policies.

#### 👥 IAM Role-Based Access Control (RBAC) Matrix
| IAM User | Assigned Group | Policy Name | Policy Type | Effective Permissions |
| :--- | :--- | :--- | :--- | :--- |
| `user-1` | **S3-Support** | `AmazonS3ReadOnlyAccess` | AWS Managed | Read-only access to Amazon S3 buckets & objects (`s3:Get*`, `s3:List*`). Denied all EC2 access. |
| `user-2` | **EC2-Support** | `AmazonEC2ReadOnlyAccess` | AWS Managed | Read-only access to EC2 instances (`ec2:Describe*`, `cloudwatch:ListMetrics`). Denied Stop/Start and S3 access. |
| `user-3` | **EC2-Admin** | `EC2-Admin-Policy` | Inline Policy | Permission to Describe, **Start**, and **Stop** EC2 instances (`ec2:StartInstances`, `ec2:StopInstances`). |

#### 🔑 Key Verification Steps:
1. **`user-1` Verification**:
   - Access Amazon S3 Console -> S3 buckets and contents viewable.
   - Access Amazon EC2 Instances -> Explicitly blocked (`UnauthorizedOperation`).
2. **`user-2` Verification**:
   - Access Amazon EC2 Instances -> Instances listed and viewable.
   - Attempt `Stop Instance` -> Access Denied (`UnauthorizedOperation`).
   - Access Amazon S3 Console -> Access Denied.
3. **`user-3` Verification**:
   - Access Amazon EC2 Instances -> Instance viewable.
   - Attempt `Stop Instance` -> Execution successful (`Instance state: Stopping`).

---

### Tasks 4–8: Upcoming
*To be documented as lab guides are executed.*

---

## 📄 License
MIT License. Built for Cloud Computing & Virtualization architectures.