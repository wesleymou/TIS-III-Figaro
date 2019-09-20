import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import CustomerService from "../services/CustomerService";
import Customer from '../models/Customer';
import CustomerListViewModel from '../models/CustomerListViewModel';

const service = new CustomerService();
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const query: string | undefined = req.query.q;

    const customers = query
      ? await service.searchAsync(query)
      : await service.getAllAsync();

    const viewModel = new CustomerListViewModel(customers);

    res.render('customer-list', { title: 'Figaro - Clientes', ...viewModel });
  } catch (err) {
    next(createError(500, err));
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = validateCustomerFromRequestBody(req.body);

    if (customer == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    await service.createAsync(customer);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

/**
 * Valida e converte um objeto para o tipo Customer.
 * Retorna o produto ou null, se o objeto for inválido.
 * @param obj Objeto que será convertido
 */
function validateCustomerFromRequestBody(obj: any): Customer | null {
  const {
    fullName,
    nickname,
    phone,
    email,
    address
  } = obj;

  if (!fullName || !phone) {
    return null;
  }

  const customer = new Customer();

  const result: Customer = {
    ...customer,
    fullName,
    nickname,
    phone,
    email,
    address
  };

  return result;
}

export default router;