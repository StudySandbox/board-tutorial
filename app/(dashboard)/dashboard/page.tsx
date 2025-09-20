import MainComponent from "./_components";

const DashboardPage = () => {
  return (
    <div className="flex h-screen flex-col items-center">
      <main className="mx-auto max-w-xl grow p-2 sm:p-8">
        <MainComponent />
      </main>
    </div>
  );
};

export default DashboardPage;
