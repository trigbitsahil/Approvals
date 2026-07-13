// // src/components/CookieDemo.jsx
// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { Button } from "@/components/ui/button";

// export const Cookie = () => {
//   const [cookieValue, setCookieValue] = useState("");

//   useEffect(() => {
//     const existing = Cookies.get("myCookie");
//     if (existing) {
//       setCookieValue(existing);
//     }
//   }, []);

//   const handleSetCookie = () => {
//     Cookies.set("myCookie", "HelloWorld", { expires: 7 });
//     setCookieValue("HelloWorld");
//   };

//   const handleRemoveCookie = () => {
//     Cookies.remove("myCookie");
//     setCookieValue("");
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <div>
//         <strong>Cookie Value:</strong> {cookieValue || "No cookie set"}
//       </div>
//       <div className="flex gap-2">
//         <Button onClick={handleSetCookie}>Set Cookie</Button>
//         <Button variant="destructive" onClick={handleRemoveCookie}>
//           Remove Cookie
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Cookie;
