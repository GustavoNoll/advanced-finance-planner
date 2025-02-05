import { Progress } from "@/components/ui/progress";

const categories = [
  { name: "Housing", spent: 1200, budget: 1500 },
  { name: "Food", spent: 400, budget: 500 },
  { name: "Transportation", spent: 250, budget: 300 },
  { name: "Entertainment", spent: 150, budget: 200 },
];

export const BudgetCategories = () => {
  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const percentage = (category.spent / category.budget) * 100;
        return (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{category.name}</span>
              <span className={percentage > 90 ? "text-red-500" : "text-gray-600"}>
                ${category.spent} / ${category.budget}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}
    </div>
  );
};