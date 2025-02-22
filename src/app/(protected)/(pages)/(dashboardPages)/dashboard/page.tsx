import { getAllProjects } from "@/actions/project";
import NotFound from "@/components/global/not-found";
import Projects from "@/components/global/projects";
import React from "react";

const DashboardPage = async () => {
  const allProjects = await getAllProjects();

  return (
    <div className="w-full flex flex-col gap-6 relative md:p-0 p-4">
      <div className="flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold dark:text-primary backdrop-blur-lg">
            Projects
          </h1>
          <p className="text-base font-normal dark:text-gray-400">
            Check All Your Unique Projects
          </p>
        </div>
      </div>

      {/* Return all projects */}
      {allProjects.data && allProjects.data.length > 0 ? (
        <Projects projects={allProjects.data} />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DashboardPage;
