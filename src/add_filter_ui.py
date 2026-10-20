with open('App.jsx', 'r') as f:
    content = f.read()

# 1. Add states
if 'pdfFilterType' not in content:
    content = content.replace(
        "const [searchQuery, setSearchQuery] = useState('')",
        "const [searchQuery, setSearchQuery] = useState('')\n  const [pdfFilterType, setPdfFilterType] = useState('all')\n  const [pdfFilterValue, setPdfFilterValue] = useState('')"
    )

# 2. Add UI right below the transactions heading
old_heading = """             <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>{t.transactions}</h2>"""
new_heading = """             <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>{t.transactions}</h2>

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
print('Filter UI added successfully!')
