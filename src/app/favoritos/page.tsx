
"use client"
import './page.css'
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import Image from 'next/image'
import { toast } from 'sonner'
import AdicionaAoCarrinho from '../compra/componente/AdicionaAoCarrinho';
import { useParams } from "next/navigation"
interface fabricante{
  id: number
  nome: string
}
interface ferramenta{
  id: number;
  nome: string;
  preco: number;
  foto: string;
  detalhes: string;
  cliente_id: number;
  ferramenta_id: number;
  fabricante: fabricante
}

interface favorito{
  id: number;
  clienteId: string;
  ferramentaId: number;
  ferramenta: ferramenta
}
export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<favorito[]>([]); // exemplo de uso do useState para array
  const { cliente } = useClienteStore()
  const { logaCliente } = useClienteStore()
  const [ferramenta, setFerramenta] = useState<ferramenta>()
  const params = useParams() as { ferramenta_id: string }

  useEffect(() => {
    async function buscaCliente(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`)
      if (response.status == 200) {
        const dados = await response.json()
        logaCliente(dados)
      }
    }
    async function buscaFerramenta() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ferramentas/${params.ferramenta_id}`)
      const dados = await response.json()
      setFerramenta(dados)
    }
    buscaFerramenta()
    async function buscaDados(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/favoritos/${idCliente}`)
      const dados = await response.json()
      console.log("Dados retornados:", dados);

      setFavoritos(dados)
    }

    if (localStorage.getItem("client_key")) {
      const idClienteLocal = localStorage.getItem("client_key") as string
      buscaCliente(idClienteLocal)
      buscaDados(idClienteLocal)
    }
  }, [params.ferramenta_id, logaCliente])

  async function apagaFavorito(favoritoId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/favoritos/${favoritoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },

    });

    if (response.status === 200) {
      const dados = await response.json();
      setFavoritos((prevFavoritos) => prevFavoritos.filter((fav) => fav.id !== favoritoId));
      //const { removerFavorito } = useClienteStore();
      //removerFavorito();

      toast.success("Favorito excluído")
      console.log("Favorito excluído:", dados);
    } else {
      console.error("Erro ao excluir favorito:", await response.json());
    }
  }



  //Link href /detalhes/{ferramenta.id}
  const favoritoLista = favoritos.map(favoritos => (


    <div key={favoritos.id} className='mx-2 hover:bg-gray-100 '>
      <div className='flex mx-20'>
        <div className='flex'>

          <div className="w-2/5 h-full">
            <a href={`/detalhes/${favoritos.ferramentaId}`}>
              <Image
                className="object-cover "
                src={favoritos.ferramenta.foto}
                alt={favoritos.ferramenta.nome}
              />
            </a>
          </div>


          <div className=' w-full flex flex-col justify-between '>
            <h5 className="mb-2 p-3 text-xl font-bold tracking-tight text-gray-900">
              {favoritos.ferramenta.fabricante.nome}
            </h5>
            <p className="mb-3 text-lg px-5 font-bold text-gray-700 
          ">
              R$ {favoritos.ferramenta.preco}
            </p>

          </div>
        </div>

        <div className='flex flex-col items-end justify-around w-3/4'>
   
          <div>
          <svg
            className="hover:scale-110  -mt-2
            active:bg-red-700 cursor-pointer"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => apagaFavorito(favoritos.id)}
          >
            <path d="M5.52832 5.79532L19.5283 19.7953M5.52832 19.7953L19.5283 5.79532"
              stroke="orange"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </div>
          <div>
          <button
            type="submit"
            className="bg-slate-500 text-white 
            hover:bg-orange-700 focus:ring-4 focus:outline-none 
            focus:ring-primary-300 font-medium rounded-lg 
             text-center "
          >
            <AdicionaAoCarrinho
              IDdetalhes={0}
              idfavorito={favoritos.ferramentaId}
              nomefavorito={favoritos.ferramenta.fabricante.nome}
              precoFavorito={favoritos.ferramenta.preco}
            />
          </button>
          </div>
          <div>

          </div>

        </div>

      </div >
    <div className='border bg-black bg-opacity-20 border-gray-300 h-0.5 m-2 '></div>
    </div>
  
  ))

  return (
    <section className=" ">

      <h1 className="mb-6 mt-4 flex justify-starttext-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
        Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Favoritos</span>
      </h1>

      <div className="">
        {favoritoLista}

      </div>

    </section>
  )
}
