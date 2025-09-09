import { useState, useEffect } from "react";
import { Eye, EyeOff, Vote, Mail, Lock, AlertCircle, CheckCircle, X, Check, Send, Timer, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

interface PasswordRequirement {
    text: string;
    met: boolean;
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState<"email" | "verification" | "reset">("email");
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    // Password validation
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
        { text: "At least 8 characters", met: false },
        { text: "One uppercase letter", met: false },
        { text: "One lowercase letter", met: false },
        { text: "One number", met: false },
        { text: "One special character", met: false },
    ]);

    // OTP Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    // Password validation effect
    useEffect(() => {
        const { password } = formData;
        setPasswordRequirements([
            { text: "At least 8 characters", met: password.length >= 8 },
            { text: "One uppercase letter", met: /[A-Z]/.test(password) },
            { text: "One lowercase letter", met: /[a-z]/.test(password) },
            { text: "One number", met: /\d/.test(password) },
            { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        ]);
    }, [formData.password]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPasswordValid = () => {
        return passwordRequirements.every(req => req.met);
    };

    const handleSendResetOTP = async () => {
        if (!formData.email || !validateEmail(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await authService.resetPasswordOTP(formData.email);

            if (response.success) {
                setOtpSent(true);
                setOtpTimer(60); // 1 minute
                setStep("verification");
                setSuccess("Password reset code sent! Check your email.");
            }

        } catch (error) {
            const err = error as { response?: { data?: { data?: { detail?: string } } } };
            setError(err.response?.data?.data?.detail || "Failed to send reset code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!formData.otp || formData.otp.length !== 4) {
            setError("Please enter a valid 4-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await authService.verifyOTP(formData.email, formData.otp, "PASSWORD_RESET");

            if (response.success) {
                setStep("reset");
                setSuccess("OTP verified! Now set your new password.");
            }

        } catch (error) {
            const err = error as { response?: { data?: { data?: { detail?: string } } } };
            setError(err.response?.data?.data?.detail || "Failed to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!isPasswordValid()) {
            setError("Password doesn't meet all requirements");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await authService.resetPassword(formData.email, formData.password, formData.otp);

            if (response.success) {
                setSuccess("Password reset successfully! You can now log in with your new password.");
                setTimeout(() => {
                    navigate("/login");
                    console.log("Redirecting to login...");
                }, 2000);
            }


        } catch (error) {
            const err = error as { response?: { data?: { data?: { detail?: string } } } };
            setError(err.response?.data?.data?.detail || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden">
                <div className="relative h-64 w-64 bg-gradient-to-r from-orange-400 to-red-400 opacity-20 blur-3xl rounded-full" />
            </div>
            <div className="absolute bottom-0 left-0 -z-10 transform-gpu overflow-hidden">
                <div className="relative h-64 w-64 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-3xl rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-4 shadow-lg">
                        <KeyRound className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Recover access to your voting account</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step === "email" ? "bg-orange-600 text-white" :
                            step === "verification" || step === "reset" ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-400"
                            }`}>
                            {step === "verification" || step === "reset" ? <Check className="h-4 w-4" /> : "1"}
                        </div>
                        <div className={`w-16 h-1 rounded ${step === "verification" || step === "reset" ? "bg-orange-200" : "bg-gray-200"}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step === "verification" ? "bg-orange-600 text-white" :
                            step === "reset" ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-400"
                            }`}>
                            {step === "reset" ? <Check className="h-4 w-4" /> : "2"}
                        </div>
                        <div className={`w-16 h-1 rounded ${step === "reset" ? "bg-orange-200" : "bg-gray-200"}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step === "reset" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-400"
                            }`}>
                            3
                        </div>
                    </div>
                </div>

                {/* Reset Password Card */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
                            {step === "email" && "Find Your Account"}
                            {step === "verification" && "Enter Reset Code"}
                            {step === "reset" && "New Password"}
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            {step === "email" && "Enter your email to receive a reset code"}
                            {step === "verification" && "Check your email for the reset code"}
                            {step === "reset" && "Create a strong new password"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Success/Error Messages */}
                        {error && (
                            <Alert variant="destructive" className="bg-red-50 border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-red-800">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-orange-50 border-orange-200">
                                <CheckCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Step 1: Email Input */}
                        {step === "email" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <div className="flex space-x-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your registered email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-orange-500 transition-colors"
                                                disabled={loading}
                                                required
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSendResetOTP}
                                            disabled={loading || !formData.email || !validateEmail(formData.email)}
                                            className="h-12 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Code
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        We'll send a 4-digit reset code to this email address.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === "verification" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                        Reset Code
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 4-digit code"
                                        value={formData.otp}
                                        onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        className="h-12 text-center text-xl font-mono tracking-wider bg-gray-50/50 border-gray-200 focus:bg-white focus:border-orange-500 transition-colors"
                                        disabled={loading}
                                        maxLength={4}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 text-center">
                                        Code sent to: <span className="font-medium">{formData.email}</span>
                                    </p>
                                </div>

                                {otpTimer > 0 && (
                                    <div className="flex items-center justify-center text-sm text-gray-600">
                                        <Timer className="h-4 w-4 mr-1" />
                                        Code expires in {formatTime(otpTimer)}
                                    </div>
                                )}

                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleSendResetOTP}
                                        disabled={loading || otpTimer > 0}
                                        className="flex-1 h-12"
                                    >
                                        Resend Code
                                    </Button>
                                    <Button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || formData.otp.length !== 4}
                                        className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        ) : (
                                            "Continue"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: New Password */}
                        {step === "reset" && (
                            <div className="space-y-4">
                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-orange-500 transition-colors"
                                            disabled={loading}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-2 h-8 w-8 hover:bg-gray-100"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                {formData.password && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                                        <div className="space-y-1">
                                            {passwordRequirements.map((req, index) => (
                                                <div key={index} className="flex items-center text-xs">
                                                    {req.met ? (
                                                        <CheckCircle className="h-3 w-3 text-orange-600 mr-2" />
                                                    ) : (
                                                        <X className="h-3 w-3 text-gray-400 mr-2" />
                                                    )}
                                                    <span className={req.met ? "text-orange-600" : "text-gray-500"}>
                                                        {req.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            className={`pl-10 pr-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                                ? "focus:border-red-500 border-red-300"
                                                : "focus:border-orange-500"
                                                }`}
                                            disabled={loading}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-2 h-8 w-8 hover:bg-gray-100"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="text-xs text-red-600">Passwords don't match</p>
                                    )}
                                </div>

                                {/* Account Info */}
                                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                    <p className="text-sm text-orange-800">
                                        <span className="font-medium">Account:</span> {formData.email}
                                    </p>
                                    <p className="text-xs text-orange-600 mt-1">
                                        Your password will be updated for this account.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="pt-4">
                        {step === "reset" && (
                            <Button
                                onClick={handleResetPassword}
                                className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                disabled={loading || !isPasswordValid() || formData.password !== formData.confirmPassword}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <a
                            href="/login"
                            className="text-orange-600 hover:text-orange-800 font-medium transition-colors hover:underline"
                        >
                            Back to Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}