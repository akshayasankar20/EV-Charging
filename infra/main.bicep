targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
param location string = resourceGroup().location

@minLength(1)
@maxLength(64)
param environmentName string

param containerRegistryName string = ''
param appServicePlanId string = ''

var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
  'managed-by': 'bicep'
}

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = if (empty(containerRegistryName)) {
  name: 'acr${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
    publicNetworkAccess: 'Enabled'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = if (empty(appServicePlanId)) {
  name: 'asp-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'B2'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Backend App Service
resource backendAppService 'Microsoft.Web/sites@2022-09-01' = {
  name: 'backend-${resourceToken}'
  location: location
  tags: union(tags, {
    'azd-service-name': 'backend'
  })
  kind: 'app,linux,container'
  properties: {
    serverFarmId: empty(appServicePlanId) ? appServicePlan.id : appServicePlanId
    siteConfig: {
      linuxFxVersion: 'DOCKER|node:18-alpine'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'PORT'
          value: '5000'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
      ]
    }
  }
}

// Frontend App Service
resource frontendAppService 'Microsoft.Web/sites@2022-09-01' = {
  name: 'frontend-${resourceToken}'
  location: location
  tags: union(tags, {
    'azd-service-name': 'frontend'
  })
  kind: 'app,linux,container'
  properties: {
    serverFarmId: empty(appServicePlanId) ? appServicePlan.id : appServicePlanId
    siteConfig: {
      linuxFxVersion: 'DOCKER|nginx:alpine'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'REACT_APP_API_URL'
          value: 'https://${backendAppService.properties.defaultHostName}/api'
        }
      ]
    }
  }
}

output containerRegistryName string = empty(containerRegistryName) ? containerRegistry.name : containerRegistryName
output containerRegistryUrl string = empty(containerRegistryName)
  ? 'https://${containerRegistry!.properties.loginServer}'
  : 'https://${containerRegistryName}.azurecr.io'
output backendAppServiceUrl string = 'https://${backendAppService.properties.defaultHostName}'
output frontendAppServiceUrl string = 'https://${frontendAppService.properties.defaultHostName}'
