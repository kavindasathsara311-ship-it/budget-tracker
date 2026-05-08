export const weeklyReportTemplate = (name: string, data: any) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; color: #334155;">
      <h2 style="color: #0d9488;">Weekly Budget Report</h2>
      <p>Hi ${name}, here's a look at your spending this past week.</p>

      <div style="display: flex; justify-content: space-between; margin: 20px 0;">
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; flex: 1; margin-right: 10px; text-align: center;">
          <div style="font-size: 12px;">Total Spent</div>
          <div style="font-size: 20px; font-weight: bold; color: #0d9488;">$${data.totalSpent.toFixed(2)}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; flex: 1; margin-right: 10px; text-align: center;">
          <div style="font-size: 12px;">Daily Avg</div>
          <div style="font-size: 20px; font-weight: bold; color: #0d9488;">$${data.averageDaily.toFixed(2)}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; flex: 1; text-align: center;">
          <div style="font-size: 12px;">Over Budget</div>
          <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${data.overBudgetDays} Days</div>
        </div>
      </div>

      <h3 style="color: #0d9488;">Daily Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="text-align: left; background-color: #f8fafc;">
            <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Date</th>
            <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Total</th>
            <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.dailyBreakdown.map((d: any) => `
            <tr style="background-color: ${d.isOverBudget ? '#fee2e2' : '#dcfce7'};">
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${d.date}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">$${d.total.toFixed(2)}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${d.isOverBudget ? 'Over' : 'Within'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3 style="color: #0d9488;">Category Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="text-align: left; background-color: #f8fafc;">
            <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Category</th>
            <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Amount</th>
            <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">%</th>
          </tr>
        </thead>
        <tbody>
          ${data.categoryBreakdown.map((c: any, index: number) => `
            <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f1f5f9'};">
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${c.category}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">$${c.amount.toFixed(2)}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${c.percentage.toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};
