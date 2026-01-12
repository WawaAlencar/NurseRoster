
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle, VerticalAlign, HeadingLevel, PageBreak, PageOrientation, VerticalMergeType, HeightRule, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { Employee, EmployeeCategory } from "./types";
import { MONTH_NAMES, DEFAULT_LAYOUT_CONFIG } from "./constants";

// Configurações de estilo
const FONT_FAMILY = "Arial";
const FONT_SIZE_HEADER = 24; // 12pt
const FONT_SIZE_BODY = 16;   // 8pt (Reduzido levemente para caber mais)
const ROW_HEIGHT = 400;

// Helper: Convert hex string to "FFFFFF" format (remove #)
const cleanHex = (hex: string) => hex.replace('#', '');

const isMorning = (code: string) => ['D6', 'M15', 'PR2'].includes(code);
const isAfternoon = (code: string) => ['D6', 'T15', 'PR2'].includes(code);
const isNight = (code: string) => ['N8', 'PR2'].includes(code);

// Cria uma célula de texto simples com bordas
const createCell = (text: string, widthPercent: number, bold = false, fill?: string, colSpan = 1, vMerge?: any) => {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: fill ? { fill: cleanHex(fill) } : undefined,
    columnSpan: colSpan,
    verticalMerge: vMerge,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 40, right: 40 }, // Margens reduzidas
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold, font: FONT_FAMILY, size: FONT_SIZE_BODY })],
      }),
    ],
  });
};

// Tabela Genérica (Padrão)
const createShiftTable = (
  title: string,
  headerColor: string,
  rowColor: string,
  nurses: { name: string, code: string }[],
  techs: { name: string, code: string }[],
  colWidths: number[], // Array of percentages
  minNurseRows: number = 3,
  minTechRows: number = 8
) => {
  
  const rows: TableRow[] = [];

  // Header Row 
  rows.push(new TableRow({
    tableHeader: true,
    children: [
        createCell("Nº", colWidths[0], true, headerColor),
        createCell(title, colWidths[1], true, headerColor),
        createCell("OCORRÊNCIAS / TROCAS", colWidths[2], true, headerColor),
        createCell("ATIVIDADES", colWidths[3], true, headerColor),
        createCell("REDIST.", colWidths[4], true, headerColor),
        createCell("ENT.", colWidths[5], true, headerColor),
        createCell("INT.", colWidths[6], true, headerColor),
        createCell("SAÍ.", colWidths[7], true, headerColor),
        createCell("ASSINATURA", colWidths[8], true, headerColor),
    ]
  }));

  // --- Nurses ---
  nurses.forEach((nurse, index) => {
    rows.push(new TableRow({
      children: [
        createCell(`${index + 1}`, colWidths[0]),
        new TableCell({
            width: { size: colWidths[1], type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            },
            children: [new Paragraph({ children: [
                new TextRun({ text: nurse.name, font: FONT_FAMILY, size: FONT_SIZE_BODY })
            ]})],
            verticalAlign: VerticalAlign.CENTER,
        }),
        createCell("", colWidths[2]),
        createCell("", colWidths[3]),
        createCell("", colWidths[4]),
        createCell("", colWidths[5]),
        createCell("", colWidths[6]),
        createCell("", colWidths[7]),
        createCell("", colWidths[8]),
      ]
    }));
  });

  // Pad Nurses (min rows)
  for (let i = nurses.length; i < minNurseRows; i++) {
    rows.push(new TableRow({ 
        children: colWidths.map((width, idx) => 
            createCell(idx === 0 ? `${i + 1}` : "", width)
        )
    }));
  }

  // Separator Row for Technicians
  rows.push(new TableRow({
    children: [
      createCell("", colWidths[0], false, rowColor),
      new TableCell({
          width: { size: colWidths[1], type: WidthType.PERCENTAGE },
          shading: { fill: cleanHex(rowColor) },
          borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
          },
          children: [new Paragraph({ children: [new TextRun({ text: "TÉCNICOS", bold: true, font: FONT_FAMILY, size: FONT_SIZE_BODY })] })],
          verticalAlign: VerticalAlign.CENTER,
      }),
      createCell("", colWidths[2], false, rowColor, 7), // Merged remaining cells
    ]
  }));

  // --- Technicians ---
  techs.forEach((tech, index) => {
    rows.push(new TableRow({
      children: [
        createCell(`${index + 1}`, colWidths[0]),
        new TableCell({
            width: { size: colWidths[1], type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            },
            children: [new Paragraph({ children: [
                new TextRun({ text: tech.name, font: FONT_FAMILY, size: FONT_SIZE_BODY })
            ]})],
            verticalAlign: VerticalAlign.CENTER,
        }),
        createCell("", colWidths[2]),
        createCell("", colWidths[3]),
        createCell("", colWidths[4]),
        createCell("", colWidths[5]),
        createCell("", colWidths[6]),
        createCell("", colWidths[7]),
        createCell("", colWidths[8]),
      ]
    }));
  });

  // Pad Techs (min rows)
  for (let i = techs.length; i < minTechRows; i++) {
    rows.push(new TableRow({ 
        children: colWidths.map((width, idx) => 
            createCell(idx === 0 ? `${i + 1}` : "", width)
        )
    }));
  }

  return new Table({
    rows: rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: { bottom: 20 }, // Reduced Margin
    borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
    }
  });
};

// Tabela ESPECÍFICA para UCINCO/UCINCA (Layout Compacto da Imagem), UTI NEO e PADRÃO (Layout Novo)
const createUcincoTable = (
  title: string,
  headerColor: string,
  nurses: { name: string, code: string }[],
  techs: { name: string, code: string }[],
  baseColWidths: number[],
  minNurseRows: number = 3,
  minTechRows: number = 4,
  sectorName: string = "UCINCO",
  config: any = null
) => {
    const rows: TableRow[] = [];
    
    // Configurar Colunas e Larguras com base no Setor
    let calculatedWidths: number[] = [];
    
    // UTI NEO / PADRÃO: 11 Cols (Add Expurgo, Kamishibai)
    // UCINCO: 10 Cols (Add Expurgo)
    
    if (sectorName === "UTI NEO" || sectorName === "Padrão") {
       // Num(3), Name(20), Oco(10), Ativ(10), Red(8), Exp(8), Kam(8), Time(15), Sig(18)
       calculatedWidths = [3, 20, 10, 10, 8, 8, 8, 5, 5, 5, 18];
    } else if (sectorName === "UCINCO") {
       // Num(3), Name(22), Oco(12), Ativ(12), Red(10), Exp(8), Time(15), Sig(18)
       calculatedWidths = [3, 22, 12, 12, 10, 8, 5, 5, 5, 18];
    } else {
       calculatedWidths = baseColWidths;
    }

    // Helper to build headers
    const buildHeaders = () => {
        const headerCells: TableCell[] = [];
        
        // Row 1
        headerCells.push(createCell("Nº", calculatedWidths[0], true, headerColor, 1, VerticalMergeType.RESTART));
        headerCells.push(createCell(title, calculatedWidths[1], true, headerColor, 1, VerticalMergeType.RESTART));
        headerCells.push(createCell("TROCAS, BH E REMANEJAMENTOS", calculatedWidths[2], true, headerColor, 1, VerticalMergeType.RESTART));
        headerCells.push(createCell("DISTRIBUIÇÃO DAS ATIVIDADES", calculatedWidths[3], true, headerColor, 1, VerticalMergeType.RESTART));
        headerCells.push(createCell("REDISTRIBUIÇÃO DAS ATIVIDADES", calculatedWidths[4], true, headerColor, 1, VerticalMergeType.RESTART));
        
        // Extra Cols - Usando nomes da configuração para o modelo Padrão
        if (sectorName === "UTI NEO" || sectorName === "Padrão") {
             const col6Title = (sectorName === "UTI NEO") ? "EXPURGO" : (config?.col6Name || "COLUNA 6");
             const col7Title = (sectorName === "UTI NEO") ? "KAMISHIBAI" : (config?.col7Name || "COLUNA 7");
             
             headerCells.push(createCell(col6Title, calculatedWidths[5], true, headerColor, 1, VerticalMergeType.RESTART));
             headerCells.push(createCell(col7Title, calculatedWidths[6], true, headerColor, 1, VerticalMergeType.RESTART));
        } else if (sectorName === "UCINCO") {
             headerCells.push(createCell("EXPURGO", calculatedWidths[5], true, headerColor, 1, VerticalMergeType.RESTART));
        }

        // Time and Sig (Indices shift based on extras)
        const timeStartIndex = (sectorName === "UTI NEO" || sectorName === "Padrão") ? 7 : (sectorName === "UCINCO" ? 6 : 5);
        const sigIndex = timeStartIndex + 3;

        headerCells.push(createCell("HORÁRIO", calculatedWidths[timeStartIndex] + calculatedWidths[timeStartIndex+1] + calculatedWidths[timeStartIndex+2], true, headerColor, 3));
        headerCells.push(createCell("ASSINATURA FUNCIONÁRIO", calculatedWidths[sigIndex], true, headerColor, 1, VerticalMergeType.RESTART));

        rows.push(new TableRow({ tableHeader: true, children: headerCells }));

        // Row 2 (Bottom)
        const bottomCells: TableCell[] = [];
        
        // Merged Placeholders
        bottomCells.push(createCell("", calculatedWidths[0], true, headerColor, 1, VerticalMergeType.CONTINUE));
        bottomCells.push(createCell("", calculatedWidths[1], true, headerColor, 1, VerticalMergeType.CONTINUE));
        bottomCells.push(createCell("", calculatedWidths[2], true, headerColor, 1, VerticalMergeType.CONTINUE));
        bottomCells.push(createCell("", calculatedWidths[3], true, headerColor, 1, VerticalMergeType.CONTINUE));
        bottomCells.push(createCell("", calculatedWidths[4], true, headerColor, 1, VerticalMergeType.CONTINUE));

        if (sectorName === "UTI NEO" || sectorName === "Padrão") {
             bottomCells.push(createCell("", calculatedWidths[5], true, headerColor, 1, VerticalMergeType.CONTINUE));
             bottomCells.push(createCell("", calculatedWidths[6], true, headerColor, 1, VerticalMergeType.CONTINUE));
        } else if (sectorName === "UCINCO") {
             bottomCells.push(createCell("", calculatedWidths[5], true, headerColor, 1, VerticalMergeType.CONTINUE));
        }

        bottomCells.push(createCell("ENTRADA", calculatedWidths[timeStartIndex], true, headerColor));
        bottomCells.push(createCell("INTERVALO", calculatedWidths[timeStartIndex+1], true, headerColor));
        bottomCells.push(createCell("SAÍDA", calculatedWidths[timeStartIndex+2], true, headerColor));
        bottomCells.push(createCell("", calculatedWidths[sigIndex], true, headerColor, 1, VerticalMergeType.CONTINUE));

        rows.push(new TableRow({ tableHeader: true, children: bottomCells }));
    };

    buildHeaders();

    // Body Row Builder
    const createBodyRow = (index: number, name: string) => {
        const cells: TableCell[] = [];
        
        // Num & Name
        cells.push(createCell(`${index + 1}`, calculatedWidths[0]));
        cells.push(new TableCell({
            width: { size: calculatedWidths[1], type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 2, color: "000000" } },
            children: [new Paragraph({ children: [ new TextRun({ text: name, font: FONT_FAMILY, size: FONT_SIZE_BODY }) ]})],
            verticalAlign: VerticalAlign.CENTER,
        }));

        // Fillers
        for(let i = 2; i < calculatedWidths.length; i++) {
            cells.push(createCell("", calculatedWidths[i]));
        }
        return new TableRow({ children: cells });
    }

    // --- Nurses ---
    nurses.forEach((nurse, index) => {
        rows.push(createBodyRow(index, nurse.name));
    });

    // Pad Nurses
    for (let i = nurses.length; i < minNurseRows; i++) {
        rows.push(createBodyRow(i, ""));
    }

    // Separator Row (Technicians)
    const separatorCells: TableCell[] = [];
    separatorCells.push(createCell("", calculatedWidths[0], false, headerColor));
    separatorCells.push(new TableCell({
        width: { size: calculatedWidths[1], type: WidthType.PERCENTAGE },
        shading: { fill: cleanHex(headerColor) },
        borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 2, color: "000000" } },
        children: [new Paragraph({ children: [new TextRun({ text: "TÉCNICOS", bold: true, font: FONT_FAMILY, size: FONT_SIZE_BODY })] })],
        verticalAlign: VerticalAlign.CENTER,
    }));
    // Merge remaining
    separatorCells.push(createCell("", 100 - calculatedWidths[0] - calculatedWidths[1], false, headerColor, calculatedWidths.length - 2));

    rows.push(new TableRow({ children: separatorCells }));

    // --- Technicians ---
    techs.forEach((tech, index) => {
        rows.push(createBodyRow(index, tech.name));
    });

    // Pad Technicians
    for (let i = techs.length; i < minTechRows; i++) {
        rows.push(createBodyRow(i, ""));
    }

    return new Table({
        rows: rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { bottom: 20 },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        }
    });
};


// Tabela ESPECÍFICA UCA
const createUcaShiftTable = (
  title: string,
  headerColor: string,
  rowColor: string,
  nurses: { name: string, code: string }[],
  techs: { name: string, code: string }[],
  minNurseRows: number = 3,
  minTechRows: number = 8
) => {
  
  const rows: TableRow[] = [];
  // Specific UCA Layout Widths - ALIGNED WITH NEW HTML
  // Name (22) | Dist (14) | Org (12) | Exp (8) | Temp (8) | Ent (7) | Int (7) | Sai (6) | Ass (16)
  const colWidths = [22, 14, 12, 8, 8, 7, 7, 6, 16];

  // UCA HEADER ROW - Split logic
  // Parse title: "MANHÃ - ENFERMEIROS" -> period: "MANHÃ", role: "ENFERMEIROS"
  const parts = title.split(' - ');
  const periodLabel = parts[0] || title;
  const roleLabel = parts[1] || "";

  // Row 1 of Header (Top Level)
  rows.push(new TableRow({
    tableHeader: true,
    children: [
        // Split Cell: Part 1 (Top)
        createCell(periodLabel, colWidths[0], true, headerColor),
        // Merged Headers (Start)
        createCell("DISTRIBUIÇÃO DAS ATIVIDADES", colWidths[1], true, headerColor, 1, VerticalMergeType.RESTART),
        createCell("ORGANIZAÇÃO DAS ALMOTOLIAS/MULTIDOSES", colWidths[2], true, headerColor, 1, VerticalMergeType.RESTART),
        createCell("EXPURGO CME", colWidths[3], true, headerColor, 1, VerticalMergeType.RESTART),
        createCell("TEMP. GELADEIRA", colWidths[4], true, headerColor, 1, VerticalMergeType.RESTART),
        // HORÁRIO SPAN (NEW)
        createCell("HORÁRIO", colWidths[5] + colWidths[6] + colWidths[7], true, headerColor, 3), // Spans 3 columns
        createCell("ASSINATURA FUNCIONÁRIO", colWidths[8], true, headerColor, 1, VerticalMergeType.RESTART),
    ]
  }));

  // Row 2 of Header (Bottom Level)
  rows.push(new TableRow({
    tableHeader: true,
    children: [
        // Split Cell: Part 2 (Bottom)
        createCell(roleLabel, colWidths[0], true, headerColor),
        // Merged Headers (Continue)
        createCell("", colWidths[1], true, headerColor, 1, VerticalMergeType.CONTINUE),
        createCell("", colWidths[2], true, headerColor, 1, VerticalMergeType.CONTINUE),
        createCell("", colWidths[3], true, headerColor, 1, VerticalMergeType.CONTINUE),
        createCell("", colWidths[4], true, headerColor, 1, VerticalMergeType.CONTINUE),
        // HORÁRIO SPLIT (NEW)
        createCell("ENTRADA", colWidths[5], true, headerColor),
        createCell("INTERVALO", colWidths[6], true, headerColor),
        createCell("SAÍDA", colWidths[7], true, headerColor),
        // Signature (Continue)
        createCell("", colWidths[8], true, headerColor, 1, VerticalMergeType.CONTINUE),
    ]
  }));

  // --- Nurses ---
  nurses.forEach((nurse, index) => {
    rows.push(new TableRow({
      children: [
        new TableCell({
            width: { size: colWidths[0], type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 2, color: "000000" } },
            children: [new Paragraph({ children: [
                new TextRun({ text: `${index + 1}. ${nurse.name}`, font: FONT_FAMILY, size: FONT_SIZE_BODY })
            ]})],
            verticalAlign: VerticalAlign.CENTER,
        }),
        createCell("", colWidths[1]),
        createCell("", colWidths[2]),
        createCell("", colWidths[3]),
        createCell("", colWidths[4]),
        createCell("", colWidths[5]),
        createCell("", colWidths[6]),
        createCell("", colWidths[7]),
        createCell("", colWidths[8]),
      ]
    }));
  });

  // Pad Nurses
  for (let i = nurses.length; i < minNurseRows; i++) {
     rows.push(new TableRow({
        children: [
            createCell(`${i + 1}.`, colWidths[0]), // Add Index padding
            ...colWidths.slice(1).map(width => createCell("", width))
        ]
     }));
  }

  // Separator
  rows.push(new TableRow({
    children: [
      createCell("TÉCNICOS", colWidths[0], true, rowColor),
      createCell("", 100 - colWidths[0], false, rowColor, 8), // Merged remaining cells
    ]
  }));

  // --- Technicians ---
  // Fixed 5 rows max as requested for UCA
  const MAX_TECH_ROWS_UCA = 5; 
  
  for (let i = 0; i < MAX_TECH_ROWS_UCA; i++) {
    const tech = techs[i];
    if (tech) {
        rows.push(new TableRow({
            children: [
                new TableCell({
                    width: { size: colWidths[0], type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 2, color: "000000" } },
                    children: [new Paragraph({ children: [
                        new TextRun({ text: `${i + 1}. ${tech.name}`, font: FONT_FAMILY, size: FONT_SIZE_BODY })
                    ]})],
                    verticalAlign: VerticalAlign.CENTER,
                }),
                createCell("", colWidths[1]),
                createCell("", colWidths[2]),
                createCell("", colWidths[3]),
                createCell("", colWidths[4]),
                createCell("", colWidths[5]),
                createCell("", colWidths[6]),
                createCell("", colWidths[7]),
                createCell("", colWidths[8]),
            ]
        }));
    } else {
         // Empty Row padding
         rows.push(new TableRow({
            children: [
                createCell(`${i + 1}.`, colWidths[0]),
                ...colWidths.slice(1).map(width => createCell("", width))
            ]
         }));
    }
  }

  // --- FIXED UCA FOOTER ROWS ---
  // 1. Transporte
  rows.push(new TableRow({
    children: [
        createCell("TÉCNICO/AUXILIAR ESCALADO\nPARA TRANSPORTE", colWidths[0], true, undefined),
        createCell("", 100 - colWidths[0], false, undefined, 8)
    ]
  }));

  // 2. Faltas
  rows.push(new TableRow({
    children: [
        createCell("FALTAS", colWidths[0], true, undefined),
        createCell("", 100 - colWidths[0], false, undefined, 8)
    ]
  }));

  // 3. Trocas/Remanejamentos - Reduced height to ~1.5 lines (450)
  rows.push(new TableRow({
    height: { value: 450, rule: HeightRule.ATLEAST }, 
    children: [
        createCell("TROCAS/REMANEJAMENTOS", colWidths[0], true, undefined),
        createCell("", 100 - colWidths[0], false, undefined, 8)
    ]
  }));

  return new Table({
    rows: rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: { bottom: 20 }, // Adjusted Bottom Margin
    borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
    }
  });
};

// Create the blank bottom table for Night page (Standard)
const createBottomNightTable = (headerColor: string, rowColor: string) => {
    const rows: TableRow[] = [];
    // Soma: 5 + 35 + 20 + 20 + 20 = 100%
    const colWidths = [5, 35, 20, 20, 20];

    // Header
    rows.push(new TableRow({
        tableHeader: true,
        children: [
            createCell("Nº", colWidths[0], true, headerColor),
            createCell("NOITE - ENFERMEIROS", colWidths[1], true, headerColor),
            createCell("HORÁRIO DESCANSO", colWidths[2], true, headerColor),
            createCell("REDISTRIBUIÇÃO DAS ATIVIDADES", colWidths[3], true, headerColor),
            createCell("ASSINATURA FUNCIONÁRIO", colWidths[4], true, headerColor),
        ]
    }));

    // Empty Nurse Rows (3)
    for (let i = 0; i < 3; i++) {
        rows.push(new TableRow({ 
            children: colWidths.map(w => createCell("", w))
        }));
    }

    // Separator
    rows.push(new TableRow({
        children: [
            createCell("", colWidths[0], false, rowColor),
            new TableCell({
                width: { size: colWidths[1], type: WidthType.PERCENTAGE },
                shading: { fill: cleanHex(rowColor) },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                },
                children: [new Paragraph({ children: [new TextRun({ text: "TÉCNICOS", bold: true, font: FONT_FAMILY, size: FONT_SIZE_BODY })] })],
                verticalAlign: VerticalAlign.CENTER,
            }),
            createCell("", colWidths[2], false, rowColor, 3),
        ]
    }));

    // Empty Tech Rows (4)
    for (let i = 0; i < 4; i++) {
        rows.push(new TableRow({ 
            children: colWidths.map(w => createCell("", w))
        }));
    }

    return new Table({
        rows: rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { top: 200 }, // Reduced Spacing from previous content
        borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        }
    });
};

// Specific Table for UCA: ORGANIZAÇÃO DO DESCANSO NOTURNO
const createUcaRestTable = () => {
  const rows: TableRow[] = [];
  // Columns: 30% (Name) | 10% (Start) | 10% (End) | 30% (Redist) | 20% (Sig)
  const colWidths = [30, 10, 10, 30, 20];
  const headerColor = "FFE699"; // Yellowish for distinction

  // --- SECTION: ENFERMEIROS ---
  rows.push(new TableRow({
      tableHeader: true,
      children: [
          createCell("ENFERMEIROS", colWidths[0], true, headerColor),
          createCell("INÍCIO\nHORÁRIO\nDESCANSO", colWidths[1], true, headerColor),
          createCell("FIM\nHORÁRIO\nDESCANSO", colWidths[2], true, headerColor),
          createCell("REDISTRIBUIÇÃO DAS ATIVIDADES DURANTE DESCANSO", colWidths[3], true, headerColor),
          createCell("ASSINATURA DO PROFISSIONAL", colWidths[4], true, headerColor),
      ]
  }));

  // Empty Rows for Nurses (2 rows as per template)
  for (let i = 1; i <= 2; i++) {
      rows.push(new TableRow({
          height: { value: 300, rule: HeightRule.EXACT }, // COMPACT ~20px
          children: [
              createCell(`${i}.`, colWidths[0], false), // Using '1.' as placeholder or empty
              createCell("", colWidths[1]),
              createCell("", colWidths[2]),
              createCell("", colWidths[3]),
              createCell("", colWidths[4]),
          ]
      }));
  }

  // --- SECTION: TÉCNICOS/AUXILIARES ---
  rows.push(new TableRow({
    tableHeader: true,
    children: [
        createCell("TÉCNICOS/AUXILIARES", colWidths[0], true, headerColor),
        createCell("INÍCIO\nHORÁRIO\nDESCANSO", colWidths[1], true, headerColor),
        createCell("FIM\nHORÁRIO\nDESCANSO", colWidths[2], true, headerColor),
        createCell("REDISTRIBUIÇÃO DAS ATIVIDADES DURANTE DESCANSO (LEITOS E HORÁRIO)", colWidths[3], true, headerColor),
        createCell("ASSINATURA DO PROFISSIONAL", colWidths[4], true, headerColor),
    ]
  }));

  // Empty Rows for Techs (4 rows as per template)
  for (let i = 1; i <= 4; i++) {
    rows.push(new TableRow({
        height: { value: 300, rule: HeightRule.EXACT }, // COMPACT ~20px
        children: [
            createCell(`${i}.`, colWidths[0], false),
            createCell("", colWidths[1]),
            createCell("", colWidths[2]),
            createCell("", colWidths[3]),
            createCell("", colWidths[4]),
        ]
    }));
  }

  return new Table({
      rows: rows,
      width: { size: 90, type: WidthType.PERCENTAGE }, // REDUCED WIDTH (90%)
      alignment: AlignmentType.CENTER,
      margins: { top: 50 },
      borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
          insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      }
  });
};

const createPageHeader = (fullDate: string, dayOfWeek: string, sectorName: string, titleText: string, logoBuffer?: ArrayBuffer | null) => {
    const children: any[] = [];
    
    // Insert Logo if provided
    if (logoBuffer) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new ImageRun({
                    data: logoBuffer,
                    transformation: {
                        width: 300, 
                        height: 60
                    },
                    type: "png"
                })
            ],
            spacing: { after: 20 } // Reduced from 50 to save space
        }));
    }

    // Title and Info
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: titleText, bold: true, font: FONT_FAMILY, size: 24 })],
            spacing: { after: 20 } // Reduced from 50 to save space
        })
    );
    
    children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  borders: { top: {style: BorderStyle.NONE}, bottom: {style: BorderStyle.NONE}, left: {style: BorderStyle.NONE}, right: {style: BorderStyle.NONE} },
                  children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `SETOR: ${sectorName}`, bold: true, font: FONT_FAMILY, size: FONT_SIZE_BODY })] })],
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  borders: { top: {style: BorderStyle.NONE}, bottom: {style: BorderStyle.NONE}, left: {style: BorderStyle.NONE}, right: {style: BorderStyle.NONE} },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `DATA: ${fullDate}`, bold: true, font: FONT_FAMILY, size: FONT_SIZE_BODY })] })],
                }),
                new TableCell({
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  borders: { top: {style: BorderStyle.NONE}, bottom: {style: BorderStyle.NONE}, left: {style: BorderStyle.NONE}, right: {style: BorderStyle.NONE} },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `DIA: ${dayOfWeek}`, bold: true, font: FONT_FAMILY, size: FONT_SIZE_BODY })] })],
                }),
              ]
            })
          ]
        })
    );
    
    children.push(new Paragraph({ text: "", spacing: { after: 20 } }));
    
    return children;
};


export const generateDocx = async (employees: Employee[], month: number, year: number, sectorName: string = "UTI NEO", config: any = null) => {
  const children: any[] = [];
  
  // Use config colors or fallback defaults
  const colors = {
    morning: config?.colorMorningHeader || "#FFEEBB",
    morningRow: config?.colorMorningRow || "#FFFBE6",
    afternoon: config?.colorAfternoonHeader || "#D4EDDA",
    afternoonRow: config?.colorAfternoonRow || "#E8F5E9",
    night: config?.colorNightHeader || "#CCE5FF",
    nightRow: config?.colorNightRow || "#E6F2FF",
  };
  
  const titleText = config?.titleReport || "DISTRIBUIÇÃO DIÁRIA DAS ATIVIDADES DE ENFERMAGEM";

  // --- COLUMN WIDTH CALCULATION ---
  // Fallback default config if not provided
  const c = config || DEFAULT_LAYOUT_CONFIG;
  
  // Extract raw pixel values
  const wNum = Number(c.numberWidth || 25);
  const wName = Number(c.nameWidth || 220);
  const wOcc = Number(c.occurrencesWidth || 120);
  const wAct = Number(c.activitiesWidth || 120);
  const wRed = Number(c.redistWidth || 60);
  const wTime = Number(c.timeWidth || 40);
  const wSig = Number(c.signatureWidth || 90);

  // Calculate total sum in pixels
  const totalPx = wNum + wName + wOcc + wAct + wRed + (wTime * 3) + wSig;

  // Convert to percentages (floats) for DOCX table
  const shiftColWidths = [
      (wNum / totalPx) * 100,
      (wName / totalPx) * 100,
      (wOcc / totalPx) * 100,
      (wAct / totalPx) * 100,
      (wRed / totalPx) * 100,
      (wTime / totalPx) * 100,
      (wTime / totalPx) * 100,
      (wTime / totalPx) * 100,
      (wSig / totalPx) * 100,
  ];

  // Determine if we are using a compact layout (Single Page like UCINCO/UCINCA)
  const isCompact = ["UCINCO", "UCINCA"].includes(sectorName);
  const isUCA = ["UCA"].includes(sectorName);
  const isMultiPageNovo = ["UTI NEO", "Padrão"].includes(sectorName);
  
  // No logo fetching for any template
  let logoBuffer: ArrayBuffer | null = null;
  
  // Configuration based on Sector/Template
  const minNurseRows = (isCompact || isUCA || isMultiPageNovo) ? 2 : 3;
  const minTechRows = isCompact ? 4 : 8;

  // Calculate number of days in the selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase();
    const fullDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();

    // Helpers to filter employees for this day
    const filterEmps = (cats: string[], check: (c: string) => boolean) => 
      employees
        .filter(e => cats.includes(e.category) && e.schedule[day] && check(e.schedule[day] as string))
        .sort((a, b) => {
             const aIsAPH = a.category.includes('APH');
             const bIsAPH = b.category.includes('APH');
             if (aIsAPH !== bIsAPH) return aIsAPH ? 1 : -1;
             return 0;
        })
        .map(e => ({ 
            name: e.category.includes('APH') ? `${e.name.toUpperCase()} (APH)` : e.name.toUpperCase(), 
            code: e.schedule[day] as string 
        }));

    const mornNurses = filterEmps(['Enfermeiras', 'Enfermeiras - APH'], isMorning);
    const mornTechs = filterEmps(['Técnicas de Enfermagem', 'Técnicas de Enfermagem - APH'], isMorning);
    const aftNurses = filterEmps(['Enfermeiras', 'Enfermeiras - APH'], isAfternoon);
    const aftTechs = filterEmps(['Técnicas de Enfermagem', 'Técnicas de Enfermagem - APH'], isAfternoon);
    const nightNurses = filterEmps(['Enfermeiras', 'Enfermeiras - APH'], isNight);
    const nightTechs = filterEmps(['Técnicas de Enfermagem', 'Técnicas de Enfermagem - APH'], isNight);

    // --- HEADER ---
    children.push(...createPageHeader(fullDate, dayOfWeek, sectorName, titleText, logoBuffer));

    // --- MORNING ---
    if (isUCA) {
        children.push(createUcaShiftTable("MANHÃ - ENFERMEIROS", colors.morning, colors.morningRow, mornNurses, mornTechs, minNurseRows, minTechRows));
        children.push(new Paragraph({ children: [ new TextRun({ text: "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: ______________________________________________________________", bold: true, font: FONT_FAMILY, size: 16 }) ], spacing: { before: 120, after: 20 } }));
    } else if (isCompact || isMultiPageNovo) {
         children.push(createUcincoTable("MANHÃ - ENFERMEIROS", colors.morning, mornNurses, mornTechs, shiftColWidths, minNurseRows, minTechRows, sectorName, config));
         children.push(new Paragraph({ children: [ new TextRun({ text: "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA", bold: true, font: FONT_FAMILY, size: 16 }) ], spacing: { before: 50, after: 50 } }));
    } else {
        children.push(createShiftTable("MANHÃ - ENFERMEIROS", colors.morning, colors.morningRow, mornNurses, mornTechs, shiftColWidths, minNurseRows, minTechRows));
    }
    
    if (!isCompact && !isMultiPageNovo) children.push(new Paragraph({ text: "", spacing: { after: 20 } }));
    if (isMultiPageNovo) children.push(new Paragraph({ text: "", spacing: { after: 20 } }));


    // --- AFTERNOON ---
    if (isUCA) {
        children.push(createUcaShiftTable("TARDE - ENFERMEIROS", colors.afternoon, colors.afternoonRow, aftNurses, aftTechs, minNurseRows, minTechRows));
        children.push(new Paragraph({ children: [ new TextRun({ text: "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: ______________________________________________________________", bold: true, font: FONT_FAMILY, size: 16 }) ], spacing: { before: 120, after: 20 } }));
    } else if (isCompact || isMultiPageNovo) {
         children.push(createUcincoTable("TARDE - ENFERMEIROS", colors.afternoon, aftNurses, aftTechs, shiftColWidths, minNurseRows, minTechRows, sectorName, config));
         children.push(new Paragraph({ children: [ new TextRun({ text: "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA", bold: true, font: FONT_FAMILY, size: 16 }) ], spacing: { before: 50, after: 50 } }));
    } else {
        children.push(createShiftTable("TARDE - ENFERMEIROS", colors.afternoon, colors.afternoonRow, aftNurses, aftTechs, shiftColWidths, minNurseRows, minTechRows));
    }
    
    // --- SPLIT LOGIC ---
    if (isCompact) {
        children.push(new Paragraph({ text: "", spacing: { after: 20 } }));
        children.push(createUcincoTable("NOITE - ENFERMEIROS", colors.night, nightNurses, nightTechs, shiftColWidths, minNurseRows, minTechRows, sectorName, config));
        children.push(new Paragraph({ children: [ new TextRun({ text: "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO: ______________________________ CARIMBO/ASSINATURA", bold: true, font: FONT_FAMILY, size: 16 }) ], spacing: { before: 50, after: 0 } }));
    } else {
        children.push(new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } }));
        children.push(...createPageHeader(fullDate, dayOfWeek, sectorName, titleText, logoBuffer));

        if (isUCA) {
             children.push(createUcaShiftTable("NOITE - ENFERMEIROS", colors.night, colors.nightRow, nightNurses, nightTechs, minNurseRows, minTechRows));
        } else if (isMultiPageNovo) {
             children.push(createUcincoTable("NOITE - ENFERMEIROS", colors.night, nightNurses, nightTechs, shiftColWidths, minNurseRows, minTechRows, sectorName, config));
        } else {
             children.push(createShiftTable("NOITE - ENFERMEIROS", colors.night, colors.nightRow, nightNurses, nightTechs, shiftColWidths, minNurseRows, minTechRows));
        }

        children.push(new Paragraph({ children: [ new TextRun({ text: (isUCA || isMultiPageNovo) ? "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: ______________________________________________________________" : "ENFERMEIRO RESPONSÁVEL PELA DISTRIBUIÇÃO- CARIMBO/ ASSINATURA: __________________________________________________", bold: true, font: FONT_FAMILY, size: 16 }) ], spacing: { before: (isUCA || isMultiPageNovo) ? 120 : 50, after: 50 } }));

        if (isUCA || isMultiPageNovo) {
            children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ORGANIZAÇÃO DO DESCANSO NOTURNO", bold: true, font: FONT_FAMILY, size: 18 })], spacing: { after: 0, before: isUCA ? 240 : 100 }, border: { top: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 2, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 2, color: "000000" } } }));
            children.push(createUcaRestTable());
        } else {
             children.push(createBottomNightTable(colors.night, colors.nightRow));
        }
    }

    if (day < daysInMonth) {
      children.push(new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 500, right: 850, bottom: 400, left: 850 } } },
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Livro_Plantao_${sectorName.replace(/\s+/g, '_')}_${MONTH_NAMES[month]}_${year}.docx`);
};
