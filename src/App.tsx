import React, { useState } from 'react';
import { Modal } from './components/ui/Modal';
import { DataTable } from './components/ui/DataTable';
import { TextInput } from './components/forms/TextInput';
import { SelectInput } from './components/forms/SelectInput';
import { ProductGrid } from './components/cart/ProductGrid';
import { CartSidebar } from './components/cart/CartSidebar';
import { OptimizedUserList } from './components/performance/OptimizedUserList';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useCart } from './hooks/useCart';
import { mockUsers, mockDepartments, mockProducts } from './data/mockData';
import type { DataTableColumn, User, PaginationProps } from './types';
import { ShoppingCart, Users, Table, Settings, Undo } from 'lucide-react';

// Component to demonstrate all features //
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'datatable' | 'forms' | 'cart' | 'performance'>('datatable');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers); // ✅ users in state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
  });

  const { features } = useTheme();
  const { cart, addToCart, updateQuantity, removeItem, applyDiscount, undo, canUndo } = useCart();

  // Delete user
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Save user (edit mode)
  const handleSaveUser = () => {
    if (isEditMode && selectedUser) {
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id ? { ...selectedUser } : user
        )
      );
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
  };

  // DataTable columns configuration
  const userColumns: DataTableColumn<User>[] = [
    { key: 'name', label: 'Full Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: false,
      render: (user) => (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {user.role}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex gap-2">
          {features.rowActions.includes('view') && (
            <button
              onClick={() => {
                setSelectedUser(user);
                setIsModalOpen(true);
                setIsEditMode(false);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View
            </button>
          )}
          {features.rowActions.includes('edit') && (
            <button
              onClick={() => {
                setSelectedUser(user);
                setIsModalOpen(true);
                setIsEditMode(true);
              }}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Edit
            </button>
          )}
          {features.rowActions.includes('delete') && (
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  const pagination: PaginationProps = {
    page: currentPage,
    pageSize: 10,
    total: users.length,
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    console.log('Sort by:', key, direction);
  };

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
  };

  const departmentOptions = mockDepartments.map(dept => ({
    value: dept.id,
    label: dept.name,
  }));

  const tabs = [
    { id: 'datatable' as const, label: 'DataTable', icon: Table },
    { id: 'forms' as const, label: 'Forms', icon: Users },
    { id: 'cart' as const, label: 'Shopping Cart', icon: ShoppingCart },
    { id: 'performance' as const, label: 'Performance', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              React Assessment
            </h1>
            <div className="flex items-center gap-4">
              
              {activeTab === 'cart' && (
                <div className="flex items-center gap-2">
                  {canUndo && (
                    <button
                      onClick={undo}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title="Undo last action"
                    >
                      <Undo size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-gray-600 hover:text-gray-900"
                  >
                    <ShoppingCart size={24} />
                    {cart.items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'datatable' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">DataTable Component Demo</h2>
              
              <DataTable
                data={users}
                columns={userColumns}
                onSort={handleSort}
                pagination={pagination}
                onPageChange={setCurrentPage}
                loading={false}
                emptyMessage="No users found"
                searchable={true}
                exportable={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Form Components Demo</h2>
              <p className="text-gray-600 mb-6">
                Accessible form components with validation, error states, and consistent styling.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="Enter your full name"
                  helperText="This will be displayed on your profile"
                />
                
                <TextInput
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  placeholder="Enter your email"
                  error={formData.email && !formData.email.includes('@') ? 'Please enter a valid email' : ''}
                />
                
                <SelectInput
                  label="Department"
                  required
                  options={departmentOptions}
                  value={formData.department}
                  onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  placeholder="Select your department"
                  searchable
                />
                
                <TextInput
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                  placeholder="Enter password"
                  showPasswordToggle
                  helperText="Must be at least 8 characters"
                />
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Modal Demo
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shopping Cart Demo</h2>
              <p className="text-gray-600 mb-6">
                Advanced state management with optimistic updates, error recovery, and persistence.
              </p>
              
              <ProductGrid
                products={mockProducts}
                onAddToCart={addToCart}
              />
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Performance Optimization Demo</h2>
              
              <OptimizedUserList
                users={mockUsers}
                departments={mockDepartments}
                onUserSelect={(user) => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedUser(null);
        }}
        title={isEditMode ? 'Edit User' : selectedUser ? `User Details: ${selectedUser.name}` : 'Modal'}
        size="medium"
      >
        {selectedUser && isEditMode ? (
          <div className="space-y-4">
            <TextInput
              label="Full Name"
              value={selectedUser.name}
              onChange={(value) => setSelectedUser(prev => prev ? { ...prev, name: value } : prev)}
            />
            <TextInput
              label="Email"
              type="email"
              value={selectedUser.email}
              onChange={(value) => setSelectedUser(prev => prev ? { ...prev, email: value } : prev)}
            />
            <SelectInput
              label="Department"
              value={selectedUser.department}
              options={departmentOptions}
              onChange={(value) => setSelectedUser(prev => prev ? { ...prev, department: value } : prev)}
            />
            <button
              onClick={handleSaveUser}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        ) : selectedUser ? (
          <div className="space-y-4">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}</p>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </Modal>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onApplyDiscount={applyDiscount}
        onCheckout={handleCheckout}
        subtotal={cart.totals.subtotal}
        tax={cart.totals.tax}
        shipping={cart.totals.shipping}
        discount={cart.discountAmount}
        total={cart.totals.total}
        isLoading={cart.isLoading}
      />
    </div>
  );
};

// Main App component with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;