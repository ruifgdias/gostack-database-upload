import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface ImportTransactionRequest {
  filename: string;
}

class ImportTransactionsService {
  async execute({
    filename,
  }: ImportTransactionRequest): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const createCategoryService = new CreateCategoryService();
    const csvFilePath = path.resolve(uploadConfig.directory, filename);

    const lines = await loadCSV(csvFilePath);
    const transactions: Transaction[] = [];

    await Promise.all(
      lines.map(async line => {
        const category = await createCategoryService.execute({ name: line[3] });
        const value: number = +line[2];
        const title = line[0];
        const type = line[1] as 'outcome' | 'income';

        transactions.push(
          transactionRepository.create({ title, type, value, category }),
        );
      }),
    );

    await transactionRepository.save(transactions);

    return transactions;
  }
}

async function loadCSV(filePath: string): Promise<Array<string[]>> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: Array<string[]> = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

export default ImportTransactionsService;
