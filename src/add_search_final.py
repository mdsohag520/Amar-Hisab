with open('App.jsx', 'r') as f:
    content = f.read()

# 1. Add searchQuery state before finalDisplayTransactions
if 'const [searchQuery, setSearchQuery]' not in content:
    content = content.replace(
        'const finalDisplayTransactions = filteredByPeriodTransactions.filter(item => {',
        "const [searchQuery, setSearchQuery] = useState('')\n\n  const finalDisplayTransactions = filteredByPeriodTransactions.filter(item => {"
    )

# 2. Replace the old filter logic with advanced search logic
old_logic = """    const matchesType = filter === 'all' || item.type === filter
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })"""

new_logic = """    const matchesType = filter === 'all' || item.type === filter;
    if (!searchQuery) return matchesType;
    const q = searchQuery.toLowerCase();
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const catMatch = (getCategoryDisplayName(item.category) || '').toLowerCase().includes(q);
    const amountMatch = String(item.amount).includes(q);
    const dateMatch = (item.date || '').includes(q);
    const noteMatch = (item.note || '').toLowerCase().includes(q);
    return matchesType && (titleMatch || catMatch || amountMatch || dateMatch || noteMatch);
  });"""

content = content.replace(old_logic, new_logic)

# 3. Add search bar UI in the transactions page right after the filter buttons
old_ui = """             <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
               {['all', 'income', 'expense'].map(key => (
                 <button key={key} onClick={() => setFilter(key)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: filter === key ? 'rgba(255,255,255,0.3)' : 'transparent', color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>{t[key]}</button>
               ))}
             </div>"""

new_ui = """             <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
               {['all', 'income', 'expense'].map(key => (
                 <button key={key} onClick={() => setFilter(key)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: filter === key ? 'rgba(255,255,255,0.3)' : 'transparent', color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>{t[key]}</button>
               ))}
             </div>

             <div style={{ marginBottom: '16px' }}>
               <input 
                 type="text" 
                 placeholder={t.search || "Search transactions..."} 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)} 
                 style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
               />
             </div>"""

content = content.replace(old_ui, new_ui)

# 4. Fix bottom nav overlap by adding padding at the bottom of the main container
content = content.replace(
    '<div style={{ padding: \'16px\' }}>',
    '<div style={{ padding: \'16px\', paddingBottom: \'100px\' }}>'
)

with open('App.jsx', 'w') as f:
    f.write(content)
print('Search bar and bottom padding added successfully!')
