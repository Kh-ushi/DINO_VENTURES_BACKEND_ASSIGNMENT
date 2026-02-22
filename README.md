## 🦕 Internal Wallet Service ##

## High-integrity wallet service built for a high-traffic virtual credit system (gaming / loyalty platform use-case).**

Designed with a focus on:

- Data Integrity

- Concurrency Safety

- Idempotent Mutations

- Ledger-Based Auditability

- Production-Ready Architecture

## 1. Problem Overview**
This service manages application-specific virtual credits (e.g., Gold Coins, Reward Points).

Although the currency is virtual, the system guarantees:

- No negative balances

- No lost transactions

- No double-spend under concurrency

- Strong consistency

- Full audit trail of all balance changes

Example:

**If a user earns 100 points and spends 30 points, the ledger will reliably show a remaining balance of 70 — even under heavy concurrent traffic.**


**2. Tech Stack & Justification**
**Backend**

- Node.js + Express (TypeScript)
- PostgreSQL
- Prisma ORM

**Why This Stack?**

- PostgreSQL provides strong ACID guarantees
- Row-level locking supports concurrency control
- Prisma enables type-safe database interactions
- TypeScript ensures compile-time correctness


## 3. Architecture Overview**
Core Design: Ledger-Based System (Double-Entry)

Instead of directly mutating a balance column:

- Every operation writes to a Transaction
- Each Transaction creates Ledger Entries
- Wallet balances are derived from ledger integrity

This ensures:
- Auditability
- Traceability
- Zero silent data corruption

## 4. Implemented Functional Flows**

**a. Wallet Top-Up**
- Credits wallet
- Debit from system Treasury wallet
- Double-entry ledger write
- Idempotent

**b.Bonus / Incentive**
- System credits wallet
- No user action required
- Ledger recorded

**c.Spend**
- Validates sufficient balance
- Uses transactional row locking
- Prevents race condition double-spend
- Idempotent

## 5. Concurrency & Race Condition Handling**

Critical section:
- Balance check
- Ledger write
- Balance update

Strategy:
- All operations wrapped inside database transaction
- SELECT ... FOR UPDATE row-level locking
- Prevents simultaneous double-spend
- Ensures serialization safety
Example:

```sql
SELECT * FROM "Wallet"
WHERE id = $1
FOR UPDATE;
```

If two requests try to spend at the same time:

- One acquires lock
- Other waits
- Balance never becomes inconsistent

## 6. Idempotency Strategy**
- Every mutation requires:
```http
Idempotency-Key: <uuid>
```
Flow:

Check if key exists

If exists → return stored response

Else → execute transaction

Store result against key

Example:
```Javascript
await prisma.idempotencyKey.findUnique({
  where: { key }
});
```

Guarantees:

- Safe retries
- No duplicate deduction
- Exactly-once mutation semantics

## 8. Deadlock Avoidance**
To minimize deadlock risk:

- Wallet rows are always locked in a deterministic order
- Treasury wallet accessed consistently
- Single-row locking strategy per transaction
- This ensures high concurrency safety.

## 9. Running Backend Locally**

```bash
npm install
```
```bash
npx prisma migrate deploy
```

```bash
npx prisma db seed
```

```bash
npm run dev
```

## 10. Running Backedn with Docker (Containerization)

The project includes inside backend/wallet-service:

- Dockerfile 
- docker-compose.yml

To spin up everything:
```bash
docker-compose up --build
```

This will:

Start PostgreSQL
Run migrations
Seed initial data
Start API server

## 11. Testing

Includes:
- Unit tests
- Concurrency integration test
- Idempotency verification
- Ledger sum validation
- Example concurrency scenario tested:
- 5 parallel spend requests
- Only valid number succeed
- Others fail
- Final balance correct


## Deployment

The application is fully containerized and deployed to AWS EC2 using Docker.

### Infrastructure

- **Cloud Provider:** AWS EC2 (Ubuntu 24.04)
- **Instance Type:** t3.micro
- **Containerization:** Docker + Docker Compose
- **Database:** PostgreSQL (Dockerized)
- **Reverse Proxy:** Nginx
- **HTTPS:** Let's Encrypt (Certbot)
- **DNS:** DuckDNS (dynamic DNS)

### Architecture

Internet → Nginx (HTTPS) → Node.js App (Docker) → PostgreSQL (Docker)

Nginx handles:
- SSL termination
- Reverse proxy to the backend container
- Automatic HTTPS redirection

### Docker Setup

The backend and database are orchestrated using `docker-compose.yml`:

- `app` service → Node.js wallet service
- `db` service → PostgreSQL database
- Automatic migration execution on startup
- Database seeding during first boot

To run backend locally:

```bash
docker-compose up --build
```

## Frontend (Demo UI)

A minimal React + TypeScript frontend is provided for demonstration and API testing purposes.

Production URL:
https://dino-ventures-backend-assignment.vercel.app

The frontend connects to the deployed backend over HTTPS and demonstrates:
- Wallet selection
- Top-up
- Spend
- Transaction history
- Idempotency behavior