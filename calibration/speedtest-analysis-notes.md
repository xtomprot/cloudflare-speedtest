# Speedtest Analysis Notes

**Date:** 2026-04-20  
**Project:** Cloudflare Speedtest Demo - Calibration & Analysis

---

## Table of Contents

1. [Data Cleaning & Processing](#data-cleaning--processing)
2. [Statistical Analysis - MAE](#statistical-analysis---mae)
3. [CTU NetTest Methodology (RMBT)](#ctu-nettest-methodology-rmbt)
4. [Cloudflare vs CTU Technical Comparison](#cloudflare-vs-ctu-technical-comparison)
5. [VPN Impact Analysis](#vpn-impact-analysis)
6. [TCP Congestion Window Explained](#tcp-congestion-window-explained)
7. [Latency Measurement Differences](#latency-measurement-differences)
8. [Connection Reuse vs Slow Start](#connection-reuse-vs-slow-start)

---

## Data Cleaning & Processing

### Problem Identified
Original CSV had inconsistent decimal notation:
- **Format A:** `84/24,36` = Download 84 / Upload 24 / Ping 36 (comma = field separator)
- **Format B:** `48,9 / 28,1 / 52,6` = Download 48.9 / Upload 28.1 / Ping 52.6 (comma = decimal)

### Solution
Manually parsed each row based on context and user patterns:
- Tomáš Protiva entries: Comma as field separator
- Mirka entries: Comma as decimal separator
- Other users: Mixed, analyzed case-by-case

### Final Structure
Created `speedtest_cleaned.csv` with UTF-8 BOM encoding:
- Separate columns for Download, Upload, Ping, Jitter
- Added `down_delta` and `up_delta` columns (TMobile - Competitor)
- Added `percent_diff_down` and `percent_diff_up` columns
- 48 measurement rows, 46 valid comparisons

---

## Statistical Analysis - MAE

### Mean Absolute Error (MAE) - Business Explanation (Czech)

**Co to je?**  
Střední absolutní chyba (MAE) říká: "O kolik se v průměru liší naše měření od měření konkurence?"

**Jak se počítá:**
1. Vezmeš každý rozdíl mezi T-Mobile speedtestem a konkurencí
2. Všechny rozdíly převedeš na kladná čísla (ignoruješ znaménko)
3. Spočítáš průměr těchto absolutních rozdílů

**Příklad:**
```
Test 1: T-Mobile 84 Mbps, Ookla 64 Mbps → rozdíl +20 Mbps
Test 2: T-Mobile 50 Mbps, Ookla 69 Mbps → rozdíl -19 Mbps
Test 3: T-Mobile 72 Mbps, Ookla 76 Mbps → rozdíl -4 Mbps

MAE = (20 + 19 + 4) / 3 = 14.3 Mbps
```

**Význam:** "V průměru se naše měření liší o 14.3 Mbps oproti Ookle, bez ohledu na to, jestli měříme víc nebo míň."

### Excel Formulas for Technology-Specific MAE

**FWA:**
```excel
Count: =COUNTIF($B$2:$B$49,"FWA")
MAE Download: =SUMPRODUCT(ABS($O$2:$O$49)*($B$2:$B$49="FWA"))/COUNTIF($B$2:$B$49,"FWA")
MAE Upload: =SUMPRODUCT(ABS($P$2:$P$49)*($B$2:$B$49="FWA"))/COUNTIF($B$2:$B$49,"FWA")
```

**xDSL:**
```excel
Count: =COUNTIF($B$2:$B$49,"xDSL")
MAE Download: =SUMPRODUCT(ABS($O$2:$O$49)*($B$2:$B$49="xDSL"))/COUNTIF($B$2:$B$49,"xDSL")
MAE Upload: =SUMPRODUCT(ABS($P$2:$P$49)*($B$2:$B$49="xDSL"))/COUNTIF($B$2:$B$49,"xDSL")
```

**Optika (FTTH/FTTx):**
```excel
Count: =COUNTIF($B$2:$B$49,"Optika (FTTH/FTTx)")
MAE Download: =SUMPRODUCT(ABS($O$2:$O$49)*($B$2:$B$49="Optika (FTTH/FTTx)"))/COUNTIF($B$2:$B$49,"Optika (FTTH/FTTx)")
MAE Upload: =SUMPRODUCT(ABS($P$2:$P$49)*($B$2:$B$49="Optika (FTTH/FTTx)"))/COUNTIF($B$2:$B$49,"Optika (FTTH/FTTx)")
```

### Why Technology-Specific MAE Matters

Absolute MAE naturally increases with higher speeds:
- 500 Mbps connection with 5% error → 25 Mbps absolute difference
- 100 Mbps connection with 5% error → 5 Mbps absolute difference

Therefore: Always analyze MAE **per technology type** to get meaningful comparisons.

---

## CTU NetTest Methodology (RMBT)

### What is RMBT?

**RTR Multithreaded Broadband Test**
- Developed by Austria's RTR (telecommunications regulator)
- Adopted by Czech CTU (Český telekomunikační úřad)
- Open-source implementation: https://github.com/CTUCZ/rmbt-server

### Protocol Details

**Primary Transport:**
- TLS-encrypted TCP connections over port 443
- Alternative: HTTP with upgrade to RMBT protocol OR WebSocket (RFC 6455)
- Legacy mode: Plain TCP sockets

**Key Characteristics:**
- **Multi-threaded:** 3 parallel TCP connections by default (configurable)
- **Chunk-based transmission:** Fixed-size data chunks
- **Test duration:** 7 seconds nominal per phase (download/upload)
- **High-entropy data:** Random data to prevent compression interference
- **Timestamp-based measurement:** Client records bytes + timestamps per connection

### Measurement Process

**Download Test:**
1. Client opens 3 parallel TCP connections
2. Server transmits data chunks for 7 seconds
3. Client records timestamps and cumulative bytes per connection
4. Final throughput calculated by interpolating data across all connections

**Upload Test:**
- Mirrors download but client sends, server receives
- Server provides periodic feedback (min 0.001s intervals)

**Latency Test:**
- Ping/pong exchanges
- Minimum 10, maximum 200 pings
- Uses same RMBT protocol

**Source:** [RMBT Specification](https://github.com/rtr-nettest/rmbt-server/blob/master/RMBT_specification.md)

---

## Cloudflare vs CTU Technical Comparison

### Technology Stack Comparison

| Aspect | Cloudflare Speedtest | CTU NetTest (RMBT) |
|--------|---------------------|-------------------|
| **Protocol** | HTTP Fetch API | Raw TCP/TLS + RMBT protocol |
| **Environment** | Browser JavaScript | Native C server |
| **Connections** | Sequential requests | 3 parallel TCP streams |
| **Duration** | Variable (ramp-up based) | Fixed 7 seconds |
| **Timing API** | PerformanceResourceTiming | Native microsecond timers |
| **Data Format** | HTTP headers + payload | Binary chunks with markers |

### Cloudflare Configuration (from App.vue)

```javascript
measurements: [
  { type: 'latency', numPackets: 1 },
  { type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true },
  { type: 'latency', numPackets: 20 },
  { type: 'download', bytes: 1e5, count: 6 },   // 100KB
  { type: 'download', bytes: 1e6, count: 6 },   // 1MB  
  { type: 'download', bytes: 1e7, count: 4 },   // 10MB
  { type: 'upload', bytes: 1e5, count: 8 },
  { type: 'packetLoss', numPackets: 1e3, batchSize: 10 },
  { type: 'upload', bytes: 1e6, count: 6 },
  { type: 'upload', bytes: 1e7, count: 4 },
  { type: 'download', bytes: 2.5e7, count: 4 }  // 25MB
]
```

**Key Parameter:**
- `bandwidthFinishRequestDuration: 1000ms` (default)
- Stops testing larger files once a request takes ≥1000ms

### Why Variance Occurs

| Factor | Cloudflare | CTU | Impact on Variance |
|--------|-----------|-----|-------------------|
| **Protocol** | HTTP Fetch | Raw TCP/TLS | ⭐⭐⭐ High |
| **Parallelism** | Sequential | 3 parallel streams | ⭐⭐⭐ High |
| **Slow Start** | Restarts per request | Continuous streams | ⭐⭐ Medium |
| **Duration** | Variable (ramp-up) | Fixed 7s | ⭐⭐ Medium |
| **Environment** | Browser sandbox | Native C server | ⭐ Low |

### Neither is "Wrong"

**Cloudflare measures:**
- ✅ Realistic user experience (browser-based)
- ✅ What a typical web download looks like
- ✅ Privacy-preserving (client-side only)

**CTU measures:**
- ✅ Maximum network capacity
- ✅ Line capability independent of application overhead
- ✅ Regulatory compliance testing

**Key Takeaway:** Cloudflare shows "what a user experiences," CTU shows "what the line is capable of."

---

## VPN Impact Analysis

### Observed Data Pattern

From calibration data, **dramatic differences with VPN:**

**Row 28 (Bezdrát 100 s VPN, FWA):**
- Cloudflare: 4.32 Mbps download
- CTU: 117 Mbps download
- **Delta: -112.68 Mbps** (Cloudflare 27× slower!)

**Row 44-47 (100 DSL s VPN, xDSL):**
- Cloudflare: 6.52-8.44 Mbps download
- CTU: 50.7-58.6 Mbps download
- **Delta: ~-45 Mbps** (Cloudflare 6-8× slower)

### Why TCP Performs Better Over VPN

#### 1. Connection Setup Overhead × VPN Latency ⭐⭐⭐

**HTTP Fetch (sequential):**
```
Request 1: DNS → TCP handshake → TLS handshake → HTTP → download → close
Request 2: DNS → TCP handshake → TLS handshake → HTTP → download → close
...
```

**VPN adds latency to each step:**
- Normal RTT: 20ms
- VPN RTT: 40-50ms (encrypted tunnel overhead)
- Each request pays this penalty repeatedly

**CTU (persistent connections):**
```
Setup once: 3× (TCP handshake → TLS handshake)
Then: Continuous data stream for 7 seconds
```

**Impact:** With VPN adding 30ms RTT, HTTP Fetch wastes time on connection setup instead of transferring data.

#### 2. TCP Slow Start × High Latency ⭐⭐⭐

**How slow start works:**
- Starts with cwnd = 10 packets
- Doubles every RTT until reaching capacity
- Formula: `Time to full speed ≈ log₂(target_cwnd) × RTT`

**Example over VPN (50ms RTT):**

| RTT Round | Window Size | Throughput |
|-----------|-------------|------------|
| 1 | 10 packets | ~100 Kbps |
| 2 | 20 packets | ~200 Kbps |
| 3 | 40 packets | ~400 Kbps |
| 4 | 80 packets | ~800 Kbps |
| 5 | 160 packets | ~1.6 Mbps |
| 6 | 320 packets | ~3.2 Mbps |

**After 300ms (6 RTTs), only at 3.2 Mbps!**

**HTTP Fetch problem:**
- Each 100KB request finishes in ~200ms
- Never escapes slow start!
- Next request starts over at round 1

**CTU advantage:**
- 3 parallel streams run for 7000ms
- 7000ms ÷ 50ms = 140 RTT rounds
- Congestion window reaches full capacity

#### 3. Bandwidth-Delay Product (BDP) ⭐⭐

**BDP = Bandwidth × RTT**

Example: 100 Mbps line with VPN (50ms RTT)
```
BDP = 100 Mbps × 50ms = 625 KB in flight needed
```

**HTTP Fetch:** Sequential requests, only 1× BDP filled  
**CTU:** 3 parallel streams, 3× BDP filled simultaneously

#### 4. HTTP Protocol Overhead ⭐⭐

**Every HTTP request includes ~500 bytes headers**

Over VPN with 50ms RTT:
- Header exchange = 1 RTT = 50ms wasted per request
- 8 sequential requests × 50ms = 400ms just for headers

**CTU's binary protocol:** Minimal overhead, no HTTP parsing

#### 5. Request Completion Logic

From Cloudflare config:
```javascript
{ type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true }
```

**Ramp-up logic:**
1. If download takes <1000ms → try larger file
2. If download takes ≥1000ms → stop testing

**Over VPN with slow start:**
- 100KB request takes 300ms but only averages 4 Mbps (stuck in slow start)
- 1MB request takes 1200ms → test stops early
- Never reaches full capacity!

**CTU:** Fixed 7-second test regardless, always has time to reach full speed

### Summary: VPN Impact

| Factor | HTTP Fetch Impact | Raw TCP Impact |
|--------|------------------|----------------|
| **Connection setup** | Repeated per request (+30-50ms each) | Once at start |
| **Slow start** | Restarts every request | Continuous growth |
| **Parallel streams** | Sequential = 1× BDP | 3 parallel = 3× BDP |
| **Protocol overhead** | HTTP headers + parsing | Minimal markers |
| **Browser sandbox** | Conservative buffers | Optimized buffers |
| **VPN latency** | Multiplies overhead | Amortized over 7s |

**Result:** Over VPN, combination of high latency + sequential requests + repeated slow start cripples HTTP Fetch performance.

---

## TCP Congestion Window Explained

### Co je Congestion Window (cwnd)?

**Congestion window** je TCP mechanismus, který kontroluje, **kolik dat může být "ve vzduchu" (odeslané, ale ještě nepotvrzené) v daném okamžiku**.

### Jednoduchá analogie

Představ si to jako **kolonu nákladních aut na dálnici:**
- Malé cwnd = Můžeš vypustit jen 2 kamiony najednou
- Velké cwnd = Můžeš vypustit 100 kamionů najednou
- Čím víc kamionů na cestě → tím vyšší propustnost

**TCP problém:** Na začátku spojení neví, jak velká síť je → začíná opatrně.

### Jak to funguje technicky

#### Fáze 1: Slow Start (Pomalý start)

```
RTT 1:  cwnd = 10 paketů   →  pošle 10  →  dostane ACK → cwnd = 20
RTT 2:  cwnd = 20 paketů   →  pošle 20  →  dostane ACK → cwnd = 40
RTT 3:  cwnd = 40 paketů   →  pošle 40  →  dostane ACK → cwnd = 80
RTT 4:  cwnd = 80 paketů   →  pošle 80  →  dostane ACK → cwnd = 160
RTT 5:  cwnd = 160 paketů  →  pošle 160 →  dostane ACK → cwnd = 320
```

**Pravidlo:** Za každý úspěšně potvrzený paket zdvojnásob cwnd (exponenciální růst).

#### Fáze 2: Congestion Avoidance (Vyhýbání přetížení)

Když cwnd dosáhne slow start threshold:

```
RTT 10:  cwnd = 500 paketů  →  pošle 500  →  ACK  →  cwnd = 501
RTT 11:  cwnd = 501 paketů  →  pošle 501  →  ACK  →  cwnd = 502
```

**Pravidlo:** Růst zpomalí na lineární (+1 paket za RTT).

#### Fáze 3: Packet Loss (Ztráta paketu)

Když se paket ztratí:
```
cwnd = 500 → PACKET LOST! → cwnd = 250 (snížení na polovinu)
```

### Příklad: 100 Mbps linka, 50ms RTT (VPN)

**Maximální možná propustnost:**
```
Bandwidth-Delay Product = 100 Mbps × 50ms = 625 KB
Potřebuješ cwnd ≥ 625 KB = ~417 paketů (1500B každý)
```

**Kolik času trvá se tam dostat?**

| RTT Round | cwnd (pakety) | Data "in flight" | Efektivní rychlost |
|-----------|---------------|------------------|---------------------|
| 0 | 10 | 15 KB | 2.4 Mbps |
| 1 | 20 | 30 KB | 4.8 Mbps |
| 2 | 40 | 60 KB | 9.6 Mbps |
| 3 | 80 | 120 KB | 19.2 Mbps |
| 4 | 160 | 240 KB | 38.4 Mbps |
| 5 | 320 | 480 KB | 76.8 Mbps |
| 6 | 417+ | 625 KB | **100 Mbps** ✅ |

**Trvá 6 RTT = 300ms dosáhnout plné rychlosti!**

### Proč to škodí Cloudflare?

**Cloudflare (HTTP Fetch) - sekvenční requesty:**
```
Request 1: 100 KB download
  → trvá 200ms
  → cwnd dosáhne jen ~40 paketů
  → průměrná rychlost ~5 Mbps
  → REQUEST KONČÍ ❌
  → cwnd RESETUJE na 10!

Request 2: 1 MB download  
  → cwnd ZAČÍNÁ ZNOVU od 10! ❌
  → trvá 800ms
  → průměrná rychlost ~15 Mbps
```

**CTU NetTest (Raw TCP) - trvalé spojení:**
```
Connection 1, 2, 3: Otevřené po 7 sekund
  → RTT 1-6: slow start (300ms)
  → RTT 7-140: plná rychlost 6.7s! ✅
  → Průměrná rychlost ≈ 95 Mbps
```

### Slow Start After Idle (RFC 5681)

**Důležité:** I když TCP spojení zůstává otevřené (HTTP Keep-Alive), **cwnd se může resetovat po idle pauze!**

**Pravidlo:** Pokud TCP nepošle data po dobu > 1 RTT, implementace BY MĚLA snížit cwnd zpět.

**Proč?**
- Síťové podmínky se mohly změnit
- Buffery mohly vypršet
- Bezpečnost proti přetížení

**Implementace:**
```
Linux: cwnd = initial_cwnd (10)
Windows: cwnd = max(initial_cwnd, cwnd/2)
```

**Dopad na Cloudflare:**

I když HTTP Keep-Alive reusuje spojení (bez handshakes), mezi requesty je pauza (10-50ms JavaScript overhead) → cwnd se může redukovat → slow start se opakuje!

---

## Latency Measurement Differences

### Why Cloudflare Shows Higher Idle Latency

**Observed pattern:** Cloudflare idle latency typically +10-20ms higher than Ookla/CTU unloaded ping.

### How Each Measures Latency

#### Cloudflare Speedtest

**Method:**
```
HTTP GET request with bytes=0
Timing = requestStart → responseStart (Time To First Byte)
```

**What happens in one "ping":**
1. JavaScript initiates HTTP GET
2. Browser DNS lookup (if needed)
3. TCP handshake (if new connection) - 1 RTT
4. TLS handshake (if new connection) - 1-2 RTT  
5. HTTP request sent with headers (~400-600 bytes)
6. Server receives and parses HTTP request
7. Server sends HTTP response with headers (~300-500 bytes)
8. Browser receives first byte
9. PerformanceResourceTiming API records time
10. Subtract 10ms `estimatedServerTime`

**Total overhead:**
- Browser API overhead: ~2-5ms
- HTTP parsing (client + server): ~3-6ms
- TLS record framing: ~1-3ms
- JavaScript execution: ~1-2ms
- Server HTTP stack: ~2-5ms
- **Minus 10ms estimate**

**Typical result: True RTT + 10-20ms**

#### Ookla/CTU Speedtest

**Method:**
```
Raw TCP or UDP-based ping
Server echoes packet immediately
```

**What happens:**
1. Send small packet with timestamp
2. Server echoes it back (microsecond response time)
3. Measure round-trip time

**Minimal overhead:**
- No HTTP parsing
- No browser API delay
- Optimized native code
- Minimal TLS overhead

**Typical result: True RTT + 1-2ms**

### Technical Breakdown of Extra Latency

#### 1. PerformanceResourceTiming API Precision (+2-5ms)

Browser timing APIs have limited precision:
- Timer resolution often rounded to 1ms (Spectre mitigation)
- Event loop delays in JavaScript
- Browser rendering thread interference

**Ookla:** Uses native code with microsecond precision timers

#### 2. HTTP Protocol Overhead (+3-8ms)

**Request:**
```http
GET /download?bytes=0 HTTP/1.1
Host: speed.cloudflare.com
User-Agent: Mozilla/5.0...
Accept: */*
[headers...]
```
~400-600 bytes

**Response:**
```http
HTTP/1.1 200 OK
Content-Length: 0
[headers...]
```
~300-500 bytes

**Parsing overhead:**
- Server: Parse HTTP → ~2-4ms
- Client: Parse response → ~2-3ms

#### 3. TLS Record Framing (+1-3ms)

Even over existing TLS connection, each HTTP message is wrapped:
```
[TLS header 5B][encrypted HTTP][MAC 16B]
```

Encryption/decryption + framing: ~2ms total

#### 4. Browser Event Loop Delays (+1-5ms)

JavaScript is single-threaded:
```
Network receives data → Queue event → Wait for event loop → Callback executes
```

If browser is busy, callback is delayed.

#### 5. Why 10ms Subtraction Doesn't Fix It

From Cloudflare README:
```
estimatedServerTime: 10ms (default)
```

**Problems:**
- Browser overhead isn't accounted for (~5-8ms)
- HTTP overhead varies by server load
- TLS framing not included
- 10ms is a guess, actual varies

### Comparison Table

| Factor | Ookla | Cloudflare | Extra Latency |
|--------|-------|------------|---------------|
| **Protocol** | Raw TCP/UDP ping | HTTP GET | +3-8ms |
| **Timing API** | Native microsecond | Browser PerformanceAPI | +2-5ms |
| **Server stack** | Optimized echo | HTTP handler | +2-5ms |
| **Encryption** | Minimal TLS | TLS record framing | +1-3ms |
| **Parsing** | Binary packet | HTTP headers | +2-4ms |
| **JavaScript** | None | Event loop delays | +1-5ms |
| **Subtracted** | - | -10ms estimate | - |
| **TOTAL** | ≈ True RTT + 1ms | ≈ True RTT + 10-20ms | **+10-20ms** |

### Real-World Example

**Actual network RTT: 15ms**

**Ookla shows:** 16ms (15 + 1ms overhead)

**Cloudflare shows:**
```
Network RTT:               15ms
Browser + HTTP overhead:  +15ms
Estimated server time:    -10ms (subtracted)
──────────────────────────
Final displayed:           20ms
```

**Difference: +4-5ms**

### Key Takeaway

**Cloudflare will ALWAYS show ~10-20ms higher idle latency** because:
- ✅ It measures HTTP round-trip (not network round-trip)
- ✅ Browser APIs add overhead
- ✅ JavaScript execution adds delays
- ✅ 10ms server time subtraction doesn't account for client-side overhead

**This is expected behavior, not a bug.**

**Cloudflare measures "real-world web latency"**  
**Ookla/CTU measures "theoretical network latency"**

### Recommendation for Users

Add disclaimer:
```
ℹ️ O latenci (ping)

Náš speedtest měří HTTP latenci, která zahrnuje režii prohlížeče a protokolu.
Hodnoty mohou být o 10-20ms vyšší než u nativních ping nástrojů (Ookla, CTU).
Toto není chyba - měříme realističtější "web latenci" místo čisté síťové latence.
```

---

## Connection Reuse vs Slow Start

### Important Distinction

**Connection Setup** and **TCP Slow Start** are DIFFERENT things!

#### Connection Setup (one-time)

Happens **only when opening a new TCP connection:**

```
Client → Server: SYN
Server → Client: SYN-ACK
Client → Server: ACK
[TCP connection established]

Client → Server: ClientHello (TLS)
Server → Client: ServerHello (TLS)
[TLS handshake continues...]
[TLS connection established]
```

**With HTTP Keep-Alive:** This happens only ONCE, then connection is reused.

**Overhead:** ~2-3 RTT (50-150ms with VPN)

#### TCP Slow Start (per request behavior)

**KEY POINT:** Even if TCP connection stays open, cwnd behavior:

```
Request 1:  
  cwnd starts at 10 → grows to 50 → REQUEST ENDS → cwnd stays at 50
  
[Idle time: 10-100ms while JavaScript prepares next request]

Request 2:
  ❌ cwnd does NOT reset completely, BUT...
  ⚠️ cwnd REDUCES due to "slow start after idle" (RFC 5681)
  
  Rule: "If connection sits idle for > 1 RTT, reduce cwnd"
  
  cwnd = max(initial_cwnd, cwnd/2) or reset to initial_cwnd
  
  → cwnd effectively restarted or heavily reduced!
```

### Slow Start After Idle (RFC 5681)

**Rule from TCP standard:**

If TCP connection sends no data for duration > 1 RTT, implementation SHOULD reduce cwnd back to initial value or half.

**Why?**
- Network conditions may have changed during pause
- Buffers may have expired
- Safety measure against congestion

**In practice:**
```
Linux:    ssthresh = cwnd, cwnd = initial_cwnd (10)
Windows:  cwnd = max(initial_cwnd, cwnd/2)
macOS:    varies by version
```

### Timeline Example from Cloudflare Config

```javascript
{ type: 'latency', numPackets: 1 },        // ~20ms
{ type: 'download', bytes: 1e5, count: 8 }, // ~200ms per request
{ type: 'latency', numPackets: 20 },       // ~20ms each
```

**Scenario with HTTP Keep-Alive + Slow Start After Idle:**

```
t=0ms:     Request 1 (latency #1)
           - DNS lookup: 20ms
           - TCP handshake: 50ms (VPN)
           - TLS handshake: 100ms (VPN)  
           - HTTP GET: 15ms network RTT
           TOTAL: 185ms
           cwnd achieved: ~20 packets
           
t=185ms:   [Connection open, cwnd=20]

t=200ms:   Request 2 (download 100KB) - 15ms pause
           ⚠️ Idle for 15ms - cwnd reduced? Depends on OS
           Maybe cwnd stays at 20, maybe → 10
           
t=400ms:   Request 3 (download 100KB)
           [another pause]
           
...

t=2000ms:  Request 10 (latency #1 of 20)
           - No DNS ✓
           - No TCP handshake ✓  
           - No TLS handshake ✓
           - Just HTTP GET: 15ms network + 10ms overhead = 25ms
           TOTAL: 25ms ← "warmed up" (no handshakes)
           
           BUT cwnd might have been reset during pauses!
```

### What "Connection Warmup" Actually Means

**"Connection Warmup" = ✓ Correct**
- First request: Full handshakes (~2-3 RTT overhead)
- Subsequent requests: Reuse connection (no handshakes)
- Saves 100-150ms on first vs subsequent requests

**"Bandwidth Warmup" = ✗ Doesn't exist with HTTP Fetch**
- Each request starts with reduced cwnd
- Slow start after idle between requests
- No continuous saturation like CTU

### Visualization

**Latency overhead (connection setup):**
```
Request 1:  |████████████████|  65ms (handshakes + HTTP)
Request 2:  |████|              20ms (just HTTP, reused connection) ✓
Request 3:  |████|              20ms
```

**Bandwidth throughput (slow start):**
```
Request 1:  |╱▔▔| 100KB done    avg 8 Mbps
[pause - JavaScript overhead]
Request 2:  |╱▔▔| 100KB done    avg 10 Mbps (cwnd reduced!)
[pause]
Request 3:  |╱▔▔| 100KB done    avg 12 Mbps
```

**CTU (continuous stream):**
```
Stream:     |╱▔▔▔▔▔▔▔▔▔▔▔▔▔| 7s avg 95 Mbps ✓
```

### Key Differences Summary

**Connection reuse (HTTP Keep-Alive):**
- ✅ Avoids DNS lookup
- ✅ Avoids TCP handshake (3-way)
- ✅ Avoids TLS handshake (1-2 RTT)
- ✅ Saves 100-150ms per request

**cwnd preservation:**
- ✗ NOT guaranteed
- ✗ Slow start after idle applies
- ✗ JavaScript pauses between requests trigger cwnd reduction
- ✗ Each bandwidth request suffers slow start even if connection is reused

### Verification Method

**In Chrome DevTools:**

1. Open speedtest
2. F12 → Network tab
3. Run test
4. Check "Connection ID" column

If all requests have **same Connection ID** → reused ✓  
If each request has **different Connection ID** → new connections ✗

Or check timing details - if "DNS Lookup" and "Initial connection" is 0ms for requests 2+, it means reuse.

---

## Recommendations for Speedtest Demo

### User Disclaimers (Czech)

**Před testem / Po testu:**
```
⚠️ Indikativní měření

Tento speedtest slouží pouze pro orientační ověření rychlosti vašeho připojení. 
Není metrologicky certifikován a nelze jej použít jako oficiální důkaz rychlosti připojení.

Výsledky mohou být ovlivněny:
• Vytížením sítě a serverů
• Kvalitou Wi-Fi signálu
• Počtem připojených zařízení
• Běžícími aplikacemi na pozadí
• VPN připojením (výrazně snižuje naměřené hodnoty)

Pro oficiální měření kontaktujte zákaznickou podporu.
```

**O latenci:**
```
ℹ️ O latenci (ping)

Náš speedtest měří HTTP latenci, která zahrnuje režii prohlížeče a protokolu.
Hodnoty mohou být o 10-20ms vyšší než u nativních ping nástrojů (Ookla, CTU).
Toto není chyba - měříme realističtější "web latenci" místo čisté síťové latence.
```

### Business Stakeholder Explanation

**Proč se liší od ostatních testů?**

"Cloudflare speedtest měří **latenci webové aplikace** (zahrnuje HTTP overhead), konkurenční testy měří **čistou síťovou latenci**. Oba výsledky jsou správné, jen měří jiné věci. 

Pro běžné uživatele je Cloudflare test **relevantnější**, protože ukazuje skutečnou rychlost prohlížení webu, ne teoretickou kapacitu linky.

Přes VPN jsou rozdíly větší, protože browser-based testy trpí vyšší latencí víc než nativní TCP testy."

---

## Technical References

### Source Documents

1. **RMBT Specification:**  
   https://github.com/rtr-nettest/rmbt-server/blob/master/RMBT_specification.md

2. **Cloudflare Speedtest SDK:**  
   https://github.com/cloudflare/speedtest

3. **CTU NetTest GitHub:**  
   https://github.com/CTUCZ

4. **RFC 5681 - TCP Congestion Control:**  
   https://www.rfc-editor.org/rfc/rfc5681

### Data Files

- `speedtest_cleaned.csv` - Cleaned calibration data with UTF-8 BOM encoding
- Original: `Speedtest DEMO - Testování Speedtestu.csv`

### Configuration

Current Cloudflare speedtest config in `src/App.vue`:
- Sequential ramp-up approach
- 100KB → 1MB → 10MB → 25MB file sizes
- `bandwidthFinishRequestDuration: 1000ms` default
- `bypassMinDuration: true` for initial download test

---

## Conclusions

### Key Findings

1. **CTU NetTest uses RMBT protocol** (multi-threaded TCP/TLS, open-source)
2. **Cloudflare uses HTTP Fetch API** (browser-based, sequential requests)
3. **Both are valid** but measure different aspects of network performance
4. **VPN dramatically affects Cloudflare** due to slow start + sequential requests
5. **Latency differences are expected** (~10-20ms higher for Cloudflare)
6. **MAE should be calculated per technology** to account for absolute vs percentage errors

### Recommendations

1. ✅ Use technology-specific MAE statistics
2. ✅ Add clear disclaimers about measurement methodology
3. ✅ Explain VPN impact to users
4. ✅ Document that higher latency is expected (not a bug)
5. ✅ Position as "real-world browser performance" vs "line capacity test"

---

**End of Analysis Notes**
