import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface DeleteTransactionRequest {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: DeleteTransactionRequest): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.find({ where: { id } });

    if (!transaction) throw new AppError('transaction not found!', 404);

    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
