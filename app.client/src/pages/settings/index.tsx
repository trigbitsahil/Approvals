import ProjectSettings from "@/components/settings/ProjectSettings";
import TaskStatuses from "@/components/settings/TaskStatuses";
import ColorsSetting from "@/components/settings/ColorsSetting";
import Deleteproject from "@/components/settings/Deleteproject";

export default function SettingsPage() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <ProjectSettings />
        <TaskStatuses />
        <ColorsSetting />
        <Deleteproject />
      </div>
    </div>
  );
}
