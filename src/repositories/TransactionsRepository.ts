import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    
    const allTransactions = await this.find();
    let income=0, outcome=0;

    allTransactions.map(t => {
      if (t.type === "income")
        income = income + t.value * 1;

      if (t.type === "outcome")
        outcome = outcome + t.value * 1;
    })

    return {
      income,
      outcome,
      total: (income - outcome)
    }
  }
}

export default TransactionsRepository;
