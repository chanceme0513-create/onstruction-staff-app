import { AppHeader } from "@/components/layout/AppHeader";

type Props = {
  children: React.ReactNode;
};

export function EmployeeLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="建築会社スタッフアプリ" />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">{children}</main>
    </div>
  );
}
