"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAProfilePicture } from "@/lib/picture";
import { getAppPageStaticInfo } from "next/dist/build/analysis/get-page-static-info";

export function SignUpForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setName('')
        setEmail('')
        setPassword('')
        setRepeatPassword('')
        setError(null)
        setIsLoading(false)
    }, [])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        setIsLoading(true);
        setError(null);

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (name.trim().length > 15) {
            setError("Name has more than 15 characters");
            setIsLoading(false);
            return;
        }

        if (name.trim() === '') {
            setError("Name is empty");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name.trim(),
                        picture: getAProfilePicture()
                    },
                    emailRedirectTo: `${window.location.origin}/user/rooms`,
                },
            });
            if (error) throw error;
            router.push("/auth/signup-success");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
            setName('')
            setEmail('')
            setPassword('')
            setRepeatPassword('')
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign up</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="repeat-password">Repeat Password</Label>
                                </div>
                                <Input
                                    id="repeat-password"
                                    type="password"
                                    required
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating an account..." : "Sign up"}
                            </Button>
                            {error && <p className="text-sm text-red-500 -mt-6">{error}</p>}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
