import { FiDollarSign } from "react-icons/fi";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({
  title = "Expense Tracker",
  subtitle = "Manage your finances with ease",
}: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
        <FiDollarSign className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <p className="text-gray-600 text-lg">{subtitle}</p>
    </div>
  );
}
