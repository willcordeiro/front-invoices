import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/config/axiosConfig";

interface Invoice {
  id: number;
  clientNumber: string;
  nomeCliente: string;
  data: string;
  valorAPagar: string;
  fileName: string;
}

export default function InvoiceLibrary() {
  const [clientNumber, setClientNumber] = useState("");
  const [period, setPeriod] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [clientNumber, period, invoices]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get("api/allPdf");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const filterInvoices = () => {
    let filtered = invoices;

    if (clientNumber) {
      filtered = filtered.filter((invoice) =>
        invoice.clientNumber.includes(clientNumber)
      );
    }

    if (period && period !== "all") {
      const currentDate = new Date();
      const filterDate = new Date(currentDate.getTime());

      switch (period) {
        case "1m":
          filterDate.setMonth(currentDate.getMonth() - 1);
          break;
        case "3m":
          filterDate.setMonth(currentDate.getMonth() - 3);
          break;
        case "6m":
          filterDate.setMonth(currentDate.getMonth() - 6);
          break;
        case "1y":
          filterDate.setFullYear(currentDate.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.data);
        return invoiceDate >= filterDate && invoiceDate <= currentDate;
      });
    }

    setFilteredInvoices(filtered);
  };

  const handleDownload = async (fileName: string) => {
    try {
      const response = await api.post(
        `api/download-pdf`,
        { fileName },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Biblioteca de Faturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="clientNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Número do Cliente
            </label>
            <Input
              id="clientNumber"
              type="text"
              value={clientNumber}
              onChange={(e) => setClientNumber(e.target.value)}
              placeholder="Digite o número do cliente"
            />
          </div>
          <div>
            <label
              htmlFor="period"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Período de Análise
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Selecione um período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1m">Último mês</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número do Cliente</TableHead>
              <TableHead>Nome do Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor a Pagar</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.clientNumber}</TableCell>
                <TableCell>{invoice.nomeCliente}</TableCell>
                <TableCell>{invoice.data}</TableCell>
                <TableCell>{invoice.valorAPagar}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDownload(invoice.fileName)}>
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
