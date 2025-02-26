
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignInPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black"
    >
      <SignIn
        signUpUrl="/sign-up"
        redirectUrl="/setup"
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-white hover:bg-white/90 text-black",
            card: "bg-black/50 backdrop-blur-xl border border-white/10",
            headerTitle: "text-white",
            headerSubtitle: "text-white/60",
            socialButtonsBlockButton: "text-white border-white/20",
            formFieldLabel: "text-white/80",
            formFieldInput: "bg-white/10 border-white/20 text-white",
            dividerLine: "bg-white/20",
            dividerText: "text-white/60",
            footer: "text-white/60",
            phoneInput: "bg-white/10 border-white/20 text-white"
          }
        }}
        initialValues={{
          phoneNumber: "+1"  // Default country code for US
        }}
      />
    </motion.div>
  );
};

export default SignInPage;
