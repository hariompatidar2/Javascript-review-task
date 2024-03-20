import { Link } from 'react-router-dom'

const CTAButton = ({text,link,className=""}) => {
  return (
    <Link to={link} className={`bg-[#4F46E5] py-2 px-4 text-center font-medium rounded-lg text-white hover:bg-[#4e46f7] ${className}`}>{text}</Link>
  )
}

export default CTAButton;