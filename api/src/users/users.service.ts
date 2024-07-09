import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CepService } from 'src/cep/cep.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly cepService: CepService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const cepInfo = await this.cepService.getCepInformation(
      createUserDto.zipCode,
    );

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      address: {
        number: createUserDto.number,
        street: cepInfo.street,
        neighborhood: cepInfo.neighborhood,
        city: cepInfo.city,
        state: cepInfo.state,
        zipCode: cepInfo.cep,
      },
      password: hash,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByRecoverToken(recoverToken: string): Promise<User | undefined> {
    return this.userModel.findOne({ recoverToken }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async changePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    await this.update(id, { password: hash, recoverToken: null });
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
