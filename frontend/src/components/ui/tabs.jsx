import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext();

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};

const Tabs = React.forwardRef(({ defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue || '');

  useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);

  const handleTabChange = useCallback(
    (id) => {
      if (onValueChange) {
        onValueChange(id);
      }
      setSelectedTab(id);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleTabChange }}>
      <div ref={ref} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export const TabsContent = ({ children }) => {
  return <div>{children}</div>;
};

export const TabsList = ({ children }) => {
  return <div>{children}</div>;
};

export const TabsTrigger = ({ children }) => {
  return <button>{children}</button>;
};

export { Tabs, useTabs };
