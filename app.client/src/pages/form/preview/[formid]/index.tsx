// import PosterPreview from "@/components/FormBuilder/subcomponents/form-preview/PosterPreview";
// import StepperFormPreview from "@/components/FormBuilder/subcomponents/form-preview/StepperFormPreview";
// import type { TemplateType } from "@/types/FormTemplateTypes";

// import { useEffect, useState } from "react";
// import { Typography } from "@/components/ui/typography";

// interface PreviewPageProps {
//   formId: string;
// }

// const PreviewPage: React.FC<PreviewPageProps> = ({ formId }) => {
//   const [template, setTemplate] = useState<TemplateType | null>(null);
//   const [formContentRes, setFormContentRes] = useState<any[]>([]);

//   // Dummy example to simulate fetching
//   useEffect(() => {
//     // Fetch form content and template by formId from your REST API or local store
//     // Replace the following with your own fetch logic
//     const fetchData = async () => {
//       try {
//         const templateRes = await fetch(`/api/template/${formId}`);
//         const contentRes = await fetch(`/api/form-content/${formId}`);

//         const templateData = await templateRes.json();
//         const contentData = await contentRes.json();

//         if (templateData?.templateRow) {
//           setTemplate(JSON.parse(templateData.templateRow));
//         }

//         if (contentData?.files) {
//           setFormContentRes(contentData.files);
//         }
//       } catch (error) {
//         console.error("Error loading form data:", error);
//       }
//     };

//     fetchData();
//   }, [formId]);

//   return (
//     <div className="flex h-screen w-full flex-col md:flex-row overflow-auto">
//       {/* Poster or file preview */}
//       <div className="w-full md:w-1/2 p-4">
//         {formContentRes && formContentRes.length ? (
//           <PosterPreview data={formContentRes as any} screenType="mobile" />
//         ) : (
//           <Typography variant="h2" className="text-center text-2xl">
//             Your Poster/SlideShow/PDF will be here
//           </Typography>
//         )}
//       </div>

//       {/* Form Preview */}
//       <div className="w-full md:w-1/2 p-4">
//         {template ? (
//           <StepperFormPreview
//             showPreview
//             formId={formId}
//             formLayoutComponents={template.formLayoutComponents || []}
//             screenType="mobile"
//           />
//         ) : (
//           <Typography variant="h2" className="text-center text-2xl">
//             Your form will be here
//           </Typography>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PreviewPage;
