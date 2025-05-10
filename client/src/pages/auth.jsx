import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/navbar";
import CommonForm from "@/components/common-forms";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { signInFormControls, signUpFormControls } from "@/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    signUpFormData,
    setSignInFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== "" &&
      signUpFormData.role !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-400 dark:bg-gray-900 dark:bg-none text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex flex-1 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors">
          <Tabs
            value={activeTab}
            defaultValue="signin"
            onValueChange={handleChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
              <TabsTrigger
                value="signin"
                className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card className="p-4 space-y-4">
                <CardHeader>
                  <CardTitle>Sign In to your account</CardTitle>
                  <CardDescription>
                    {" "}
                    Enter your email and password to access your accound
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText="Sign In"
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-center text-blue-700 dark:text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="p-4 space-y-4">
                <CardHeader>
                  <CardTitle>Create a new account</CardTitle>
                  <CardDescription>
                    {" "}
                    Enter your username, email and password to create your
                    accound
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText="Sign Up"
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default AuthPage;
