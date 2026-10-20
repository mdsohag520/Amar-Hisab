with open('App.jsx', 'r') as f:
    content = f.read()

# 1. Add states for the new filter
if 'pdfFilterType' not in content:
    content = content.replace(
        "const [searchQuery, setSearchQuery] = useState('')",
        "const [searchQuery, setSearchQuery] = useState('')\n  const [pdfFilterType, setPdfFilterType] = useState('all')\n  const [pdfFilterValue, setPdfFilterValue] = useState('')"
    )

# 2. Add the PDF download logic inside downloadPDF function
pdf_logic = """
    // Apply specific date/month/year filter if selected
    let pdfFilteredData = finalDisplayTransactions;
    if (pdfFilterType === 'date' && pdfFilterValue) {
      pdfFilteredData = pdfFilteredData.filter(t => t.date === pdfFilterValue);
    } else if (pdfFilterType === 'month' && pdfFilterValue) {
      pdfFilteredData = pdfFilteredData.filter(t => t.date.slice(0, 7) === pdfFilterValue);
    } else if (pdfFilterType === 'year' && pdfFilterValue) {
      pdfFilteredData = pdfFilteredData.filter(t => t.date.slice(0, 4) === pdfFilterValue);
    }

    const tableData = pdfFilteredData.map(item => ["""
    
content = content.replace("    const tableData = finalDisplayTransactions.map(item => [", pdf_logic)

# 3. Update periodText to reflect the new filter
content = content.replace(
    "const periodText = `Period: ${reportPeriod.toUpperCase()} | Generated: ${new Date().toLocaleDateString()}`;",
    "const periodText = `Filter: ${pdfFilterType.toUpperCase()} ${pdfFilterValue ? `(${pdfFilterValue})` : '(All)'} | Generated: ${new Date().toLocaleDateString()}`;"
)

# 4. Add UI for the new filter right below the PDF button
old_heading = """             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{t.transactions}</h2>
               <button onClick={downloadPDF} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                 <Download size={16} /> PDF
               </button>
             </div>"""

new_heading = """             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{t.transactions}</h2>
               <button onClick={downloadPDF} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                 <Download size={16} /> PDF
               </button>
             </div>

             <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
               <select value={pdfFilterType} onChange={e => { setPdfFilterType(e.target.value); setPdfFilterValue(''); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                 <option value="all" style={{ color: 'black' }}>All Dates</option>
                 <option value="date" style={{ color: 'black' }}>Specific Date</option>
                 <option value="month" style={{ color: 'black' }}>Specific Month</option>
                 <option value="year" style={{ color: 'black' }}>Specific Year</option>
               </select>
               {pdfFilterType !== 'all' && (
                 <input 
                   type={pdfFilterType === 'date' ? 'date' : pdfFilterType === 'month' ? 'month' : 'number'} 
                   value={pdfFilterValue} 
                   onChange={e => setPdfFilterValue(e.target.value)} 
                   placeholder={pdfFilterType === 'year' ? 'YYYY' : ''}
                   style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                 />
               )}
             </div>"""

content = content.replace(old_heading, new_heading)

with open('App.jsx', 'w') as f:
    f.write(content)
print('Date filter and PDF integration added!')
