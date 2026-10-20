with open('App.jsx', 'r') as f:
    lines = f.readlines()

# Find the start of the transactions filter section
start_idx = -1
for i, line in enumerate(lines):
    if "{['all', 'income', 'expense'].map(key => (" in line:
        start_idx = i - 1  # Include the div above it
        break

if start_idx == -1:
    print("Error: Could not find the filter section.")
else:
    # Replace from start_idx up to the line where the transaction list begins
    end_idx = start_idx
    for i in range(start_idx, len(lines)):
        if "display: 'flex', flexDirection: 'column', gap: '10px'" in lines[i]:
            end_idx = i
            break

    new_block = """            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
              {['all', 'income', 'expense'].map(key => (
                <button key={key} onClick={() => setFilter(key)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: filter === key ? 'rgba(255,255,255,0.3)' : 'transparent', color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>{t[key]}</button>
              ))}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <input 
                type="text" 
                placeholder={t.search || "Search transactions..."} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }} 
              />
            </div>

"""

    lines[start_idx:end_idx] = [new_block]

    with open('App.jsx', 'w') as f:
        f.writelines(lines)
    print('Search and filter section fixed perfectly!')
