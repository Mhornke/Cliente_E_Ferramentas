import { create } from 'zustand'
import { ClienteI } from '@/utils/types/clientes'
import favoritos from '@/app/favoritos/page'
import  podutoId  from "@/app/compra/carrinho/page";

type ClienteStore = {
  cliente: ClienteI
  favoritos: number
  carrinho: number[]
  
  logaCliente: (clienteLogado: ClienteI) => void
  deslogaCliente: () => void
  adicionarCarrinho: (ferramentaId: number) => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
  cliente: {} as ClienteI,
  logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),
  deslogaCliente: () => set({ cliente: {} as ClienteI }),

  favoritos: 0,
  carrinho: [],
  
  adicionarCarrinho: (ferramentaId) => set((state) => ({ carrinho:[... state.carrinho, ferramentaId]})),

  // cliente: {
  //   id: "dfsdsfdfsdfs",
  //   nome: "Luisa Farias",
  //   email: "luisa@fdssdf.cc"
  // } 
  // bears: 0,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}))