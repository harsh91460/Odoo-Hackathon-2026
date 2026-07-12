export default function StatusBadge({ status }) {
  const styles = {
    'Available': 'bg-status-green/20 text-status-green border-status-green/30',
    'Completed': 'bg-status-green/20 text-status-green border-status-green/30',
    'On Trip': 'bg-status-blue/20 text-status-blue border-status-blue/30',
    'Dispatched': 'bg-status-blue/20 text-status-blue border-status-blue/30',
    'In Shop': 'bg-status-orange/20 text-status-orange border-status-orange/30',
    'Suspended': 'bg-status-orange/20 text-status-orange border-status-orange/30',
    'Retired': 'bg-status-red/20 text-status-red border-status-red/30',
    'Draft': 'bg-status-gray/20 text-status-gray border-status-gray/30',
  };

  const activeStyle = styles[status] || 'bg-gray-800 text-gray-300 border-gray-600';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${activeStyle}`}>
      {status}
    </span>
  );
}