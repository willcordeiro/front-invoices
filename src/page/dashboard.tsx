import { useState } from "react";
import ListTab from "../components/listTab";
import ChartsTab from "../components/chartsTab";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-x-2 mb-4">
        <Button
          onClick={() => setActiveTab("list")}
          variant={activeTab === "list" ? "default" : "ghost"}
        >
          Lista e Filtros
        </Button>
        <Button
          onClick={() => setActiveTab("charts")}
          variant={activeTab === "charts" ? "default" : "ghost"}
        >
          Gráficos e Informações
        </Button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        {activeTab === "list" ? <ListTab /> : <ChartsTab />}
      </div>
    </div>
  );
};

export default Dashboard;
