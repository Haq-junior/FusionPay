import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { config } from '../config';
import { 
  _SERVICE as BackendService,
  PaymentType,
  PaymentStatus,
  Payment,
  VirtualCard,
  Result,
  Result_1,
  Result_2
} from '../../../declarations/fusionPay_backend/fusionPay_backend.did';
import { 
  idlFactory
} from '../../../declarations/fusionPay_backend';

// Use canister ID from config
const canisterId = config.ic.backendCanisterId;

// Backend service class
export class FusionPayBackend {
  private actor: ActorSubclass<BackendService> | null = null;
  private agent: HttpAgent | null = null;

  async init(authClient?: AuthClient) {
    try {
      const host = config.ic.host;

      this.agent = new HttpAgent({ host });

      if (config.ic.network === 'local') {
        await this.agent.fetchRootKey();
      }

      if (authClient && await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        this.agent = new HttpAgent({ 
          host,
          identity 
        });
        
        if (config.ic.network === 'local') {
          await this.agent.fetchRootKey();
        }
      }

      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId,
      });
    } catch (error) {
      console.error('Failed to initialize backend:', error);
      throw error;
    }
  }

  private ensureActor() {
    if (!this.actor) {
      throw new Error('Backend not initialized. Call init() first.');
    }
    return this.actor;
  }

  // Payment Management
  async createPayment(
    amount: number,
    currency: string,
    paymentType: PaymentType,
    to: Principal,
    description: string
  ): Promise<{ ok: Payment } | { err: string }> {
    const actor = this.ensureActor();
    const result = await actor.createPayment(
      BigInt(amount),
      currency,
      paymentType,
      to,
      description
    );
    return result as { ok: Payment } | { err: string };
  }

  async getPayment(paymentId: string): Promise<{ ok: Payment } | { err: string }> {
    const actor = this.ensureActor();
    const result = await actor.getPayment(paymentId);
    return result as { ok: Payment } | { err: string };
  }

  async getUserPayments(): Promise<Payment[]> {
    const actor = this.ensureActor();
    return await actor.getUserPayments();
  }

  // Virtual Card Management
  async createVirtualCard(currency: string): Promise<{ ok: VirtualCard } | { err: string }> {
    const actor = this.ensureActor();
    try {
      const result = await actor.createVirtualCard(currency);
      return result as { ok: VirtualCard } | { err: string };
    } catch (error) {
      console.error('Backend createVirtualCard error:', error);
      return { err: `Failed to create virtual card: ${error}` };
    }
  }

  async getUserCards(): Promise<VirtualCard[]> {
    const actor = this.ensureActor();
    return await actor.getUserCards();
  }

  async deactivateCard(cardId: string): Promise<{ ok: VirtualCard } | { err: string }> {
    const actor = this.ensureActor();
    const result = await actor.deactivateCard(cardId);
    return result as { ok: VirtualCard } | { err: string };
  }

  // Balance Management
  async getCardBalance(cardId: string): Promise<{ ok: bigint } | { err: string }> {
    const actor = this.ensureActor();
    const result = await actor.getCardBalance(cardId);
    return result as { ok: bigint } | { err: string };
  }

  async topUpCard(cardId: string, amount: number): Promise<{ ok: VirtualCard } | { err: string }> {
    const actor = this.ensureActor();
    const result = await actor.topUpCard(cardId, BigInt(amount));
    return result as { ok: VirtualCard } | { err: string };
  }
}

// Singleton instance
export const backendService = new FusionPayBackend();

// Helper functions for working with backend types
export const createPaymentType = {
  MobileMoney: { MobileMoney: null } as PaymentType,
  Card: { Card: null } as PaymentType,
};

export const getPaymentStatusText = (status: PaymentStatus): string => {
  if ('Pending' in status) return 'Pending';
  if ('Completed' in status) return 'Completed';
  if ('Failed' in status) return 'Failed';
  return 'Unknown';
};

export const getPaymentTypeText = (type: PaymentType): string => {
  if ('MobileMoney' in type) return 'Mobile Money';
  if ('Card' in type) return 'Card';
  return 'Unknown';
};

// Type exports for frontend use
export type {
  Payment,
  VirtualCard,
  PaymentType,
  PaymentStatus,
  BackendService
}; 