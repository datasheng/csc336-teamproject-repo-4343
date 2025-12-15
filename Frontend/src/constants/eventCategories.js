// Event Categories
export const EVENT_CATEGORIES = [
  { value: 'music', label: '🎵 Music', color: 'bg-red-100 text-red-800' },
  { value: 'tech', label: '💻 Technology', color: 'bg-blue-100 text-blue-800' },
  { value: 'sports', label: '⚽ Sports', color: 'bg-green-100 text-green-800' },
  { value: 'food', label: '🍔 Food & Dining', color: 'bg-orange-100 text-orange-800' },
  { value: 'art', label: '🎨 Art', color: 'bg-purple-100 text-purple-800' },
  { value: 'culture', label: '🎭 Culture', color: 'bg-pink-100 text-pink-800' },
  { value: 'business', label: '💼 Business', color: 'bg-gray-100 text-gray-800' },
  { value: 'education', label: '📚 Education', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'health', label: '🏥 Health', color: 'bg-lime-100 text-lime-800' },
  { value: 'other', label: '📌 Other', color: 'bg-slate-100 text-slate-800' },
];

export const getCategoryLabel = (categoryValue) => {
  const category = EVENT_CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.label : '📌 Other';
};

export const getCategoryColor = (categoryValue) => {
  const category = EVENT_CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.color : 'bg-slate-100 text-slate-800';
};
