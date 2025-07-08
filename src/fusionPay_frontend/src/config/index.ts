// Environment configuration and constants

interface AppConfig {
  app: {
    name: string
    version: string
  }
  ic: {
    network: string
    host: string
    internetIdentityCanisterId: string
    backendCanisterId: string
  }
  api: {
    priceApiUrl: string
    exchangeRateApiUrl: string
  }
  features: {
    enablePriceTicker: boolean
    enableAnalytics: boolean
    enableDebugMode: boolean
  }
  security: {
    maxPaymentAmount: number
    maxCardsPerUser: number
    sessionTimeout: number
  }
  ui: {
    defaultCurrency: string
    supportedCurrencies: string[]
    defaultTheme: string
  }
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue
}

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key]
  if (value === undefined) return defaultValue
  return value === 'true' || value === '1'
}

const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key]
  if (value === undefined) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export const config: AppConfig = {
  app: {
    name: getEnvVar('VITE_APP_NAME', 'FusionPay'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  },
  ic: {
    network: getEnvVar('VITE_DFX_NETWORK', 'local'),
    host: getEnvVar('VITE_IC_HOST', 'http://localhost:4943'),
    internetIdentityCanisterId: getEnvVar('VITE_INTERNET_IDENTITY_CANISTER_ID', 'rdmx6-jaaaa-aaaaa-aaadq-cai'),
    backendCanisterId: getEnvVar('VITE_FUSIONPAY_BACKEND_CANISTER_ID', 'vpyes-67777-77774-qaaeq-cai'),
  },
  api: {
    priceApiUrl: getEnvVar('VITE_PRICE_API_URL', 'https://api.coingecko.com/api/v3'),
    exchangeRateApiUrl: getEnvVar('VITE_EXCHANGE_RATE_API_URL', 'https://api.exchangerate-api.com/v4/latest'),
  },
  features: {
    enablePriceTicker: getBooleanEnvVar('VITE_ENABLE_PRICE_TICKER', true),
    enableAnalytics: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
    enableDebugMode: getBooleanEnvVar('VITE_ENABLE_DEBUG_MODE', true),
  },
  security: {
    maxPaymentAmount: getNumberEnvVar('VITE_MAX_PAYMENT_AMOUNT', 1000000),
    maxCardsPerUser: getNumberEnvVar('VITE_MAX_CARDS_PER_USER', 10),
    sessionTimeout: getNumberEnvVar('VITE_SESSION_TIMEOUT', 3600000), // 1 hour
  },
  ui: {
    defaultCurrency: getEnvVar('VITE_DEFAULT_CURRENCY', 'GHS'),
    supportedCurrencies: getEnvVar('VITE_SUPPORTED_CURRENCIES', 'GHS,USD,EUR,ICP').split(','),
    defaultTheme: getEnvVar('VITE_DEFAULT_THEME', 'dark'),
  },
}

// Validation
if (!config.ic.backendCanisterId) {
  console.warn('Backend canister ID not configured')
}

if (config.features.enableDebugMode) {
  console.log('App Configuration:', config)
}

export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

export default config
