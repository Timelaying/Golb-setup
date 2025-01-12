import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

export default function Frontpage (){    //<LoginForm renders the jsx
    return (<div>
        <h1>Input your Username and Password</h1>
        <div>
            <LoginForm /> 
        </div>
        <h1> New User ?</h1>
        <div>
            <RegisterForm />
        </div>
    </div> 
    
)
}