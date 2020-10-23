import dotenv from 'dotenv';
dotenv.config();
import { Customer } from './mongoose';
import customers from './data/customers';
import connectDB from './connect';

connectDB();

const customerModel = new Customer();

const importData = async () => {
  try {
    await customerModel.deleteAll();
    await customerModel.createMany(customers);
    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async () => {
  try {
    await customerModel.deleteAll();
    console.log('Data Destroyed!'.red.inverse)
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
}

if(process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}