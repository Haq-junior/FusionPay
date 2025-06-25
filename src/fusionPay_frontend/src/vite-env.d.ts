/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INTERNET_IDENTITY_CANISTER_ID: string
  readonly VITE_FUSIONPAY_BACKEND_CANISTER_ID: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 