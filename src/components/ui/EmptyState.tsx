type Props = {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon = "📭", title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
      <span className="text-5xl">{icon}</span>
      <div>
        <p className="font-semibold text-gray-700">{title}</p>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
