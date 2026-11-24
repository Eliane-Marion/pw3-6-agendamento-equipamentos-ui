/**
 * Interface idêntica à @Entity ReservaArmario do Java.
 *
 * Java              -> TypeScript
 * Long id           -> number   (opcional: o banco gera ao cadastrar)
 * Integer           -> number
 * String            -> string
 * LocalDate         -> string   (formato 'AAAA-MM-DD', ex.: '2026-11-25')
 * Boolean ativo     -> boolean  (opcional: o backend define ao cadastrar)
 */
export interface ReservaArmario {
  id?: number;
  numeroArmario: number;
  nomeAluno: string;
  dataInicio: string;
  dataFim: string;
  ativo?: boolean;
}
