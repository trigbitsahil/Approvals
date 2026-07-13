import{o as e}from"./chunk-zsgVPwQN.js";import{n as t,t as n}from"./jsx-runtime-0GMzaUZo.js";import{c as r,i,o as a,r as o,s,t as c}from"./dialog-D9SFINPB.js";import{t as l}from"./button-CpNWB3uH.js";import{t as u}from"./plus-BG-fMJ9q.js";import{t as d}from"./Scanner-gI96NxaC.js";import{t as f}from"./input-BXLmZqt2.js";import{t as p}from"./productApi-DnzLYios.js";var m=e(t(),1),h=n();function g(){let[e,t]=(0,m.useState)(!1),[n,d]=(0,m.useState)(!1),[g,_]=(0,m.useState)({productName:``,barcode:``,price:``}),v=e=>{_({...g,[e.target.name]:e.target.value})};return(0,h.jsx)(`div`,{className:`flex justify-end`,children:(0,h.jsxs)(c,{open:e,onOpenChange:t,children:[(0,h.jsx)(r,{asChild:!0,children:(0,h.jsxs)(l,{className:`(above classes)`,children:[(0,h.jsx)(u,{size:16}),`Add Product`]})}),(0,h.jsxs)(o,{className:`\r
          bg-white dark:bg-zinc-900\r
          text-black dark:text-white\r
          border border-gray-200 dark:border-zinc-800\r
          rounded-2xl shadow-2xl`,children:[(0,h.jsxs)(a,{children:[(0,h.jsx)(s,{className:`text-lg font-semibold`,children:`Add New Product`}),(0,h.jsx)(i,{className:`text-gray-500 dark:text-zinc-400`,children:`Fill product name, barcode and price.`})]}),(0,h.jsxs)(`form`,{onSubmit:async e=>{e.preventDefault(),d(!0);try{await p({productName:g.productName,barcode:g.barcode,price:Number(g.price)}),_({productName:``,barcode:``,price:``}),t(!1)}catch{alert(`Error ❌`)}finally{d(!1)}},className:`space-y-4 mt-4`,children:[(0,h.jsx)(f,{name:`productName`,placeholder:`Product Name`,value:g.productName,onChange:v,required:!0,className:`\r
                bg-gray-100 dark:bg-zinc-800\r
                border border-gray-300 dark:border-zinc-700\r
                focus:ring-2 focus:ring-purple-600\r
                text-black dark:text-white`}),(0,h.jsx)(f,{name:`barcode`,placeholder:`Barcode`,value:g.barcode,onChange:v,required:!0,className:`\r
                bg-gray-100 dark:bg-zinc-800\r
                border border-gray-300 dark:border-zinc-700\r
                focus:ring-2 focus:ring-purple-600\r
                text-black dark:text-white`}),(0,h.jsx)(f,{name:`price`,type:`number`,placeholder:`Price`,value:g.price,onChange:v,required:!0,className:`\r
                bg-gray-100 dark:bg-zinc-800\r
                border border-gray-300 dark:border-zinc-700\r
                focus:ring-2 focus:ring-purple-600\r
                text-black dark:text-white`}),(0,h.jsx)(l,{type:`submit`,disabled:n,className:`\r
     w-full\r
      bg-primary\r
    text-primary-foreground\r
    hover:bg-primary/90\r
    active:scale-[0.98]\r
    transition-all\r
    duration-200\r
    shadow-md\r
  `,children:n?`Saving...`:`Save Product`})]})]})]})})}function _(){return(0,h.jsxs)(`div`,{className:`min-h-screen px-4 py-8 \r
      bg-white dark:bg-black \r
      text-black dark:text-white`,children:[(0,h.jsxs)(`div`,{className:`flex justify-between items-center mb-8 max-w-5xl mx-auto`,children:[(0,h.jsx)(`h1`,{className:`text-xl md:text-2xl font-semibold`,children:`Barcode Page`}),(0,h.jsx)(g,{})]}),(0,h.jsx)(`div`,{className:`max-w-5xl mx-auto`,children:(0,h.jsx)(d,{})}),(0,h.jsx)(`div`,{className:`max-w-5xl mx-auto mt-10`,children:(0,h.jsx)(`hr`,{className:`border-gray-300 dark:border-zinc-800`})})]})}export{_ as default};