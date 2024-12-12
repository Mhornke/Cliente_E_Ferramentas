import { ClienteI } from "./clientes";
import { Ferramenta } from "./ferramentas";
export interface CarrinhoI {
    id: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    clienteId: ClienteI; 
    ferramentaId: Ferramenta;
    
}
