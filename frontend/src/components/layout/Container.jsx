export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-screen-xl px-4 ${className}`}>
      {children}
    </div>
  );
}
