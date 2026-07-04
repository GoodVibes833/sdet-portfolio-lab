"use client";

import { Download, Printer } from "lucide-react";
import { Place } from "@/data/places";

interface Props {
  places: Place[];
  selectedPlace?: Place | null;
}

export default function ExportButtons({ places, selectedPlace }: Props) {
  const exportCSV = () => {
    const headers = ["이름", "카테고리", "주소", "전화", "평점", "설명"];
    const rows = places.map((p) => [
      p.name,
      p.category,
      p.address || "",
      p.phone || "",
      String(p.rating || ""),
      p.shortDesc || p.description || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "places.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPlace = () => {
    if (!selectedPlace) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>${selectedPlace.name}</title>
      <style>body{font-family:sans-serif;padding:24px;max-width:600px;margin:0 auto}img{width:100%;border-radius:12px;margin-bottom:16px}h1{margin-bottom:8px}p{line-height:1.6;color:#444}</style></head>
      <body>
        <img src="${selectedPlace.image}" alt="${selectedPlace.name}" />
        <h1>${selectedPlace.name}</h1>
        <p><strong>주소:</strong> ${selectedPlace.address || "-"}</p>
        <p><strong>전화:</strong> ${selectedPlace.phone || "-"}</p>
        <p><strong>평점:</strong> ${selectedPlace.rating || "-"}</p>
        <p>${selectedPlace.description || ""}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
        <Download size={14} /> CSV
      </button>
      {selectedPlace && (
        <button onClick={printPlace} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <Printer size={14} /> 프린트
        </button>
      )}
    </div>
  );
}
