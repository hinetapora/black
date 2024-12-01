// File: app/signup/components/ProgressBar.tsx

import React from "react";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => (
  <div className="w-full mt-6 mb-2 flex items-center">
    <div className="w-full mr-2">
      <div className="h-2 bg-gray-600 rounded-full dark:bg-gray-700">
        <div
          className="h-2 bg-green-400 rounded-full transition-all duration-300 dark:bg-green-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
    <div className="text-sm text-gray-300 dark:text-gray-200">{percentage}%</div>
  </div>
);

export default ProgressBar;
