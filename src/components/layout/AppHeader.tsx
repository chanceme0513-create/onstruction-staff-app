type Props = {
  title: string;
};

export function AppHeader({ title }: Props) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-base font-bold text-gray-800">{title}</h1>
      </div>
    </header>
  );
}
