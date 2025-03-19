
import WeeklyIntakeForm from "@/components/WeeklyIntakeForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-[#00539B] py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <h2 className="text-white text-xl font-bold">Mount Sinai</h2>
          <h1 className="ml-4 text-white text-xl font-semibold">Weekly Intake Form</h1>
        </div>
      </header>
      <WeeklyIntakeForm />
    </div>
  );
};

export default Index;
