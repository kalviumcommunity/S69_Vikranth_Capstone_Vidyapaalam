// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-secondary text-secondary-foreground mt-auto">
//       <div className="container mx-auto py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="text-lg font-bold mb-4 gradient-text">VidyaPaalam</h3>
//             <p className="text-sm">
//               Connecting passionate mentors with eager learners to bridge the skill gap.
//             </p>
//           </div>
          
//           <div>
//             <h4 className="font-semibold mb-4">Explore</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/skills" className="text-sm hover:text-primary transition-colors">
//                   Browse Skills
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/mentors" className="text-sm hover:text-primary transition-colors">
//                   Find Mentors
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/become-mentor" className="text-sm hover:text-primary transition-colors">
//                   Become a Mentor
//                 </Link>
//               </li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="font-semibold mb-4">Resources</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/about" className="text-sm hover:text-primary transition-colors">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/faq" className="text-sm hover:text-primary transition-colors">
//                   FAQs
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contact" className="text-sm hover:text-primary transition-colors">
//                   Contact Us
//                 </Link>
//               </li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="font-semibold mb-4">Legal</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/terms" className="text-sm hover:text-primary transition-colors">
//                   Terms of Service
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/privacy" className="text-sm hover:text-primary transition-colors">
//                   Privacy Policy
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
//           <p>&copy; {new Date().getFullYear()} VidyaPaalam. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-auto py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              VidyaPaalam
            </h3>
            <p className="text-lg text-gray-600">
              Connecting passionate mentors with eager learners to bridge the skill gap.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/skills"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link
                  to="/mentors"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  Find Mentors
                </Link>
              </li>
              <li>
                <Link
                  to="/become-mentor"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  Become a Mentor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-lg hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-8 text-center text-base text-gray-500">
          <p>&copy; {new Date().getFullYear()} VidyaPaalam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;