# ⚡ QUICK START - 5 Minutes to Running

## Choose Your Path

### 🐳 Path 1: Docker Compose (Easiest - 2 minutes)
```bash
docker-compose up
# Wait 30 seconds for builds...
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### 🚀 Path 2: Manual Setup (3 minutes)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Backend ready on port 5000

# Terminal 2 - Frontend
cd frontend
npm install
npm start
# Frontend ready on port 3000
```

### ☁️ Path 3: Azure Cloud (15 minutes)
```bash
# Follow DEPLOYMENT.md for complete guide
az group create --name ev-charging-rg --location eastus
az deployment group create -g ev-charging-rg -f infra/main.bicep
# Then push code to GitHub for auto-deploy
```

---

## Test It Immediately

### 1. Open Frontend
```
http://localhost:3000
```
You should see:
- List of 4 charging stations
- "Find Best Station" button
- Station cards with real-time metrics

### 2. Click "Find Best Station"
✅ Backend calculates best option
✅ Shows recommendation with wait time
✅ Compares with other stations

### 3. Click "Book Now"
✅ Select station
✅ Enter user ID
✅ Choose vehicle type
✅ Booking confirmed!

### 4. Watch Real-Time Updates
✅ Queue lengths update every 5 seconds
✅ Occupancy rates change
✅ Grid load adjusts

---

## API Endpoints (Test in Browser/Postman)

```bash
# Get all stations
curl http://localhost:5000/api/stations

# Get recommendation
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"user_location":{"lat":40.7128,"lng":-74.0060}}'

# Get predictions
curl http://localhost:5000/api/predict/demand

# Health check
curl http://localhost:5000/api/health
```

---

## Troubleshooting

**Port 3000/5000 already in use?**
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
PORT=5001 npm start
```

**Docker issues?**
```bash
# Clean rebuild
docker-compose down -v
docker-compose up --build
```

**Can't reach localhost?**
```bash
# Check if services are running
docker ps

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Next Steps After Quick Start

1. **Read Full Docs**
   - README.md - Complete system guide
   - ARCHITECTURE.txt - System design

2. **Explore Code**
   - backend/utils/optimization.js - Smart algorithm
   - frontend/src/components/ - UI components

3. **Deploy to Cloud**
   - DEPLOYMENT.md - Azure setup guide
   - .github/workflows/deploy.yml - CI/CD config

4. **Customize**
   - Add more stations (backend/models/stations.js)
   - Change algorithm (backend/utils/optimization.js)
   - Customize UI (frontend/src/components/)

---

## Feature Tour (2 minutes)

### The Recommendation Engine
1. Click "Find Best Station"
2. See algorithm in action:
   - ⏱ Calculates wait times
   - 🔌 Evaluates availability
   - ⚡ Checks grid load
   - 🎯 Recommends best option

### The Booking System
1. Click "Book Now" on any station
2. Enter user details
3. Get booking confirmation
4. See queue position

### Real-Time Updates
1. Watch station occupancy change (every 5s)
2. Queue lengths update
3. Load percentages adjust
4. Available chargers change

### Network Insights
1. See current demand factor
2. Check peak hour status
3. Review system-wide metrics
4. Understand grid state

---

## What Happens Behind the Scenes

### Every 5 Seconds (Edge Layer)
```javascript
// Each station simulates:
- Random charger completions
- New queue arrivals
- Power draw updates
- Load factor recalculation
```

### On Recommendation Request
```javascript
// Backend calculates for each station:
- Waiting time = (queue / chargers) × avg_time
- Availability score = available / total
- Load factor = current_power / capacity
- Final score = weighted optimization
// Returns station with highest score
```

### On Booking
```javascript
// Backend:
- Adds user to station queue
- Generates booking ID
- Returns queue position
- Estimated wait time
```

---

## Demo to Judges (5 minutes)

1. **Show Frontend**
   - "This is our real-time dashboard"
   - Point to station list
   - Show real-time updates

2. **Demonstrate Smart Recommendation**
   - Click "Find Best Station"
   - "Algorithm optimizes 3 factors: waiting time, availability, and grid load"
   - Show results

3. **Show Booking**
   - Click "Book Now"
   - "Instant confirmation with queue position"
   - Booking success screen

4. **Explain Architecture**
   - "Frontend (React) talks to backend (Node.js)"
   - "Backend has optimization algorithm"
   - "Each station simulates real-time edge intelligence"

5. **Show Cloud Deployment**
   - "Deployed on Azure with CI/CD"
   - "One push to GitHub = auto-deployment"
   - Show DEPLOYMENT.md

---

## Key Talking Points

✅ **Smart Algorithm**: Multi-factor optimization, not random selection
✅ **Real-time**: Edge layer simulates realistic charging scenarios
✅ **Cloud-Ready**: Full Azure deployment with CI/CD automation
✅ **Production Code**: Modular, scalable, well-documented
✅ **Complete Package**: Frontend, backend, infrastructure included

---

## File Location Reference

- Documentation: README.md, DEPLOYMENT.md, ARCHITECTURE.txt
- Backend: `backend/` folder
- Frontend: `frontend/` folder
- Cloud Setup: `infra/main.bicep`
- Automation: `docker-compose.yml`, `.github/workflows/deploy.yml`

---

## Success Indicators

### ✅ If you see:
- 4 stations listed with real data
- "Find Best Station" returns a recommendation
- "Book Now" flow works end-to-end
- Real-time metrics updating every 5 seconds
- No errors in browser console

### → You're ready to go! 🎉

---

## Running Commands Cheat Sheet

```bash
# Start everything
docker-compose up

# Just backend
cd backend && npm install && npm start

# Just frontend
cd frontend && npm install && npm start

# Test API
curl http://localhost:5000/api/stations

# Deploy to Azure
az group create -n ev-charging-rg -l eastus
az deployment group create -g ev-charging-rg -f infra/main.bicep

# Check logs
docker-compose logs -f

# Stop everything
docker-compose down
```

---

**You're all set! Start with Docker Compose and explore! 🚀**

Questions? Check README.md for complete documentation.
