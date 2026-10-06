
import WeeklyIntakeForm from "@/components/WeeklyIntakeForm";

const Index = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <header className="w-full shrink-0 bg-[#00539B] py-2 px-6 shadow-md">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-semibold">Azure and On-Prem Intakes</h1>
        </div>
      </header>
      <WeeklyIntakeForm />
    </div>
  );
};

export default Index;
