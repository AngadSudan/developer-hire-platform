import ProjectSection from "./ProjectSection";
import Sidebar from "./Sidebar";
import CreateProject from "./create-project";

export default function DashBoardPageV1() {
    return (
        <div className="bg-bg h-screen flex">
            <Sidebar />
            <main className="flex-1 p-6 flex flex-col overflow-hidden">
                <div className="shrink-0 mb-3">
                    <CreateProject />
                </div>

                <div className="flex-1 overflow-auto rounded-3xl my-scrollbar-hide">
                    <ProjectSection />
                </div>
            </main>

        </div>
    );
}
