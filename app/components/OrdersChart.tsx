'use client';

import { useState } from 'react';
import RetroButton from './RetroButton';

interface ChartData {
  date: string;
  totalOrders: number;
  paidOrders: number;
  freeOrders: number;
  revenue: number;
}

interface OrdersChartProps {
  data: ChartData[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  const [viewMode, setViewMode] = useState<'total' | 'paid'>('total');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-4 border-black p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Orders Over Time (Last 30 Days)</h2>
        <p className="text-gray-600">No order data available yet.</p>
      </div>
    );
  }

  // Get the data to display based on view mode
  const chartValues = data.map(d => viewMode === 'total' ? d.totalOrders : d.paidOrders);
  const maxValue = Math.max(...chartValues, 1); // At least 1 to avoid division by zero

  // Format date for display (show MM/DD)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white border-4 border-black p-6 mb-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Orders Over Time (Last 30 Days)</h2>
        <div className="flex gap-2">
          <RetroButton
            onClick={() => setViewMode('total')}
            className={`!px-4 !py-2 !text-sm ${viewMode === 'total' ? '!bg-[#000080] !text-white' : ''}`}
          >
            Total Orders
          </RetroButton>
          <RetroButton
            onClick={() => setViewMode('paid')}
            className={`!px-4 !py-2 !text-sm ${viewMode === 'paid' ? '!bg-[#000080] !text-white' : ''}`}
          >
            Paid Only
          </RetroButton>
        </div>
      </div>

      {/* Chart */}
      <div className="border-2 border-black p-4 pb-12 bg-gray-50 overflow-x-auto">
        <div className="flex items-end h-64" style={{ width: '100%', minWidth: '100%' }}>
          {data.map((item, index) => {
            const value = viewMode === 'total' ? item.totalOrders : item.paidOrders;
            const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const showLabel = index % 5 === 0; // Show date label every 5 days

            return (
              <div key={item.date} className="flex flex-col items-center group relative flex-1">
                {/* Bar container with fixed height */}
                <div className="flex items-end w-full" style={{ height: '240px' }}>
                  <div
                    className="w-full bg-[#000080] hover:bg-[#0000CD] transition-colors border border-black relative mx-px"
                    style={{ height: `${heightPercent}%`, minHeight: value > 0 ? '4px' : '0' }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                      <div className="font-bold">{formatDate(item.date)}</div>
                      <div>Total: {item.totalOrders}</div>
                      <div>Paid: {item.paidOrders}</div>
                      <div>Free: {item.freeOrders}</div>
                      <div>Revenue: ${(item.revenue / 100).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Date label - always at same baseline with more spacing */}
                <div className="text-[8px] sm:text-[10px] mt-3 text-center" style={{ height: '24px' }}>
                  {showLabel && (
                    <span className="whitespace-nowrap transform inline-block rotate-45 origin-center">
                      {formatDate(item.date)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#000080] border border-black"></div>
          <span>
            {viewMode === 'total' ? 'Total Orders' : 'Paid Orders'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">Max: {maxValue} orders</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t-2 border-black flex flex-wrap gap-4 justify-center text-sm">
        <div>
          <span className="font-bold">30-Day Total: </span>
          {data.reduce((sum, d) => sum + d.totalOrders, 0)} orders
        </div>
        <div>
          <span className="font-bold">Paid: </span>
          {data.reduce((sum, d) => sum + d.paidOrders, 0)}
        </div>
        <div>
          <span className="font-bold">Free: </span>
          {data.reduce((sum, d) => sum + d.freeOrders, 0)}
        </div>
        <div>
          <span className="font-bold">Revenue: </span>
          ${(data.reduce((sum, d) => sum + d.revenue, 0) / 100).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
