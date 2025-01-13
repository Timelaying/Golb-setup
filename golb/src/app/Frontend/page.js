import LoginForm from "./Forms/LoginForm"
import RegisterForm from "./Forms/RegisterForm"

export default function Frontpage (){    //<LoginForm renders the jsx
    return (<div>
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