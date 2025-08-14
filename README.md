# React Assessment 

A comprehensive React application demonstrating advanced component architecture, state management, performance optimization, and white-label configuration capabilities.

## 🚀 Features

### Task 1: Reusable Component Library
- **DataTable**: Sortable columns, pagination, custom renderers, search, export
- **Modal**: Accessible with portal rendering, focus management, keyboard navigation
- **Form Components**: TextInput, SelectInput with validation and error states
- **TypeScript**: Complete type safety throughout the application

### Task 2: Complex State Management
- **Shopping Cart**: Add/remove items, quantity updates, discount codes
- **Persistence**: Cart data saved to localStorage
- **Optimistic Updates**: Immediate UI feedback with error recovery
- **Undo Functionality**: Revert recent cart actions

### Task 3: Performance Optimization
- **Memoization**: React.memo, useMemo, useCallback for expensive operations
- **Efficient Rendering**: Prevent unnecessary re-renders
- **Optimized Data Structures**: Department lookup maps for O(1) access
- **Performance Monitoring**: Built-in optimization indicators

### Task 4: White-Label Configuration
- **Theme System**: Dynamic client-specific theming
- **Feature Flags**: Configurable functionality per client
- **Flexible API**: Same components, different configurations

##  Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling
- **Modern React Hooks** for state management

##  Design Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Modern UI**: Clean interface with micro-interactions
- **Consistent Spacing**: 8px grid system
- **Professional Color Palette**: Blue primary with semantic colors

##  Demo Sections

1. **DataTable Demo**: Interactive table with all features
2. **Forms Demo**: Validation, error states, accessibility
3. **Shopping Cart**: State management with persistence
4. **Performance**: Optimized components with monitoring

##  Getting Started

```bash
npm install
npm run dev
```

## 🎯 Key Optimizations

### Performance Improvements Applied:
- Memoized expensive calculations (date operations, filtering, sorting)
- Created lookup maps for O(1) data access
- Used React.memo to prevent unnecessary re-renders
- Memoized callbacks to prevent child re-renders
- Moved inline styles to CSS classes
- Ready for virtualization for large datasets

### White-Label Configuration:
- Theme switching between client configurations
- Feature flags controlling component behavior
- Maintainable configuration system
- Easy addition of new clients

## Component APIs

### DataTable
```typescript
<DataTable
  data={users}
  columns={columns}
  onSort={handleSort}
  pagination={pagination}
  onPageChange={handlePageChange}
  loading={false}
  searchable={true}
  exportable={true}
/>
```

### Modal
```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="medium"
  closeOnOverlayClick={true}
>
  <Content />
</Modal>
```

### TextInput
```typescript
<TextInput
  label="Email"
  type="email"
  required
  error="Invalid email"
  onChange={handleChange}
  showPasswordToggle={true}
/>
```

This solution demonstrates production-ready code with proper architecture, performance considerations, and maintainable patterns suitable for enterprise applications.