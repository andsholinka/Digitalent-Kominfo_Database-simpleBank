import 'source-map-support/register'

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import connectDB from './connect';
import { Customer, CustomerType } from './mongoose';

const app = express();

connectDB();
const customerModel = new Customer();

// middlewares
app.use(express.json());
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message
  })
})

// routes
//@route    POST /customers
//@desc     Create customers
app.post('/customers', async (req, res, next) => {
  // let customers: CustomerType[];
  try {
    if (req.body instanceof Array) {
      await customerModel.createMany(req.body)
    } else {
      await customerModel.create(req.body)
    }
  } catch (error) {
    next(error)
  }
  return res.send({ success: true })
});

//@routes   GET /customers
//@desc     Fetch all customers
app.get('/customers', async (req, res, next) => {
  let customers: CustomerType[];
  const limit = Number(req.query.limit) || 10;
  try {
    customers = await customerModel.getAll(limit)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)

});

app.get('/customers/search', async (req, res, next) => {
  let customers: CustomerType[];
  const keyword = req.query.keyword ? {
    first_name: {
      $regex: req.query.keyword as string,
      $options: 'i'
    }
  } : {};

  try {
    customers = await customerModel.getByName(keyword)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})

app.get('/customers/type/:type', async (req, res, next) => {
  let customers: CustomerType[];
  const type = req.params.type as string;

  try {
    customers = await customerModel.getByType(type)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})

//@router GET /customers/state/:state
//@desc Menampilkan data sesuai value params Path dari state
app.get('/customers/state/:state', async (req, res, next) => {
  let customers: CustomerType[]
  const state = req.params.state as string

  try {
    customers = await customerModel.getByState(state)
  } catch (error) {
    return next(error)
  }
  res.json(customers)
})


//@router GET /customers/age/:age
//@desc Menampilkan data value params Path dari age $lessthan
app.get('/customers/age/:age', async (req, res, next) => {
  let customers: CustomerType[]
  const age = parseInt(req.params.age)

  try {
    customers = await customerModel.getByAge(age)
  } catch (error) {
    return next(error)
  }
  res.json(customers)
})

app.listen(4000, () => {
  console.log('App listen to port 4000');
});
