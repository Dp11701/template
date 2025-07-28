export function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={
        "font-bold text-xl text-blue-600 flex items-center gap-2 " +
        (props.className || "")
      }
    >
      <span>MyAdmin</span>
    </div>
  );
}
