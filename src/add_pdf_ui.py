with open('App.jsx', 'r') as f:
    content = f.read()

# 1. Add the PDF button next to the "Transactions" heading
old_heading = """             <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>{t.transactions}</h2>"""
new_heading = """             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{t.transactions}</h2>
               <button onClick={() => setPdfModalOpen(true)} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                 <Download size={16} /> PDF
               </button>
             </div>"""
content = content.replace(old_heading, new_heading)

# 2. Add the PDF BottomSheet Modal before the first BottomSheet
pdf_modal = """      <BottomSheet isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} title="PDF Export Options">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Select Period</label>
          <select value={pdfPeriod} onChange={e => setPdfPeriod(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            <option value="allTime" style={{ color: 'black' }}>All Time (সর্বমোট)</option>
            <option value="daily" style={{ color: 'black' }}>Daily (দৈনিক)</option>
            <option value="monthly" style={{ color: 'black' }}>Monthly (মাসিক)</option>
            <option value="yearly" style={{ color: 'black' }}>Yearly (বার্ষিক)</option>
          </select>

          {pdfPeriod !== 'allTime' && (
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '8px' }}>
                {pdfPeriod === 'yearly' ? 'Select Year' : pdfPeriod === 'monthly' ? 'Select Month' : 'Select Date'}
              </label>
              <input 
                type={pdfPeriod === 'yearly' ? 'number' : pdfPeriod === 'monthly' ? 'month' : 'date'} 
                value={pdfPeriod === 'yearly' ? pdfSelectedDate.slice(0,4) : pdfPeriod === 'monthly' ? pdfSelectedDate.slice(0,7) : pdfSelectedDate} 
                onChange={e => {
                  if (pdfPeriod === 'yearly') setPdfSelectedDate(e.target.value + '-01-01');
                  else if (pdfPeriod === 'monthly') setPdfSelectedDate(e.target.value + '-01');
                  else setPdfSelectedDate(e.target.value);
                }} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
              />
            </div>
          )}

          <button onClick={() => { downloadPDF(); setPdfModalOpen(false); }} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
            Download PDF
          </button>
        </div>
      </BottomSheet>

"""

content = content.replace("      <BottomSheet isOpen={modal === 'income' || modal === 'expense'}", pdf_modal + "      <BottomSheet isOpen={modal === 'income' || modal === 'expense'}")

# 3. Add Download icon import if not present
if "Download," not in content and "Download }" not in content:
    content = content.replace("import {\n  PieChart,", "import { Download } from 'lucide-react'\nimport {\n  PieChart,")

with open('App.jsx', 'w') as f:
    f.write(content)
print('PDF UI and button added successfully!')
