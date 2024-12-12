"use client"
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { toast } from 'sonner'
import { useCarrinho } from "@/context/carrinho";
import EnviaCompra from "@/app/compra/componente/EnviaCompra";
import Image from "next/image";
import { Ferramenta } from "@/utils/types/ferramentas";

interface Produto {
  id: number
  nome: string;
  ferramentaId: string;
  ferramenta:Ferramenta
  quantidade: number;
  fotos: string;
  acessorios: string;
  precoUnitario: number;
  clienteId: string;
}

export default function Carrinho() {
  // const [calcular, setCalcular] = useState()
  const [frete, setFrete] = useState<number>(0)
  const [subTotal, setSubTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const { fecharCarrinho } = useCarrinho();
  const { logaCliente } = useClienteStore()

  const [carrinho, setCarrinho] = useState<Produto[]>([])


  const [taxas, setTaxas] = useState({
    frete: 40,
    desconto: 0.5,
    freteGratis: 489
  });

  useEffect(() => {
    async function buscaCliente(idCliente: string) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`);
        if (response.status === 200) {
          const dados = await response.json();
          console.log(idCliente);

          logaCliente(dados);
        } else {
          console.error("Cliente não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    }

    async function buscaCarrinho(idCliente: string) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${idCliente}`);
        if (!response.ok) {
          console.error("Erro ao buscar carrinho");
          return;
        }
        const dados = await response.json();
        setCarrinho(dados);
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      }
    }

    if (localStorage.getItem("client_key")) {
      const idClienteLocal = localStorage.getItem("client_key") as string;
      buscaCliente(idClienteLocal);
      buscaCarrinho(idClienteLocal);
      console.log();

    }
  }, [logaCliente]);

  useEffect(() => {

    const valores = carrinho.map(
      (produto) => Number(produto.precoUnitario) * produto.quantidade
    );

    // Calcula o subtotal somando todos os valores
    const novoSubTotal = valores.reduce((acc, curr) => acc + curr, 0);

    setSubTotal(novoSubTotal);
    const novoFrete = novoSubTotal >= taxas.freteGratis ? 0 : taxas.frete;
    setFrete(novoFrete);
    setTotal(novoSubTotal + novoFrete);
    console.log("valor do total do carrinho ", novoSubTotal);
  }, [carrinho, taxas.frete, taxas.freteGratis])

  const altera = frete == 0 ? "text-green-600" : "text-black"



  async function apagaProdutoCarrinho(itemId: number) {
    const clienteId = localStorage.getItem("client_key");
    const response = await
      fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clienteId })
      });

    if (response.status === 200) {
      const dados = await response.json();
      console.log("na exclusão antes do setter", dados);
      console.log("na exclusão", carrinho);
      setCarrinho((prevCarrinho) => prevCarrinho.filter((car) => car.id !== itemId))


    } else {
      console.error("Erro ao excluir Produto:", await response.json());
    }



  }
  async function incrementeEdecrementa(itemId: number, decrementa: boolean) {
    console.log("ID recebido:", itemId);
    console.log("Decrementa:", decrementa);

    const quantidade = decrementa ? -1 : +1;
    console.log("quantidade enviada", quantidade);

    const response = await
      fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${itemId}`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantidade })
        }
      )
    console.log("resposta da api", response);


    if (!response.ok) {
      toast("erro ao atualizar a quantidade de itens no carriho")
      throw new Error("erro ao atualizar a quantidade de itens ")
    }

    if (response.status === 200) {
      const dados = await response.json();
      console.log("na exclusão antes do setter", dados);
      console.log("na exclusão", carrinho);

      setCarrinho((prevCarrinho) => {
        const carrinhoAtualizado = prevCarrinho.map((produto) =>
          produto.id === itemId
            ? { ...produto, quantidade: produto.quantidade + quantidade }
            : produto
        );

        // Filtra os itens com quantidade menor que 1 (ou zero)
        return carrinhoAtualizado.filter((produto) => produto.quantidade > 0);
      });
    }
  }

  const compraLista = carrinho.map((produto) => (
    <div key={produto.ferramenta.id} className="mb-2 w-full bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100">
      <div className="flex justify-between space-y-4">
        <Image
          src={produto.ferramenta.foto} // Acessando a foto da ferramenta
          alt="Produto"
          className="w-1/3 object-cover rounded"
        />
        <div className="flex flex-col justify-around">
          <h2 className="text-lg font-bold">{produto.ferramenta.modelo}</h2>
          <p className="text-sm text-gray-600">{produto.ferramenta.fabricante.nome}</p>
          <p className="text-lg font-bold">R${produto.ferramenta.preco}</p>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <button
            className="px-2 py-1 text-sm bg-gray-200 active:shadow-lg active:text-white active:bg-red-600 rounded"
            onClick={() => incrementeEdecrementa(produto.ferramenta.id, true)}
          >
            -
          </button>
          <span className="text-lg font-bold">{produto.quantidade}</span>
          <button
            className="px-2 py-1 text-sm bg-gray-200 active:shadow-lg active:bg-green-600 active:text-white rounded"
            onClick={() => incrementeEdecrementa(produto.ferramenta.id, false)}
          >
            +
          </button>
        </div>
        <div className="flex items-start">
          <svg
            className="hover:scale-110 active:bg-red-700"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => apagaProdutoCarrinho(produto.ferramenta.id)}
          >
            <path
              d="M5.52832 5.79532L19.5283 19.7953M5.52832 19.7953L19.5283 5.79532"
              stroke="orange"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  ));
  


  return (
    <section className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
      <div className="relative bg-gray-200 max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">

        <button
          onClick={fecharCarrinho}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg"
        >
          X
        </button>

        <div className="flex flex-col space-y-4 mb-4">
          <h1 className="text-3xl font-bold mb-4">Carrinho de Compras</h1>
          {compraLista}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Resumo da Compra</h2>
          <ul className="list-none mb-2">
            <li className="flex justify-between items-center mb-1">
              <span>Subtotal:</span>
              <span className="font-bold">R$ {subTotal}</span>
            </li>
            <li className="flex justify-between items-center mb-1">
              <span>Frete:</span>
              <span className="text-gray-400 font-semibold">Frete Gratis acima de R$ 489</span>
              <span className={`font-bold ${altera} `}>R${frete}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Total:</span>
              <span className="font-bold">R${total}</span>
            </li>
          </ul>
          <EnviaCompra subTotal={subTotal} frete={frete} total={total} />
        </div>
      </div>
    </section>

  )
}
