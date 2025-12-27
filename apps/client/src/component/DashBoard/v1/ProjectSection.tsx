// "use client";

// import { useState } from "react";
// import demo1 from "../v1/images/demoSnippet1.png";
// import demo2 from "../v1/images/demoSnippet2.png";
// import demo3 from "../v1/images/demoSnippet3.png";
// import leftArrow from "../v1/images/leftArrow.svg";
// import rightArrow from "../v1/images/rightArrow.svg";
// import demoUser from "../v1/images/demoUser.svg";
// import bookmark from "../v1/images/bookmark.svg";
// import heart from "../v1/images/heart.svg";
// import filledHeart from "../v1/images/filledHeart.svg";
// import filledBookmark from "../v1/images/filledBookmark.svg";
// import { fileURLToPath } from "url";
// import Image from "next/image";


// export default function ProjectCard() {
//     // Image slider states and functions 
//     const images = [demo1, demo2, demo3];
//     const [current, setCurrent] = useState(0);

//     const prev = () =>
//         setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));

//     const next = () =>
//         setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));



//     // Bookmarked and liked
//     const [like, setLike] = useState(false);
//     const [bookmarked, setBookmark] = useState(false);

//     const isLike = () => {
//         setLike(!like);
//     }

//     const isBookmark = () => {
//         setBookmark(!bookmarked);
//     }


//     return (
//         <article
//             className="relative w-full h-[80svh] bg-green-50 rounded-3xl overflow-hidden transition hover:shadow-lg"
//         >
//             {/* IMAGE SLIDER */}
//             <div
//                 className="absolute w-full h-full flex items-center justify-between gap-3 pt-5 px-3"
//             >
//                 {/* LEFT ARROW */}
//                 <button
//                     onClick={prev}
//                 >
//                     <img
//                         src={leftArrow.src}
//                         alt="Previous Arrow"
//                         className="w-8 h-8 hover:scale-105 transform transition duration-200"
//                     />
//                 </button>

//                 {/* IMAGE */}
                

//                 {/* RIGHT ARROW */}
//                 <button
//                     onClick={next}
//                     className=""
//                 >
//                     <img
//                         src={rightArrow.src}
//                         alt="Next"
//                         className="w-8 h-8 hover:scale-105 transform transition duration-200"
//                     />
//                 </button>
//             </div>
//             <div className="bg-green-200 w-[80%] h-[70%] mx-auto rounded-2xl overflow-hidden">
//                     <Image src={images[current].src} alt="Project img"
//                         className="w-full h-full object-fill"
//                         width={250}
//                         height={250}
//                     />
//             </div>


//             {/* PROJECT CONTENT */}
//             <div className="p-6 space-y-3 space-x-3 bg-green-400">
//                 {/* Profile + Actions */}
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                         <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white" >
//                             <img src={demoUser.src} alt="Demo User" />
//                         </div>
//                         <span className="text-white text-md font-medium">
//                             Britto Anand
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-2 text-white/80 text-sm">
//                         <button onClick={isBookmark}>
//                             <img src={bookmarked? filledBookmark.src : bookmark.src} alt="Bookmark Button" 
//                                 className="h-7 w-7 transition transform hover:scale-105"
//                             />
//                         </button>
//                         <button onClick={isLike}>
//                             <img src={like? filledHeart.src : heart.src} alt="Like Button" 
//                                 className="h-7 w-7 transition transform hover:scale-105"
//                             />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Text */}
//                 <div>
//                     <h3 className="text-[#e8ded8] font-semibold text-sm sm:text-base leading-snug">
//                         Explore The Space - A Website to teach you stuf about space.
//                     </h3>
//                     <p className="text-[#B1AAA6] text-xs sm:text-sm mt-1 leading-relaxed">
//                         Explore The Space - A Website to teach you stuf about space. Helps you outgrow other people who dont know how amazing the space is.
//                     </p>
//                 </div>
//             </div>
//         </article>
//     );
// }

"use client";

import { useState } from "react";
import demo1 from "../v1/images/demoSnippet1.png";
import demo2 from "../v1/images/demoSnippet2.png";
import demo3 from "../v1/images/demoSnippet3.png";
import leftArrow from "../v1/images/leftArrow.svg";
import rightArrow from "../v1/images/rightArrow.svg";
import demoUser from "../v1/images/demoUser.svg";
import bookmark from "../v1/images/bookmark.svg";
import heart from "../v1/images/heart.svg";
import filledHeart from "../v1/images/filledHeart.svg";
import filledBookmark from "../v1/images/filledBookmark.svg";
import Image from "next/image";

export default function ProjectCard() {
    const images = [demo1, demo2, demo3];
    const [current, setCurrent] = useState(0);

    const prev = () =>
        setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));

    const next = () =>
        setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

    const [like, setLike] = useState(false);
    const [bookmarked, setBookmark] = useState(false);

    const isLike = () => setLike(!like);
    const isBookmark = () => setBookmark(!bookmarked);

    return (
        <article className="w-full mx-auto bg-divBg rounded-3xl overflow-hidden shadow border">
            
            {/* IMAGE SECTION LIKE LINKEDIN */}
            <div className="relative w-full h-[55vh] bg-divBg overflow-hidden flex items-center justify-center">
                
                {/* LEFT ARROW */}
                <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 "
                >
                    <img src={leftArrow.src} alt="Prev" className="w-8 h-8" />
                </button>

                <div className="w-full h-full bg-divBg  ">
                    <Image
                        src={images[current].src}
                        alt="Project Image"
                        width={500}
                        height={500}
                        className="w-[85%] h-[95%] object-fill mx-auto mt-4 rounded-3xl"
                    />
                </div>

                {/* RIGHT ARROW */}
                <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2"
                >
                    <img src={rightArrow.src} alt="Next" className="w-8 h-8" />
                </button>
            </div>

            {/* TEXT CONTENT AT BOTTOM */}
            <div className="p-5 flex flex-col gap-4 bg-divBg">

                {/* USER + ACTIONS LIKE LINKEDIN */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            <img src={demoUser.src} alt="User" className="w-7 h-7" />
                        </div>
                        <span className="text-[#d5cbc6] text-sm font-semibold">
                            Britto Anand
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex items-center gap-3">
                            <button onClick={isBookmark}>
                                <img
                                    src={bookmarked ? filledBookmark.src : bookmark.src}
                                    alt="Bookmark"
                                    className="w-7 h-7"
                                />
                            </button>
                            <button onClick={isLike}>
                                <img
                                    src={like ? filledHeart.src : heart.src}
                                    alt="Like"
                                    className="w-7 h-7"
                                />
                            </button>
                        </div>

                        <div className=" text-text2 bg-bg px-3 py-1 rounded-3xl">
                            <p>View Project</p>
                        </div>
                    </div>

                </div>

                {/* TITLE + DESCRIPTION */}
                <div>
                    <h3 className="text-text2 font-semibold text-base">
                        Explore The Space - A Website About Space
                    </h3>
                    <p className="text-text2 text-sm mt-1 leading-relaxed">
                        Learn cool space facts, grow smarter than people who still think stars are stickers on the sky.
                    </p>
                </div>
            </div>
        </article>
    );
}
