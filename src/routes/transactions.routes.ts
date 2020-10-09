import { request, Router } from 'express';
import CreateTransactionService from '../services/CreateTransactionService';

import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload'
import multer from 'multer';

const transactionsRouter = Router();


const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactions = await getCustomRepository(TransactionsRepository).find();
  const balance = await getCustomRepository(TransactionsRepository).getBalance();
  return response.json({transactions,balance});
});

// {
//   "id": "uuid",
//   "title": "Salário",
//   "value": 3000,
//   "type": "income",
//   "category": "Alimentação"
// }

transactionsRouter.post('/', async (request, response) => {
  const {title, value, type, category} = request.body;

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({title, value, type, category});

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id : request.params.id});

  return response.status(200).json({});
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {

  const importTransactionsService = new ImportTransactionsService();
  const transactions = await importTransactionsService.execute({filename : request.file.filename})

  return response.json(transactions);
});

export default transactionsRouter;
