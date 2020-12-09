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
    // Pega todas as transações
    // This porque já está dentro do repository
    const transactions = await this.find();
    const { income, outcome } = transactions.reduce((accumulator, transactionItem) => {
      switch (transactionItem.type) {
        case "income":
          accumulator.income += Number(transactionItem.value);
          break;
        case "outcome":
          accumulator.outcome += Number(transactionItem.value);
          break;
        default:
          break;
      }

      return accumulator;

    }, {
      income: 0,
      outcome: 0,
      total: 0
    });

    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
