"use client"

import { useClienteStore } from "@/context/cliente";
import { useEffect, useState } from "react";
import { ItemPedido } from "@/utils/types/itenmPedido";
import Image from "next/image";
interface IntemPedido {
  id: number,
  ferramentaId: string,
  quantidade: number,
  preco: number

}
interface Pedido {
  id: number;
  clienteId: number;
  data: string;  // Data em formato string (ou use Date se você precisar do tipo Date)
  status: string;
  valorTotal: number;  // Adicionei valorTotal
  itens: Array<{
    id: number;
    ferramentaId: string;
    nome: string;  // Adicionei nome
    precoUnitario: number;
    quantidade: number;
    ferramenta?: { foto?: string; acessorios?: string };  // Tipo opcional para ferramenta
  }>;
}



export default function Compra() {

  const { logaCliente } = useClienteStore()
  const [pedido, setPedido] = useState<Pedido[]>([])
  const [itenspedido, setItensPedido] = useState<ItemPedido[]>([])

  useEffect(() => {
    async function buscaCliente(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`)
      if (response.status == 200) {
        const dados = await response.json()
        logaCliente(dados)
      }
    }

    async function buscaPedidos(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos/${idCliente}`)
      const dados = await response.json()
      console.log("dados da API", dados);  // Verifique os dados aqui
   
      setPedido(dados)  // Armazene os dados no estado
   
      console.log("pedidos após setter", dados);  // Verifique os dados após o setter
   }
   

   if (localStorage.getItem("client_key")) {
    const idClienteLocal = localStorage.getItem("client_key") as string
    console.log("idClienteLocal", idClienteLocal);  // Verifique o ID do cliente
    buscaCliente(idClienteLocal)
    buscaPedidos(idClienteLocal)
   }
  }, [logaCliente])
  console.log("dados apos o setter de pedidos", pedido);
  pedido.forEach((p) => console.log("valor Total", p.valorTotal));


  const pedidosLista = pedido.map((pedidos) => (
    <div key={pedidos.id} className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <ul className="divide-y divide-gray-200">
        {pedidos.itens.map((item) => (
          <li key={item.id} className="flex py-4">
            <Image src={item.ferramenta?.foto || "default-image.jpg"} alt={item.nome} className="w-20 h-20 object-cover rounded" />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold">{item.nome}</h3>
              <p className="text-sm text-gray-600">{item.ferramenta?.acessorios || "Sem descrição disponível"}</p>
              <p className="text-lg font-bold">R$ {item.precoUnitario}</p>
              <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <p className="text-lg font-bold">Total: R$ {pedidos.valorTotal}</p>
        <p className="text-lg font-bold">Status: {pedidos.status}</p>
      </div>
    </div>
  ));
  


  return (



    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 mt-4 flex justify-starttext-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
        Seus <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Pedidos</span>
      </h1>
      {pedidosLista}

    </div>








  )

}