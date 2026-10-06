
import WeeklyIntakeForm from "@/components/WeeklyIntakeForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-[#00539B] py-4 px-6 shadow-md">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-semibold">Azure and On-Prem Intakes</h1>
        </div>
      </header>
      <WeeklyIntakeForm />
    </div>
  );
};

export default Index;
