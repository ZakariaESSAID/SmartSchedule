'use client'

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold">Bienvenue sur SmartSchedule</h2>
        <p className="text-gray-500 mt-2">
          Utilisez le menu de navigation sur la gauche pour gérer les cours, les enseignants, les étudiants et les salles.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
