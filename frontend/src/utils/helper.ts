export const getPriorityColor = (priority: string = ''): string => {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-600';
        case 'medium':
            return 'bg-yellow-100 text-yellow-600';
        case 'low':
            return 'bg-green-100 text-green-600';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};
