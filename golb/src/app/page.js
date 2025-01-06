import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landingpage() {
  return (
    <div>
      <h1>Welcome</h1>
      <div>
        <Link href="/Frontend/page">
          <Button>Click Me</Button>
        </Link>
      </div>
    </div>
  );
}
