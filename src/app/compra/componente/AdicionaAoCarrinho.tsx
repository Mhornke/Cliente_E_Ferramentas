'use client'

import { Ferramenta } from "@/utils/types/ferramentas";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { toast } from 'sonner'
import { CarrinhoI } from "@/utils/types/carrinho";
type Props={
  
  IDdetalhes: number
  idfavorito: number
  nomefavorito: string
  precoFavorito: number
}

export default function AdicionaAoCarrinho({idfavorito, nomefavorito, precoFavorito, IDdetalhes} :Props) {
  const [ferramenta, setFerramenta] = useState<Ferramenta>()
  const [carrinho, setCarrinho] = useState<CarrinhoI[]>([])
  const params = useParams() as { ferramenta_id: string }
  const { cliente } = useClienteStore()
  const { logaCliente } = useClienteStore()

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    async function buscaCliente(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`)
      if (response.status == 200) {
        const dados = await response.json()
        logaCliente(dados)
      }
    }

    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ferramentas/${params.ferramenta_id}`)
      const dados = await response.json()
      setFerramenta(dados)
    }
    buscaDados()

    
    if (localStorage.getItem("client_key")) {
      const idClienteLocal = localStorage.getItem("client_key") as string
      buscaCliente(idClienteLocal)
     
    }
       
  }, [carrinho, logaCliente, cliente.id, params.ferramenta_id]);
  

  async function adicionarAoCarrinho() {
    console.log("id vindo de favoritos", idfavorito, IDdetalhes );

    const requestBody = {
      nome:String( ferramenta?.modelo || nomefavorito),
        quantidade: 1,
        precoUnitario: Number(ferramenta?.preco || precoFavorito) ,
        clienteId: cliente.id,
        ferramentaId: Number(idfavorito || IDdetalhes),
    }
    console.log("log do response apos adicionar carrinho", requestBody);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(   

        requestBody)
    })

    
    if (response.status === 201) {
      toast.success(`Esse produto foi Adicionado ao seu carrinho `);
    
    }else if(response.status === 200){
      toast.success(`Esse produto foi acrescentado ao seu carrinho `);
    }
   

  }

  return (


    <button type="submit" className="w-full text-white bg-orange-600
        hover:bg-primary-700 
        focus:ring-4 focus:outline-none focus:ring-primary-300 
        font-medium rounded-lg 
        text-sm px-5 py-2.5 text-center dark:bg-primary-600 
        dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      onClick={adicionarAoCarrinho}
    >
      Adicionar ao Carrinho</button>


  )
}