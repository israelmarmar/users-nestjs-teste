import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CepService {
  private readonly apiUrl = 'https://brasilapi.com.br/api/cep/v1';

  async getCepInformation(cep: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/${cep}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching CEP information:', error.response.data);
      throw error.response.data.errors[0].message;
    }
  }
}
