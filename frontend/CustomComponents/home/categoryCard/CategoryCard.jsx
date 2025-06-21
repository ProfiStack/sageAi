'use client'

export default function CategoryCard  ({ item, onClick }) {
    
    return (
      <div 
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(item)}
      >
        <div className="flex items-start space-x-3">
          <div className="h-[48px] w-[48px] bg-[#D4B03880] rounded-[8px] flex items-center justify-center flex-shrink-0">
            <div className="h-full w-full flex items-center justify-center">{item.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    );
  };