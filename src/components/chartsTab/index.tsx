import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "@/config/axiosConfig";

interface EnergyData {
  data: string;
  valoresFaturados: Array<{
    tipo: string;
    quantidade: string;
    valorTotal: string;
  }>;
  energiaCompensada: { quantidade: string; valorTotal: string };
  contribuicaoIlumPublica: { valorTotal: string };
}

interface ChartData {
  name: string;
  consumo: number;
  compensada: number;
  semGD: number;
  economiaGD: number;
}

interface TotalStats {
  energyConsumed: number;
  compensatedEnergy: number;
  totalWithoutGdr: number;
  totalGdr: number;
}

export default function EnergyConsumptionCharts() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalStats, setTotalStats] = useState<TotalStats>({
    energyConsumed: 0,
    compensatedEnergy: 0,
    totalWithoutGdr: 0,
    totalGdr: 0,
  });

  useEffect(() => {
    fetchAndProcessData();
  }, []);

  const fetchAndProcessData = async () => {
    try {
      const response = await api.get<EnergyData[]>("api/allPdf");
      const processedData = processData(response.data);
      setChartData(processedData.chartData);

      setTotalStats(processedData.totalStats);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processData = (
    rawData: EnergyData[]
  ): { chartData: ChartData[]; totalStats: TotalStats } => {
    const chartData: ChartData[] = [];
    const totalStats: TotalStats = {
      energyConsumed: 0,
      compensatedEnergy: 0,
      totalWithoutGdr: 0,
      totalGdr: 0,
    };

    rawData.forEach((item) => {
      const energiaEletrica = item.valoresFaturados.find(
        (vf) => vf.tipo === "Energia Elétrica"
      );
      const energiaSCEE = item.valoresFaturados.find(
        (vf) => vf.tipo === "Energia SCEE s/ ICMS"
      );

      if (energiaEletrica && energiaSCEE) {
        const consumo =
          parseFloat(energiaEletrica.quantidade) +
          parseFloat(energiaSCEE.quantidade);
        const compensada = parseFloat(item.energiaCompensada.quantidade);
        const semGD =
          parseFloat(energiaEletrica.valorTotal) +
          parseFloat(energiaSCEE.valorTotal) +
          parseFloat(item.contribuicaoIlumPublica.valorTotal);
        const economiaGD = parseFloat(item.energiaCompensada.valorTotal);

        chartData.push({
          name: item.data,
          consumo,
          compensada,
          semGD,
          economiaGD,
        });

        totalStats.energyConsumed += consumo;
        totalStats.compensatedEnergy += compensada;
        totalStats.totalWithoutGdr += semGD;
        totalStats.totalGdr += economiaGD;
      }
    });

    return { chartData, totalStats };
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnergyChart data={chartData} />
        <FinancialChart data={chartData} />
      </div>
      <StatCards stats={totalStats} />
    </div>
  );
}

function EnergyChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados de Energia (kWh)</CardTitle>
        <CardDescription>Consumo vs. Energia Compensada</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumo: { label: "Consumo", color: "hsl(var(--chart-1))" },
            compensada: { label: "Compensada", color: "hsl(var(--chart-2))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="consumo"
                stroke="var(--color-consumo)"
                name="Consumo"
              />
              <Line
                type="monotone"
                dataKey="compensada"
                stroke="var(--color-compensada)"
                name="Compensada"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function FinancialChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Financeiros (R$)</CardTitle>
        <CardDescription>Valor Total sem GD vs. Economia GD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            semGD: { label: "Sem GD", color: "hsl(var(--chart-3))" },
            economiaGD: { label: "Economia GD", color: "hsl(var(--chart-4))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="semGD" fill="var(--color-semGD)" name="Sem GD" />
              <Bar
                dataKey="economiaGD"
                fill="var(--color-economiaGD)"
                name="Economia GD"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function StatCards({ stats }: { stats: TotalStats }) {
  const statItems = [
    {
      title: "Total de Energia Consumida",
      value: `${stats.energyConsumed.toFixed(2)} kWh`,
    },
    {
      title: "Energia Compensada",
      value: `${stats.compensatedEnergy.toFixed(2)} kWh`,
    },
    {
      title: "Valor Total sem GD",
      value: `R$ ${stats.totalWithoutGdr.toFixed(2)}`,
    },
    { title: "Economia GD", value: `R$ ${stats.totalGdr.toFixed(2)}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
