import LoginForm from "./Forms/LoginForm"
import RegisterForm from "./Forms/RegisterForm"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Frontpage (){    //<LoginForm renders the jsx
    return (<div>
        <h1>Want to get in on th gist?</h1>
        <div>
        <Link href="/Forms/LoginForm"> 
          <Button>Login</Button>
        </Link>
        </div>
        <h1> New User ? Register</h1>
        <div>
            <RegisterForm />
        </div>
    </div> 
    
)
}