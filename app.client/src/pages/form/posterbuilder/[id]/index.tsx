// import React, {
//   type FunctionComponent,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import ButtonToHome from "@/components/ButtonToHome";
// import PhotosForm from "@/modules/formsContentFiles/form/photos";
// import Text from "@/components/Text";
// import MyPosts from "@/modules/formsContentFiles/Components/MyPosts";
// import { FileType } from "@/modules/formsContentFiles/interface";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

// type PosterBuilderPageProps = {};

// const FormPosterPage: FunctionComponent<PosterBuilderPageProps> = () => {
//   const params = useParams();
//   const id = params?.id as string;
//   const dispatch = useAppDispatch();

//   const template = useAppSelector(
//     (state) => state.entities.formBuilder.selectedTemplate
//   );

//   // You can set a default or fetch it later via Redux or API
//   const [fileType, setFileType] = useState<FileType>(FileType.POSTER);

//   const handleTypeChange = useCallback(
//     (type: FileType) => setFileType(type),
//     []
//   );

//   useEffect(() => {
//     // If fileType needs to change based on external values, handle here
//   }, []);

//   return (
//     <>
//       <ButtonToHome />
//       <div className="flex flex-col items-center justify-center text-center p-4">
//         <Text variant="h2" component="h2" fontSize="2rem">
//           {template?.formName || "Form Poster"}
//         </Text>

//         <PhotosForm
//           formId={id ?? ""}
//           fileType={fileType}
//           onTypeChange={handleTypeChange}
//           formData={[]} // Replace with Redux or other source as needed
//         />

//         <MyPosts formId={id ?? ""} />

//         <Link
//           to="/"
//           className="mt-6 text-blue-600 underline hover:text-blue-800"
//         >
//           Back to Home
//         </Link>
//       </div>
//     </>
//   );
// };

// export default FormPosterPage;
