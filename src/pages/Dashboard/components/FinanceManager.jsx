import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, ArrowUpDown, Filter, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import './Manager.css';

const FinanceManager = () => {
  const { t } = useTranslation();
  const fm = (key) => t(`dashboard.financeManager.${key}`);
  
  // Initial mock data for expenses
  const initialExpenses = [
    { id: 1, description: 'Abonament Adobe Creative Cloud', amount: 600, category: 'Software', date: '2026-01-15', validUntil: '2027-01-15', status: 'active' },
    { id: 2, description: 'Hosting Server Anual', amount: 1200, category: 'Infrastructure', date: '2025-12-01', validUntil: '2026-12-01', status: 'active' },
    { id: 3, description: 'Licență Windows Server', amount: 850, category: 'Software', date: '2025-11-10', validUntil: '2026-11-10', status: 'active' },
    { id: 4, description: 'Marketing Google Ads', amount: 500, category: 'Marketing', date: '2026-01-01', validUntil: '2026-01-31', status: 'expired' },
  ];

  // Initial mock data for income
  const initialIncome = [
    { id: 1, description: 'Proiect Website Corporate - ABC Company', amount: 5000, category: 'Web Design', date: '2026-01-20', client: 'ABC Company', status: 'paid' },
    { id: 2, description: 'Logo Design - XYZ Startup', amount: 800, category: 'Branding', date: '2026-01-15', client: 'XYZ Startup', status: 'paid' },
    { id: 3, description: 'E-commerce Platform - Online Store', amount: 12000, category: 'Web Development', date: '2026-01-10', client: 'Online Store', status: 'paid' },
    { id: 4, description: 'Maintenance Contract - Tech Corp', amount: 2000, category: 'Maintenance', date: '2026-01-25', client: 'Tech Corp', status: 'pending' },
  ];

  const [expenses, setExpenses] = useState(initialExpenses);
  const [income, setIncome] = useState(initialIncome);
  const [activeView, setActiveView] = useState('expenses'); // 'expenses', 'income', 'charts'
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  
  // Sorting and filtering states for expenses
  const [expenseSortField, setExpenseSortField] = useState('date');
  const [expenseSortDirection, setExpenseSortDirection] = useState('desc');
  const [expenseFilter, setExpenseFilter] = useState({ category: '', status: '' });
  
  // Sorting and filtering states for income
  const [incomeSortField, setIncomeSortField] = useState('date');
  const [incomeSortDirection, setIncomeSortDirection] = useState('desc');
  const [incomeFilter, setIncomeFilter] = useState({ category: '', status: '' });

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    validUntil: '',
    client: '',
    status: ''
  });

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Sorted and filtered expenses
  const sortedFilteredExpenses = useMemo(() => {
    let filtered = [...expenses];
    
    if (expenseFilter.category) {
      filtered = filtered.filter(exp => exp.category === expenseFilter.category);
    }
    if (expenseFilter.status) {
      filtered = filtered.filter(exp => exp.status === expenseFilter.status);
    }
    
    filtered.sort((a, b) => {
      let aVal = a[expenseSortField];
      let bVal = b[expenseSortField];
      
      if (expenseSortField === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (expenseSortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  }, [expenses, expenseSortField, expenseSortDirection, expenseFilter]);

  // Sorted and filtered income
  const sortedFilteredIncome = useMemo(() => {
    let filtered = [...income];
    
    if (incomeFilter.category) {
      filtered = filtered.filter(inc => inc.category === incomeFilter.category);
    }
    if (incomeFilter.status) {
      filtered = filtered.filter(inc => inc.status === incomeFilter.status);
    }
    
    filtered.sort((a, b) => {
      let aVal = a[incomeSortField];
      let bVal = b[incomeSortField];
      
      if (incomeSortField === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (incomeSortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  }, [income, incomeSortField, incomeSortDirection, incomeFilter]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, index) => {
      const monthNum = String(index + 1).padStart(2, '0');
      
      const monthExpenses = expenses
        .filter(exp => exp.date.includes(`-${monthNum}-`))
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      const monthIncome = income
        .filter(inc => inc.date.includes(`-${monthNum}-`))
        .reduce((sum, inc) => sum + inc.amount, 0);
      
      return {
        month,
        expenses: monthExpenses,
        income: monthIncome,
        profit: monthIncome - monthExpenses
      };
    });
    
    return data;
  }, [expenses, income]);

  const handleSort = (field, type) => {
    if (type === 'expense') {
      if (expenseSortField === field) {
        setExpenseSortDirection(expenseSortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setExpenseSortField(field);
        setExpenseSortDirection('asc');
      }
    } else {
      if (incomeSortField === field) {
        setIncomeSortDirection(incomeSortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setIncomeSortField(field);
        setIncomeSortDirection('asc');
      }
    }
  };

  const handleEdit = (item, type) => {
    setFormData({
      description: item.description,
      amount: item.amount,
      category: item.category,
      date: item.date,
      validUntil: item.validUntil || '',
      client: item.client || '',
      status: item.status
    });
    setEditingId(item.id);
    // Ensure we're in the correct view when editing
    if (type === 'expenses' && activeView !== 'expenses') {
      setActiveView('expenses');
    } else if (type === 'income' && activeView !== 'income') {
      setActiveView('income');
    }
    setShowForm(true);
  };

  const handleDelete = (item, type) => {
    setDeleteId(item.id);
    setDeleteItemName(item.description);
    // Store which type we're deleting from
    setActiveView(type);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (activeView === 'expenses') {
      setExpenses(expenses.filter(e => e.id !== deleteId));
    } else if (activeView === 'income') {
      setIncome(income.filter(i => i.id !== deleteId));
    }
    setDeleteId(null);
    setShowConfirmDelete(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeView === 'expenses') {
      if (editingId) {
        setExpenses(expenses.map(exp =>
          exp.id === editingId ? { ...exp, ...formData, amount: parseFloat(formData.amount) } : exp
        ));
      } else {
        const newExpense = {
          id: Math.max(...expenses.map(e => e.id), 0) + 1,
          ...formData,
          amount: parseFloat(formData.amount)
        };
        setExpenses([...expenses, newExpense]);
      }
    } else if (activeView === 'income') {
      if (editingId) {
        setIncome(income.map(inc =>
          inc.id === editingId ? { ...inc, ...formData, amount: parseFloat(formData.amount) } : inc
        ));
      } else {
        const newIncome = {
          id: Math.max(...income.map(i => i.id), 0) + 1,
          ...formData,
          amount: parseFloat(formData.amount)
        };
        setIncome([...income, newIncome]);
      }
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: '',
      validUntil: '',
      client: '',
      status: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: '',
      validUntil: '',
      client: '',
      status: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  const expenseCategories = [...new Set(expenses.map(e => e.category))];
  const incomeCategories = [...new Set(income.map(i => i.category))];

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>
          <DollarSign size={24} />
          {fm('title')}
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="finance-summary">
        <div className="summary-card income-card">
          <div className="summary-icon">
            <TrendingUp size={32} />
          </div>
          <div className="summary-content">
            <p className="summary-label">{fm('totalIncome')}</p>
            <p className="summary-value">{totalIncome.toFixed(2)} RON</p>
          </div>
        </div>
        
        <div className="summary-card expense-card">
          <div className="summary-icon">
            <TrendingDown size={32} />
          </div>
          <div className="summary-content">
            <p className="summary-label">{fm('totalExpenses')}</p>
            <p className="summary-value">{totalExpenses.toFixed(2)} RON</p>
          </div>
        </div>
        
        <div className={`summary-card profit-card ${netProfit >= 0 ? 'positive' : 'negative'}`}>
          <div className="summary-icon">
            <DollarSign size={32} />
          </div>
          <div className="summary-content">
            <p className="summary-label">{fm('netProfit')}</p>
            <p className="summary-value">{netProfit.toFixed(2)} RON</p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button
          className={`tab-btn ${activeView === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveView('expenses')}
        >
          <TrendingDown size={18} />
          {fm('expenses')}
        </button>
        <button
          className={`tab-btn ${activeView === 'income' ? 'active' : ''}`}
          onClick={() => setActiveView('income')}
        >
          <TrendingUp size={18} />
          {fm('income')}
        </button>
        <button
          className={`tab-btn ${activeView === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveView('charts')}
        >
          <BarChart size={18} />
          {fm('charts')}
        </button>
      </div>

      {/* Expenses View */}
      {activeView === 'expenses' && (
        <>
          <div className="manager-actions">
            <button onClick={openAddForm} className="add-btn">
              + {fm('addExpense')}
            </button>
            
            <div className="filter-controls">
              <select
                value={expenseFilter.category}
                onChange={(e) => setExpenseFilter({ ...expenseFilter, category: e.target.value })}
                className="filter-select"
              >
                <option value="">{fm('allCategories')}</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={expenseFilter.status}
                onChange={(e) => setExpenseFilter({ ...expenseFilter, status: e.target.value })}
                className="filter-select"
              >
                <option value="">{fm('allStatuses')}</option>
                <option value="active">{fm('active')}</option>
                <option value="expired">{fm('expired')}</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="manager-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('description', 'expense')} className="sortable">
                    {fm('description')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('amount', 'expense')} className="sortable">
                    {fm('amount')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('category', 'expense')} className="sortable">
                    {fm('category')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('date', 'expense')} className="sortable">
                    {fm('date')} <ArrowUpDown size={14} />
                  </th>
                  <th>{fm('validUntil')}</th>
                  <th>{fm('status')}</th>
                  <th>{fm('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td className="amount-cell">{expense.amount.toFixed(2)}</td>
                    <td><span className="category-badge">{expense.category}</span></td>
                    <td>{new Date(expense.date).toLocaleDateString('ro-RO')}</td>
                    <td>{expense.validUntil ? new Date(expense.validUntil).toLocaleDateString('ro-RO') : '-'}</td>
                    <td>
                      <span className={`status-badge ${expense.status}`}>
                        {fm(expense.status)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(expense, 'expenses')} className="action-btn edit-btn">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(expense, 'expenses')} className="action-btn delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Income View */}
      {activeView === 'income' && (
        <>
          <div className="manager-actions">
            <button onClick={openAddForm} className="add-btn">
              + {fm('addIncome')}
            </button>
            
            <div className="filter-controls">
              <select
                value={incomeFilter.category}
                onChange={(e) => setIncomeFilter({ ...incomeFilter, category: e.target.value })}
                className="filter-select"
              >
                <option value="">{fm('allCategories')}</option>
                {incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={incomeFilter.status}
                onChange={(e) => setIncomeFilter({ ...incomeFilter, status: e.target.value })}
                className="filter-select"
              >
                <option value="">{fm('allStatuses')}</option>
                <option value="paid">{fm('paid')}</option>
                <option value="pending">{fm('pending')}</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="manager-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('description', 'income')} className="sortable">
                    {fm('description')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('amount', 'income')} className="sortable">
                    {fm('amount')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('category', 'income')} className="sortable">
                    {fm('category')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('client', 'income')} className="sortable">
                    {fm('client')} <ArrowUpDown size={14} />
                  </th>
                  <th onClick={() => handleSort('date', 'income')} className="sortable">
                    {fm('date')} <ArrowUpDown size={14} />
                  </th>
                  <th>{fm('status')}</th>
                  <th>{fm('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredIncome.map(inc => (
                  <tr key={inc.id}>
                    <td>{inc.description}</td>
                    <td className="amount-cell income-amount">{inc.amount.toFixed(2)}</td>
                    <td><span className="category-badge">{inc.category}</span></td>
                    <td>{inc.client}</td>
                    <td>{new Date(inc.date).toLocaleDateString('ro-RO')}</td>
                    <td>
                      <span className={`status-badge ${inc.status}`}>
                        {fm(inc.status)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(inc, 'income')} className="action-btn edit-btn">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(inc, 'income')} className="action-btn delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Charts View */}
      {activeView === 'charts' && (
        <div className="charts-container">
          <div className="chart-card">
            <h3>{fm('chartIncomeVsExpenses')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name={fm('income')} />
                <Bar dataKey="expenses" fill="#ef4444" name={fm('expenses')} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>{fm('chartNetProfit')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} name={fm('netProfit')} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>{fm('chartTrends')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name={fm('income')} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name={fm('expenses')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <Modal 
          isOpen={showForm}
          onClose={resetForm}
          title={editingId 
            ? (activeView === 'expenses' ? fm('editExpense') : fm('editIncome'))
            : (activeView === 'expenses' ? fm('addExpense') : fm('addIncome'))
          }
        >
          <form onSubmit={handleSubmit} className="manager-form" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
            <div className="form-group">
              <label>{fm('description')} {fm('required')}</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder={fm('descriptionPlaceholder')}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{fm('amount')} {fm('required')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder={fm('amountPlaceholder')}
                />
              </div>

              <div className="form-group">
                <label>{fm('category')} {fm('required')}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  placeholder={fm('categoryPlaceholder')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{fm('date')} {fm('required')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {activeView === 'expenses' && (
                <div className="form-group">
                  <label>{fm('validUntil')}</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              )}

              {activeView === 'income' && (
                <div className="form-group">
                  <label>{fm('client')} {fm('required')}</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                    placeholder={fm('clientPlaceholder')}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{fm('status')} {fm('required')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="">{fm('selectStatus')}</option>
                {activeView === 'expenses' ? (
                  <>
                    <option value="active">{fm('active')}</option>
                    <option value="expired">{fm('expired')}</option>
                  </>
                ) : (
                  <>
                    <option value="paid">{fm('paid')}</option>
                    <option value="pending">{fm('pending')}</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-btn">
                {fm('cancel')}
              </button>
              <button type="submit" className="submit-btn">
                {editingId ? fm('update') : fm('add')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false);
            setDeleteId(null);
          }}
          onConfirm={confirmDelete}
          title={fm('confirmDeleteTitle')}
          message={fm('confirmDelete').replace('{name}', deleteItemName)}
        />
      )}
    </div>
  );
};

export default FinanceManager;
