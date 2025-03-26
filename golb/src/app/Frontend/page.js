import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/app/components/PageWrapper";
import CardContainer from "@/app/components/CardContainer";
import PageHeader from "@/app/components/PageHeader";

export default function Frontpage() {
  return (
    <PageWrapper>
      <CardContainer className="text-center space-y-10">
        <PageHeader title="Want to get in on the gist?" />

        <Link href="/Frontend/Forms/LoginForm" aria-label="Go to login page">
          <Button className="px-6 py-3 text-base font-medium bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-200">
            Login
          </Button>
        </Link>

        <div className="flex items-center justify-center space-x-2">
          <span className="block h-px w-16 bg-gray-600"></span>
          <span className="text-sm text-gray-400">New User?</span>
          <span className="block h-px w-16 bg-gray-600"></span>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-50">Create an Account</h2>
          <Link href="/Frontend/Forms/RegisterForm" aria-label="Go to registration page">
            <Button className="px-6 py-3 text-base font-medium bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 transition-all duration-200">
              Register
            </Button>
          </Link>
        </div>
      </CardContainer>
    </PageWrapper>
  );
}
