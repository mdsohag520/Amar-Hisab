with open('App.jsx', 'r') as f:
    lines = f.readlines()

start_index = 449
end_index = start_index
while '});' not in lines[end_index] and end_index < start_index + 20:
    end_index += 1

new_block = """  const finalDisplayTransactions = filteredByPeriodTransactions.filter(item => {
    const matchesType = filter === 'all' || item.type === filter;
    if (!searchQuery) {
      return matchesType;
    }
    const q = searchQuery.toLowerCase();
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const catMatch = (getCategoryDisplayName(item.category) || '').toLowerCase().includes(q);
    const amountMatch = String(item.amount).includes(q);
    const dateMatch = (item.date || '').includes(q);
    const noteMatch = (item.note || '').toLowerCase().includes(q);
    return matchesType && (titleMatch || catMatch || amountMatch || dateMatch || noteMatch);
  });\n"""

lines[start_index:end_index+1] = [new_block]

with open('App.jsx', 'w') as f:
    f.writelines(lines)
print('Code fixed successfully!')
