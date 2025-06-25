import { Actor, HttpAgent, Identity } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'

// ICP Ledger Canister ID (mainnet)
export const ICP_LEDGER_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai'

// Development environment check
const isDevelopment = process.env.NODE_ENV === 'development'

// Create HTTP Agent
export const createAgent = (identity?: Identity): HttpAgent => {
  const agent = new HttpAgent({
    host: isDevelopment ? 'http://localhost:4943' : 'https://ic0.app',
    identity
  })

  // Fetch root key for local development
  if (isDevelopment) {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running')
      console.error(err)
    })
  }

  return agent
}

// ICP Ledger Interface (simplified)
export interface ICPLedger {
  account_balance: (args: { account: Uint8Array }) => Promise<{ e8s: bigint }>
  transfer: (args: {
    memo: bigint
    amount: { e8s: bigint }
    fee: { e8s: bigint }
    from_subaccount?: Uint8Array[]
    to: Uint8Array
    created_at_time?: { timestamp_nanos: bigint }[]
  }) => Promise<{ Ok?: bigint; Err?: any }>
}

// Create ICP Ledger Actor
export const createICPLedgerActor = (identity?: Identity): ICPLedger => {
  const agent = createAgent(identity)
  
  // Simplified IDL for ICP Ledger (you would normally import this)
  const idlFactory = ({ IDL }: any) => {
    const Tokens = IDL.Record({ e8s: IDL.Nat64 })
    const AccountIdentifier = IDL.Vec(IDL.Nat8)
    const TransferArgs = IDL.Record({
      memo: IDL.Nat64,
      amount: Tokens,
      fee: Tokens,
      from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      to: AccountIdentifier,
      created_at_time: IDL.Opt(IDL.Record({ timestamp_nanos: IDL.Nat64 }))
    })
    const TransferResult = IDL.Variant({
      Ok: IDL.Nat64,
      Err: IDL.Variant({
        BadFee: IDL.Record({ expected_fee: Tokens }),
        InsufficientFunds: IDL.Record({ balance: Tokens }),
        TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
        TxCreatedInFuture: IDL.Null,
        TxDuplicate: IDL.Record({ duplicate_of: IDL.Nat64 })
      })
    })

    return IDL.Service({
      account_balance: IDL.Func([IDL.Record({ account: AccountIdentifier })], [Tokens], ['query']),
      transfer: IDL.Func([TransferArgs], [TransferResult], [])
    })
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: ICP_LEDGER_CANISTER_ID
  }) as ICPLedger
}

// Utility functions
export const e8sToICP = (e8s: bigint): number => {
  return Number(e8s) / 100_000_000
}

export const icpToE8s = (icp: number): bigint => {
  return BigInt(Math.round(icp * 100_000_000))
}

export const formatICP = (e8s: bigint): string => {
  const icp = e8sToICP(e8s)
  return icp.toFixed(8).replace(/\.?0+$/, '')
}

// Account identifier utilities
export const principalToAccountIdentifier = (principal: Principal, subAccount?: Uint8Array): Uint8Array => {
  // This is a simplified version - you would use the actual account identifier library
  const principalBytes = principal.toUint8Array()
  const accountIdentifier = new Uint8Array(32)
  accountIdentifier.set(principalBytes.slice(0, Math.min(32, principalBytes.length)))
  return accountIdentifier
}

// Exchange rate utilities (mock implementation)
export const getExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  // In a real implementation, this would fetch from an oracle or exchange API
  const mockRates: Record<string, number> = {
    'ICP-GHS': 238.50,
    'ICP-USD': 12.45,
    'ICP-USDT': 12.43,
    'ICP-USDC': 12.44
  }
  
  const rateKey = `${fromCurrency}-${toCurrency}`
  return mockRates[rateKey] || 1
}

export const convertCurrency = async (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number> => {
  const rate = await getExchangeRate(fromCurrency, toCurrency)
  return amount * rate
}

// Transaction fee constants
export const ICP_TRANSFER_FEE = BigInt(10_000) // 0.0001 ICP in e8s
export const FUSIONPAY_FEE_RATE = 0.001 // 0.1%

export const calculateTransactionFees = (icpAmount: bigint) => {
  const fusionPayFee = BigInt(Math.floor(Number(icpAmount) * FUSIONPAY_FEE_RATE))
  return {
    networkFee: ICP_TRANSFER_FEE,
    fusionPayFee,
    totalFees: ICP_TRANSFER_FEE + fusionPayFee
  }
}