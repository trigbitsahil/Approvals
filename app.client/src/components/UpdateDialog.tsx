// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import  type { User } from "./UserTable";

// interface UpdateDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user: User | null;
//   onUpdate: (updatedUser: User) => void;
// }

// export const UpdateDialog: React.FC<UpdateDialogProps> = ({
//   open,
//   onOpenChange,
//   user,
//   onUpdate,
// }) => {
//   const [formData, setFormData] = useState<User | null>(null);

//   useEffect(() => {
//     if (user) setFormData(user);
//   }, [user]);

//   const handleChange = (field: keyof User, value: string) => {
//     if (!formData) return;
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = () => {
//     if (formData) {
//       onUpdate(formData);
//       onOpenChange(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Update User</DialogTitle>
//         </DialogHeader>

//         {formData && (
//           <div className="space-y-5">
            
//             <Input
//               placeholder="First Name"
//               value={formData.firstName}
//               onChange={(e) => handleChange("firstName", e.target.value)}
//             />

//             <Input
//               placeholder="Last Name"
//               value={formData.lastName}
//               onChange={(e) => handleChange("lastName", e.target.value)}
//             />
//             <Input
//               placeholder="Age"
//               value={formData.age}
//               onChange={(e) => handleChange("age", e.target.value)}
//             />
//             <Input
//               placeholder="Gender"
//               value={formData.gender}
//               onChange={(e) => handleChange("gender", e.target.value)}
//             />
//             <Input
//               placeholder="Email"
//               value={formData.email}
//               onChange={(e) => handleChange("email", e.target.value)}
//             />
//             <Input
//               placeholder="Phone Number"
//               value={formData.phoneNumber}
//               onChange={(e) => handleChange("phoneNumber", e.target.value)}
//             />
//           </div>
//         )}

//         <DialogFooter className="mt-4">
//           <Button onClick={handleSubmit}>Update</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
