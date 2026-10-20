with open('App.jsx', 'r') as f:
    lines = f.readlines()

# Find the line where the filter buttons end (search for "))}" after the filter map)
start_idx = -1
for i, line in enumerate(lines):
    if "{['all', 'income', 'expense'].map(key => (" in line:
        # Find the closing of this map
        for j in range(i, i + 10):
            if "))}" in lines[j]:
                start_idx = j + 1
                break
        break

if start_idx == -1:
    print("Error: Could not find filter buttons.")
else:
    search_bar = '''             <div style={{ marginBottom: "16px" }}>
               <input 
                 type="text" 
                 placeholder={t.search || "Search transactions..."} 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)} 
                 style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }} 
               />
             </div>\n'''
    
    lines.insert(start_idx, search_bar)
    
    with open('App.jsx', 'w') as f:
        f.writelines(lines)
    print('Search bar restored!')
