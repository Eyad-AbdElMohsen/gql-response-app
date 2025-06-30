import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getUserById(id: number) {
    try {
      return await this.userRepo.findOneByOrFail({ id });  
    } catch (err) {
      throw new HttpException('No User found!', HttpStatus.NOT_FOUND);
    }
  }

  async getAllUsers() {
    return await this.userRepo.find();
  }

  async createNewUser(createUserInput: CreateUserInput) {
    try {
      const newUser = this.userRepo.create(createUserInput);
      return await this.userRepo.save(newUser);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
