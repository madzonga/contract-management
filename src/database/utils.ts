import { Transaction } from 'sequelize';
import { sequelize } from '../models/index';

export async function withRetry<T>(fn: (trx: Transaction) => Promise<T>, retries = 3, delay = 100): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    const trx = await sequelize.transaction();
    try {
      const result = await fn(trx);
      await trx.commit();
      return result;
    } catch (error: any) {
      await trx.rollback();
      if (error.name === 'SequelizeDatabaseError' && error.parent && error.parent.code === 'SQLITE_BUSY') {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}