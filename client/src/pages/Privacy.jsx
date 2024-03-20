import meme from "../assets/privacy-meme.png"

const Privacy = () => {
  return (
    <div className='w-full h-screen'>
        <img src={meme} alt='Privacy Policy' loading='lazy' className='w-full h-full object-contain' />
    </div>
  )
}

export default Privacy