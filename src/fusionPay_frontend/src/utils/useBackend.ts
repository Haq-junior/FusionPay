import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { 
  backendService, 
  Payment, 
  VirtualCard, 
  PaymentType,
  createPaymentType,
  getPaymentStatusText,
  getPaymentTypeText
} from './backend';
import { useAuth } from '../contexts/AuthContext';

export const useBackend = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment Management
  const createPayment = useCallback(async (
    amount: number,
    currency: string,
    paymentType: 'MobileMoney' | 'Card',
    toPrincipal: string,
    description: string
  ) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to create payments');
    }

    setIsLoading(true);
    setError(null);

    try {
      const to = Principal.fromText(toPrincipal);
      const type = paymentType === 'MobileMoney' 
        ? createPaymentType.MobileMoney 
        : createPaymentType.Card;
      
      const result = await backendService.createPayment(
        amount,
        currency,
        type,
        to,
        description
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      return result.ok;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getUserPayments = useCallback(async (): Promise<Payment[]> => {
    if (!isAuthenticated) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const payments = await backendService.getUserPayments();
      return payments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getPayment = useCallback(async (paymentId: string): Promise<Payment> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await backendService.getPayment(paymentId);

      if ('err' in result) {
        throw new Error(result.err);
      }

      return result.ok;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Virtual Card Management
  const createVirtualCard = useCallback(async (currency: string): Promise<VirtualCard> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to create virtual cards');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await backendService.createVirtualCard(currency);

      if ('err' in result) {
        throw new Error(result.err);
      }

      return result.ok;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create virtual card';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getUserCards = useCallback(async (): Promise<VirtualCard[]> => {
    if (!isAuthenticated) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const cards = await backendService.getUserCards();
      return cards;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch virtual cards';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const deactivateCard = useCallback(async (cardId: string): Promise<VirtualCard> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await backendService.deactivateCard(cardId);

      if ('err' in result) {
        throw new Error(result.err);
      }

      return result.ok;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate card';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const topUpCard = useCallback(async (cardId: string, amount: number): Promise<VirtualCard> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await backendService.topUpCard(cardId, amount);

      if ('err' in result) {
        throw new Error(result.err);
      }

      return result.ok;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to top up card';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getCardBalance = useCallback(async (cardId: string): Promise<number> => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await backendService.getCardBalance(cardId);

      if ('err' in result) {
        throw new Error(result.err);
      }

      return Number(result.ok);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch card balance';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Utility functions
  const formatPaymentAmount = useCallback((amount: bigint, currency: string): string => {
    return `${Number(amount).toLocaleString()} ${currency}`;
  }, []);

  const formatTimestamp = useCallback((timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1000000); // Convert from nanoseconds
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }, []);

  return {
    // State
    isLoading,
    error,
    
    // Payment methods
    createPayment,
    getUserPayments,
    getPayment,
    
    // Virtual card methods
    createVirtualCard,
    getUserCards,
    deactivateCard,
    topUpCard,
    getCardBalance,
    
    // Utility functions
    formatPaymentAmount,
    formatTimestamp,
    getPaymentStatusText,
    getPaymentTypeText,
    
    // Clear error
    clearError: () => setError(null),
  };
}; 