import React, { useState, useMemo, memo, useCallback } from 'react';
import type { User, Department } from '../../types';

// Memoized UserCard component to prevent unnecessary re-renders
const UserCard = memo<{
  user: User;
  department?: Department;
  onClick: (user: User) => void;
}>(({ user, department, onClick }) => {
  // Memoize expensive calculations
  const isActive = useMemo(() => {
    return new Date().getTime() - new Date(user.lastLogin).getTime() < 30 * 24 * 60 * 60 * 1000;
  }, [user.lastLogin]);

  const lastLoginFormatted = useMemo(() => {
    return new Date(user.lastLogin).toLocaleDateString();
  }, [user.lastLogin]);

  const handleClick = useCallback(() => {
    onClick(user);
  }, [onClick, user]);

  return (
    <div 
      onClick={handleClick}
      className={`
        p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200
        hover:shadow-md hover:border-blue-300
        ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-600 truncate">{user.email}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-500">
              Department: {department?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-500">
              Last Login: {lastLoginFormatted}
            </p>
          </div>
          <span className={`
            inline-flex px-2 py-1 text-xs font-medium rounded-full
            ${isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
            }
          `}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

interface OptimizedUserListProps {
  users: User[];
  departments: Department[];
  onUserSelect: (user: User) => void;
}

export const OptimizedUserList: React.FC<OptimizedUserListProps> = ({
  users,
  departments,
  onUserSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Create department lookup map for O(1) access
  const departmentMap = useMemo(() => {
    return departments.reduce((map, dept) => {
      map[dept.id] = dept;
      return map;
    }, {} as Record<string, Department>);
  }, [departments]);

  // Memoize expensive filtering and sorting operations
  const processedUsers = useMemo(() => {
    let filtered = users;

    // Apply filters
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(lowercaseSearch) ||
        user.email.toLowerCase().includes(lowercaseSearch)
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    // Sort by last login (most recent first)
    return [...filtered].sort((a, b) => 
      new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
    );
  }, [users, searchTerm, selectedDepartment]);

  // Memoize callbacks to prevent child re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  }, []);

  return (
    <div className="space-y-6">
      {/* Performance monitoring info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Performance Optimizations Applied:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Memoized expensive calculations (date operations, filtering, sorting)</li>
          <li>• Created department lookup map for O(1) access instead of Array.find()</li>
          <li>• Used React.memo for UserCard to prevent unnecessary re-renders</li>
          <li>• Memoized callbacks to prevent child component re-renders</li>
          <li>• Moved inline styles to CSS classes to avoid object recreation</li>
          <li>• Virtualization ready (can be added for large lists)</li>
        </ul>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="sm:w-48">
          <select 
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {processedUsers.length} of {users.length} users
      </div>
      
      {/* User list */}
      <div className="space-y-4">
        {processedUsers.map(user => (
          <UserCard 
            key={user.id}
            user={user}
            onClick={onUserSelect}
            department={departmentMap[user.department]}
          />
        ))}
        
        {processedUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};