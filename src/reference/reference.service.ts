import { Injectable } from '@nestjs/common';

@Injectable()
export class ReferenceService {
  private readonly nacionalidades = [
    'Brasileira', 'Americana', 'Canadense', 'Francesa', 'Alemã', 'Italiana', 'Espanhola', 'Portuguesa',
    'Argentina', 'Chilena', 'Mexicana', 'Colombiana', 'Peruana', 'Venezuelana', 'Uruguaia', 'Paraguaia',
    'Boliviana', 'Equatoriana', 'Guiana', 'Suriname', 'Guiana Francesa', 'Japonesa', 'Chinesa', 'Coreana',
    'Indiana', 'Paquistanesa', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Butão', 'Maldivas', 'Afeganistão',
    'Irã', 'Iraque', 'Kuwait', 'Arábia Saudita', 'Bahrain', 'Qatar', 'Emirados Árabes Unidos', 'Omã',
    'Iêmen', 'Jordânia', 'Líbano', 'Síria', 'Israel', 'Palestina', 'Egito', 'Sudão', 'Sudão do Sul',
    'Etiópia', 'Eritreia', 'Djibouti', 'Somália', 'Quênia', 'Tanzânia', 'Uganda', 'Ruanda', 'Burundi',
    'Congo', 'República Democrática do Congo', 'Gabão', 'Camarões', 'Chade', 'República Centro-Africana',
    'Nigéria', 'Níger', 'Mali', 'Burkina Faso', 'Senegal', 'Gâmbia', 'Guiné-Bissau', 'Guiné', 'Serra Leoa',
    'Libéria', 'Costa do Marfim', 'Gana', 'Togo', 'Benin', 'Cabo Verde', 'São Tomé e Príncipe',
    'Guiné Equatorial', 'Angola', 'Namíbia', 'Botswana', 'Zimbábue', 'Zâmbia', 'Malawi', 'Moçambique',
    'Madagascar', 'Comores', 'Maurício', 'Seychelles', 'África do Sul', 'Lesoto', 'Eswatini'
  ];

  private readonly naturalidades = [
    // Capitais brasileiras
    'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA', 'Fortaleza, CE',
    'Brasília, DF', 'Curitiba, PR', 'Recife, PE', 'Porto Alegre, RS', 'Manaus, AM', 'Belém, PA',
    'Goiânia, GO', 'Guarulhos, SP', 'Campinas, SP', 'São Luís, MA', 'São Gonçalo, RJ', 'Maceió, AL',
    'Duque de Caxias, RJ', 'Natal, RN', 'Teresina, PI', 'Campo Grande, MS', 'João Pessoa, PB',
    'Nova Iguaçu, RJ', 'São Bernardo do Campo, SP', 'Osasco, SP', 'Santo André, SP', 'Ribeirão Preto, SP',
    'Jaboatão dos Guararapes, PE', 'Uberlândia, MG', 'Sorocaba, SP', 'Contagem, MG', 'Aracaju, SE',
    'Feira de Santana, BA', 'Cuiabá, MT', 'Vila Velha, ES', 'Aparecida de Goiânia, GO', 'Londrina, PR',
    'Juiz de Fora, MG', 'Ananindeua, PA', 'Porto Velho, RO', 'Serra, ES', 'Caxias do Sul, RS',
    'Niterói, RJ', 'Belford Roxo, RJ', 'Campos dos Goytacazes, RJ', 'Várzea Grande, MT', 'Petrópolis, RJ',
    'Vitória, ES', 'Blumenau, SC', 'Foz do Iguaçu, PR', 'Palmas, TO', 'Cariacica, ES', 'Ponta Grossa, PR',
    'Caucaia, CE', 'Petrópolis, RJ', 'Montes Claros, MG', 'Itaquaquecetuba, SP', 'Mauá, SP',
    'Carapicuíba, SP', 'São José dos Campos, SP', 'Mogi das Cruzes, SP', 'Santos, SP', 'Diadema, SP',
    'Jundiaí, SP', 'Piracicaba, SP', 'Caruaru, PE', 'Bauru, SP', 'Itabuna, BA', 'Franca, SP',
    'Ribeirão das Neves, MG', 'Taubaté, SP', 'Limeira, SP', 'São Carlos, SP', 'Itu, SP', 'Pindamonhangaba, SP',
    'Poços de Caldas, MG', 'Uberaba, MG', 'Araçatuba, SP', 'Araraquara, SP', 'Barretos, SP',
    'Botucatu, SP', 'Jaú, SP', 'Lins, SP', 'Marília, SP', 'Ourinhos, SP', 'Presidente Prudente, SP',
    'São José do Rio Preto, SP', 'Sorocaba, SP', 'Tatuí, SP', 'Votuporanga, SP'
  ];

  private normalizeString(str: string): string {
    return str
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '') 
      .toLowerCase()
      .trim();
  }

  getAllNacionalidades(): string[] {
    return [...this.nacionalidades].sort();
  }

  getAllNaturalidades(): string[] {
    return [...this.naturalidades].sort();
  }

  searchNacionalidades(searchTerm: string): string[] {
    const normalizedSearchTerm = this.normalizeString(searchTerm);
    return this.nacionalidades.filter(nacionalidade => 
      this.normalizeString(nacionalidade).includes(normalizedSearchTerm)
    );
  }

  searchNaturalidades(searchTerm: string): string[] {
    const normalizedSearchTerm = this.normalizeString(searchTerm);
    return this.naturalidades.filter(naturalidade => 
      this.normalizeString(naturalidade).includes(normalizedSearchTerm)
    );
  }
} 