import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;
}

export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class User {
  _id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  recoverToken?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: AddressSchema, required: true })
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
