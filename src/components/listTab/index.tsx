import { useState } from "react";

const ListTab: React.FC = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Filtrar por nome"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Data
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700"
          >
            Período
          </label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecione um período</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Lista de Itens</h3>
        <ul className="space-y-2">
          {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"].map(
            (item, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};
export default ListTab;
