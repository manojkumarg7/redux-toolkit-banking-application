import { DEMO_CREDENTIALS } from '../constants';
import { mockUser } from '../data/mockData';
import type { AuthCredentials, User } from '../types';
import { simulateFailure, simulateRequest } from './apiClient';

export async function login(credentials: AuthCredentials): Promise<User> {
  const identifier = credentials.identifier.trim().toLowerCase();
  const validIdentifiers = [
    DEMO_CREDENTIALS.identifier.toLowerCase(),
    DEMO_CREDENTIALS.email.toLowerCase(),
  ];

  if (!validIdentifiers.includes(identifier) || credentials.password !== DEMO_CREDENTIALS.password) {
    return simulateFailure('Invalid Customer ID/Email or password.');
  }

  return simulateRequest(mockUser, 700);
}

export async function logout(): Promise<void> {
  return simulateRequest(undefined, 200);
}

export async function getCurrentUser(): Promise<User> {
  return simulateRequest(mockUser, 300);
}
