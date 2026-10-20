with open('App.jsx', 'r') as f:
    lines = f.readlines()

# We will replace the block from line 453 to 465
# First, find the exact start (the searchQuery state)
start_idx = -1
for i, line in enumerate(lines):
    if 'const [searchQuery, setSearchQuery]' in line:
        start_idx = i
        break

# Find the end (the closing of finalDisplayTransactions)
end_idx = start_idx
for i in range(start_idx, len(lines)):
    if 'const getContactStats' in lines[i]:
        end_idx = i - 1
        break

new_block = '''  const [searchQuery, setSearchQuery] = useState('')

  const finalDisplayTransactions = filteredByPeriodTransactions.filter(item => {
    const matchesType = filter === 'all' || item.type === filter;
    if (!searchQuery) return matchesType;
    const q = searchQuery.toLowerCase();
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const catMatch = (getCategoryDisplayName(item.category) || '').toLowerCase().includes(q);
    const amountMatch = String(item.amount).includes(q);
    const dateMatch = (item.date || '').includes(q);
    const noteMatch = (item.note || '').toLowerCase().includes(q);
    return matchesType && (titleMatch || catMatch || amountMatch || dateMatch || noteMatch);
  });\n\n'''

lines[start_idx:end_idx] = [new_block]

with open('App.jsx', 'w') as f:
    f.writelines(lines)
print('Final search logic block rewritten perfectly!')
