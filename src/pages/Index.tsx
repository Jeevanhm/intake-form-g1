
import WeeklyIntakeForm from "@/components/WeeklyIntakeForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-[#00539B] py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <img 
            src="https://www.mountsinai.org/static/css/assets/logo/mount-sinai.png" 
            alt="Mount Sinai Logo" 
            className="h-10"
          />
          <h1 className="ml-4 text-white text-xl font-semibold">Weekly Intake Form</h1>
        </div>
      </header>
      <WeeklyIntakeForm />
    </div>
  );
};

export default Index;
