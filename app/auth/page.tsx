"use client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/auth-context"; // Import useAuth
import { toast } from "sonner";
import { apiRequest, oauthLogin } from "@/lib/api";
import { AuthApiResponse } from "@/lib/types";
import { useStore } from "@/lib/store";


function AuthPageContent() {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const { isAuthenticated, loading, login } = useAuth(); // Get signIn, isAuthenticated, and isLoading from AuthContext
  const { returnUrl: storedReturnUrl, setReturnUrl } = useStore(); // Get returnUrl from Zustand store

  useEffect(() => {
    const urlReturnUrl = searchParams.get("returnUrl"); /// /login?returnUrl=/checkout
    if (urlReturnUrl && urlReturnUrl !== storedReturnUrl) {
      setReturnUrl(urlReturnUrl);
    }
  }, [searchParams, setReturnUrl, storedReturnUrl]);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (isAuthenticated) {
    // If authenticated, the login function in AuthContext should have already redirected.
    // This component should not render anything further if already authenticated.
    return null;
  }

  const handleLogin = async () => {
    try {
      const data = await apiRequest<AuthApiResponse>("/auth/signin", "POST", {
        email: signInEmail,
        password: signInPassword,
      });
      if (data.accessToken) {
        await login(data.accessToken, storedReturnUrl); // Pass storedReturnUrl to login function
      }
      toast.success("Sign in successful!");
    } catch (error: any) {
      alert(error.response?.data?.error || "An error occurred during sign in.");
    }
  };

  const handleSignup = async () => {
    try {
      const data = await apiRequest<AuthApiResponse>("/auth/signup", "POST", {
        email: signUpEmail,
        password: signUpPassword,
      });

      if (data.accessToken) {
        await login(data.accessToken, storedReturnUrl); // Pass storedReturnUrl to login function
      }

      toast.success("Signup successful!");
      // The login function now handles redirection, so no need to push here
      // router.push("/");
    } catch (error: any) {
      alert(error.response?.data?.error || "An error occurred during sign up.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await oauthLogin("google");
      router.push(data.url);
    } catch (err: unknown) {
      console.error("Google login error:", err);
      toast.error((err as Error).message || "Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {/* Left Side - Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-white-400 via-green-500 to-white-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/auth-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo.png"
              alt="HomeChef"
              width={60}
              height={60}
              className="rounded-2xl"
            />
            <h1 className="text-4xl font-bold">AHARRAA</h1>
          </div>
          <h2 className="text-5xl font-italic leading-tight mb-6">
            Delicious home-cooked
            <br />
            meals delivered to
            <br />
            your doorstep
          </h2>
          <p className="text-xl text-white/90 max-w-md">
            Connect with local home chefs and enjoy authentic, homemade food
            from your community.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex justify-center p-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Image
              src="/logo.png"
              alt="HomeChef"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <h1 className="text-3xl font-bold text-gray-900">AHARRAA</h1>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/80 p-1 rounded-xl">
              <TabsTrigger
                value="signin"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card className="border-0 shadow-xl min-h-[580px]">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl font-bold">
                    Welcome back!
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to continue your culinary journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="signin-email"
                      className="text-sm font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="signin-password"
                        className="text-sm font-medium"
                      >
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Forgot?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base mt-6"
                    onClick={handleLogin}
                  >
                    Sign In
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:bg-gray-50 font-medium"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-0 shadow-xl min-h-[580px]">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl font-bold">
                    Create an account
                  </CardTitle>
                  <CardDescription className="text-base">
                    Join us and discover amazing home-cooked meals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      className="text-sm font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      className="text-sm font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <Button
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base mt-6"
                    onClick={handleSignup}
                  >
                    Create Account
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:bg-gray-50 font-medium"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading authentication...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
