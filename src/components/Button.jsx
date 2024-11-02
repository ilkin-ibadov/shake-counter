const Button = ({title, action}) => {
  return (
    <button onClick={action} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>{title}</button>
  )
}

export default Button