import { CategoryOption } from "../types/index";
export const getCategoryIcon = (category: string) => {
  const icons = {
    Food: "🍔",
    Transportation: "🚗",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Healthcare: "🏥",
    Bills: "📄",
    Education: "📚",
    Travel: "✈️",
    Other: "📦",
  };
  return icons[category as keyof typeof icons] || "📦";
};

export const getCategoryColor = (category: string) => {
  const colors = {
    Food: "bg-orange-100 border-orange-200",
    Transportation: "bg-blue-100 border-blue-200",
    Entertainment: "bg-purple-100 border-purple-200",
    Shopping: "bg-pink-100 border-pink-200",
    Healthcare: "bg-red-100 border-red-200",
    Bills: "bg-yellow-100 border-yellow-200",
    Education: "bg-green-100 border-green-200",
    Travel: "bg-indigo-100 border-indigo-200",
    Other: "bg-gray-100 border-gray-200",
  };
  return (
    colors[category as keyof typeof colors] || "bg-gray-100 border-gray-200"
  );
};

export const categories: CategoryOption[] = [
  { label: "🍔 Food", value: "Food" },
  { label: "🚗 Transportation", value: "Transportation" },
  { label: "🎬 Entertainment", value: "Entertainment" },
  { label: "🛍️ Shopping", value: "Shopping" },
  { label: "🏥 Healthcare", value: "Healthcare" },
  { label: "📄 Bills", value: "Bills" },
  { label: "📚 Education", value: "Education" },
  { label: "✈️ Travel", value: "Travel" },
  { label: "📦 Other", value: "Other" },
];
