import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '../types';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const itemSchema = z.object({
  amount: z.number().positive('Required'),
  category: z.nativeEnum(Category),
  reason: z.string().min(1, 'Required'),
});

const schema = z.object({
  date: z.string(),
  expenses: z.array(itemSchema).min(1, 'Add at least one expense'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const BulkExpenseForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      expenses: [{ amount: undefined as any, category: Category.FOOD, reason: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenses'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date for all expenses</label>
        <input
          type="date"
          {...register('date')}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Expense Items</h3>
          <button
            type="button"
            onClick={() => append({ amount: 0, category: Category.FOOD, reason: '' })}
            className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto px-1 -mx-1">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`expenses.${index}.amount` as const, { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${
                      errors.expenses?.[index]?.amount ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.expenses?.[index]?.amount && <p className="text-red-500 text-[10px] mt-1">{errors.expenses[index].amount?.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    {...register(`expenses.${index}.category` as const)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reason</label>
                  <input
                    type="text"
                    {...register(`expenses.${index}.reason` as const)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${
                      errors.expenses?.[index]?.reason ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="E.g. Coffee"
                  />
                  {errors.expenses?.[index]?.reason && <p className="text-red-500 text-[10px] mt-1">{errors.expenses[index].reason?.message}</p>}
                </div>
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full border border-slate-100 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {errors.expenses?.root && (
        <p className="text-red-500 text-sm font-bold text-center">{errors.expenses.root.message}</p>
      )}
      {Object.keys(errors).length > 0 && !errors.expenses && (
        <p className="text-red-500 text-sm font-bold text-center">Please check all fields</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-teal-200"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        Save All Expenses
      </button>
    </form>
  );
};
