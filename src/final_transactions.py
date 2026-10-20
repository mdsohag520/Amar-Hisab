with open('App.jsx', 'r') as f:
    lines = f.readlines()

start_idx = 864  # Line 865
end_idx = 909    # Line 910

new_block = '''        {activePage === 'transactions' && (
          <div style={{ padding: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{t.transactions}</h2>
               <button onClick={() => setPdfModalOpen(true)} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                 <Download size={16} /> PDF
               </button>
             </div>
             
             <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
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
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(
                finalDisplayTransactions.reduce((groups, item) => {
                  const date = item.date;
                  if (!groups[date]) groups[date] = [];
                  groups[date].push(item);
                  return groups;
                }, {})
              ).sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, items]) => (
                <div key={date} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#9ca3af', marginBottom: '8px', paddingLeft: '4px' }}>
                    {date}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.type === 'income' ? '#10b981' : '#ef4444' }}>
                          {item.type === 'income' ? <TrendingUp size={20} /> : <ReceiptText size={20} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>{item.title}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{getCategoryDisplayName(item.category)} • {item.date}</div>
                        </div>
                        <div style={{ fontWeight: '700', color: item.type === 'income' ? '#10b981' : 'white', fontSize: '16px', marginRight: '8px' }}>{item.type === 'income' ? '+' : '−'}{money(item.amount)}</div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => openEditModal(item)} style={{ background: 'none', border: 'none', color: 'var(--primary)' }}><Pencil size={18} /></button>
                          <button onClick={() => confirmDeleteTransaction(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
             </div>
          </div>
        )}\n\n'''

lines[start_idx:end_idx] = [new_block]

with open('App.jsx', 'w') as f:
    f.writelines(lines)
print('Transactions page completely rebuilt perfectly!')
