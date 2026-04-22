# Getting Started - Cloud Deployment Guide

## 🎯 What You'll Deploy

A **fully functional Smart EV Charging system** on Azure with:
- ✅ Backend API running on App Service
- ✅ Frontend React app on App Service  
- ✅ Container Registry for images
- ✅ Automatic CI/CD with GitHub Actions

## 📋 Prerequisites

1. **Azure Account** - [Create free account](https://azure.microsoft.com/free/)
2. **GitHub Account** - For CI/CD automation
3. **Azure CLI** - [Install here](https://learn.microsoft.com/cli/azure/install-azure-cli)
4. **Docker** - [Install here](https://www.docker.com/products/docker-desktop)

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Azure

```powershell
# Login to Azure
az login

# Set subscription (if you have multiple)
az account set --subscription "Your Subscription Name"

# Create resource group
az group create `
  --name ev-charging-rg `
  --location eastus
```

### Step 2: Create Service Principal for CI/CD

```powershell
# Create service principal
$sp = az ad sp create-for-rbac `
  --name "ev-charging-app" `
  --role Contributor `
  --scopes "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/ev-charging-rg" `
  --json | ConvertFrom-Json

# Save the output - you'll need it for GitHub secrets
Write-Host $sp | ConvertTo-Json
```

### Step 3: Deploy Infrastructure (Bicep)

```powershell
# Deploy the template
az deployment group create `
  --resource-group ev-charging-rg `
  --template-file infra/main.bicep `
  --parameters location=eastus environmentName=prod

# Get outputs
az deployment group show `
  --resource-group ev-charging-rg `
  --name main `
  --query properties.outputs
```

### Step 4: Create Container Registry

```powershell
# Create ACR with unique name
az acr create `
  --resource-group ev-charging-rg `
  --name evcharging$(Get-Random -Minimum 1000 -Maximum 9999) `
  --sku Basic

# Get login credentials
az acr credential show `
  --resource-group ev-charging-rg `
  --name <your-acr-name>
```

### Step 5: Configure GitHub Secrets

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

```
AZURE_CREDENTIALS=<service principal JSON from Step 2>
AZURE_RESOURCE_GROUP=ev-charging-rg
AZURE_LOCATION=eastus
REGISTRY_LOGIN_SERVER=<your-acr-name>.azurecr.io
REGISTRY_USERNAME=<username from Step 4>
REGISTRY_PASSWORD=<password from Step 4>
```

### Step 6: Push Changes & Deploy

```powershell
git add .
git commit -m "Ready for cloud deployment"
git push origin main
```

**GitHub Actions will automatically:**
1. Build Docker images
2. Push to Container Registry
3. Deploy to App Service

## ✅ Verify Deployment

```powershell
# Get App Service URLs
az webapp show `
  --resource-group ev-charging-rg `
  --name backend-* `
  --query defaultHostName `
  -o tsv

az webapp show `
  --resource-group ev-charging-rg `
  --name frontend-* `
  --query defaultHostName `
  -o tsv

# Test backend health
Invoke-RestMethod https://<backend-url>/api/health

# Test stations endpoint
Invoke-RestMethod https://<backend-url>/api/stations
```

## 💰 Estimated Costs (Monthly)

| Service | SKU | Cost |
|---------|-----|------|
| App Service Plan | B2 Linux | ~$55 |
| Container Registry | Basic | ~$5 |
| Data Transfer | - | ~$1-5 |
| **Total** | | ~**$60-65** |

*Free tier available for 30 days!*

## 🔧 Common Issues & Fixes

### Issue: "Resource already exists"
```powershell
# Delete and recreate
az group delete --name ev-charging-rg
az group create --name ev-charging-rg --location eastus
```

### Issue: GitHub Actions failing
- Check secrets are correct
- Verify ACR credentials work locally:
```powershell
docker login -u <username> -p <password> <registry>.azurecr.io
```

### Issue: Frontend can't reach backend
- Check CORS is enabled on backend
- Verify API URL in frontend env:
```javascript
REACT_APP_API_URL=https://<backend-hostname>/api
```

## 📊 Monitoring

```powershell
# View real-time logs
az webapp log tail `
  --resource-group ev-charging-rg `
  --name backend-*

# Get performance metrics
az monitor metrics list `
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/ev-charging-rg/providers/Microsoft.Web/sites/backend-* `
  --metric "Http5xx"
```

## 🔄 Continuous Deployment

Now that CI/CD is set up:

1. Make code changes locally
2. Push to GitHub main branch
3. GitHub Actions automatically:
   - Builds Docker images
   - Runs tests
   - Pushes to ACR
   - Deploys to App Service

No manual deployment needed! 🎉

## 📞 Need Help?

**Check logs:**
```powershell
# Real-time logs
az webapp log tail -resource-group ev-charging-rg --name backend-*

# Download logs
az webapp log download --resource-group ev-charging-rg --name backend-*
```

**Common endpoints:**
- Frontend: `https://<frontend-url>`
- Backend API: `https://<backend-url>/api`
- API Docs: Visit `/api/stations` or `/api/stations` for sample

## 🎊 Next Steps

1. **Monitor costs**: Set up billing alerts
2. **Add custom domain**: Use your own domain
3. **Enable HTTPS**: Azure handles this automatically
4. **Scale up**: Change App Service plan if needed
5. **Add database**: Integrate CosmosDB for data persistence

---

**Deployed? Show it off! 🚀**

Tweet: "Just deployed Smart EV Charging on Azure! Real-time optimization with React + Node.js 💡⚡ #makeathon2026"
