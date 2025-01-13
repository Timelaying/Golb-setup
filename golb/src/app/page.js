import { Button } from "@/components/ui/button";
import Link from "next/link"; // using Link for routing

export default function Landingpage() {
  return (
    <div>
      <h1>Welcome</h1>
      <div>
        <Link href="/Frontend"> 
          <Button>Want to get in on th gist?</Button>
        </Link>
      </div>
    </div>
  );
}
