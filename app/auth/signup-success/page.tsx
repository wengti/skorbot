import Button from "@/components/my-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="">
      <div className="">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>You may proceed to browse the site now.</CardDescription>
            </CardHeader>
            <Link href='/private' className='block pl-6 pb-6'>
                <Button size='sm'>Get started</Button>
            </Link>
            {/* <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent> */}
          </Card>
          
        </div>
      </div>
    </div>
  );
}
