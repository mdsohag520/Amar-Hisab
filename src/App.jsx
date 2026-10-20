import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download,
  Wallet, TrendingUp, TrendingDown, ArrowLeftRight,
  Plus, Home, ReceiptText, Users, ChartNoAxesCombined,
  Settings, Globe, CalendarDays, Search, Bell, X, Trash2, Pencil,
  HandCoins, ChevronRight, Filter, LogOut, Loader2, CheckCircle, History, PieChart as PieIcon, BarChart2, Tag, User, Mail, BookOpen, Phone, Clock, AlertCircle, Lock, Eye, EyeOff
} from 'lucide-react'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { supabase } from './supabase'
import './App.css'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Import components
import GlassBubble from './components/GlassBubble'
import BottomSheet from './components/BottomSheet'
import Toast from './components/Toast'
import ConfirmDialog from './components/ConfirmDialog'

const translations = {
  BN: {
    appName: 'আমার হিসাব', appTagline: 'AMAR HISAB', brandSubtext: 'আপনার হিসাব, আপনার নিয়ন্ত্রণে', brandSubtext2: 'ব্যক্তিগত হিসাব রাখুন গুছিয়ে।',
    tagline: 'আপনার টাকার সম্পূর্ণ হিসাব',
    dashboard: 'ড্যাশবোর্ড', transactions: 'লেনদেন', debts: 'দেনা-পাওনা', reports: 'রিপোর্ট', settings: 'সেটিংস', khata: 'খাতা',
    balance: 'মোট ব্যালেন্স', income: 'মোট আয়', expense: 'মোট খরচ', receivable: 'মোট পাওনা', payable: 'মোট দেনা',
    recent: 'সাম্প্রতিক লেনদেন', seeAll: 'সব দেখুন', search: 'লেনদেন খুঁজুন...',
    incomeLabel: 'আয় যোগ করুন', expenseLabel: 'খরচ যোগ করুন', editIncomeLabel: 'আয় এডিট করুন', editExpenseLabel: 'খরচ এডিট করুন',
    amount: 'টাকার পরিমাণ (৳)', category: 'ক্যাটাগরি', note: 'বিবরণ',
    save: 'সংরক্ষণ করুন', update: 'আপডেট করুন', cancel: 'বাতিল', salary: 'বেতন', food: 'খাবার', transport: 'যাতায়াত', other: 'অন্যান্য',
    noData: 'কোনো লেনদেন নেই', all: 'সব', welcome: 'স্বাগতম!', quick: 'দ্রুত হিসাব',
    daily: 'দৈনিক', monthly: 'মাসিক', yearly: 'বার্ষিক', allTime: 'সর্বমোট', filterPeriod: 'সময়কাল ফিল্টার',
    login: 'লগইন করুন', register: 'রেজিস্ট্রেশন করুন', email: 'ইমেইল', password: 'পাসওয়ার্ড', 
    logout: 'লগআউট', noAccount: 'অ্যাকাউন্ট নেই? রেজিস্ট্রেশন করুন', haveAccount: 'অ্যাকাউন্ট আছে? লগইন করুন',
    loading: 'লোড হচ্ছে...', error: 'কিছু ভুল হয়েছে!', deleteConfirm: 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?',
    liveData: 'লাইভ ডেটা', date: 'তারিখ', incomePlaceholder: 'বেতন বা অন্যান্য আয়', expensePlaceholder: 'দৈনন্দিন খরচ', 
    welcomeSubtitle: 'চলো, তোমার আর্থিক হিসাব গুছিয়ে রাখি।', selectedPeriod: 'নির্বাচিত সময়ের লেনদেন',
    addDebt: 'দেনা-পাওনা যোগ করুন', editDebt: 'দেনা-পাওনা এডিট করুন', personName: 'ব্যক্তির নাম', debtType: 'ধরন', receivableType: 'পাওনা (আমি পাবো)', payableType: 'দেনা (আমি দেবো)',
    paidAmount: 'পরিশোধিত', remaining: 'বাকি আছে', payNow: 'টাকা পরিশোধ করুন', paymentAmount: 'পরিশোধের পরিমাণ',
    totalReceivable: 'মোট পাওনা', totalPayable: 'মোট দেনা', debtDetails: 'দেনা-পাওনার বিবরণ', mainAmount: 'মূল পরিমাণ',
    paymentHistory: 'পরিশোধের ইতিহাস', noPaymentHistory: 'এখনো কোনো পরিশোধ করা হয়নি।', paymentDate: 'পরিশোধের তারিখ',
    financialReport: 'আর্থিক রিপোর্ট', expenseBreakdown: 'খরচের খাতসমূহ', monthlyComparison: 'মাসিক তুলনা (গত ৬ মাস)',
    netSavings: 'নেট সঞ্চয়', noExpenseData: 'এই সময়ে কোনো খরচের ডেটা নেই', noIncomeData: 'এই সময়ে কোনো আয়ের ডেটা নেই',
    manageCategories: 'ক্যাটাগরি ম্যানেজমেন্ট', addNewCategory: 'নতুন ক্যাটাগরি যোগ করুন', catName: 'ক্যাটাগরির নাম', catType: 'ধরন',
    addCategoryBtn: 'ক্যাটাগরি যোগ করুন', noCustomCategory: 'আপনার কোনো কাস্টম ক্যাটাগরি নেই', defaultCategories: 'ডিফল্ট ক্যাটাগরি',
    profileInfo: 'প্রোফাইল তথ্য', customCategoriesList: 'আপনার তৈরি করা ক্যাটাগরি',
    khataTitle: 'খাতা হিসাব', addContact: 'নতুন কন্টাক্ট', editContact: 'কন্টাক্ট এডিট করুন', contactName: 'নাম', contactPhone: 'ফোন নম্বর', addEntry: 'লেনদেন যোগ করুন', editEntry: 'লেনদেন এডিট করুন',
    give: 'দিলাম (পাওনা)', take: 'নিলাম (দেনা)', currentBalance: 'বর্তমান ব্যালেন্স', youWillGet: 'আপনি পাবেন', youWillGive: 'আপনি দেবেন',
    contactList: 'কন্টাক্ট লিস্ট', entryHistory: 'লেনদেনের ইতিহাস', noContacts: 'কোনো কন্টাক্ট নেই', noEntries: 'কোনো লেনদেন নেই', addContactBtn: 'কন্টাক্ট যোগ করুন',
    selectContact: 'কন্টাক্ট সিলেক্ট করুন', viewKhata: 'খাতা দেখুন', backToContacts: 'সব কন্টাক্টে ফিরে যান',
    summary: 'সারসংক্ষেপ', totalGave: 'মোট দিলাম', totalTook: 'মোট নিলাম',
    overallSummary: 'সর্বমোট খাতা সারসংক্ষেপ', totalMarketDue: 'বাজারে মোট পাওনা', totalMarketPayable: 'বাজারে মোট দেনা',
    dueDate: 'পরিশোধের শেষ তারিখ', upcomingReminders: 'আসন্ন রিমাইন্ডার', noReminders: 'কোনো আসন্ন রিমাইন্ডার নেই', overdue: 'সময় পার হয়েছে', today: 'আজ', tomorrow: 'আগামীকাল', daysLeft: 'দিন বাকি',
    descriptionPlaceholder: 'বিবরণ লিখুন...', settled: 'হিসাব সমান', confirmDeleteTitle: 'মুছে ফেলতে চান?', confirmDeleteMsg: 'আপনি কি নিশ্চিত? এই কাজটি ফিরিয়ে আনা সম্ভব নয়।',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?', resetPasswordTitle: 'পাসওয়ার্ড রিসেট করুন', sendResetLink: 'রিসেট লিংক পাঠান', changePassword: 'পাসওয়ার্ড পরিবর্তন করুন', newPassword: 'নতুন পাসওয়ার্ড', updatePasswordBtn: 'পাসওয়ার্ড আপডেট করুন', profileSettings: 'প্রোফাইল সেটিংস', fullName: 'পুরো নাম', updateProfile: 'প্রোফাইল আপডেট করুন',
    verifyEmailMsg: 'আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। অনুগ্রহ করে লিংকে ক্লিক করে লগইন করুন।',
    resetEmailSent: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে!', backToLogin: 'লগইনে ফিরে যান',
    editPayment: 'পরিশোধ এডিট করুন', totalPaidToContact: 'মোট পরিশোধ করেছে', totalReceivedFromContact: 'মোট পরিশোধ করেছেন'
  },
  EN: {
    appName: 'Amar Hisab', appTagline: 'AMAR HISAB', brandSubtext: 'Your money, your control', brandSubtext2: 'Keep your finances organized.',
    tagline: 'Your complete money manager',
    dashboard: 'Dashboard', transactions: 'Transactions', debts: 'Debts & Credits', reports: 'Reports', settings: 'Settings', khata: 'Khata',
    balance: 'Total Balance', income: 'Total Income', expense: 'Total Expenses', receivable: 'Money to Receive', payable: 'Money to Pay',
    recent: 'Recent Transactions', seeAll: 'See all', search: 'Search transactions...',
    incomeLabel: 'Add Income', expenseLabel: 'Add Expense', editIncomeLabel: 'Edit Income', editExpenseLabel: 'Edit Expense',
    amount: 'Amount (৳)', category: 'Category', note: 'Description',
    save: 'Save', update: 'Update', cancel: 'Cancel', salary: 'Salary', food: 'Food', transport: 'Transport', other: 'Other',
    noData: 'No records found', all: 'All', welcome: 'Welcome!', quick: 'Quick Entry',
    daily: 'Daily', monthly: 'Monthly', yearly: 'Yearly', allTime: 'All Time', filterPeriod: 'Filter Period',
    login: 'Login', register: 'Register', email: 'Email', password: 'Password',
    logout: 'Logout', noAccount: "Don't have an account? Register", haveAccount: 'Have an account? Login',
    loading: 'Loading...', error: 'Something went wrong!', deleteConfirm: 'Are you sure you want to delete this?',
    liveData: 'LIVE DATA', date: 'Date', incomePlaceholder: 'Salary or other income', expensePlaceholder: 'Everyday expenses',
    welcomeSubtitle: "Let's keep your finances organized.", selectedPeriod: 'Transactions for selected period',
    addDebt: 'Add Debt/Credit', editDebt: 'Edit Debt/Credit', personName: 'Person Name', debtType: 'Type', receivableType: 'Receivable', payableType: 'Payable',
    paidAmount: 'Paid', remaining: 'Remaining', payNow: 'Make Payment', paymentAmount: 'Payment Amount',
    totalReceivable: 'Total Receivable', totalPayable: 'Total Payable', debtDetails: 'Debts & Credits', mainAmount: 'Main Amount',
    paymentHistory: 'Payment History', noPaymentHistory: 'No payments made yet.', paymentDate: 'Payment Date',
    financialReport: 'Financial Report', expenseBreakdown: 'Expense Breakdown', monthlyComparison: 'Monthly Comparison (Last 6 Months)',
    netSavings: 'Net Savings', noExpenseData: 'No expense data for this period', noIncomeData: 'No income data for this period',
    manageCategories: 'Category Management', addNewCategory: 'Add New Category', catName: 'Category Name', catType: 'Type',
    addCategoryBtn: 'Add Category', noCustomCategory: 'You have no custom categories', defaultCategories: 'Default Categories',
    profileInfo: 'Profile Information', customCategoriesList: 'Your Custom Categories',
    khataTitle: 'Khata Ledger', addContact: 'New Contact', editContact: 'Edit Contact', contactName: 'Name', contactPhone: 'Phone Number', addEntry: 'Add Entry', editEntry: 'Edit Entry',
    give: 'Gave (Receivable)', take: 'Took (Payable)', currentBalance: 'Current Balance', youWillGet: 'You will get', youWillGive: 'You will give',
    contactList: 'Contact List', entryHistory: 'Entry History', noContacts: 'No contacts found', noEntries: 'No entries found', addContactBtn: 'Add Contact',
    selectContact: 'Select Contact', viewKhata: 'View Khata', backToContacts: 'Back to Contacts',
    summary: 'Summary', totalGave: 'Total Gave', totalTook: 'Total Took',
    overallSummary: 'Overall Khata Summary', totalMarketDue: 'Total Market Due', totalMarketPayable: 'Total Market Payable',
    dueDate: 'Due Date', upcomingReminders: 'Upcoming Reminders', noReminders: 'No upcoming reminders', overdue: 'Overdue', today: 'Today', tomorrow: 'Tomorrow', daysLeft: 'days left',
    descriptionPlaceholder: 'Enter description...', settled: 'Settled', confirmDeleteTitle: 'Delete Item?', confirmDeleteMsg: 'Are you sure? This action cannot be undone.',
    forgotPassword: 'Forgot Password?', resetPasswordTitle: 'Reset Password', sendResetLink: 'Send Reset Link', changePassword: 'Change Password', newPassword: 'New Password', updatePasswordBtn: 'Update Password', profileSettings: 'Profile Settings', fullName: 'Full Name', updateProfile: 'Update Profile',
    verifyEmailMsg: 'A verification link has been sent to your email. Please click the link to login.',
    resetEmailSent: 'Password reset link sent to your email!', backToLogin: 'Back to Login',
    editPayment: 'Edit Payment', totalPaidToContact: 'Total Paid by Them', totalReceivedFromContact: 'Total Paid by You'
  },
}

const money = value => '৳' + Number(value).toLocaleString('en-BD', { maximumFractionDigits: 2 })

function App() {
  const [lang, setLang] = useState(localStorage.getItem('amar_lang') || 'BN')
  const [activePage, setActivePage] = useState(localStorage.getItem('amar_page') || 'dashboard')
  const [reportPeriod, setReportPeriod] = useState(localStorage.getItem('amar_period') || 'allTime')
  const [selectedDate, setSelectedDate] = useState(localStorage.getItem('amar_date') || new Date().toISOString().slice(0, 10))

  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoadingBtn, setAuthLoadingBtn] = useState(false)
  
  // Auth States
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [transactions, setTransactions] = useState([])
  const [debts, setDebts] = useState([])
  const [payments, setPayments] = useState([])
  const [customCategories, setCustomCategories] = useState([])
  const [contacts, setContacts] = useState([])
  const [khataEntries, setKhataEntries] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  
  const [selectedContactId, setSelectedContactId] = useState(localStorage.getItem('amar_sel_contact') || null)
  const selectedContact = useMemo(() => contacts.find(c => c.id === selectedContactId), [contacts, selectedContactId])

  const [loadingData, setLoadingData] = useState(false)
  
  const [modal, setModal] = useState('')
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfPeriod, setPdfPeriod] = useState('allTime')
  const [pdfSelectedDate, setPdfSelectedDate] = useState(new Date().toISOString().split('T')[0]) 
  const [paymentModal, setPaymentModal] = useState(null) 
  const [historyModal, setHistoryModal] = useState(null) 
  const [editingPayment, setEditingPayment] = useState(null) 
  
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'info' })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, onConfirm: null, message: '' })
  
  const [editingId, setEditingId] = useState(null)
  const [editingDebtId, setEditingDebtId] = useState(null)
  const [editingContactId, setEditingContactId] = useState(null)
  const [editingKhataEntryId, setEditingKhataEntryId] = useState(null)
  
  const [filter, setFilter] = useState(localStorage.getItem('amar_filter') || 'all')
  const [search, setSearch] = useState('')
  
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('other')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const [debtPerson, setDebtPerson] = useState('')
  const [debtType, setDebtType] = useState('receivable')
  const [debtNote, setDebtNote] = useState('')
  const [debtDate, setDebtDate] = useState(new Date().toISOString().slice(0, 10))
  const [debtDueDate, setDebtDueDate] = useState('')
  
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDateRecord, setPaymentDateRecord] = useState(new Date().toISOString().slice(0, 10))

  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState('expense')

  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [khataEntryType, setKhataEntryType] = useState('give')
  const [khataContactId, setKhataContactId] = useState('')
  const [khataDueDate, setKhataDueDate] = useState('')

  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Profile States
  const [profileName, setProfileName] = useState('')
  const [profileNewPassword, setProfileNewPassword] = useState('')

  const t = translations[lang]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('amar_lang', lang)
    localStorage.setItem('amar_page', activePage)
    localStorage.setItem('amar_period', reportPeriod)
    localStorage.setItem('amar_date', selectedDate)
    localStorage.setItem('amar_filter', filter)
    if (selectedContactId) localStorage.setItem('amar_sel_contact', selectedContactId)
    else localStorage.removeItem('amar_sel_contact')
  }, [lang, activePage, reportPeriod, selectedDate, filter, selectedContactId])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session)
        if (event === 'PASSWORD_RECOVERY') {
            setAuthError(lang === 'BN' ? 'পাসওয়ার্ড রিসেট লিংক সফল হয়েছে। নতুন পাসওয়ার্ড সেট করুন।' : 'Password recovery link verified. Please set a new password.');
        }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchData()
      fetchProfile()
    } else {
      setTransactions([]); setDebts([]); setPayments([]); setCustomCategories([]); setContacts([]); setKhataEntries([]); setUserProfile(null)
    }
  }, [session])

  async function fetchProfile() {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    if (!error && data) {
      setUserProfile(data)
      setProfileName(data.full_name || '')
    }
  }

  async function fetchData() {
    setLoadingData(true)
    const [txRes, debtRes, payRes, catRes, conRes, khataRes] = await Promise.all([
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('debts').select('*').order('date', { ascending: false }),
      supabase.from('debt_payments').select('*').order('payment_date', { ascending: false }),
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('contacts').select('*').order('name', { ascending: true }),
      supabase.from('khata_entries').select('*').order('date', { ascending: false })
    ])
    if (txRes.error) console.error(txRes.error); else setTransactions(txRes.data || [])
    if (debtRes.error) console.error(debtRes.error); else setDebts(debtRes.data || [])
    if (payRes.error) console.error(payRes.error); else setPayments(payRes.data || [])
    if (catRes.error) console.error(catRes.error); else setCustomCategories(catRes.data || [])
    if (conRes.error) console.error(conRes.error); else setContacts(conRes.data || [])
    if (khataRes.error) console.error(khataRes.error); else setKhataEntries(khataRes.data || [])
    setLoadingData(false)
  }

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, isOpen: false })), 3000);
  }

  async function handleAuth(e) {
    e.preventDefault(); setAuthError(''); setAuthLoadingBtn(true)
    let error;
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password }); error = signInError
    } else {
      const { error: signUpError, data } = await supabase.auth.signUp({ email, password }); error = signUpError
      if (!error && data.user && data.session === null) {
          showToast(t.verifyEmailMsg, 'success');
          setIsLogin(true);
      }
    }
    if (error) setAuthError(error.message)
    else if (!isLogin && error === null) {}
    setAuthLoadingBtn(false)
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setAuthLoadingBtn(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/?type=recovery`,
    });
    if (error) showToast(error.message, 'error');
    else showToast(t.resetEmailSent);
    setAuthLoadingBtn(false);
    setIsForgotPassword(false);
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update({ full_name: profileName }).eq('id', session.user.id);
    if (error) showToast(error.message, 'error');
    else {
      showToast(lang === 'BN' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated!');
      fetchProfile();
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    if (!profileNewPassword) return;
    const { error } = await supabase.auth.updateUser({ password: profileNewPassword });
    if (error) showToast(error.message, 'error');
    else {
      showToast(lang === 'BN' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে!' : 'Password changed!');
      setProfileNewPassword('');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.clear()
    setActivePage('dashboard'); setReportPeriod('allTime'); setSelectedContactId(null); setFilter('all')
  }

  // --- DELETE FUNCTIONS ---
  function confirmDeleteTransaction(id) {
    setDeleteDialog({
      isOpen: true, message: t.confirmDeleteMsg,
      onConfirm: async () => {
        const { error } = await supabase.from('transactions').delete().eq('id', id)
        if (error) showToast(error.message, 'error'); 
        else { setTransactions(prev => prev.filter(tx => tx.id !== id)); showToast(lang === 'BN' ? 'লেনদেন মুছে ফেলা হয়েছে' : 'Transaction deleted'); }
      }
    })
  }

  function confirmDeleteDebt(id) {
    setDeleteDialog({
      isOpen: true, message: t.confirmDeleteMsg,
      onConfirm: async () => {
        const { error } = await supabase.from('debts').delete().eq('id', id)
        if (error) showToast(error.message, 'error')
        else { setDebts(prev => prev.filter(d => d.id !== id)); setPayments(prev => prev.filter(p => p.debt_id !== id)); showToast(lang === 'BN' ? 'মুছে ফেলা হয়েছে' : 'Deleted successfully'); }
      }
    })
  }

  function confirmDeletePayment(id) {
    setDeleteDialog({
      isOpen: true, message: t.confirmDeleteMsg,
      onConfirm: async () => {
        const payment = payments.find(p => p.id === id)
        if (!payment) return

        const { error: delError } = await supabase.from('debt_payments').delete().eq('id', id)
        if (delError) return showToast(delError.message, 'error')

        const debt = debts.find(d => d.id === payment.debt_id)
        if (debt) {
            const newPaid = Number(debt.paid_amount) - Number(payment.amount)
            const { error: updError } = await supabase.from('debts').update({ paid_amount: newPaid }).eq('id', debt.id)
            if (updError) showToast(updError.message, 'error')
            else { setDebts(prev => prev.map(d => d.id === debt.id ? {...d, paid_amount: newPaid} : d)) }
        }

        setPayments(prev => prev.filter(p => p.id !== id))
        setHistoryModal(prev => prev ? { ...prev, history: prev.history.filter(p => p.id !== id) } : null)
        showToast(lang === 'BN' ? 'পরিশোধ মুছে ফেলা হয়েছে' : 'Payment deleted')
      }
    })
  }

  function confirmDeleteCategory(id) {
    setDeleteDialog({
      isOpen: true, message: t.confirmDeleteMsg,
      onConfirm: async () => {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) showToast(error.message, 'error'); 
        else { setCustomCategories(prev => prev.filter(c => c.id !== id)); showToast(lang === 'BN' ? 'ক্যাটাগরি মুছে ফেলা হয়েছে' : 'Category deleted'); }
      }
    })
  }

  function confirmDeleteContact(id) {
    setDeleteDialog({
      isOpen: true, message: t.confirmDeleteMsg,
      onConfirm: async () => {
        const { error } = await supabase.from('contacts').delete().eq('id', id)
        if (error) showToast(error.message, 'error')
        else {
            setContacts(prev => prev.filter(c => c.id !== id));
            setKhataEntries(prev => prev.filter(e => e.contact_id !== id));
            if(selectedContactId === id) setSelectedContactId(null);
            showToast(lang === 'BN' ? 'কন্টাক্ট মুছে ফেলা হয়েছে' : 'Contact deleted');
        }
      }
    })
  }

  function confirmDeleteKhataEntry(id) {
    setDeleteDialog({
      isOpen: true, message: t.confirmDeleteMsg,
      onConfirm: async () => {
        const { error } = await supabase.from('khata_entries').delete().eq('id', id)
        if (error) showToast(error.message, 'error'); 
        else { setKhataEntries(prev => prev.filter(e => e.id !== id)); showToast(lang === 'BN' ? 'লেনদেন মুছে ফেলা হয়েছে' : 'Entry deleted'); }
      }
    })
  }

  function openEditModal(item) {
    setModal(item.type); setEditingId(item.id); setAmount(item.amount); setNote(item.title); setDate(item.date)
    setCategory(item.category) 
  }

  function openEditDebtModal(debt) {
    setModal('debt'); setEditingDebtId(debt.id); setDebtPerson(debt.person_name); setDebtType(debt.type); setAmount(debt.amount); setDebtNote(debt.note || ''); setDebtDate(debt.date); setDebtDueDate(debt.due_date || '')
  }

  function openEditContactModal(contact) {
    setModal('contact'); setEditingContactId(contact.id); setContactName(contact.name); setContactPhone(contact.phone || '')
  }

  function openEditKhataEntryModal(entry) {
    setModal('khataEntry'); setEditingKhataEntryId(entry.id); setKhataContactId(entry.contact_id); setKhataEntryType(entry.type); setAmount(entry.amount); setNote(entry.note || ''); setDate(entry.date); setKhataDueDate(entry.due_date || '')
  }

  function openEditPaymentModal(payment) {
    setHistoryModal(null)
    setEditingPayment(payment)
    setPaymentAmount(payment.amount)
    setPaymentDateRecord(payment.payment_date)
  }

  function closeModal() {
    setModal(''); setEditingId(null); setEditingDebtId(null); setEditingContactId(null); setEditingKhataEntryId(null); setEditingPayment(null)
    setAmount(''); setNote(''); setCategory('other'); setDate(new Date().toISOString().slice(0, 10))
    setDebtPerson(''); setDebtType('receivable'); setDebtNote(''); setDebtDate(new Date().toISOString().slice(0, 10)); setDebtDueDate('')
    setContactName(''); setContactPhone(''); setKhataEntryType('give'); setKhataContactId(''); setKhataDueDate('')
    setPaymentAmount(''); setPaymentDateRecord(new Date().toISOString().slice(0, 10))
  }

  const filteredByPeriodTransactions = useMemo(() => {
    return transactions.filter(item => {
      if (reportPeriod === 'allTime') return true
      const itemDate = item.date; const selected = selectedDate
      if (reportPeriod === 'daily') return itemDate === selected
      if (reportPeriod === 'monthly') return itemDate.slice(0, 7) === selected.slice(0, 7)
      if (reportPeriod === 'yearly') return itemDate.slice(0, 4) === selected.slice(0, 4)
      return true
    })
  }, [transactions, reportPeriod, selectedDate])

  const income = filteredByPeriodTransactions.filter(i => i.type === 'income').reduce((s, i) => s + Number(i.amount), 0)
  const expense = filteredByPeriodTransactions.filter(i => i.type === 'expense').reduce((s, i) => s + Number(i.amount), 0)
  const netSavings = income - expense
  
  const totalAllIncome = transactions.filter(i => i.type === 'income').reduce((s, i) => s + Number(i.amount), 0)
  const totalAllExpense = transactions.filter(i => i.type === 'expense').reduce((s, i) => s + Number(i.amount), 0)
  const totalBalance = totalAllIncome - totalAllExpense

  const totalReceivable = debts.filter(d => d.type === 'receivable').reduce((s, d) => s + (Number(d.amount) - Number(d.paid_amount)), 0)
  const totalPayable = debts.filter(d => d.type === 'payable').reduce((s, d) => s + (Number(d.amount) - Number(d.paid_amount)), 0)

  const finalDisplayTransactions = filteredByPeriodTransactions.filter(item => {
    const matchesType = filter === 'all' || item.type === filter
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  // Helper to calculate contact specific stats
  const getContactStats = (contactId) => {
    const entries = khataEntries.filter(e => e.contact_id === contactId)
    const totalGave = entries.filter(e => e.type === 'give').reduce((s,e) => s + Number(e.amount), 0)
    const totalTook = entries.filter(e => e.type === 'take').reduce((s,e) => s + Number(e.amount), 0)
    const totalPaid = entries.filter(e => e.type === 'take').reduce((s,e) => s + Number(e.amount), 0) // Assuming 'take' means they paid back or I received
    const balance = totalGave - totalTook
    
    // Simple calculation for "total paid"
    const totalPaidByThem = entries.filter(e => e.type === 'take').reduce((s,e) => s + Number(e.amount), 0)

    return { totalGave, totalTook, balance, totalPaidByThem }
  }

  const getContactBalance = (contactId) => {
    const entries = khataEntries.filter(e => e.contact_id === contactId)
    let bal = 0
    entries.forEach(e => {
        if (e.type === 'give') bal += Number(e.amount)
        if (e.type === 'take') bal -= Number(e.amount)
    })
    return bal;
  }

  const overallKhataSummary = useMemo(() => {
    let totalDue = 0; let totalPayable = 0;
    contacts.forEach(c => {
        const bal = getContactBalance(c.id);
        if (bal > 0) totalDue += bal;
        if (bal < 0) totalPayable += Math.abs(bal);
    });
    return { totalDue, totalPayable };
  }, [contacts, khataEntries]);

  const expenseChartData = useMemo(() => {
    const grouped = {}
    filteredByPeriodTransactions.filter(i => i.type === 'expense').forEach(i => {
      const catName = getCategoryDisplayName(i.category)
      grouped[catName] = (grouped[catName] || 0) + Number(i.amount)
    })
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }))
  }, [filteredByPeriodTransactions, lang, customCategories])

  const monthlyChartData = useMemo(() => {
    const last6Months = []
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthStr = d.toISOString().slice(0, 7)
      const monthName = d.toLocaleDateString(lang === 'BN' ? 'bn-BD' : 'en-GB', { month: 'short' })
      const monthIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(monthStr)).reduce((s, t) => s + Number(t.amount), 0)
      const monthExpense = transactions.filter(t => t.type === 'expense' && t.date.startsWith(monthStr)).reduce((s, t) => s + Number(t.amount), 0)
      last6Months.push({ name: monthName, Income: monthIncome, Expense: monthExpense })
    }
    return last6Months
  }, [transactions, lang])

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Filter transactions based on pdfPeriod and pdfSelectedDate
    const pdfTransactions = transactions.filter(item => {
      if (pdfPeriod === 'allTime') return true;
      const itemDate = item.date;
      const selected = pdfSelectedDate;
      if (pdfPeriod === 'daily') return itemDate === selected;
      if (pdfPeriod === 'monthly') return itemDate.slice(0, 7) === selected.slice(0, 7);
      if (pdfPeriod === 'yearly') return itemDate.slice(0, 4) === selected.slice(0, 4);
      return true;
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text('Amar Hisab - Transaction Report', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle (Period and Date)
    doc.setFontSize(10);
    doc.setTextColor(100);
    const periodText = `Period: ${pdfPeriod.toUpperCase()} (${pdfSelectedDate}) | Generated: ${new Date().toLocaleDateString()}`;
    doc.text(periodText, pageWidth / 2, 28, { align: 'center' });
    
    // Table Data
    const tableData = pdfTransactions.map(item => [
      item.date,
      item.title,
      item.category,
      item.type === 'income' ? 'Income' : 'Expense',
      (item.type === 'income' ? '+' : '-') + item.amount + ' Tk'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount (Tk)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 25 },
        4: { halign: 'right' }
      }
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Income: ${income} Tk`, 14, finalY);
    doc.text(`Total Expense: ${expense} Tk`, 14, finalY + 8);
    doc.text(`Net Savings: ${netSavings} Tk`, 14, finalY + 16);

    doc.save(`Amar_Hisab_${reportPeriod}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  async function saveTransaction(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return
    
    let categoryName = category;
    if (category.startsWith('custom_')) {
        const catId = category.split('_')[1];
        const found = customCategories.find(c => c.id === catId);
        if (found) categoryName = found.name;
    } else {
        const defaultCatMap = { salary: t.salary, food: t.food, transport: t.transport, other: t.other };
        categoryName = defaultCatMap[category] || t.other;
    }

    const txData = { user_id: session.user.id, type: modal, amount: value, category: categoryName, title: note.trim() || categoryName, note: note.trim(), date: date }

    if (editingId) {
      const { data, error } = await supabase.from('transactions').update(txData).eq('id', editingId).select()
      if (error) showToast(error.message, 'error'); 
      else { setTransactions(prev => prev.map(tx => tx.id === editingId ? data[0] : tx)); closeModal(); showToast(lang === 'BN' ? 'আপডেট হয়েছে' : 'Updated'); }
    } else {
      const { data, error } = await supabase.from('transactions').insert([txData]).select()
      if (error) showToast(error.message, 'error'); 
      else { setTransactions(prev => [data[0], ...prev]); closeModal(); showToast(lang === 'BN' ? 'সেভ হয়েছে' : 'Saved'); }
    }
  }

  async function saveDebt(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return
    if (!debtPerson.trim()) return showToast(lang === 'BN' ? 'ব্যক্তির নাম দিন' : 'Enter person name', 'error')
    
    const debtData = { user_id: session.user.id, type: debtType, person_name: debtPerson.trim(), amount: value, note: debtNote.trim(), date: debtDate, due_date: debtDueDate || null }

    if (editingDebtId) {
        const existingDebt = debts.find(d => d.id === editingDebtId); debtData.paid_amount = existingDebt ? existingDebt.paid_amount : 0
        const { data, error } = await supabase.from('debts').update(debtData).eq('id', editingDebtId).select()
        if (error) showToast(error.message, 'error'); 
        else { setDebts(prev => prev.map(d => d.id === editingDebtId ? data[0] : d)); closeModal(); showToast(lang === 'BN' ? 'আপডেট হয়েছে' : 'Updated'); }
    } else {
        debtData.paid_amount = 0
        const { data, error } = await supabase.from('debts').insert([debtData]).select()
        if (error) showToast(error.message, 'error'); 
        else { setDebts(prev => [data[0], ...prev]); closeModal(); showToast(lang === 'BN' ? 'সেভ হয়েছে' : 'Saved'); }
    }
  }

  async function handlePayment(e) {
    e.preventDefault()
    const payVal = Number(paymentAmount)
    if (!Number.isFinite(payVal) || payVal <= 0) return
    
    if (editingPayment) {
        const oldPayment = payments.find(p => p.id === editingPayment.id)
        if (!oldPayment) return
        const debt = debts.find(d => d.id === oldPayment.debt_id)
        if (!debt) return

        const newDebtPaidAmount = Number(debt.paid_amount) - Number(oldPayment.amount) + payVal
        if (newDebtPaidAmount > Number(debt.amount)) return showToast(lang === 'BN' ? 'পরিশোধের পরিমাণ মূল টাকার চেয়ে বেশি হতে পারে না!' : 'Payment cannot exceed the total amount!', 'error')

        const { error: payError } = await supabase.from('debt_payments').update({ amount: payVal, payment_date: paymentDateRecord }).eq('id', editingPayment.id)
        if (payError) return showToast(payError.message, 'error')

        const { error: debtError } = await supabase.from('debts').update({ paid_amount: newDebtPaidAmount }).eq('id', debt.id)
        if (debtError) return showToast(debtError.message, 'error')

        setPayments(prev => prev.map(p => p.id === editingPayment.id ? { ...p, amount: payVal, payment_date: paymentDateRecord } : p))
        setDebts(prev => prev.map(d => d.id === debt.id ? { ...d, paid_amount: newDebtPaidAmount } : d))
        
        if (historyModal) {
            setHistoryModal(prev => ({
                ...prev,
                history: prev.history.map(p => p.id === editingPayment.id ? { ...p, amount: payVal, payment_date: paymentDateRecord } : p)
            }))
        }
        
        setEditingPayment(null)
        setPaymentAmount('')
        setPaymentDateRecord(new Date().toISOString().slice(0, 10))
        showToast(lang === 'BN' ? 'পরিশোধ আপডেট হয়েছে!' : 'Payment updated!')
    } else {
        const currentDebt = paymentModal
        const newPaidAmount = Number(currentDebt.paid_amount) + payVal
        if (newPaidAmount > Number(currentDebt.amount)) return showToast(lang === 'BN' ? 'পরিশোধের পরিমাণ মূল টাকার চেয়ে বেশি হতে পারে না!' : 'Payment cannot exceed the total amount!', 'error')

        const { data: updatedDebt, error: debtError } = await supabase.from('debts').update({ paid_amount: newPaidAmount }).eq('id', currentDebt.id).select()
        if (debtError) return showToast(debtError.message, 'error')

        const payRecord = { debt_id: currentDebt.id, user_id: session.user.id, amount: payVal, payment_date: paymentDateRecord }
        const { data: newPayment, error: payError } = await supabase.from('debt_payments').insert([payRecord]).select()
        if (payError) return showToast(payError.message, 'error')

        setDebts(prev => prev.map(d => d.id === currentDebt.id ? updatedDebt[0] : d))
        setPayments(prev => [newPayment[0], ...prev])
        
        if (historyModal) {
            setHistoryModal(prev => ({
                ...prev,
                history: [newPayment[0], ...prev.history]
            }))
        }
        
        setPaymentModal(null); setPaymentAmount(''); setPaymentDateRecord(new Date().toISOString().slice(0, 10))
        showToast(lang === 'BN' ? 'পরিশোধ সফলভাবে রেকর্ড করা হয়েছে!' : 'Payment recorded successfully!')
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const catData = { user_id: session.user.id, name: newCatName.trim(), type: newCatType };
    const { data, error } = await supabase.from('categories').insert([catData]).select();
    if (error) showToast(error.message, 'error');
    else {
        setCustomCategories(prev => [...prev, data[0]]);
        setNewCatName('');
        showToast(lang === 'BN' ? 'ক্যাটাগরি সফলভাবে যোগ করা হয়েছে!' : 'Category added successfully!');
    }
  }

  async function handleSaveContact(e) {
    e.preventDefault();
    if (!contactName.trim()) return;
    
    const conData = { user_id: session.user.id, name: contactName.trim(), phone: contactPhone.trim() };
    
    if (editingContactId) {
        const { data, error } = await supabase.from('contacts').update(conData).eq('id', editingContactId).select();
        if (error) showToast(error.message, 'error');
        else {
            setContacts(prev => prev.map(c => c.id === editingContactId ? data[0] : c).sort((a,b)=> a.name.localeCompare(b.name)));
            closeModal(); showToast(lang === 'BN' ? 'আপডেট হয়েছে' : 'Updated');
        }
    } else {
        const { data, error } = await supabase.from('contacts').insert([conData]).select();
        if (error) showToast(error.message, 'error');
        else {
            setContacts(prev => [...prev, data[0]].sort((a,b)=> a.name.localeCompare(b.name)));
            closeModal(); showToast(lang === 'BN' ? 'কন্টাক্ট যোগ হয়েছে' : 'Contact added');
        }
    }
  }

  async function handleSaveKhataEntry(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || !khataContactId) return;

    const entryData = { user_id: session.user.id, contact_id: khataContactId, type: khataEntryType, amount: value, note: note.trim(), date: date, due_date: khataDueDate || null };
    
    if (editingKhataEntryId) {
        const { data, error } = await supabase.from('khata_entries').update(entryData).eq('id', editingKhataEntryId).select();
        if (error) showToast(error.message, 'error');
        else {
            setKhataEntries(prev => prev.map(e => e.id === editingKhataEntryId ? data[0] : e));
            closeModal(); showToast(lang === 'BN' ? 'আপডেট হয়েছে' : 'Updated');
        }
    } else {
        const { data, error } = await supabase.from('khata_entries').insert([entryData]).select();
        if (error) showToast(error.message, 'error');
        else {
            setKhataEntries(prev => [data[0], ...prev]);
            closeModal(); showToast(lang === 'BN' ? 'লেনদেন যোগ হয়েছে' : 'Entry added');
        }
    }
  }

  function getCategoryDisplayName(dbCategory) {
    if (!dbCategory) return t.other;
    if (dbCategory === 'Salary') return t.salary;
    if (dbCategory === 'Food') return t.food;
    if (dbCategory === 'Transport') return t.transport;
    if (dbCategory === 'Other') return t.other;
    if (dbCategory === 'বেতন') return t.salary;
    if (dbCategory === 'খাবার') return t.food;
    if (dbCategory === 'যাতায়াত') return t.transport;
    if (dbCategory === 'অন্যান্য') return t.other;
    return dbCategory;
  }

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: Home },
    { id: 'transactions', label: t.transactions, icon: ReceiptText },
    { id: 'debts', label: t.debts, icon: Users },
    { id: 'khata', label: t.khata, icon: BookOpen },
    { id: 'reports', label: t.reports, icon: ChartNoAxesCombined },
    { id: 'settings', label: t.settings, icon: Settings },
  ]

  if (authLoading) return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><Loader2 className="spin" style={{ color: 'white' }} /></div>

  if (!session) {
    return (
      <div className="auth-container">
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
            <button className="language-button" onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')} style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <Globe size={17} /> {lang === 'BN' ? 'বাংলা' : 'English'}
            </button>
        </div>

        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
             <div className="brand-icon" style={{ margin: '0 auto 15px', width: '60px', height: '60px' }}><Wallet size={32} /></div>
             <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '800' }}>{t.appName}</h2>
             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '5px' }}>{t.tagline}</p>
          </div>
          
          {authError && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{authError}</div>}
          
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '10px', fontSize: '18px' }}>{t.resetPasswordTitle}</h3>
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input required type="email" placeholder={t.email} value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="glass-input" />
              </div>
              <button type="submit" disabled={authLoadingBtn} className="save-button" style={{ padding: '14px', marginTop: '10px' }}>{authLoadingBtn ? <Loader2 className="spin" size={20} /> : t.sendResetLink}</button>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>{t.backToLogin}</button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input required type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className="glass-input" />
                </div>
                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input required type={showPassword ? "text" : "password"} placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} className="glass-input" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button type="submit" disabled={authLoadingBtn} className="save-button" style={{ padding: '14px', marginTop: '10px' }}>{authLoadingBtn ? <Loader2 className="spin" size={20} /> : (isLogin ? t.login : t.register)}</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  {isLogin ? t.noAccount : t.haveAccount}
                </button>
                {isLogin && <button onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>{t.forgotPassword}</button>}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-icon"><Wallet size={22} /></div><strong style={{ color: 'var(--text-main)', fontSize: '18px' }}>{t.appName}</strong>
          </div>
          <div className="top-actions">
            <button className="language-button" onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')} style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <Globe size={17} /> {lang === 'BN' ? 'বাংলা' : 'English'}
            </button>
            <button className="icon-button" onClick={() => setActivePage('settings')} style={{ color: 'white' }}><Settings size={19} /></button>
            <button className="icon-button" onClick={handleLogout} style={{ color: '#ef4444' }}><LogOut size={19} /></button>
          </div>
        </header>

        {activePage === 'dashboard' && (
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{t.welcome} 👋</h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0' }}>{t.welcomeSubtitle}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <Clock size={16} /> {currentTime.toLocaleTimeString(lang === 'BN' ? 'bn-BD' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      {currentTime.toLocaleDateString(lang === 'BN' ? 'bn-BD' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
              </div>
            </div>

            <motion.div style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.8))', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '24px', color: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600' }}><Wallet size={20} /> {t.balance}</div>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{t.liveData}</span>
              </div>
              <div style={{ fontSize: '44px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '20px' }}>{money(totalBalance)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
                <div><div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {t.income}</div><strong style={{ fontSize: '18px' }}>{money(totalAllIncome)}</strong></div>
                <div><div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingDown size={14} /> {t.expense}</div><strong style={{ fontSize: '18px' }}>{money(totalAllExpense)}</strong></div>
              </div>
            </motion.div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>{t.summary}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
              <GlassBubble type="primary" size="md" amount={income} onClick={() => setActivePage('transactions')}>
                <TrendingUp size={24} style={{ color: 'white', zIndex: 2 }} />
                <span style={{ fontSize: '10px', color: 'white', marginTop: '4px', zIndex: 2 }}>{t.income}</span>
              </GlassBubble>
              <GlassBubble type="danger" size="md" amount={expense} onClick={() => setActivePage('transactions')}>
                <TrendingDown size={24} style={{ color: 'white', zIndex: 2 }} />
                <span style={{ fontSize: '10px', color: 'white', marginTop: '4px', zIndex: 2 }}>{t.expense}</span>
              </GlassBubble>
              <GlassBubble type="info" size="md" amount={totalReceivable} onClick={() => setActivePage('debts')}>
                <HandCoins size={24} style={{ color: 'white', zIndex: 2 }} />
                <span style={{ fontSize: '10px', color: 'white', marginTop: '4px', zIndex: 2 }}>{t.receivable}</span>
              </GlassBubble>
              <GlassBubble type="warning" size="md" amount={totalPayable} onClick={() => setActivePage('debts')}>
                <ArrowLeftRight size={24} style={{ color: 'white', zIndex: 2 }} />
                <span style={{ fontSize: '10px', color: 'white', marginTop: '4px', zIndex: 2 }}>{t.payable}</span>
              </GlassBubble>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setModal('income')} style={{ background: 'rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)' }}><Plus size={20} color="white" /></div>
                <div><div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>{t.incomeLabel}</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{t.incomePlaceholder}</div></div>
              </button>
              <button onClick={() => setModal('expense')} style={{ background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}><Plus size={20} color="white" /></div>
                <div><div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>{t.expenseLabel}</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{t.expensePlaceholder}</div></div>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: 0 }}>{t.recent}</h3>
              <button onClick={() => setActivePage('transactions')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>{t.seeAll} <ChevronRight size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {finalDisplayTransactions.slice(0, 5).map(item => (
                <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {item.type === 'income' ? <TrendingUp size={20} /> : <ReceiptText size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{getCategoryDisplayName(item.category)} • {item.date}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: item.type === 'income' ? '#10b981' : 'white', fontSize: '16px' }}>{item.type === 'income' ? '+' : '−'}{money(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'transactions' && (
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
        )}

        {activePage === 'debts' && (
          <div style={{ padding: '16px' }}>
             <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{t.totalReceivable}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>{money(totalReceivable)}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{t.totalPayable}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>{money(totalPayable)}</div>
                </div>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: 0 }}>{t.debtDetails}</h2>
                <button onClick={() => setModal('debt')} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={16} /> {t.addDebt}</button>
             </div>
             {debts.map(d => {
                const remaining = Number(d.amount) - Number(d.paid_amount)
                const isPaid = remaining <= 0
                const debtPayments = payments.filter(p => p.debt_id === d.id)
                return (
                  <div key={d.id} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: 'white', fontSize: '16px' }}>{d.person_name}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{d.date} {d.note ? `• ${d.note}` : ''}</div>
                      </div>
                      <div style={{ background: d.type === 'receivable' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: d.type === 'receivable' ? '#10b981' : '#ef4444', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>{d.type === 'receivable' ? t.receivableType : t.payableType}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                      <div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{t.mainAmount}</div><div style={{ fontWeight: '700', color: 'white' }}>{money(d.amount)}</div></div>
                      <div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{t.paidAmount}</div><div style={{ fontWeight: '700', color: '#10b981' }}>{money(d.paid_amount)}</div></div>
                      <div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{t.remaining}</div><div style={{ fontWeight: '700', color: '#ef4444' }}>{money(remaining)}</div></div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!isPaid && <button onClick={() => setPaymentModal(d)} style={{ flex: 1, background: 'rgba(16,185,129,0.2)', color: '#10b981', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CheckCircle size={16} /> {t.payNow}</button>}
                      <button onClick={() => setHistoryModal({debt: d, history: debtPayments})} style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6', border: 'none', padding: '10px', borderRadius: '10px' }}><History size={18} /></button>
                      <button onClick={() => openEditDebtModal(d)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px', borderRadius: '10px' }}><Pencil size={18} /></button>
                      <button onClick={() => confirmDeleteDebt(d.id)} style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '10px' }}><Trash2 size={18} /></button>
                    </div>
                  </div>
                )
             })}
          </div>
        )}

        {activePage === 'khata' && (
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{t.totalMarketDue}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>{money(overallKhataSummary.totalDue)}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{t.totalMarketPayable}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444' }}>{money(overallKhataSummary.totalPayable)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: 0 }}>{t.khataTitle}</h2>
              <button onClick={() => setModal('contact')} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={16} /> {t.addContact}</button>
            </div>

            {selectedContact ? (
              <div>
                <button onClick={() => setSelectedContactId(null)} style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontWeight: '600' }}>
                  <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> {t.backToContacts}
                </button>
                
                {/* Improved Contact Summary Card */}
                {(() => {
                    const entries = khataEntries.filter(e => e.contact_id === selectedContact.id);
                    const totalGave = entries.filter(e => e.type === 'give').reduce((s,e) => s + Number(e.amount), 0);
                    const totalTook = entries.filter(e => e.type === 'take').reduce((s,e) => s + Number(e.amount), 0);
                    const bal = totalGave - totalTook;
                    return (
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', textAlign: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '4px', fontWeight: '800' }}>{selectedContact.name}</h3>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}><Phone size={14} style={{ verticalAlign: 'middle' }} /> {selectedContact.phone || 'N/A'}</div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{t.totalGave}</div>
                            <div style={{ fontWeight: '700', color: '#10b981', fontSize: '15px' }}>{money(totalGave)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{t.totalTook}</div>
                            <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '15px' }}>{money(totalTook)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{t.remaining}</div>
                            <div style={{ fontWeight: '700', color: bal > 0 ? '#10b981' : bal < 0 ? '#ef4444' : 'white', fontSize: '15px' }}>{money(Math.abs(bal))}</div>
                          </div>
                        </div>

                        {bal > 0 && <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '8px' }}>{t.youWillGet}: {money(bal)}</div>}
                        {bal < 0 && <div style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>{t.youWillGive}: {money(Math.abs(bal))}</div>}
                        {bal === 0 && <div style={{ fontSize: '18px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>{t.settled}</div>}
                      </div>
                    )
                  })()}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', color: 'white', margin: 0 }}>{t.entryHistory}</h4>
                  <button onClick={() => setModal('khataEntry')} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={14} /> {t.addEntry}</button>
                </div>
                {khataEntries.filter(e => e.contact_id === selectedContact.id).map(entry => (
                  <div key={entry.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'white', fontSize: '14px' }}>{entry.type === 'give' ? t.give : t.take}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{entry.note || '-'} • {entry.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontWeight: '700', color: entry.type === 'give' ? '#10b981' : '#ef4444' }}>{money(entry.amount)}</div>
                      <button onClick={() => openEditKhataEntryModal(entry)} style={{ background: 'none', border: 'none', color: 'white' }}><Pencil size={14} /></button>
                      <button onClick={() => confirmDeleteKhataEntry(entry.id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {contacts.map(c => {
                  const bal = getContactBalance(c.id);
                  return (
                    <div key={c.id} onClick={() => setSelectedContactId(c.id)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: 'white', fontSize: '16px' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{c.phone}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {bal > 0 && <div style={{ color: '#10b981', fontWeight: '700' }}>{money(bal)}</div>}
                        {bal < 0 && <div style={{ color: '#ef4444', fontWeight: '700' }}>{money(Math.abs(bal))}</div>}
                        {bal === 0 && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{t.settled}</div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '12px' }}>
                        <button onClick={(e) => { e.stopPropagation(); openEditContactModal(c); }} style={{ background: 'none', border: 'none', color: 'var(--primary)' }}><Pencil size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); confirmDeleteContact(c.id); }} style={{ background: 'none', border: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activePage === 'reports' && (
          <div style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>{t.financialReport}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{t.income}</div>
                <div style={{ fontWeight: '800', color: '#10b981', fontSize: '16px' }}>{money(income)}</div>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{t.expense}</div>
                <div style={{ fontWeight: '800', color: '#ef4444', fontSize: '16px' }}>{money(expense)}</div>
              </div>
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(59,130,246,0.3)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{t.netSavings}</div>
                <div style={{ fontWeight: '800', color: netSavings >= 0 ? '#10b981' : '#ef4444', fontSize: '16px' }}>{money(netSavings)}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '16px', color: 'white', textAlign: 'center', marginBottom: '16px' }}>{t.expenseBreakdown}</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={expenseChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => money(value)} contentStyle={{ borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.8)', color: 'white' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'white' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '16px', color: 'white', textAlign: 'center', marginBottom: '16px' }}>{t.monthlyComparison}</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => money(value)} cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.8)' }}/>
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'white' }}/>
                    <Bar dataKey="Income" name={t.income} fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Expense" name={t.expense} fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activePage === 'settings' && (
          <div style={{ padding: '16px' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '4px' }}>{userProfile?.full_name || t.profileInfo}</h3>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}><Mail size={14} style={{ verticalAlign: 'middle' }} /> {session.user.email}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '16px' }}>{t.profileSettings}</h3>
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{t.fullName}</label>
                <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder={t.fullName} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                <button type="submit" style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', fontWeight: '700', marginTop: '5px' }}>{t.updateProfile}</button>
              </form>
              
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

              <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '16px' }}>{t.changePassword}</h3>
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{t.newPassword}</label>
                <input type="password" value={profileNewPassword} onChange={e => setProfileNewPassword(e.target.value)} placeholder="******" style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                <button type="submit" style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)', color: 'white', border: 'none', fontWeight: '700', marginTop: '5px' }}>{t.updatePasswordBtn}</button>
              </form>
            </div>

            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '16px' }}>{t.manageCategories}</h3>
            <form onSubmit={handleAddCategory} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input required value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder={t.catName} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <select value={newCatType} onChange={e => setNewCatType(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                <option value="expense">{t.expense}</option>
                <option value="income">{t.income}</option>
              </select>
              <button type="submit" style={{ padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', fontWeight: '700' }}>{t.addCategoryBtn}</button>
            </form>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
              {customCategories.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} color={c.type === 'income' ? '#10b981' : '#ef4444'} /> {c.name}
                  </div>
                  <button onClick={() => confirmDeleteCategory(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Pill Bottom Nav */}
      <div className="floating-nav">
        {navItems.slice(0, 4).map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
        <button className={`nav-item ${activePage === 'reports' ? 'active' : ''}`} onClick={() => setActivePage('reports')}>
          <ChartNoAxesCombined size={20} />
          <span>{t.reports}</span>
        </button>
      </div>

      {/* Modals & Sheets */}
      <BottomSheet isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} title="PDF Export Options">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Select Period</label>
          <select value={pdfPeriod} onChange={e => setPdfPeriod(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            <option value="allTime">All Time (সর্বমোট)</option>
            <option value="daily">Daily (দৈনিক)</option>
            <option value="monthly">Monthly (মাসিক)</option>
            <option value="yearly">Yearly (বার্ষিক)</option>
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

      <BottomSheet isOpen={modal === 'income' || modal === 'expense'} onClose={closeModal} title={modal === 'income' ? t.incomeLabel : t.expenseLabel}>
        <form onSubmit={saveTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>{t.amount}</label>
            <input required min="0.01" step="0.01" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ background: 'transparent', border: 'none', fontSize: '32px', fontWeight: '800', color: 'white', textAlign: 'center', outline: 'none', width: '100%' }} autoFocus />
          </div>
          
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{t.category}</label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {customCategories.filter(c => c.type === modal).map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(`custom_${c.id}`)} style={{ padding: '8px 16px', borderRadius: '20px', background: category === `custom_${c.id}` ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600' }}>{c.name}</button>
            ))}
            {['salary', 'food', 'transport', 'other'].map(key => (
              <button key={key} type="button" onClick={() => setCategory(key)} style={{ padding: '8px 16px', borderRadius: '20px', background: category === key ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600' }}>{t[key]}</button>
            ))}
          </div>

          <label style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{t.note}</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder={t.descriptionPlaceholder} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px' }} />

          <label style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{t.date}</label>
          <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px' }} />

          <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>{t.save}</button>
        </form>
      </BottomSheet>

      {/* Debt Modal */}
      <BottomSheet isOpen={modal === 'debt'} onClose={closeModal} title={editingDebtId ? t.editDebt : t.addDebt}>
        <form onSubmit={saveDebt} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input required value={debtPerson} onChange={e => setDebtPerson(e.target.value)} placeholder={t.personName} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <select value={debtType} onChange={e => setDebtType(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            <option value="receivable" style={{color: 'black'}}>{t.receivableType}</option>
            <option value="payable" style={{color: 'black'}}>{t.payableType}</option>
          </select>
          <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t.amount} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input required type="date" value={debtDate} onChange={e => setDebtDate(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700' }}>{t.save}</button>
        </form>
      </BottomSheet>

      {/* Contact Modal */}
      <BottomSheet isOpen={modal === 'contact'} onClose={closeModal} title={editingContactId ? t.editContact : t.addContact}>
        <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input required value={contactName} onChange={e => setContactName(e.target.value)} placeholder={t.contactName} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder={t.contactPhone} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700' }}>{t.save}</button>
        </form>
      </BottomSheet>

      {/* Khata Entry Modal */}
      <BottomSheet isOpen={modal === 'khataEntry'} onClose={closeModal} title={editingKhataEntryId ? t.editEntry : t.addEntry}>
        <form onSubmit={handleSaveKhataEntry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select required value={khataContactId} onChange={e => setKhataContactId(e.target.value)} disabled={!!editingKhataEntryId} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            <option value="">-- {t.selectContact} --</option>
            {contacts.map(c => <option key={c.id} value={c.id} style={{color: 'black'}}>{c.name}</option>)}
          </select>
          <select value={khataEntryType} onChange={e => setKhataEntryType(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            <option value="give" style={{color: 'black'}}>{t.give}</option>
            <option value="take" style={{color: 'black'}}>{t.take}</option>
          </select>
          <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t.amount} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700' }}>{t.save}</button>
        </form>
      </BottomSheet>

      {/* Payment Modal (Add/Edit) */}
      <BottomSheet isOpen={!!paymentModal || !!editingPayment} onClose={() => { setPaymentModal(null); setEditingPayment(null) }} title={editingPayment ? t.editPayment : `${t.payNow} - ${paymentModal?.person_name}`}>
        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {!editingPayment && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', color: 'white' }}>
              <div>{t.mainAmount}: {money(paymentModal?.amount || 0)}</div>
              <div>{t.paidAmount}: {money(paymentModal?.paid_amount || 0)}</div>
            </div>
          )}
          <input required type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder={t.paymentAmount} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input required type="date" value={paymentDateRecord} onChange={e => setPaymentDateRecord(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700' }}>{t.save}</button>
        </form>
      </BottomSheet>

      {/* History Modal */}
      {historyModal && (
        <div className="center-modal-overlay" onClick={() => setHistoryModal(null)}>
            <div className="center-modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>{t.paymentHistory} - {historyModal.debt.person_name}</h3>
                    <button onClick={() => setHistoryModal(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                </div>
                {historyModal.history.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px' }}>{t.noPaymentHistory}</div>
                ) : (
                    <div style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {historyModal.history.map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{p.payment_date}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'white' }}>{money(p.amount)}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => openEditPaymentModal(p)} style={{ background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: '#3b82f6', cursor: 'pointer' }}><Pencil size={16} /></button>
                                    <button onClick={() => confirmDeletePayment(p.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={deleteDialog.isOpen} 
        onClose={() => setDeleteDialog(prev => ({ ...prev, isOpen: false }))} 
        onConfirm={deleteDialog.onConfirm}
        title={t.confirmDeleteTitle}
        message={deleteDialog.message}
        lang={lang}
      />

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({...prev, isOpen: false}))} />
    </div>
  )
}

export default App
