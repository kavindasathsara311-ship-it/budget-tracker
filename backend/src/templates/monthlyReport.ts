export const monthlyReportTemplate = (name: string, data: any) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; color: #334155;">
      <h2 style="color: #0d9488;">Monthly Budget Report</h2>
      <p>Hi ${name}, here's your spending summary for the past month.</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 12px;">Total Spent</div>
          <div style="font-size: 20px; font-weight: bold; color: #0d9488;">$${data.totalSpent.toFixed(2)}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 12px;">Daily Avg</div>
          <div style="font-size: 20px; font-weight: bold; color: #0d9488;">$${data.averageDaily.toFixed(2)}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 12px;">Highest Spending Day</div>
          <div style="font-size: 20px; font-weight: bold; color: #ef4444;">$${data.highestSpendingDay.toFixed(2)}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 12px;">Over Budget</div>
          <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${data.overBudgetDays} Days</div>
        </div>
      </div>

      <h3 style="color: #0d9488;">Category Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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

      <p style="font-size: 14px; text-align: center;">
        You stayed within your budget for <strong>${data.withinBudgetDays}</strong> days this month. Keep it up!
      </p>
    </div>
  `;
};
