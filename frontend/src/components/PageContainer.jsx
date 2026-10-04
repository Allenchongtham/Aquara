import React from 'react';

/**
 * PageContainer: Auto-adjusts page margins, max-widths, and padding based on screen size.
 */
export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * AutoGrid: Automatically adjusts grid columns from 1 (mobile) to 2 (tablet) to 3 or 4 (desktop).
 */
export function AutoGrid({ children, cols = 3, className = '' }) {
  const colMap = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colMap[cols] || colMap[3]} gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
}