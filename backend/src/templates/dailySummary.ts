export const dailySummaryTemplate = (name: string, data: any) => {
  const statusColor = data.isOverBudget ? '#ef4444' : '#0d9488';
  const statusBg = data.isOverBudget ? '#fee2e2' : '#dcfce7';

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; color: #334155;">
      <h2 style="color: #0d9488;">Hello, ${name}!</h2>
      <p>Here is your budget summary for today.</p>
      
      <div style="background-color: ${statusBg}; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Spent Today</div>
        <div style="font-size: 32px; font-weight: bold; color: ${statusColor};">$${data.total.toFixed(2)}</div>
        <div style="font-size: 14px; margin-top: 5px;">Limit: $${data.limit ? data.limit.toFixed(2) : 'No Limit'}</div>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="border-bottom: 2px solid #0d9488; padding-bottom: 5px;">Today's Expenses</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="text-align: left; background-color: #f8fafc;">
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Reason</th>
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Category</th>
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.expenses.map((e: any, index: number) => `
              <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f1f5f9'};">
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${e.reason}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${e.category}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">$${Number(e.amount).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
        Sent by Budget Tracker. Log in to your dashboard to see more details.
      </p>
    </div>
  `;
};
