// "use client"
// import { User } from "lucide-react"

// export default function CreateProject(){
//     return (
//         <div className="bg-divBg w-full h-40 rounded-3xl mb-3 ">
//             <div className="flex gap-2">
//                 <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
//                     <User size={30} className="text-zinc-900" />
//                 </div>
//                 <div className="w-[80%]">
//                     <input type="text" placeholder="Share Your Project" 
//                         className="text-text2 bg-bg"
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client";
import { User, ImageIcon, Github, BookOpen, ArrowRight } from "lucide-react";

export default function CreateProject() {
  return (
    <div className="bg-divBg w-full rounded-3xl p-4 flex flex-col gap-4">
      
      {/* Input Row */}
      <div className="flex items-center gap-3">
        
        {/* Profile Icon */}
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <User size={29} className="text-black" />
        </div>

        {/* Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Share your project"
            className="w-[80%] bg-bg text-text2 text-sm px-4 py-3 rounded-full outline-none placeholder:text-white/40"
          />
          <button className="absolute right-58 top-1/2 -translate-y-1/2 bg-zinc-700 hover:bg-zinc-600 p-1 rounded-full transition">
            <ArrowRight size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-around text-white/70 text-sm">
        <button className="flex items-center gap-1 hover:text-white transition">
          <ImageIcon size={18} /> Snippets
        </button>

        <button className="flex items-center gap-1 hover:text-white transition">
          <Github size={18} /> GitHub Repo
        </button>

        <button className="flex items-center gap-1 hover:text-white transition">
          <BookOpen size={18} /> Case Study
        </button>
      </div>
    </div>
  );
}
