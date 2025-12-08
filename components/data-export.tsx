"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet } from "lucide-react"

interface DataExportProps {
  data: any[]
  filename: string
  title?: string
}

export function DataExport({ data, filename, title = "Exportar Datos" }: DataExportProps) {
  const handleExportPDF = () => {
    // Mock PDF export - in real app would use jsPDF
    console.log("Exporting to PDF:", { data, filename })

    // Create a simple text representation for demo
    const content = data
      .map((item) =>
        Object.entries(item)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      )
      .join("\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = () => {
    // Mock Excel export - in real app would use xlsx library
    console.log("Exporting to Excel:", { data, filename })

    // Create CSV format for demo
    if (data.length === 0) return

    const headers = Object.keys(data[0]).join(",")
    const rows = data
      .map((item) =>
        Object.values(item)
          .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
          .join(","),
      )
      .join("\n")

    const csvContent = `${headers}\n${rows}`
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
