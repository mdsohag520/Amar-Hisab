with open('App.jsx', 'r') as f:
    lines = f.readlines()

# Find the exact block to replace
start_index = -1
end_index = -1
for i, line in enumerate(lines):
    if "{finalDisplayTransactions.map(item => (" in line:
        start_index = i
    if start_index != -1 and "</div>\n" in lines[i] and "))}" in lines[i+1]:
        # We found the end of the map block
        end_index = i + 1
        break

if start_index == -1 or end_index == -1:
    print("Error: Could not find the exact map block.")
else:
    new_block = '''            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            </div>'''
    
    lines[start_index:end_index+1] = [new_block + '\n']
    
    with open('App.jsx', 'w') as f:
        f.writelines(lines)
    print('Grouping logic added successfully!')
