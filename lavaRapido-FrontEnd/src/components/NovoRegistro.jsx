import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { criarRegistro } from "../services/registroService";
import { z } from "zod";

// Regex placa: exatamente 7 caracteres alfanuméricos, com pelo menos uma letra e um número
const placaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7}$/;

const registroSchema = z.object({
  placa: z
    .string()
    .length(7, "Placa deve ter exatamente 7 caracteres")
    .regex(placaRegex, "Placa deve conter letras e números"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  tipoCliente: z.string().min(1, "Tipo Cliente é obrigatório"),
  descricao: z.string().min(1, "Serviço é obrigatório"),
  valor: z.number().positive("Valor deve ser maior que zero"),
  pago: z.boolean(),
  ativo: z.boolean(),
});

function NovoRegistro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    placa: "",
    modelo: "",
    tipoCliente: "",
    descricao: "",
    valor: 0,
    pago: false,
    ativo: true,
  });

  // Calcula o valor conforme serviço selecionado
  function calcularValor(servico) {
    switch (servico) {
      case "LAVAGEM_SIMPLES":
        return 50;
      case "LAVAGEM_SIMPLES_CERA":
        return 55;
      case "LAVAGEM_SIMPLES_POR_BAIXO":
        return 100;
      case "LAVAGEM_COMPLETA_MOTOR":
        return 150;
      default:
        return 0;
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let novoValor = type === "checkbox" ? checked : value;

    if (name === "descricao") {
      const valorCalculado = calcularValor(novoValor);
      setForm((prev) => ({
        ...prev,
        descricao: novoValor,
        valor: valorCalculado,
      }));
    } else if (name === "valor") {
      setForm((prev) => ({ ...prev, valor: Number(novoValor) }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: novoValor,
      }));
    }
  }

  async function handleSalvar() {
    try {
      // Validação com Zod (converter valor para number antes, se necessário)
      const formParaValidar = {
        ...form,
        valor: Number(form.valor),
      };
      registroSchema.parse(formParaValidar);

      await criarRegistro(formParaValidar);
      alert("Registro criado com sucesso!");
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors.map((e) => e.message).join("\n"));
      } else {
        console.error("Erro ao criar registro:", error);
        alert("Erro ao criar registro.");
      }
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Novo Registro</h1>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Voltar
        </Link>
      </div>

      <div className="border p-6 rounded shadow space-y-4">
        <div>
          <label className="block font-semibold mb-1">Placa:</label>
          <input
            type="text"
            name="placa"
            value={form.placa}
            onChange={handleChange}
            maxLength={7}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Modelo:</label>
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Tipo Cliente:</label>
          <input
            type="text"
            name="tipoCliente"
            value={form.tipoCliente}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Serviço:</label>
          <select
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Selecione um serviço --</option>
            <option value="LAVAGEM_SIMPLES">LAVAGEM_SIMPLES</option>
            <option value="LAVAGEM_SIMPLES_CERA">LAVAGEM_SIMPLES_CERA</option>
            <option value="LAVAGEM_SIMPLES_POR_BAIXO">
              LAVAGEM_SIMPLES_POR_BAIXO
            </option>
            <option value="LAVAGEM_COMPLETA_MOTOR">
              LAVAGEM_COMPLETA_MOTOR
            </option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Valor:</label>
          <input
            type="number"
            name="valor"
            value={form.valor}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="pago"
            checked={form.pago}
            onChange={handleChange}
            id="pago"
          />
          <label htmlFor="pago" className="font-semibold">
            Pago
          </label>
        </div>

        <button
          onClick={handleSalvar}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Salvar Registro
        </button>
      </div>
    </div>
  );
}

export default NovoRegistro;
