with open('App.jsx', 'r') as f:
    lines = f.readlines()

# Replace from line 454 to 465 (0-indexed 453 to 464)
new_block = '''  const finalDisplayTransactions = filteredByPeriodTransactions.filter(item => {
    const matchesType = filter === 'all' || item.type === filter;
    if (!searchQuery) return matchesType;
    const q = searchQuery.toLowerCase();
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const catMatch = (getCategoryDisplayName(item.category) || '').toLowerCase().includes(q);
    const amountMatch = String(item.amount).includes(q);
    const dateMatch = (item.date || '').includes(q);
    const noteMatch = (item.note || '').toLowerCase().includes(q);
    return matchesType && (titleMatch || catMatch || amountMatch || dateMatch || noteMatch);
  });\n'''

# We need to find the exact start (where finalDisplayTransactions begins) and end
start_idx = -1
for i, line in enumerate(lines):
    if 'const finalDisplayTransactions' in line:
        start_idx = i
        break

end_idx = start_idx
for i in range(start_idx, start_idx + 20):
    if '})' in lines[i]:
        end_idx = i
        break

lines[start_idx:end_idx+1] = [new_block]

with open('App.jsx', 'w') as f:
    f.writelines(lines)
print('Search logic fixed perfectly!')
