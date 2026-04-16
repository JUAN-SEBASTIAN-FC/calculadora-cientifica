import './ui.css';

export default function Button({ 
  children, 
  variant = 'default', 
  onClick, 
  className = '', 
  ...props 
}) {
  return (
    <button 
      className={`ui-button ${variant} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
