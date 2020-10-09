// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface CreateTransactionRequest {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionRequest): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type ==="outcome") {
      const balance = await transactionRepository.getBalance();
      if (balance.total < value)
        throw new AppError('don\'t have enough balance', 400);
    }

    const createCategory = new CreateCategoryService();
    const categoryEntity = await createCategory.execute({ name: category });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryEntity.id,
    });

    await transactionRepository.save(transaction);
    // @ts-ignore
    delete transaction.category_id;
    transaction.category = categoryEntity;

    return transaction;
  }
}

export default CreateTransactionService;
