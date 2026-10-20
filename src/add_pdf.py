with open('App.jsx', 'r') as f:
    lines = f.readlines()

# Find the line with 'async function saveTransaction'
for i, line in enumerate(lines):
    if 'async function saveTransaction' in line:
        insert_idx = i
        break

pdf_func = """  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text('Amar Hisab - Transaction Report', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle (Period and Date)
    doc.setFontSize(10);
    doc.setTextColor(100);
    const periodText = `Period: ${t[reportPeriod] || reportPeriod.toUpperCase()} | Generated: ${new Date().toLocaleDateString()}`;
    doc.text(periodText, pageWidth / 2, 28, { align: 'center' });
    
    // Table Data
    const tableData = finalDisplayTransactions.map(item => [
      item.date,
      item.title,
      getCategoryDisplayName(item.category),
      item.type === 'income' ? 'Income' : 'Expense',
      (item.type === 'income' ? '+' : '-') + money(item.amount)
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
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
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Income: ${money(income)}`, 14, finalY);
    doc.text(`Total Expense: ${money(expense)}`, 14, finalY + 8);
    doc.text(`Net Savings: ${money(netSavings)}`, 14, finalY + 16);

    doc.save(`Amar_Hisab_${reportPeriod}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

"""

lines.insert(insert_idx, pdf_func)

with open('App.jsx', 'w') as f:
    f.writelines(lines)
print('PDF function added successfully!')
