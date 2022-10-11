import img from './error.gif'

const ErrorMessage = () => {
    return (
    <div>
            <h2 style={{textAlign: 'center'}}>Whoops! Try again</h2>
            <img style={{display:'block', width: '250px', objectFit: 'contain', margin: "0 auto"}} src={img} alt="error"/>
    </div>
        
    )
}

export default ErrorMessage;