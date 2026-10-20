with open('App.jsx', 'r') as f:
    content = f.read()

# 1. Add imports after existing imports
if "import { jsPDF } from 'jspdf'" not in content:
    content = content.replace(
        "import { supabase } from './supabase'",
        "import { supabase } from './supabase'\nimport { jsPDF } from 'jspdf'\nimport autoTable from 'jspdf-autotable'"
    )

# 2. Add states for PDF modal right after the searchQuery state
if 'pdfModalOpen' not in content:
    content = content.replace(
        "const [searchQuery, setSearchQuery] = useState('')",
        "const [searchQuery, setSearchQuery] = useState('')\n  const [pdfModalOpen, setPdfModalOpen] = useState(false)\n  const [pdfPeriod, setPdfPeriod] = useState('allTime')\n  const [pdfSelectedDate, setPdfSelectedDate] = useState(new Date().toISOString().split('T')[0])"
    )

# 3. Add downloadPDF function before finalDisplayTransactions
pdf_func = """
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Filter transactions based on pdfPeriod and pdfSelectedDate
    const pdfTransactions = transactions.filter(item => {
      if (pdfPeriod === 'allTime') return true;
      const itemDate = item.date;
      const selected = pdfSelectedDate;
      if (pdfPeriod === 'daily') return itemDate === selected;
      if (pdfPeriod === 'monthly') return itemDate.slice(0, 7) === selected.slice(0, 7);
      if (pdfPeriod === 'yearly') return itemDate.slice(0, 4) === selected.slice(0, 4);
      return true;
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text('Amar Hisab - Transaction Report', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100);
    const periodText = `Period: ${pdfPeriod.toUpperCase()} (${pdfSelectedDate}) | Generated: ${new Date().toLocaleDateString()}`;
    doc.text(periodText, pageWidth / 2, 28, { align: 'center' });
    
    // Table Data
    const tableData = pdfTransactions.map(item => [
      item.date,
      item.title,
      item.category,
      item.type === 'income' ? 'Income' : 'Expense',
      (item.type === 'income' ? '+' : '-') + item.amount + ' Tk'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount (Tk)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 25 },
        4: { halign: 'right' }
      }
    });

    // Summary
    const totalIncome = pdfTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = pdfTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Income: ${totalIncome} Tk`, 14, finalY);
    doc.text(`Total Expense: ${totalExpense} Tk`, 14, finalY + 8);
    doc.text(`Net Savings: ${totalIncome - totalExpense} Tk`, 14, finalY + 16);

    doc.save(`Amar_Hisab_${pdfPeriod}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

"""

content = content.replace("const finalDisplayTransactions =", pdf_func + "const finalDisplayTransactions =")

with open('App.jsx', 'w') as f:
    f.write(content)
print('PDF core logic added successfully!')
