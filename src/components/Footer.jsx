import { Mail, Phone} from "lucide-react"
import { FaGithub , FaLinkedinIn ,FaInstagram  } from "react-icons/fa6";


const Footer = () => {
  return (
    <>
      <footer className="footer bg-gray-900 text-gray-200 overflow-hidden">
        <div className="contact-section max-w-6xl flex flex-col md:flex-row justify-between mx-auto text-center md:text-left gap-6 py-6">

            {/* contact-us */}
            <div className="contact flex-1 min-w-62.5 mb-3 md:mb-0">
                <h3 className="text-center md:text-start mb-4 font-semibold text-xl">Contact us</h3>
                <p className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Phone size={16}/>
                    +91 8754102778
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400 font-medium mb-2">
                    <Mail size={16}/>
                    vigneshsakthi562@gmail.com
                </p>
            </div>

            
            {/* social media  */}
            <div className="social flex-1 min-w-62.5 mb-3 md:mb-0">
                <h3 className="text-center mb-4 font-semibold text-xl">Follow us</h3>
                <div className="links flex justify-center items-center gap-4">
                    <a href="#">
                        <FaGithub className="text-gray-400 w-5 h-5 hover:text-gray-600 transition duration-300"/>
                    </a>
                    <a href="#">
                        <FaLinkedinIn className="text-gray-400 w-5 h-5 hover:text-blue-600 transition duration-300"/>
                    </a>
                    <a href="#">
                        <FaInstagram className="text-gray-400 w-5 h-5 hover:text-pink-600 transition duration-300"/>
                    </a>
                </div>
            </div>


            {/* about us */}
            <div className="about flex-1 min-w-62.5 mb-3 md:mb-0 px-2">
                <h3 className="text-center mb-4 font-semibold text-xl">About us</h3>
                <p className="max-w-xl text-center text-gray-400">Providing proffessional ecommerce solutions to help you grow your online buisness</p>
            </div>
        </div>


        <div className="copyright text-gray-400 text-xs border-t border-gray-700 text-center py-4">
            <p>@2026 Genz Trendz. All rights reserved</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
