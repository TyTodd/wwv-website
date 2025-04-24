"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";

// Define interfaces for form data
interface FormValuesType {
  [key: string]: string | string[] | undefined | File;
  email?: string;
}

export default function CreateProfile() {
  const { user } = useUser();
  const [formValues, setFormValues] = useState<FormValuesType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, name, value, type, checked } = e.target as HTMLInputElement;
    const inputTarget = e.target as HTMLInputElement;

    if (type === "file") {
      const file = inputTarget.files?.[0];
      if (file) {
        setFormValues((prev) => ({
          ...prev,
          [id]: file,
        }));
      }
    } else if (type === "checkbox") {
      setFormValues((prev) => {
        const fieldName = name;
        const prevValues = (prev[fieldName] as string[]) || [];

        if (checked) {
          return { ...prev, [fieldName]: [...prevValues, value] };
        } else {
          return {
            ...prev,
            [fieldName]: prevValues.filter((v: string) => v !== value),
          };
        }
      });
    } else {
      setFormValues((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      const formData = new FormData();
      if (!user) {
        console.error("User is undefined");
        return;
      }
      
      formData.append(
        "email",
        user.primaryEmailAddress?.emailAddress || formValues?.email || ""
      );
      formData.append("user_id", user.id);

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key];
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else if (key === "visa_sponsorship" || key === "work_authorization") {
            const boolValue = value === "yes" ? "true" : "false";
            formData.append(key, boolValue);
          } else {
            formData.append(key, value as string);
          }
        }
      });

      const response = await fetch("/api/create-profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Profile created successfully.",
        });
        
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          success: false,
          message: errorData.message || "Failed to save profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
          <div className="relative">
            <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-[#FF989F] to-transparent"></div>
            <div className="text-center px-8 pt-10 pb-8">
              <h1 className="text-2xl font-semibold text-gray-800">Create your profile</h1>
              <p className="mt-3 text-base text-gray-600">
                Join our network of talented women connecting with startups
              </p>
            </div>
          </div>

          {submitStatus.message && (
            <div 
              className={`mx-8 my-6 p-4 rounded-lg shadow-sm ${
                submitStatus.success 
                  ? "bg-green-50 text-green-700 border border-green-100" 
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              <div className="flex flex-col h-full w-full justify-around">
                {submitStatus.success ? (
                  <svg className="w-5 h-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
            {/* Form Sections Header */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
              <h2 className="text-base font-semibold text-gray-700">Personal Information</h2>
              <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
            </div>
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <div className="relative">
                  <input
                    id="first_name"
                    type="text"
                    required
                    className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200 bg-white hover:bg-gray-50 hover:border-gray-300" style={{ paddingLeft: '48px' }}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#FF989F] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <div className="relative">
                  <input
                    id="last_name"
                    type="text"
                    required
                    className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200 bg-white hover:bg-gray-50 hover:border-gray-300" style={{ paddingLeft: '48px' }}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#FF989F] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    readOnly={!!user?.primaryEmailAddress?.emailAddress}
                    required
                    className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200" style={{ paddingLeft: '48px' }}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  University
                </label>
                <div className="relative">
                  <input
                    id="university"
                    type="text"
                    required
                    className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200 bg-white hover:bg-gray-50 hover:border-gray-300" style={{ paddingLeft: '48px' }}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#FF989F] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 relative group">
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <input
                    id="linkedin_url"
                    type="url"
                    required
                    className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200 bg-white hover:bg-gray-50 hover:border-gray-300" style={{ paddingLeft: '48px' }}
                    placeholder="https://linkedin.com/in/username"
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#FF989F] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunity Interests */}
            <div className="pt-2 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
                <h2 className="text-base font-semibold text-gray-700">What opportunities are you interested in?</h2>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 px-6 py-6 bg-gray-50 rounded-lg border border-gray-100">
                {[
                  "Ad-hoc projects",
                  "Term-time internships",
                  "Summer internships",
                  "Full-time employment"
                ].map((option) => (
                  <label key={option} className="flex items-start py-1">
                    <input
                      name="opportunity_interests"
                      type="checkbox"
                      value={option}
                      className="mt-0.5 h-4 w-4 text-[#DB7B81] border-gray-300 rounded focus:ring-[#FF989F]"
                      onChange={handleInputChange}
                    />
                    <span className="ml-3 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Position Interests */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
                <h2 className="text-base font-semibold text-gray-700">What positions align with your interests?</h2>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 px-6 py-6 bg-gray-50 rounded-lg border border-gray-100">
                {[
                  "Software Development",
                  "Design (UI/UX, product design, etc.)",
                  "Marketing & Growth",
                  "Finance / Operations",
                  "Product Management",
                  "Content, Social Media, and Communications",
                  "Data Science & Analytics"
                ].map((option) => (
                  <label key={option} className="flex items-start py-1">
                    <input
                      name="position_interests"
                      type="checkbox"
                      value={option}
                      className="mt-0.5 h-4 w-4 text-[#DB7B81] border-gray-300 rounded focus:ring-[#FF989F]"
                      onChange={handleInputChange}
                    />
                    <span className="ml-3 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Area Interests */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
                <h2 className="text-base font-semibold text-gray-700">What areas interest you?</h2>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 px-6 py-6 bg-gray-50 rounded-lg border border-gray-100">
                {[
                  "AI & Machine Learning",
                  "Healthcare & Biotechnology",
                  "FinTech",
                  "IT & Cybersecurity",
                  "Energy, Climate, and Sustainability",
                  "Education",
                  "Consumer & Wellness",
                  "Legal"
                ].map((option) => (
                  <label key={option} className="flex items-start py-1">
                    <input
                      name="area_interests"
                      type="checkbox"
                      value={option}
                      className="mt-0.5 h-4 w-4 text-[#DB7B81] border-gray-300 rounded focus:ring-[#FF989F]"
                      onChange={handleInputChange}
                    />
                    <span className="ml-3 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
                <h2 className="text-base font-semibold text-gray-700">Additional Information</h2>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
              </div>
              <div className="mb-4">
                <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-2">
                  Skills, interests, and background (Optional)
                </label>
                <textarea
                  id="background"
                  rows={3}
                  className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                  placeholder="Tell us more about yourself..."
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                    Upload your resume
                  </label>
                  <div className="ml-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-[#FF989F] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <label htmlFor="resume" className="inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FF989F] to-[#DB7B81] text-white text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Choose File
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span className="ml-8 text-sm text-gray-600" id="file-name">No file selected</span>
                  <script dangerouslySetInnerHTML={{ __html: `
                    document.getElementById('resume').addEventListener('change', function(e) {
                      var fileName = e.target.files[0] ? e.target.files[0].name : 'No file selected';
                      document.getElementById('file-name').textContent = fileName;
                    });
                  `}} />
                </div>
              </div>

              <div className="mb-4 relative group">
                <label htmlFor="links" className="block text-sm font-medium text-gray-700 mb-2">
                  Other relevant links (Optional)
                </label>
                <div className="relative">
                  <input
                    id="links"
                    type="text"
                    className="w-full px-6 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200 bg-white hover:bg-gray-50 hover:border-gray-300" style={{ paddingLeft: '48px' }}
                    placeholder="GitHub, portfolio, personal website, etc."
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#FF989F] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Authorization */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
                <h2 className="text-base font-semibold text-gray-700">Work Authorization</h2>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="work_authorization" className="block text-sm font-medium text-gray-700 mb-2">
                  Are you legally authorized to work in the United States?
                </label>
                <select
                  id="work_authorization"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200"
                  onChange={handleInputChange}
                  defaultValue=""
                >
                  <option value="" disabled>Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label htmlFor="visa_sponsorship" className="block text-sm font-medium text-gray-700 mb-2">
                  Will you require sponsorship for employment visa status?
                </label>
                <select
                  id="visa_sponsorship"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#DB7B81] focus:border-[#DB7B81] transition-colors duration-200"
                  onChange={handleInputChange}
                  defaultValue=""
                >
                  <option value="" disabled>Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-0.5 w-5 bg-gradient-to-r from-[#FF989F] to-[#DB7B81]"></div>
                <h2 className="text-base font-semibold text-gray-700">Terms Agreement</h2>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#DB7B81] to-transparent"></div>
              </div>
              <label className="flex items-start">
                <input
                  id="termsAgreement"
                  name="termsAgreement"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 text-[#DB7B81] border-gray-300 rounded focus:ring-[#FF989F]"
                  onChange={handleInputChange}
                />
                <span className="ml-3 text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="/terms-of-service" className="text-[#DB7B81] hover:text-[#FF989F] font-medium transition-colors duration-200" target="_blank">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-[#DB7B81] hover:text-[#FF989F] font-medium transition-colors duration-200" target="_blank">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-3/4 mx-auto block px-6 py-3.5 text-base font-medium text-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
                  ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-[#FF989F] to-[#DB7B81]'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB7B81]`}
              >
                <span className="relative inline-flex items-center">
                  {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
                  {!isSubmitting && (
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
