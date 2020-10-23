import mongoose from 'mongoose';
import customers from './data/customers';

export type CustomerType = {
  first_name: string
  last_name: string
  age: number
  customer_type: string
  street: string
  city: string
  state: string
  zip_code: string
  phone_number: string
}

type Keyword = {
  first_name: {
    $regex: string;
    $options: string;
  };
} | {
  first_name?: undefined;
}

export type CustomerDocument = mongoose.Document & CustomerType;

const CustomerSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  customer_type: String,
  street: String,
  city: String,
  state: String,
  zip_code: String,
  phone_number: String
})

export class Customer {
  private model: mongoose.Model<CustomerDocument>;

  constructor() {
    this.model = mongoose.model('customer', CustomerSchema)
  }

  async create(data: CustomerType) {
    try {
      const result = await this.model.create(data);
      console.log(result);
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: CustomerType[]) {
    try {
      const result = await this.model.insertMany(data);
      console.log('Insert result %j', result);
    } catch (error) {
      throw error;
    }
  }

  async getAll(limit: number) {
    let customers: CustomerType[];
    try {
      customers = await this.model.aggregate([
        {
          "$addFields": {
            "full_name": { "$concat": ["$first_name", " ", "$last_name"] }
          },
        }
      ]).limit(limit).exec();
    } catch (error) {
      throw error;
    }

    return customers;
  }

  async getByName(keyword: Keyword) {
    let customers: CustomerType[];
    try {
      customers = await this.model.find({ ...keyword })
    } catch (error) {
      throw error
    }

    return customers;
  }

  async getByType(type: string) {
    let customers: CustomerType[];
    try {
      customers = await this.model.aggregate([{
        $match: {
          customer_type: {
            $eq: type
          }
        }
      }]).exec();
    } catch (error) {
      throw error
    }

    return customers;
  }

  async deleteAll() {
    try {
      await this.model.deleteMany({});
    } catch (error) {
      console.error(`${error}`.red.inverse);
      process.exit(1);
    }
  }

  async getByState(state: string) {
    let result: CustomerType[]
    try {
      result = await this.model.aggregate([
        {
          $match: {
            state: {
              $regex: state,
              $options: 'i'
            }
          }
        }
      ]).exec()
    } catch (error) {
      throw error
    }
    return result
  }

  // Ambil age dimana age collection <= age input
  async getByAge(age: number) {
    let result: CustomerType[]
    try {
      result = await this.model.aggregate([
        {
          $match: {
            age: { $lt: age }
          }
        }
      ]).exec()
    } catch (error) {
      throw error
    }
    return result
  }

}
