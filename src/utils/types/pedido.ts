import { ItemPedido } from "./itenmPedido"

export interface PedidoI {
  id: number
  clienteId: string
  valorTotal: Number
  quantidade: Number
  descricao: string
  itens:ItemPedido[]
  createdAt: string | null
  updatedAt: string | null
}