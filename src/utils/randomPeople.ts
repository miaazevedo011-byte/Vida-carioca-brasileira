export const MALE_NAMES = [
  'Carlos Eduardo', 'Roberto', 'Marcos Antônio', 'José Luiz', 'Fernando', 'Ricardo',
  'Rodrigo', 'Sérgio', 'Marcelo', 'Alexandre', 'Gustavo', 'Gabriel', 'Luciano', 'Renato',
  'Paulo Henrique', 'Maurício', 'Diego', 'Thiago', 'André', 'Caio', 'Leandro', 'Felipe',
  'Matheus', 'Bruno', 'Vinícius', 'Lucas', 'Guilherme', 'Hugo', 'Otávio', 'Igor'
];

export const FEMALE_NAMES = [
  'Maria Eduarda', 'Ana Rosa', 'Rosana', 'Sônia', 'Patrícia', 'Fernanda', 'Teresa',
  'Juliana', 'Camila', 'Beatriz', 'Luciana', 'Mariana', 'Vanessa', 'Aline', 'Silvia',
  'Cláudia', 'Márcia', 'Eliane', 'Cristina', 'Daniela', 'Renata', 'Camila', 'Leticia',
  'Larissa', 'Carolina', 'Amanda', 'Isabela', 'Natália', 'Lívia', 'Débora'
];

export const SURNAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares',
  'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira',
  'Monteiro', 'Cardoso', 'Teixeira', 'Mendes', 'Nunes', 'Barros', 'Ramos', 'Machado'
];

export const PARENT_JOBS = [
  'Professor(a) de Ensino Fundamental',
  'Enfermeiro(a) Hospitalar',
  'Motorista de Aplicativo / Táxi',
  'Eletricista Predial',
  'Comerciante de Bairro',
  'Advogado(a) Trabalhista',
  'Contador(a) Autônomo(a)',
  'Arquiteto(a) e Urbanista',
  'Pequeno(a) Agricultor(a)',
  'Servidor(a) Público(a) Municipal',
  'Microempresário(a)',
  'Mecânico(a) Automotivo(a)',
  'Cozinheiro(a) de Restaurante',
  'Policial Militar',
  'Secretário(a) Executivo(a)',
  'Veterinário(a)',
  'Técnico(a) de Enfermagem',
  'Gerente de Loja'
];

export const PARTNER_JOBS = [
  'Designer Gráfico / UX UI',
  'Desenvolvedor(a) de Software',
  'Arquiteto(a) de Interiores',
  'Personal Trainer & Educador Físico',
  'Médico(a) Residente',
  'Advogado(a) Associado(a)',
  'Chef de Cozinha & Gastronomia',
  'Influenciador(a) Digital de Moda',
  'Engenheiro(a) Civil',
  'Jornalista & Relações Públicas',
  'Psicólogo(a) Clínico(a)',
  'Analista de Marketing Digital',
  'Corretor(a) de Imóveis',
  'Fotógrafo(a) Profissional',
  'Dentista Ortodontista'
];

export const PARTNER_BIOS = [
  'Apaixonado(a) por viagens, café coado de manhã e trilhas na natureza.',
  'Amante de livros de ficção, cinema cult e jantares caseiros aos fins de semana.',
  'Viciado(a) em academia, tecnologia, maratona de séries e pizza no domingo.',
  'Espírito livre, fã de música ao vivo, festivais de verão e passeios com pet.',
  'Perfeccionista no trabalho, mas adora um bom vinho e conversas profundas à noite.'
];

export function getRandomName(gender?: 'M' | 'F'): string {
  const isMale = gender ? gender === 'M' : Math.random() < 0.5;
  const firstName = isMale
    ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
    : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
  const surname1 = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  const surname2 = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  return `${firstName} ${surname1}${surname2 !== surname1 ? ' ' + surname2 : ''}`;
}

export function getRandomJob(isParent: boolean = false): string {
  const list = isParent ? PARENT_JOBS : PARTNER_JOBS;
  return list[Math.floor(Math.random() * list.length)];
}

export function getRandomBio(): string {
  return PARTNER_BIOS[Math.floor(Math.random() * PARTNER_BIOS.length)];
}

export function generateRandomParents(childSurname?: string) {
  const fatherSurname = childSurname || SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  const motherSurname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];

  const fatherName = `${MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]} ${fatherSurname}`;
  const motherName = `${FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]} ${motherSurname} ${fatherSurname}`;

  const fatherAge = 25 + Math.floor(Math.random() * 10);
  const motherAge = 23 + Math.floor(Math.random() * 10);

  return [
    {
      name: fatherName,
      role: 'Pai' as const,
      age: fatherAge,
      job: getRandomJob(true),
      affection: 85 + Math.floor(Math.random() * 15),
      alive: true
    },
    {
      name: motherName,
      role: 'Mãe' as const,
      age: motherAge,
      job: getRandomJob(true),
      affection: 90 + Math.floor(Math.random() * 10),
      alive: true
    }
  ];
}
